const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ChatMessage = {
  role: "user" | "model";
  text: string;
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
  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
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
