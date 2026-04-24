import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../lib/api-auth.js";
import {
  createFullFacebookCampaign,
  type FacebookAdsDebugLog,
  facebookAdGeneratedSchema,
  generateFacebookAdContent,
} from "../lib/facebook-ads.js";

const facebookAdsRouter = Router();

facebookAdsRouter.use(requireAuth);

const adFormSchema = z
  .object({
    productDescription: z.string().min(10).max(4000),
    targetLocation: z.string().min(2).max(160),
    dailyBudget: z.number().positive().max(1_000_000),
    ageMin: z.number().int().min(13).max(65),
    ageMax: z.number().int().min(13).max(65),
    publishImmediately: z.boolean().default(false),
  })
  .refine((data) => data.ageMin <= data.ageMax, {
    message: "Minimum age must be less than or equal to maximum age.",
    path: ["ageMin"],
  });

const generateRequestSchema = adFormSchema;

const createCampaignRequestSchema = z.object({
  form: adFormSchema,
  generated: facebookAdGeneratedSchema,
  imageBase64: z.string().min(1),
});

function formatValidationDetails(error: z.ZodError) {
  const flattened = error.flatten();
  const fieldErrors = Object.fromEntries(
    Object.entries(flattened.fieldErrors).filter(([, value]) => Array.isArray(value) && value.length > 0),
  );

  return {
    formErrors: flattened.formErrors,
    fieldErrors,
  };
}

function buildFacebookAdsErrorPayload(error: unknown, fallbackMessage: string) {
  const message = error instanceof Error ? error.message : fallbackMessage;
  const lowerMessage = message.toLowerCase();

  let status = 500;
  let code = "FACEBOOK_ADS_ERROR";
  let hint: string | undefined;

  if (lowerMessage.includes("invalid request body")) {
    status = 400;
    code = "INVALID_REQUEST";
  } else if (
    lowerMessage.includes("unsupported post request") ||
    lowerMessage.includes("missing permissions") ||
    lowerMessage.includes("ads_management") ||
    lowerMessage.includes("ads_read")
  ) {
    status = 400;
    code = "META_ACCESS_ERROR";
    hint = "Check META_AD_ACCOUNT_ID and confirm the current META_ACCESS_TOKEN can manage that ad account.";
  } else if (lowerMessage.includes("not configured")) {
    status = 500;
    code = "SERVER_CONFIG_ERROR";
    hint = "Verify the required Meta and Gemini environment variables are set on the backend.";
  } else if (lowerMessage.includes("failed")) {
    status = 400;
    code = "META_STEP_FAILED";
  }

  const stepMatch = message.match(
    /^(Image upload|Campaign creation|Ad set creation|Ad creative creation|Ad creation) failed:/,
  );

  return {
    status,
    body: {
      success: false,
      code,
      message,
      error: message,
      step: stepMatch?.[1] ?? null,
      hint,
    },
  };
}

function createDebugLogger() {
  const debugLogs: FacebookAdsDebugLog[] = [];

  return {
    debugLogs,
    log: (entry: FacebookAdsDebugLog) => {
      debugLogs.push(entry);
    },
  };
}

facebookAdsRouter.post("/generate", async (req, res) => {
  const debug = createDebugLogger();
  const parsed = generateRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Invalid request body.",
      error: "Invalid request body.",
      details: formatValidationDetails(parsed.error),
      debugLogs: debug.debugLogs,
    });
  }

  try {
    const generated = await generateFacebookAdContent(parsed.data, debug.log);
    return res.json({
      success: true,
      generated,
      debugLogs: debug.debugLogs,
    });
  } catch (error) {
    const payload = buildFacebookAdsErrorPayload(error, "Failed to generate Facebook ad content.");
    return res.status(payload.status).json({
      ...payload.body,
      debugLogs: debug.debugLogs,
    });
  }
});

facebookAdsRouter.post("/create-campaign", async (req, res) => {
  const debug = createDebugLogger();
  const parsed = createCampaignRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      code: "INVALID_REQUEST",
      message: "Invalid request body.",
      error: "Invalid request body.",
      details: formatValidationDetails(parsed.error),
      debugLogs: debug.debugLogs,
    });
  }

  try {
    const result = await createFullFacebookCampaign({
      imageBase64: parsed.data.imageBase64,
      campaignName: parsed.data.generated.campaignName,
      adSetName: parsed.data.generated.adSetName,
      adName: parsed.data.generated.adName,
      primaryText: parsed.data.generated.primaryText,
      headline: parsed.data.generated.headline,
      callToAction: parsed.data.generated.callToAction,
      interests: parsed.data.generated.interests,
      location: parsed.data.form.targetLocation,
      ageMin: parsed.data.form.ageMin,
      ageMax: parsed.data.form.ageMax,
      dailyBudget: parsed.data.form.dailyBudget,
      status: parsed.data.form.publishImmediately ? "ACTIVE" : "PAUSED",
    }, debug.log);

    return res.json({
      success: true,
      ...result,
      campaignName: parsed.data.generated.campaignName,
      debugLogs: debug.debugLogs,
    });
  } catch (error) {
    const payload = buildFacebookAdsErrorPayload(error, "Failed to create Facebook campaign.");
    return res.status(payload.status).json({
      ...payload.body,
      debugLogs: debug.debugLogs,
    });
  }
});

export { facebookAdsRouter };
