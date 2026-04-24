import { ThinkingLevel } from "@google/genai";
import { z } from "zod";
import { env } from "../config/env.js";
import { ai, GEMINI_TEXT_MODEL } from "./gemini.js";

const API_VERSION = "v25.0";

const CTA_TYPES = [
  "LEARN_MORE",
  "SIGN_UP",
  "GET_QUOTE",
  "CONTACT_US",
  "SUBSCRIBE",
  "APPLY_NOW",
  "DOWNLOAD",
  "GET_OFFER",
  "SHOP_NOW",
  "BOOK_TRAVEL",
] as const;

export const facebookAdGeneratedSchema = z.object({
  primaryText: z.string().min(1).max(400),
  headline: z.string().min(1).max(80),
  callToAction: z.enum(CTA_TYPES),
  interests: z.array(z.string().min(1)).min(3).max(5),
  campaignName: z.string().min(1).max(120),
  adSetName: z.string().min(1).max(120),
  adName: z.string().min(1).max(120),
});

export type FacebookAdGeneratedContent = z.infer<typeof facebookAdGeneratedSchema>;

export type FacebookAdsDebugLog = {
  timestamp: string;
  level: "info" | "error";
  message: string;
  data?: Record<string, unknown>;
};

type FacebookAdsLogger = (entry: FacebookAdsDebugLog) => void;

export type CreateFacebookCampaignParams = {
  imageBase64: string;
  campaignName: string;
  adSetName: string;
  adName: string;
  primaryText: string;
  headline: string;
  callToAction: FacebookAdGeneratedContent["callToAction"];
  interests: string[];
  location: string;
  ageMin: number;
  ageMax: number;
  dailyBudget: number;
  status: "PAUSED" | "ACTIVE";
};

function ensureFacebookAdsConfig() {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in Backend/.env.");
  }

  if (!env.META_ACCESS_TOKEN || !env.META_AD_ACCOUNT_ID || !env.META_PAGE_ID) {
    throw new Error(
      "META_ACCESS_TOKEN, META_AD_ACCOUNT_ID, and META_PAGE_ID must be configured in Backend/.env.",
    );
  }

  return {
    accessToken: env.META_ACCESS_TOKEN,
    accountId: env.META_AD_ACCOUNT_ID.replace(/^act_/i, ""),
    pageId: env.META_PAGE_ID,
    dsaBeneficiary: env.META_DSA_BENEFICIARY,
    dsaPayor: env.META_DSA_PAYOR,
  };
}

function logFacebookAdsDebug(
  logger: FacebookAdsLogger | undefined,
  level: FacebookAdsDebugLog["level"],
  message: string,
  data?: Record<string, unknown>,
) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    level,
    message,
    data,
  };

  const consolePayload = data ? ` ${JSON.stringify(data)}` : "";
  if (level === "error") {
    console.error(`[facebook-ads][${timestamp}] ${message}${consolePayload}`);
  } else {
    console.log(`[facebook-ads][${timestamp}] ${message}${consolePayload}`);
  }

  logger?.({
    timestamp,
    level,
    message,
    data,
  });
}

function sanitizeDebugValue(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.length > 240) {
      return `${value.slice(0, 240)}...`;
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDebugValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => {
        if (key === "access_token") {
          return [key, "<redacted>"];
        }

        if (key === "bytes" && typeof nestedValue === "string") {
          return [key, `<base64:${nestedValue.length} chars>`];
        }

        return [key, sanitizeDebugValue(nestedValue)];
      }),
    );
  }

  return value;
}

export async function runFacebookAdsHealthCheck() {
  if (!env.META_ACCESS_TOKEN || !env.META_AD_ACCOUNT_ID || !env.META_PAGE_ID) {
    console.log("[facebook-ads][health-check] Skipped. META_ACCESS_TOKEN, META_AD_ACCOUNT_ID, or META_PAGE_ID is missing.");
    return;
  }

  const accessToken = env.META_ACCESS_TOKEN;
  const configuredAccountId = env.META_AD_ACCOUNT_ID.replace(/^act_/i, "");
  const configuredPageId = env.META_PAGE_ID;

  const request = async (path: string, params: Record<string, string>) => {
    const url = new URL(`https://graph.facebook.com/${API_VERSION}/${path}`);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    url.searchParams.set("access_token", accessToken);
    console.log(
      `[facebook-ads][health-check] GET ${path} ${JSON.stringify(
        sanitizeDebugValue(Object.fromEntries(url.searchParams.entries())),
      )}`,
    );

    const response = await fetch(url);
    const data = (await response.json()) as Record<string, unknown>;
    console.log(
      `[facebook-ads][health-check] RESPONSE ${path} ${JSON.stringify(
        sanitizeDebugValue({
          status: response.status,
          data,
        }),
      )}`,
    );

    return { response, data };
  };

  try {
    console.log(
      `[facebook-ads][health-check] Starting. configuredAccountId=${configuredAccountId} configuredPageId=${configuredPageId}`,
    );

    const meAdAccounts = await request("me/adaccounts", {
      fields: "id,account_id,name,account_status",
    });

    const accounts = Array.isArray(meAdAccounts.data.data)
      ? (meAdAccounts.data.data as Array<Record<string, unknown>>)
      : [];
    const accessibleAccountIds = accounts
      .map((account) => String(account.account_id ?? "").trim())
      .filter(Boolean);

    console.log(
      `[facebook-ads][health-check] Accessible ad accounts: ${
        accessibleAccountIds.length > 0 ? accessibleAccountIds.join(", ") : "<none>"
      }`,
    );

    if (accessibleAccountIds.includes(configuredAccountId)) {
      console.log(`[facebook-ads][health-check] META_AD_ACCOUNT_ID matches an accessible ad account.`);
    } else {
      console.error(
        `[facebook-ads][health-check] META_AD_ACCOUNT_ID does NOT match any ad account visible to the current token.`,
      );
    }

    await request(configuredPageId, {
      fields: "id,name",
    });
  } catch (error) {
    console.error(
      `[facebook-ads][health-check] Failed: ${error instanceof Error ? error.message : "Unknown error."}`,
    );
  }
}

function getImageUploadErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error.";

  if (message.includes("Unsupported post request")) {
    return [
      message,
      "Check that META_AD_ACCOUNT_ID is the real Meta ad account ID and that META_ACCESS_TOKEN has access to that ad account.",
    ].join(" ");
  }

  return message;
}

function parseJsonResponse<T>(raw: string | undefined | null): T {
  if (!raw) {
    throw new Error("Model returned an empty response.");
  }

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned) as T;
}

export async function generateFacebookAdContent(input: {
  productDescription: string;
  targetLocation: string;
  ageMin: number;
  ageMax: number;
}, logger?: FacebookAdsLogger) {
  ensureFacebookAdsConfig();
  logFacebookAdsDebug(logger, "info", "Generating ad copy with Gemini.", {
    targetLocation: input.targetLocation,
    ageMin: input.ageMin,
    ageMax: input.ageMax,
  });

  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: [
      "You create high-performing Facebook lead generation ads for agencies.",
      "Return only valid JSON.",
      "Write punchy, benefit-led copy.",
      "Primary text must be max 3 sentences.",
      "Headline must be max 8 words.",
      "Choose the best Meta CTA enum for the offer.",
      "Generate 3 to 5 audience interest keywords as plain strings.",
      "Generate concise, usable campaign, ad set, and ad names.",
      `Product/service description: ${input.productDescription}`,
      `Target location: ${input.targetLocation}`,
      `Target age range: ${input.ageMin}-${input.ageMax}`,
    ].join("\n\n"),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          primaryText: { type: "string" },
          headline: { type: "string" },
          callToAction: { type: "string", enum: [...CTA_TYPES] },
          interests: {
            type: "array",
            minItems: 3,
            maxItems: 5,
            items: { type: "string" },
          },
          campaignName: { type: "string" },
          adSetName: { type: "string" },
          adName: { type: "string" },
        },
        required: ["primaryText", "headline", "callToAction", "interests", "campaignName", "adSetName", "adName"],
      },
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MEDIUM,
      },
    },
  });
  logFacebookAdsDebug(logger, "info", "Gemini responded.", {
    responseText: sanitizeDebugValue(response.text ?? ""),
  });

  const parsed = facebookAdGeneratedSchema.parse(parseJsonResponse<FacebookAdGeneratedContent>(response.text));
  logFacebookAdsDebug(logger, "info", "Gemini ad copy generated successfully.", {
    campaignName: parsed.campaignName,
    adSetName: parsed.adSetName,
    adName: parsed.adName,
    interestCount: parsed.interests.length,
  });
  return parsed;
}

function createGraphParams(
  params: Record<string, string | number | boolean | Record<string, unknown> | unknown[] | undefined>,
) {
  const body = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      body.set(key, String(value));
      continue;
    }

    body.set(key, JSON.stringify(value));
  }

  return body;
}

async function postGraph<T>(
  path: string,
  params: Record<string, string | number | boolean | Record<string, unknown> | unknown[] | undefined>,
  logger?: FacebookAdsLogger,
): Promise<T> {
  const { accessToken } = ensureFacebookAdsConfig();
  const requestParams = {
    ...params,
    access_token: accessToken,
  };
  logFacebookAdsDebug(logger, "info", "Meta POST request.", {
    path,
    params: sanitizeDebugValue(requestParams) as Record<string, unknown>,
  });
  const response = await fetch(`https://graph.facebook.com/${API_VERSION}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: createGraphParams({
      ...requestParams,
    }),
  });

  const data = (await response.json()) as T & { error?: MetaErrorPayload };
  logFacebookAdsDebug(logger, response.ok && !data.error ? "info" : "error", "Meta POST response.", {
    path,
    status: response.status,
    response: sanitizeDebugValue(data) as Record<string, unknown>,
  });

  if (!response.ok || data.error) {
    throw new Error(getMetaError(data.error));
  }

  return data;
}

async function getGraph<T>(path: string, params: Record<string, string>, logger?: FacebookAdsLogger) {
  const { accessToken } = ensureFacebookAdsConfig();
  const url = new URL(`https://graph.facebook.com/${API_VERSION}/${path}`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  url.searchParams.set("access_token", accessToken);
  logFacebookAdsDebug(logger, "info", "Meta GET request.", {
    path,
    params: sanitizeDebugValue(Object.fromEntries(url.searchParams.entries())) as Record<string, unknown>,
  });

  const response = await fetch(url);
  const data = (await response.json()) as T & { error?: MetaErrorPayload };
  logFacebookAdsDebug(logger, response.ok && !data.error ? "info" : "error", "Meta GET response.", {
    path,
    status: response.status,
    response: sanitizeDebugValue(data) as Record<string, unknown>,
  });

  if (!response.ok || data.error) {
    throw new Error(getMetaError(data.error));
  }

  return data;
}

type MetaErrorPayload = {
  message?: string;
  error_user_msg?: string;
  error_subcode?: number;
};

function getMetaError(error?: MetaErrorPayload) {
  if (!error) {
    return "Unknown Meta API error.";
  }

  return error.error_user_msg || error.message || "Unknown Meta API error.";
}

async function resolveLocation(locationStr: string, logger?: FacebookAdsLogger) {
  const parts = locationStr
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const cityName = parts[0] ?? locationStr.trim();
  logFacebookAdsDebug(logger, "info", "Resolving location targeting.", {
    input: locationStr,
    cityQuery: cityName,
  });

  const cityResults = await getGraph<{ data?: Array<{ key: string; country_name?: string; country_code?: string }> }>(
    "search",
    {
      type: "adgeolocation",
      q: cityName,
      location_types: JSON.stringify(["city"]),
    },
    logger,
  );

  if (cityResults.data && cityResults.data.length > 0) {
    let bestMatch = cityResults.data[0];

    if (parts.length >= 2) {
      const countryHint = parts.at(-1)?.toLowerCase();
      const matchingResult = cityResults.data.find((result) => {
        return (
          result.country_name?.toLowerCase().includes(countryHint ?? "") ||
          result.country_code?.toLowerCase() === countryHint
        );
      });

      if (matchingResult) {
        bestMatch = matchingResult;
      }
    }

    const resolved = {
      cities: [{ key: bestMatch.key, radius: 25, distance_unit: "kilometer" }],
      location_types: ["home", "recent"],
    };
    logFacebookAdsDebug(logger, "info", "Resolved city targeting.", {
      cityKey: bestMatch.key,
      matchCount: cityResults.data.length,
      countryHint: parts.at(-1) ?? null,
    });
    return resolved;
  }

  const countryResults = await getGraph<{ data?: Array<{ country_code: string }> }>("search", {
    type: "adgeolocation",
    q: locationStr,
    location_types: JSON.stringify(["country"]),
  }, logger);

  if (countryResults.data && countryResults.data.length > 0) {
    const resolved = {
      countries: [countryResults.data[0].country_code],
      location_types: ["home", "recent"],
    };
    logFacebookAdsDebug(logger, "info", "Falling back to country targeting.", {
      countryCode: countryResults.data[0].country_code,
    });
    return resolved;
  }

  logFacebookAdsDebug(logger, "info", "Falling back to worldwide targeting.");
  return {
    country_groups: ["worldwide"],
    location_types: ["home", "recent"],
  };
}

async function resolveInterests(keywords: string[], logger?: FacebookAdsLogger) {
  const interests: Array<{ id: string; name: string }> = [];
  logFacebookAdsDebug(logger, "info", "Resolving interest keywords.", {
    keywords,
  });

  for (const keyword of keywords) {
    try {
      const result = await getGraph<{ data?: Array<{ id: string; name: string }> }>("search", {
        type: "adinterest",
        q: keyword,
      }, logger);

      const firstMatch = result.data?.[0];

      if (firstMatch) {
        interests.push({
          id: firstMatch.id,
          name: firstMatch.name,
        });
        logFacebookAdsDebug(logger, "info", "Resolved interest keyword.", {
          keyword,
          resolvedId: firstMatch.id,
          resolvedName: firstMatch.name,
        });
      }
    } catch {
      logFacebookAdsDebug(logger, "info", "Skipping unresolved interest keyword.", {
        keyword,
      });
      continue;
    }
  }

  return interests;
}

function sanitizeBase64Image(imageBase64: string) {
  const trimmed = imageBase64.trim();
  const payload = trimmed.includes(",") ? trimmed.split(",").at(-1) ?? "" : trimmed;

  if (!payload) {
    throw new Error("Image data is missing.");
  }

  return payload;
}

export async function createFullFacebookCampaign(params: CreateFacebookCampaignParams, logger?: FacebookAdsLogger) {
  const { accountId, pageId, dsaBeneficiary, dsaPayor } = ensureFacebookAdsConfig();
  const accountPath = `act_${accountId}`;
  logFacebookAdsDebug(logger, "info", "Starting Meta campaign creation.", {
    accountId,
    pageId,
    status: params.status,
    dailyBudgetEuros: params.dailyBudget,
    hasDsaBeneficiary: Boolean(dsaBeneficiary),
    hasDsaPayor: Boolean(dsaPayor),
  });

  let imageHash: string;

  try {
    logFacebookAdsDebug(logger, "info", "Uploading ad image.");
    const imageResult = await postGraph<{ images?: Record<string, { hash?: string }> }>(`${accountPath}/adimages`, {
      bytes: sanitizeBase64Image(params.imageBase64),
    }, logger);
    const imageKey = imageResult.images ? Object.keys(imageResult.images)[0] : null;
    const firstImage = imageKey ? imageResult.images?.[imageKey] : null;

    if (!imageKey || !firstImage?.hash) {
      throw new Error("Image upload succeeded but no image hash was returned.");
    }

    imageHash = firstImage.hash;
    logFacebookAdsDebug(logger, "info", "Ad image uploaded.", {
      imageHash,
    });
  } catch (error) {
    logFacebookAdsDebug(logger, "error", "Image upload failed.", {
      message: getImageUploadErrorMessage(error),
    });
    throw new Error(`Image upload failed: ${getImageUploadErrorMessage(error)}`);
  }

  let campaignId: string;

  try {
    logFacebookAdsDebug(logger, "info", "Creating campaign.", {
      campaignName: params.campaignName,
    });
    const campaign = await postGraph<{ id: string }>(`${accountPath}/campaigns`, {
      name: params.campaignName,
      objective: "OUTCOME_LEADS",
      status: params.status,
      special_ad_categories: [],
      buying_type: "AUCTION",
      is_adset_budget_sharing_enabled: false,
    }, logger);

    campaignId = campaign.id;
    logFacebookAdsDebug(logger, "info", "Campaign created.", {
      campaignId,
    });
  } catch (error) {
    logFacebookAdsDebug(logger, "error", "Campaign creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error.",
    });
    throw new Error(`Campaign creation failed: ${error instanceof Error ? error.message : "Unknown error."}`);
  }

  const geoLocations = await resolveLocation(params.location, logger);
  const interestTargeting = await resolveInterests(params.interests, logger);

  const targeting: Record<string, unknown> = {
    age_min: params.ageMin,
    age_max: params.ageMax,
    genders: [0],
    geo_locations: geoLocations,
    targeting_automation: { advantage_audience: 0 },
  };

  if (interestTargeting.length > 0) {
    targeting.flexible_spec = [{ interests: interestTargeting }];
  }

  let adSetId: string;

  try {
    logFacebookAdsDebug(logger, "info", "Creating ad set.", {
      adSetName: params.adSetName,
      interestCount: interestTargeting.length,
    });
    const adSet = await postGraph<{ id: string }>(`${accountPath}/adsets`, {
      name: params.adSetName,
      campaign_id: campaignId,
      daily_budget: Math.round(params.dailyBudget * 100),
      billing_event: "IMPRESSIONS",
      optimization_goal: "LEAD_GENERATION",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      status: params.status,
      targeting,
      promoted_object: { page_id: pageId },
      start_time: new Date().toISOString(),
      dsa_beneficiary: dsaBeneficiary,
      dsa_payor: dsaPayor,
    }, logger);

    adSetId = adSet.id;
    logFacebookAdsDebug(logger, "info", "Ad set created.", {
      adSetId,
    });
  } catch (error) {
    logFacebookAdsDebug(logger, "error", "Ad set creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error.",
    });
    throw new Error(`Ad set creation failed: ${error instanceof Error ? error.message : "Unknown error."}`);
  }

  let creativeId: string;

  try {
    logFacebookAdsDebug(logger, "info", "Creating ad creative.", {
      adName: params.adName,
      callToAction: params.callToAction,
    });
    const creative = await postGraph<{ id: string }>(`${accountPath}/adcreatives`, {
      name: `${params.adName} - Creative`,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          image_hash: imageHash,
          message: params.primaryText,
          name: params.headline,
          link: `https://www.facebook.com/${pageId}`,
          call_to_action: {
            type: params.callToAction,
          },
        },
      },
    }, logger);

    creativeId = creative.id;
    logFacebookAdsDebug(logger, "info", "Ad creative created.", {
      creativeId,
    });
  } catch (error) {
    logFacebookAdsDebug(logger, "error", "Ad creative creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error.",
    });
    throw new Error(`Ad creative creation failed: ${error instanceof Error ? error.message : "Unknown error."}`);
  }

  try {
    logFacebookAdsDebug(logger, "info", "Creating ad.", {
      adName: params.adName,
      adSetId,
      creativeId,
    });
    await postGraph(`${accountPath}/ads`, {
      name: params.adName,
      adset_id: adSetId,
      creative: { creative_id: creativeId },
      status: params.status,
    }, logger);
    logFacebookAdsDebug(logger, "info", "Ad created successfully.");
  } catch (error) {
    logFacebookAdsDebug(logger, "error", "Ad creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error.",
    });
    throw new Error(`Ad creation failed: ${error instanceof Error ? error.message : "Unknown error."}`);
  }

  logFacebookAdsDebug(logger, "info", "Meta campaign flow completed successfully.", {
    campaignId,
  });
  return {
    campaignId,
    adsManagerUrl: `https://www.facebook.com/adsmanager/manage/campaigns?act=${accountId}&campaign_ids=${campaignId}`,
  };
}
