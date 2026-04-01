"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, FolderOpen, ImagePlus, LayoutTemplate, Lightbulb, Loader2, Plus, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createGeneration,
  createProject,
  generateIdeas,
  getGenerationRun,
  getProject,
  getSlideDownloadUrl,
  listProjects,
  type GenerationRun,
  type GenerationStatus,
  type IdeaItem,
  type ProjectDetail,
  type ProjectMedia,
  type SlideRecord,
} from "@/lib/api";
import { optimizeImagesForUpload } from "@/lib/image-processing";
import { uploadthingClient } from "@/lib/uploadthing";

type AppView = "projects" | "config" | "workspace";
type WorkspaceMode = "prompt" | "ideas";
type PendingFile = {
  id: string;
  file: File;
  previewUrl: string;
};

const aspectRatios = [
  { label: "9:16", name: "Story", preview: "aspect-[9/16]" },
  { label: "16:9", name: "Wide", preview: "aspect-[16/9]" },
  { label: "1:1", name: "Square", preview: "aspect-square" },
  { label: "4:5", name: "Post", preview: "aspect-[4/5]" },
  { label: "3:4", name: "Portrait", preview: "aspect-[3/4]" },
  { label: "4:3", name: "Classic", preview: "aspect-[4/3]" },
] as const;

function getSelectedRatioPreview(selectedAspectRatio: string) {
  return aspectRatios.find((ratio) => ratio.label === selectedAspectRatio)?.preview ?? "aspect-[4/5]";
}

function getStatusLabel(status: GenerationStatus) {
  switch (status) {
    case "queued":
      return "Queued";
    case "planning":
      return "Planning";
    case "generating_images":
      return "Generating images";
    case "uploading_images":
      return "Uploading images";
    case "generating_html":
      return "Generating HTML";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

async function uploadProjectFiles(input: {
  projectId: string;
  kind: "asset" | "inspiration";
  files: File[];
}) {
  if (input.files.length === 0) {
    return [];
  }

  const optimizedFiles = await optimizeImagesForUpload(input.files);

  return (uploadthingClient as any).uploadFiles("assetUploader", {
    files: optimizedFiles,
    input: {
      projectId: input.projectId,
      kind: input.kind,
    },
    headers: () => ({
      Accept: "application/json",
    }),
  });
}

function RunStatusBanner({ run }: { run: GenerationRun | null }) {
  if (!run) {
    return null;
  }

  const isTerminal = run.status === "completed" || run.status === "failed";

  return (
    <div className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
            Active Run
          </p>
          <p className="font-subtitle mt-2 text-lg text-[color:var(--color-text)]">{getStatusLabel(run.status)}</p>
        </div>
        <div className="flex items-center gap-3">
          {!isTerminal && <Loader2 className="h-4 w-4 animate-spin text-[color:var(--color-accent)]" />}
          <span className="font-body text-sm text-[color:var(--color-text-secondary)]">
            {run.requestedOutputs} variant{run.requestedOutputs > 1 ? "s" : ""} • {run.aspectRatio}
          </span>
        </div>
      </div>
      {run.error && <p className="font-body mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">{run.error}</p>}
    </div>
  );
}

function SlideTile({
  slide,
  isReference,
  onOpen,
  onReference,
}: {
  slide: SlideRecord;
  isReference: boolean;
  onOpen: (slide: SlideRecord) => void;
  onReference: (slide: SlideRecord) => void;
}) {
  return (
    <div
      className={`rounded-[28px] border bg-[rgba(255,255,255,0.04)] p-4 text-left transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)] ${
        isReference ? "border-[rgba(194,58,131,0.55)]" : "border-white/10"
      } ${getSelectedRatioPreview(slide.aspectRatio)}`}
      onClick={() => onOpen(slide)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(slide);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex h-full flex-col gap-3 rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.14em] text-[color:var(--color-accent)]">{slide.title}</p>
            <p className="font-body mt-2 text-[11px] uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
              {slide.aspectRatio} • {getStatusLabel(slide.status)}
            </p>
          </div>
          <button
            className={`font-body inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] transition ${
              isReference
                ? "border-[rgba(194,58,131,0.55)] bg-[rgba(194,58,131,0.14)] text-white"
                : "border-white/10 bg-[rgba(255,255,255,0.04)] text-[color:var(--color-text-secondary)] hover:border-white/20 hover:text-[color:var(--color-text)]"
            }`}
            onClick={(event) => {
              event.stopPropagation();
              onReference(slide);
            }}
            type="button"
          >
            {isReference ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {isReference ? "Selected" : "Reference"}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-[18px] border border-white/10 bg-[rgba(15,25,31,0.45)]">
          {slide.status === "completed" && slide.htmlDocument ? (
            <iframe
              className="h-full w-full bg-white"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={slide.htmlDocument}
              title={slide.title}
            />
          ) : (
            <div className="flex h-full min-h-[12rem] items-center justify-center px-6 text-center">
              <div>
                {slide.status !== "failed" && <Loader2 className="mx-auto h-5 w-5 animate-spin text-[color:var(--color-accent)]" />}
                <p className="font-subtitle mt-3 text-base text-[color:var(--color-text)]">{getStatusLabel(slide.status)}</p>
                <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                  {slide.error ?? "The backend is building this slide variant now."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SlidesMakerPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<AppView>("projects");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("prompt");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectAbout, setProjectAbout] = useState("");
  const [pendingAssets, setPendingAssets] = useState<PendingFile[]>([]);
  const [prompt, setPrompt] = useState("");
  const [ideaSeed, setIdeaSeed] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("4:5");
  const [numberOfOutputs, setNumberOfOutputs] = useState("6");
  const [selectedReferenceSlideId, setSelectedReferenceSlideId] = useState<string | null>(null);
  const [selectedOutput, setSelectedOutput] = useState<SlideRecord | null>(null);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [isUploadingInspirations, setIsUploadingInspirations] = useState(false);
  const [isUploadingAssets, setIsUploadingAssets] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => listProjects(),
  });

  const projectQuery = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: () => getProject(selectedProjectId!),
    enabled: Boolean(selectedProjectId),
    refetchInterval: 2_500,
  });

  const generationRunQuery = useQuery({
    queryKey: ["generation-run", activeRunId],
    queryFn: () => getGenerationRun(activeRunId!),
    enabled: Boolean(activeRunId),
    refetchInterval: (query) => {
      const status = query.state.data?.run.status;
      if (!status || status === "completed" || status === "failed") {
        return false;
      }

      return 1_500;
    },
  });

  useEffect(() => {
    const status = generationRunQuery.data?.run.status;

    if (status === "completed" || status === "failed") {
      void queryClient.invalidateQueries({ queryKey: ["project", selectedProjectId] });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  }, [generationRunQuery.data?.run.status, queryClient, selectedProjectId]);

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const trimmedName = projectName.trim();
      const trimmedAbout = projectAbout.trim();

      if (!trimmedName || !trimmedAbout) {
        throw new Error("Project name and about are required.");
      }

      if (pendingAssets.length > 10) {
        throw new Error("A project can have at most 10 assets.");
      }

      const detail = await createProject({
        name: trimmedName,
        about: trimmedAbout,
      });

      if (pendingAssets.length > 0) {
        await uploadProjectFiles({
          projectId: detail.project.id,
          kind: "asset",
          files: pendingAssets.map((item) => item.file),
        });
      }

      return detail.project.id;
    },
    onSuccess: async (projectId) => {
      setSelectedProjectId(projectId);
      setView("workspace");
      setProjectName("");
      setProjectAbout("");
      setPendingAssets([]);
      setFormError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects"] }),
        queryClient.invalidateQueries({ queryKey: ["project", projectId] }),
      ]);
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : "Failed to create project.");
    },
  });

  const generateIdeasMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProjectId) {
        throw new Error("Select a project first.");
      }

      return generateIdeas(selectedProjectId, ideaSeed.trim() || undefined);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["project", selectedProjectId] });
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : "Failed to generate ideas.");
    },
  });

  const createGenerationMutation = useMutation({
    mutationFn: async (input: { prompt: string; trigger: "prompt" | "idea" | "reference" }) => {
      if (!selectedProjectId) {
        throw new Error("Select a project first.");
      }

      const requestedOutputs = Math.max(1, Math.min(10, Number.parseInt(numberOfOutputs || "1", 10) || 1));

      return createGeneration(selectedProjectId, {
        prompt: input.prompt,
        requestedOutputs,
        aspectRatio: selectedAspectRatio,
        referenceSlideId: selectedReferenceSlideId,
        trigger: selectedReferenceSlideId ? "reference" : input.trigger,
      });
    },
    onSuccess: async (result) => {
      setActiveRunId(result.run.id);
      await queryClient.invalidateQueries({ queryKey: ["project", selectedProjectId] });
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : "Failed to start generation.");
    },
  });

  const currentData = projectQuery.data;
  const currentProject = currentData?.project ?? null;
  const currentAssets = currentData?.assets ?? [];
  const currentInspirations = currentData?.inspirations ?? [];
  const currentIdeas = currentData?.latestIdeas ?? [];
  const currentSlides = currentData?.slides ?? [];

  const activeRun = useMemo(() => {
    if (generationRunQuery.data?.run) {
      return generationRunQuery.data.run;
    }

    return currentData?.generationRuns.find((run) => run.status !== "completed" && run.status !== "failed") ?? null;
  }, [currentData?.generationRuns, generationRunQuery.data?.run]);

  useEffect(() => {
    if (!selectedProjectId && projectsQuery.data?.projects.length) {
      setSelectedProjectId(projectsQuery.data.projects[0]?.id ?? null);
    }
  }, [projectsQuery.data?.projects, selectedProjectId]);

  function addPendingFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    const nextFiles = Array.from(fileList);

    setPendingAssets((current) => {
      const combined = [...current];

      for (const file of nextFiles) {
        if (combined.length >= 10) {
          break;
        }

        combined.push({
          id: `${file.name}-${file.lastModified}-${combined.length}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      return combined;
    });
  }

  async function handleUploadToProject(kind: "asset" | "inspiration", fileList: FileList | null) {
    if (!selectedProjectId || !fileList) {
      return;
    }

    const files = Array.from(fileList);

    if (kind === "asset" && currentAssets.length + files.length > 10) {
      setFormError("A project can have at most 10 assets.");
      return;
    }

    try {
      if (kind === "asset") {
        setIsUploadingAssets(true);
      } else {
        setIsUploadingInspirations(true);
      }

      await uploadProjectFiles({
        projectId: selectedProjectId,
        kind,
        files,
      });
      await queryClient.invalidateQueries({ queryKey: ["project", selectedProjectId] });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to upload files.");
    } finally {
      setIsUploadingAssets(false);
      setIsUploadingInspirations(false);
    }
  }

  if (view === "projects") {
    return (
      <main className="min-h-screen bg-[color:var(--color-bg)] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">Tool 01</p>
              <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">AI Slides Maker</h1>
              <p className="font-body mt-4 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)]">
                Create and manage persisted slide projects backed by Neon, UploadThing, and Gemini generation.
              </p>
            </div>

            <Button className="rounded-full px-5" onClick={() => setView("config")}>
              <Plus className="mr-2 h-4 w-4" />
              Start a New Project
            </Button>
          </header>

          <Card className="border-white/10 bg-[rgba(255,255,255,0.05)]">
            <CardContent className="p-8">
              {projectsQuery.isLoading ? (
                <div className="flex min-h-[320px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[color:var(--color-accent)]" />
                </div>
              ) : projectsQuery.data?.projects.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {projectsQuery.data.projects.map((project) => (
                    <button
                      key={project.id}
                      className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 text-left transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)]"
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setView("workspace");
                      }}
                      type="button"
                    >
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Project</p>
                      <h3 className="font-title mt-3 text-2xl tracking-[-0.05em] text-[color:var(--color-text)]">{project.name}</h3>
                      <p className="font-body mt-3 line-clamp-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">{project.about}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="font-body rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--color-text-secondary)]">
                          Assets: {project.assetCount}
                        </span>
                        <span className="font-body rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--color-text-secondary)]">
                          Slides: {project.slideCount}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] text-[color:var(--color-accent)]">
                    <FolderOpen className="h-9 w-9" />
                  </div>
                  <h2 className="font-title mt-6 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">No projects yet</h2>
                  <p className="font-body mt-4 max-w-md text-base leading-8 text-[color:var(--color-text-secondary)]">
                    Start a new project to define the context, upload assets, and move into the persisted generation workspace.
                  </p>
                  <Button className="mt-6 rounded-full px-5" onClick={() => setView("config")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start a New Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (view === "config") {
    return (
      <main className="min-h-screen bg-[color:var(--color-bg)] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">Config</p>
              <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">New Project</h1>
              <p className="font-body mt-4 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)]">
                Define the project context first. Assets selected here will be uploaded to UploadThing after the project record is created.
              </p>
            </div>

            <Button className="rounded-full px-5" variant="outline" onClick={() => setView("projects")}>
              Back to Projects
            </Button>
          </header>

          <Card className="border-white/10 bg-[rgba(255,255,255,0.05)]">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="font-body text-sm text-[color:var(--color-text-secondary)]" htmlFor="project-name">
                    Project name
                  </label>
                  <Input id="project-name" onChange={(event) => setProjectName(event.target.value)} placeholder="Q2 Product Story" value={projectName} />
                </div>

                <div className="space-y-3">
                  <label className="font-body text-sm text-[color:var(--color-text-secondary)]" htmlFor="project-about">
                    About
                  </label>
                  <textarea
                    className="font-body min-h-52 w-full resize-none rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]"
                    id="project-about"
                    onChange={(event) => setProjectAbout(event.target.value)}
                    placeholder="Explain what this project is about, who the audience is, and what kind of visual direction the AI should understand."
                    value={projectAbout}
                  />
                </div>

                <div className="space-y-3">
                  <label
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/15 bg-[rgba(255,255,255,0.03)] px-4 py-8 text-center transition hover:border-white/25 hover:bg-[rgba(255,255,255,0.05)]"
                    htmlFor="config-assets"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(248,101,64,0.12)] text-[color:var(--color-accent)]">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-subtitle text-base text-[color:var(--color-text)]">Add project assets</p>
                      <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                        Up to 10 files. These become reusable project assets after the project is created.
                      </p>
                    </div>
                    <input
                      className="hidden"
                      id="config-assets"
                      multiple
                      onChange={(event) => {
                        addPendingFiles(event.target.files);
                        event.target.value = "";
                      }}
                      type="file"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Assets</p>
                  <div className="mt-4 grid gap-3">
                    {pendingAssets.length === 0 ? (
                      <p className="font-body text-sm leading-6 text-[color:var(--color-text-secondary)]">No assets selected yet.</p>
                    ) : (
                      pendingAssets.map((asset) => (
                        <div key={asset.id} className="rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-3">
                          <div className="aspect-[4/3] overflow-hidden rounded-[14px] bg-[rgba(255,255,255,0.04)]">
                            <img alt={asset.file.name} className="h-full w-full object-cover" src={asset.previewUrl} />
                          </div>
                          <p className="font-body mt-3 truncate text-sm text-[color:var(--color-text)]">{asset.file.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {formError && <p className="font-body text-sm leading-6 text-[color:var(--color-accent)]">{formError}</p>}

                <Button className="w-full rounded-full" disabled={createProjectMutation.isPending} onClick={() => createProjectMutation.mutate()}>
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--color-bg)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">Workspace</p>
            <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">
              {currentProject?.name ?? "AI Slides Maker"}
            </h1>
            <p className="font-body mt-4 max-w-3xl text-base leading-8 text-[color:var(--color-text-secondary)]">
              Projects, ideas, slide variants, references, and generated media now live in the backend.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full px-5" variant="outline" onClick={() => setView("projects")}>
              Projects
            </Button>
            <Button className="rounded-full px-5" variant="outline" onClick={() => setView("config")}>
              New Project
            </Button>
          </div>
        </header>

        <RunStatusBanner run={activeRun} />

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card className="border-white/10 bg-[rgba(255,255,255,0.05)]">
            <CardContent className="space-y-5">
              <div className="inline-flex rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] p-1">
                <button
                  className={`font-body rounded-full px-4 py-2 text-sm transition ${
                    workspaceMode === "prompt" ? "bg-[color:var(--color-primary)] text-white" : "text-[color:var(--color-text-secondary)]"
                  }`}
                  onClick={() => setWorkspaceMode("prompt")}
                  type="button"
                >
                  Prompt
                </button>
                <button
                  className={`font-body rounded-full px-4 py-2 text-sm transition ${
                    workspaceMode === "ideas" ? "bg-[color:var(--color-primary)] text-white" : "text-[color:var(--color-text-secondary)]"
                  }`}
                  onClick={() => setWorkspaceMode("ideas")}
                  type="button"
                >
                  Generate Ideas
                </button>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-subtitle text-lg text-[color:var(--color-text)]">{workspaceMode === "prompt" ? "Prompt" : "Direction Seed"}</p>
                  {selectedReferenceSlideId && (
                    <p className="font-body text-xs uppercase tracking-[0.14em] text-[color:var(--color-accent)]">Reference Active</p>
                  )}
                </div>

                {workspaceMode === "prompt" ? (
                  <>
                    <textarea
                      className="font-body mt-4 min-h-40 w-full resize-none rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.02)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-tertiary)]"
                      onChange={(event) => setPrompt(event.target.value)}
                      placeholder="Describe the slide, composition, message, and style."
                      value={prompt}
                    />

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] text-[color:var(--color-text-secondary)]"
                        onClick={() => setSelectedReferenceSlideId(null)}
                        type="button"
                      >
                        <Wand2 className="h-4 w-4" />
                      </button>
                      <Button
                        className="rounded-full px-5"
                        disabled={createGenerationMutation.isPending || !currentProject}
                        onClick={() => createGenerationMutation.mutate({ prompt: prompt.trim(), trigger: "prompt" })}
                        type="button"
                      >
                        {createGenerationMutation.isPending ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      className="font-body mt-4 min-h-28 w-full resize-none rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.02)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-tertiary)]"
                      onChange={(event) => setIdeaSeed(event.target.value)}
                      placeholder="Optionally steer what kind of ideas should be generated."
                      value={ideaSeed}
                    />

                    <div className="mt-4 flex items-center justify-end">
                      <Button
                        className="rounded-full px-5"
                        disabled={!currentProject || generateIdeasMutation.isPending}
                        onClick={() => generateIdeasMutation.mutate()}
                        type="button"
                      >
                        {generateIdeasMutation.isPending ? "Generating..." : "Generate Ideas"}
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {currentIdeas.length === 0 ? (
                        <div className="rounded-[22px] border border-dashed border-white/12 bg-[rgba(255,255,255,0.02)] px-4 py-6 text-center">
                          <Lightbulb className="mx-auto h-5 w-5 text-[color:var(--color-accent)]" />
                          <p className="font-body mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                            Saved ideas will appear here after the backend generates them.
                          </p>
                        </div>
                      ) : (
                        currentIdeas.map((idea) => (
                          <div key={idea.id} className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-subtitle text-base text-[color:var(--color-text)]">{idea.title}</p>
                                <p className="font-body mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">{idea.prompt}</p>
                              </div>
                              <Button
                                className="shrink-0 rounded-full px-4"
                                disabled={createGenerationMutation.isPending}
                                onClick={() => createGenerationMutation.mutate({ prompt: idea.prompt, trigger: "idea" })}
                                type="button"
                              >
                                Generate
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="font-subtitle text-lg text-[color:var(--color-text)]">Inspirations</p>
                <div className="mt-4 grid gap-3">
                  <label
                    className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-dashed border-white/15 bg-[rgba(255,255,255,0.03)] px-4 py-4 transition hover:border-white/25"
                    htmlFor="inspirations"
                  >
                    <ImagePlus className="h-5 w-5 text-[color:var(--color-accent)]" />
                    <span className="font-body text-sm text-[color:var(--color-text-secondary)]">Add inspiration images</span>
                    <input
                      className="hidden"
                      id="inspirations"
                      multiple
                      onChange={(event) => {
                        void handleUploadToProject("inspiration", event.target.files);
                        event.target.value = "";
                      }}
                      type="file"
                    />
                  </label>

                  {isUploadingInspirations && (
                    <p className="font-body text-sm leading-6 text-[color:var(--color-text-secondary)]">Uploading inspiration images...</p>
                  )}

                  {currentInspirations.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {currentInspirations.slice(0, 6).map((asset) => (
                        <div key={asset.id} className="aspect-square overflow-hidden rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.03)]">
                          <img alt={asset.name} className="h-full w-full object-cover" src={asset.url} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="font-subtitle text-lg text-[color:var(--color-text)]">Output Count</p>
                <div className="mt-4 flex items-center gap-3">
                  <Input
                    className="max-w-28"
                    inputMode="numeric"
                    onChange={(event) => setNumberOfOutputs(event.target.value.replace(/\D/g, ""))}
                    placeholder="6"
                    value={numberOfOutputs}
                  />
                  <span className="font-body text-sm text-[color:var(--color-text-secondary)]">Number of sibling variants</span>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-subtitle text-lg text-[color:var(--color-text)]">Aspect Ratio</p>
                  <LayoutTemplate className="h-4 w-4 text-[color:var(--color-accent)]" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {aspectRatios.map((ratio) => {
                    const isSelected = ratio.label === selectedAspectRatio;

                    return (
                      <button
                        key={ratio.label}
                        className="rounded-[18px] border bg-[rgba(255,255,255,0.03)] p-2.5 text-left transition hover:border-white/20"
                        onClick={() => setSelectedAspectRatio(ratio.label)}
                        style={{
                          borderColor: isSelected ? "rgba(194,58,131,0.55)" : "rgba(255,255,255,0.1)",
                        }}
                        type="button"
                      >
                        <p className="font-body text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">{ratio.label}</p>
                        <div className="mt-2.5 flex h-14 items-center justify-center rounded-[14px] bg-[rgba(15,25,31,0.55)]">
                          <div
                            className={`rounded-[10px] border border-white/15 bg-[rgba(107,185,204,0.16)] ${ratio.preview}`}
                            style={{
                              width: ratio.label === "16:9" ? "48px" : ratio.label === "4:3" ? "40px" : ratio.label === "1:1" ? "28px" : "24px",
                              maxHeight: "46px",
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[rgba(255,255,255,0.05)]">
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-accent text-xs uppercase tracking-[0.18em] text-[color:var(--color-primary)]">Output</p>
                  <h2 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">Generation Area</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="font-body rounded-full border border-white/10 px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
                    Assets: {currentAssets.length}
                  </div>
                  <div className="font-body rounded-full border border-white/10 px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
                    Inspirations: {currentInspirations.length}
                  </div>
                  {selectedReferenceSlideId && (
                    <div className="font-body rounded-full border border-[rgba(194,58,131,0.55)] px-4 py-2 text-sm text-white">
                      Reference Selected
                    </div>
                  )}
                </div>
              </div>

              {formError && <p className="font-body text-sm leading-6 text-[color:var(--color-accent)]">{formError}</p>}

              <div className="grid gap-4 lg:grid-cols-3">
                {projectQuery.isLoading ? (
                  <div className="lg:col-span-3 flex min-h-[320px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[color:var(--color-accent)]" />
                  </div>
                ) : currentSlides.length === 0 ? (
                  <div className="lg:col-span-3 flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-[rgba(255,255,255,0.03)] px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] text-[color:var(--color-accent)]">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <h3 className="font-title mt-5 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">No slides yet</h3>
                    <p className="font-body mt-4 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      Generate variants from the left panel. Each completed slide is saved as HTML and can be reused as a reference.
                    </p>
                  </div>
                ) : (
                  currentSlides.map((slide) => (
                    <SlideTile
                      isReference={selectedReferenceSlideId === slide.id}
                      key={slide.id}
                      onOpen={setSelectedOutput}
                      onReference={(item) =>
                        setSelectedReferenceSlideId((current) => (current === item.id ? null : item.id))
                      }
                      slide={slide}
                    />
                  ))
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="font-subtitle text-lg text-[color:var(--color-text)]">Project Assets</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {currentAssets.length ? (
                    currentAssets.map((asset: ProjectMedia) => (
                      <div key={asset.id} className="w-[120px]">
                        <div className="aspect-square overflow-hidden rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)]">
                          <img alt={asset.name} className="h-full w-full object-cover" src={asset.url} />
                        </div>
                        <p className="font-body mt-2 truncate text-xs text-[color:var(--color-text-secondary)]">{asset.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="font-body text-sm text-[color:var(--color-text-secondary)]">No assets attached to this project yet.</p>
                  )}

                  <label className="flex h-[120px] w-[120px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-[rgba(255,255,255,0.03)] text-center transition hover:border-white/25">
                    <ImagePlus className="h-5 w-5 text-[color:var(--color-accent)]" />
                    <span className="font-body mt-2 px-3 text-xs leading-5 text-[color:var(--color-text-secondary)]">Upload new asset</span>
                    <input
                      className="hidden"
                      multiple
                      onChange={(event) => {
                        void handleUploadToProject("asset", event.target.files);
                        event.target.value = "";
                      }}
                      type="file"
                    />
                  </label>
                </div>
                {isUploadingAssets && (
                  <p className="font-body mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">Uploading project assets...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
          <button className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={() => setSelectedOutput(null)} type="button" />
          <div className="relative z-10 w-full max-w-5xl rounded-[32px] border border-white/10 bg-[rgba(36,33,36,0.92)] p-6 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.85)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">{selectedOutput.aspectRatio}</p>
                <h3 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">{selectedOutput.title}</h3>
                <p className="font-body mt-3 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)]">{selectedOutput.prompt}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm text-white transition hover:opacity-90"
                  href={getSlideDownloadUrl(selectedOutput.id)}
                  target="_blank"
                >
                  Download
                </a>
                <Button className="rounded-full px-5" onClick={() => setSelectedOutput(null)} type="button" variant="outline">
                  Close
                </Button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
              <div
                className={`w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] ${getSelectedRatioPreview(
                  selectedOutput.aspectRatio,
                )}`}
              >
                {selectedOutput.status === "completed" && selectedOutput.htmlDocument ? (
                  <iframe
                    className="h-full w-full bg-white"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={selectedOutput.htmlDocument}
                    title={selectedOutput.title}
                  />
                ) : (
                  <div className="flex h-full min-h-[22rem] items-center justify-center px-6 text-center">
                    <div>
                      {selectedOutput.status !== "failed" && <Loader2 className="mx-auto h-6 w-6 animate-spin text-[color:var(--color-accent)]" />}
                      <p className="font-subtitle mt-4 text-lg text-[color:var(--color-text)]">{getStatusLabel(selectedOutput.status)}</p>
                      <p className="font-body mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                        {selectedOutput.error ?? "This slide is still being generated."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
