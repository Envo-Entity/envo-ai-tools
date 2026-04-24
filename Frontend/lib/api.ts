const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiErrorPayload = {
  success?: boolean;
  code?: string;
  message?: string;
  error?: string;
  hint?: string;
  step?: string | null;
  debugLogs?: FacebookAdsDebugLog[];
  details?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

export type FacebookAdsDebugLog = {
  timestamp: string;
  level: "info" | "error";
  message: string;
  data?: Record<string, unknown>;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  hint?: string;
  step?: string | null;
  debugLogs?: FacebookAdsDebugLog[];
  details?: ApiErrorPayload["details"];
  payload?: ApiErrorPayload;

  constructor(message: string, options: { status: number; payload?: ApiErrorPayload }) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.payload?.code;
    this.hint = options.payload?.hint;
    this.step = options.payload?.step;
    this.debugLogs = options.payload?.debugLogs;
    this.details = options.payload?.details;
    this.payload = options.payload;
  }
}

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export type FacebookAdFormData = {
  productDescription: string;
  targetLocation: string;
  dailyBudget: number;
  ageMin: number;
  ageMax: number;
  publishImmediately: boolean;
};

export type FacebookAdGeneratedContent = {
  primaryText: string;
  headline: string;
  callToAction:
    | "LEARN_MORE"
    | "SIGN_UP"
    | "GET_QUOTE"
    | "CONTACT_US"
    | "SUBSCRIBE"
    | "APPLY_NOW"
    | "DOWNLOAD"
    | "GET_OFFER"
    | "SHOP_NOW"
    | "BOOK_TRAVEL";
  interests: string[];
  campaignName: string;
  adSetName: string;
  adName: string;
};

export type FacebookAdCreateResult = {
  campaignId: string;
  campaignName: string;
  adsManagerUrl: string;
  debugLogs?: FacebookAdsDebugLog[];
};

export type PromptRaceIngredient = {
  title: string;
  description: string;
  health_impact: "good" | "okay" | "bad";
};

export type PromptRaceAnalysis = {
  is_consumable: boolean;
  confidence: number;
  product_name: string | null;
  product_subtitle?: string | null;
  category: "food" | "beverage" | "cosmetics" | "other" | null;
  health_score: number | null;
  planet_score: number | null;
  reasoning?: string | null;
  compatibility: {
    score: number;
    label: "low" | "moderate" | "high";
    summary: string;
    likes: Array<{ text: string }>;
    concerns: Array<{ text: string }>;
  } | null;
  ingredients: PromptRaceIngredient[] | null;
};

export type PromptRaceUsage = {
  model: string;
  tokens: {
    prompt: number;
    cached: number;
    output: number;
    thoughts: number;
    total: number;
  };
  cost: {
    input_usd: number;
    cached_usd: number;
    output_usd: number;
    thoughts_usd: number;
    total_usd: number;
  };
};

export type PromptRaceGeneratedImage = {
  mimeType: string;
  data: string;
};

export type PromptRaceAgentOneResult = {
  productName: string | null;
  categories: string[];
  extractedIngredients: string;
};

export type ProjectSummary = {
  id: string;
  name: string;
  about: string;
  assetCount: number;
  slideCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MediaKind = "asset" | "inspiration" | "generated_image";
export type GenerationStatus =
  | "queued"
  | "planning"
  | "generating_images"
  | "uploading_images"
  | "generating_html"
  | "completed"
  | "failed";

export type ProjectMedia = {
  id: string;
  projectId: string;
  kind: MediaKind;
  storageProvider: string;
  uploadthingKey: string | null;
  url: string;
  name: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  sourceGenerationRunId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IdeaItem = {
  id: string;
  batchId: string;
  projectId: string;
  title: string;
  prompt: string;
  order: number;
  createdAt: string;
};

export type IdeaBatch = {
  id: string;
  projectId: string;
  seed: string | null;
  status: "completed" | "failed";
  createdAt: string;
  updatedAt: string;
};

export type SlideRecord = {
  id: string;
  projectId: string;
  generationRunId: string;
  variantIndex: number;
  title: string;
  prompt: string;
  aspectRatio: string;
  status: GenerationStatus;
  htmlDocument: string;
  referenceSlideId: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GenerationRun = {
  id: string;
  projectId: string;
  trigger: "prompt" | "idea" | "reference";
  sourcePrompt: string;
  requestedOutputs: number;
  aspectRatio: string;
  referenceSlideId: string | null;
  status: GenerationStatus;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = {
  project: {
    id: string;
    name: string;
    about: string;
    createdAt: string;
    updatedAt: string;
  };
  media: ProjectMedia[];
  assets: ProjectMedia[];
  inspirations: ProjectMedia[];
  generatedImages: ProjectMedia[];
  slides: SlideRecord[];
  generationRuns: GenerationRun[];
  latestIdeaBatch: IdeaBatch | null;
  latestIdeas: IdeaItem[];
};

async function readJson<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? ((await response.json()) as T & ApiErrorPayload) : null;
  const text = isJson ? null : await response.text();

  if (!response.ok) {
    const message =
      data?.message ??
      data?.error ??
      text ??
      `Request failed with status ${response.status}.`;

    throw new ApiError(message, {
      status: response.status,
      payload: data ?? undefined,
    });
  }

  return data as T;
}

export async function sendChat(messages: ChatMessage[]) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  return readJson<{ reply: string }>(response);
}

export async function getSession() {
  const response = await fetch(`${API_URL}/api/auth/session`, {
    cache: "no-store",
    credentials: "include",
  });

  return readJson<{ authenticated: boolean }>(response);
}

export async function unlockSite(password: string) {
  const response = await fetch(`${API_URL}/api/auth/unlock`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  return readJson<{ authenticated: boolean }>(response);
}

export async function generateFacebookAd(input: FacebookAdFormData) {
  const response = await fetch(`${API_URL}/api/facebook-ads/generate`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<{ generated: FacebookAdGeneratedContent; debugLogs?: FacebookAdsDebugLog[] }>(response);
}

export async function createFacebookAdCampaign(input: {
  form: FacebookAdFormData;
  generated: FacebookAdGeneratedContent;
  imageBase64: string;
}) {
  const response = await fetch(`${API_URL}/api/facebook-ads/create-campaign`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<FacebookAdCreateResult>(response);
}

export async function analyzePromptRace(input: {
  imageBase64: string;
  prompt: string;
  enableGrounding: boolean;
}) {
  const response = await fetch(`${API_URL}/api/prompt-race/prompt-one`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<{
    analysis: PromptRaceAnalysis;
    usage: PromptRaceUsage;
  }>(response);
}

export async function analyzePromptTwoAgentOne(input: {
  imageBase64: string;
  prompt: string;
  enableGrounding: boolean;
}) {
  const response = await fetch(`${API_URL}/api/prompt-race/prompt-two/agent-one`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<{
    productName: string | null;
    categories: string[];
    extractedIngredients: string;
    usage: PromptRaceUsage;
  }>(response);
}

export async function analyzePromptTwoAgentTwo(input: {
  imageBase64: string;
  prompt: string;
  extractedIngredients: string;
  agentOneProductName?: string | null;
  agentOneCategories: string[];
  userProfile: {
    allergies: string[];
    healthConditions: string[];
    dietaryPreferences: string[];
    skinConditions: string[];
  };
  enableGrounding: boolean;
}) {
  const response = await fetch(`${API_URL}/api/prompt-race/prompt-two/agent-two`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<{
    analysis: PromptRaceAnalysis;
    usage: PromptRaceUsage;
  }>(response);
}

export async function analyzePromptTwoAgentThree(input: {
  imageBase64: string;
}) {
  const response = await fetch(`${API_URL}/api/prompt-race/prompt-two/agent-three`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<{
    image: PromptRaceGeneratedImage;
    usage: PromptRaceUsage;
  }>(response);
}

export async function analyzeSupabaseScan(input: { imageBase64: string }) {
  const response = await fetch(
    "https://ihichdejyaeignzbnfgb.supabase.co/functions/v1/prompt-race-analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  return readJson<{
    analysis: PromptRaceAnalysis;
    usage: PromptRaceUsage;
  }>(response);
}

export async function listProjects() {
  const response = await fetch(`${API_URL}/api/projects`, {
    credentials: "include",
  });

  return readJson<{ projects: ProjectSummary[] }>(response);
}

export async function createProject(input: { name: string; about: string }) {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<ProjectDetail>(response);
}

export async function deleteProject(projectId: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return readJson<{ success: boolean }>(response);
}

export async function deleteProjectMedia(projectId: string, mediaId: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/media/${mediaId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return readJson<{ success: boolean }>(response);
}

export async function getProject(projectId: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    credentials: "include",
  });

  return readJson<ProjectDetail>(response);
}

export async function generateIdeas(projectId: string, seed?: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/ideas`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seed }),
  });

  return readJson<{ batch: IdeaBatch; ideas: IdeaItem[] }>(response);
}

export async function deleteIdea(projectId: string, ideaId: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/ideas/${ideaId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return readJson<{ success: boolean }>(response);
}

export async function deleteSlide(slideId: string) {
  const response = await fetch(`${API_URL}/api/slides/${slideId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return readJson<{ success: boolean }>(response);
}

export async function createGeneration(
  projectId: string,
  input: {
    prompt: string;
    requestedOutputs: number;
    aspectRatio: string;
    referenceSlideId?: string | null;
    trigger?: "prompt" | "idea" | "reference";
  },
) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/generations`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJson<{ run: GenerationRun; slides: SlideRecord[] }>(response);
}

export async function getGenerationRun(runId: string) {
  const response = await fetch(`${API_URL}/api/generations/${runId}`, {
    credentials: "include",
  });

  return readJson<{ run: GenerationRun; slides: SlideRecord[] }>(response);
}

export async function renameProjectMedia(projectId: string, mediaId: string, name: string) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/media/${mediaId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  return readJson<{ media: ProjectMedia }>(response);
}

export async function registerUploadedProjectMedia(
  projectId: string,
  uploads: Array<{
    key: string;
    url: string;
    name: string;
    mimeType?: string | null;
    sizeBytes?: number | null;
    kind: "asset" | "inspiration";
  }>,
) {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/media/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uploads }),
  });

  return readJson<{ media: ProjectMedia[] }>(response);
}

export function getSlideDownloadUrl(slideId: string) {
  return `${API_URL}/api/slides/${slideId}/download`;
}
