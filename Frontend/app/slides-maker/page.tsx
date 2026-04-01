"use client";

import { Copy, FolderOpen, ImagePlus, LayoutTemplate, Lightbulb, Plus, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AppView = "projects" | "config" | "workspace";
type WorkspaceMode = "prompt" | "ideas";

type AssetItem = {
  id: string;
  name: string;
  url: string;
};

type ProjectItem = {
  id: string;
  name: string;
  about: string;
  assets: AssetItem[];
};

type GeneratedItem = {
  id: string;
  title: string;
  aspectRatio: string;
  source: "prompt" | "idea";
  prompt: string;
};

type IdeaItem = {
  id: string;
  title: string;
  prompt: string;
  isGenerating?: boolean;
};

const aspectRatios = [
  { label: "9:16", name: "Story", preview: "aspect-[9/16]" },
  { label: "16:9", name: "Wide", preview: "aspect-[16/9]" },
  { label: "1:1", name: "Square", preview: "aspect-square" },
  { label: "4:5", name: "Post", preview: "aspect-[4/5]" },
  { label: "3:4", name: "Portrait", preview: "aspect-[3/4]" },
  { label: "4:3", name: "Classic", preview: "aspect-[4/3]" },
] as const;

const mockIdeas: IdeaItem[] = [
  {
    id: "idea-1",
    title: "Narrative Hook",
    prompt: "Create a bold opening slide with one sharp statement, a hero visual, and a clean callout that introduces the core story immediately.",
  },
  {
    id: "idea-2",
    title: "Problem Breakdown",
    prompt: "Generate a structured slide that breaks the problem into 3 concise points with strong visual hierarchy and simple supporting shapes.",
  },
  {
    id: "idea-3",
    title: "Before / After",
    prompt: "Design a before-versus-after comparison slide that makes the transformation feel obvious, premium, and easy to scan.",
  },
  {
    id: "idea-4",
    title: "Proof Slide",
    prompt: "Build a testimonial or proof-driven slide with strong quote treatment, metric highlights, and compact supporting detail.",
  },
];

function getSelectedRatioPreview(selectedAspectRatio: string) {
  return aspectRatios.find((ratio) => ratio.label === selectedAspectRatio)?.preview ?? "aspect-[4/5]";
}

function OutputTile({
  item,
  onOpen,
  onReference,
}: {
  item: GeneratedItem;
  onOpen: (item: GeneratedItem) => void;
  onReference: (event: { stopPropagation: () => void }, item: GeneratedItem) => void;
}) {
  const tileAspect = getSelectedRatioPreview(item.aspectRatio);

  return (
    <button
      className={`rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 text-left transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)] ${tileAspect}`}
      onClick={() => onOpen(item)}
      type="button"
    >
      <div className="flex h-full flex-col justify-between rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-accent text-xs uppercase tracking-[0.14em] text-[color:var(--color-accent)]">
            {item.title}
          </p>
          <button
            className="font-body inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)] transition hover:border-white/20 hover:text-[color:var(--color-text)]"
            onClick={(event) => onReference(event, item)}
            type="button"
          >
            <Copy className="h-3.5 w-3.5" />
            Reference
          </button>
        </div>
        <div className="space-y-3">
          <div className="font-body text-xs uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
            {item.aspectRatio} • {item.source === "idea" ? "Idea" : "Prompt"}
          </div>
          <div className="font-body text-sm leading-6 text-[color:var(--color-text-secondary)]">
            {item.prompt}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function SlidesMakerPage() {
  const [view, setView] = useState<AppView>("projects");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectAbout, setProjectAbout] = useState("");
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("prompt");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("4:5");
  const [prompt, setPrompt] = useState("");
  const [ideaSeed, setIdeaSeed] = useState("");
  const [ideaOptions, setIdeaOptions] = useState<IdeaItem[]>([]);
  const [numberOfOutputs, setNumberOfOutputs] = useState("6");
  const [inspirations, setInspirations] = useState<AssetItem[]>([]);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<GeneratedItem | null>(null);

  const currentProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  function buildAssetItems(fileList: FileList | null) {
    if (!fileList) {
      return [];
    }

    return Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }

  function handleCreateProject() {
    const nextProject: ProjectItem = {
      id: `project-${Date.now()}`,
      name: projectName.trim() || "Untitled Project",
      about: projectAbout.trim(),
      assets,
    };

    setProjects((current) => [nextProject, ...current]);
    setSelectedProjectId(nextProject.id);
    setView("workspace");
    setGeneratedItems([]);
  }

  function handleOpenProject(projectId: string) {
    setSelectedProjectId(projectId);
    setView("workspace");
  }

  function handleMockGenerate() {
    const outputCount = Math.max(1, Number.parseInt(numberOfOutputs || "1", 10) || 1);

    setGeneratedItems((current) => [
      ...current,
      ...Array.from({ length: outputCount }, (_, index) => ({
        id: `slide-${Date.now()}-${index}`,
        title: `Slide ${String(current.length + index + 1).padStart(2, "0")}`,
        aspectRatio: selectedAspectRatio,
        source: "prompt" as const,
        prompt: prompt.trim() || "Prompt-driven generated slide preview.",
      })),
    ]);
  }

  function handleDownloadSelected() {
    if (!selectedOutput) {
      return;
    }

    const blob = new Blob(
      [
        JSON.stringify(
          {
            title: selectedOutput.title,
            aspectRatio: selectedOutput.aspectRatio,
            source: selectedOutput.source,
            prompt: selectedOutput.prompt,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selectedOutput.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleGenerateIdeas() {
    setIdeaOptions(
      mockIdeas.map((idea, index) => ({
        ...idea,
        id: `${idea.id}-${Date.now()}-${index}`,
      })),
    );
  }

  function handleGenerateFromIdea(idea: IdeaItem) {
    setIdeaOptions((current) =>
      current.map((item) => (item.id === idea.id ? { ...item, isGenerating: true } : item)),
    );

    window.setTimeout(() => {
      setGeneratedItems((current) => [
        ...current,
        {
          id: `slide-${Date.now()}-${idea.id}`,
          title: `Slide ${String(current.length + 1).padStart(2, "0")}`,
          aspectRatio: selectedAspectRatio,
          source: "idea",
          prompt: idea.prompt,
        },
      ]);

      setIdeaOptions((current) =>
        current.map((item) => (item.id === idea.id ? { ...item, isGenerating: false } : item)),
      );
    }, 900);
  }

  function handleReferenceClick(event: { stopPropagation: () => void }, item: GeneratedItem) {
    event.stopPropagation();
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          title: item.title,
          aspectRatio: item.aspectRatio,
          source: item.source,
          prompt: item.prompt,
        },
        null,
        2,
      ),
    );
  }

  if (view === "projects") {
    return (
      <main className="min-h-screen bg-[color:var(--color-bg)] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Tool 01
              </p>
              <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">
                AI Slides Maker
              </h1>
              <p className="font-body mt-4 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)]">
                Create and manage slide projects before jumping into prompt-driven generation.
              </p>
            </div>

            <Button className="rounded-full px-5" onClick={() => setView("config")}>
              <Plus className="mr-2 h-4 w-4" />
              Start a New Project
            </Button>
          </header>

          <Card className="border-white/10 bg-[rgba(255,255,255,0.05)]">
            <CardContent className="p-8">
              {projects.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] text-[color:var(--color-accent)]">
                    <FolderOpen className="h-9 w-9" />
                  </div>
                  <h2 className="font-title mt-6 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                    No projects yet
                  </h2>
                  <p className="font-body mt-4 max-w-md text-base leading-8 text-[color:var(--color-text-secondary)]">
                    Start a new project to define the context, add assets, and then move into the generation workspace.
                  </p>
                  <Button className="mt-6 rounded-full px-5" onClick={() => setView("config")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start a New Project
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 text-left transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)]"
                      onClick={() => handleOpenProject(project.id)}
                      type="button"
                    >
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                        Project
                      </p>
                      <h3 className="font-title mt-3 text-2xl tracking-[-0.05em] text-[color:var(--color-text)]">
                        {project.name}
                      </h3>
                      <p className="font-body mt-3 line-clamp-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                        {project.about || "No project description yet."}
                      </p>
                    </button>
                  ))}
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
              <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Config
              </p>
              <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">
                New Project
              </h1>
              <p className="font-body mt-4 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)]">
                Define the project context, describe what the deck is about, and attach assets for the AI pipeline later.
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
                  <Input
                    id="project-name"
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Q2 Product Story"
                    value={projectName}
                  />
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
                      <p className="font-subtitle text-base text-[color:var(--color-text)]">
                        Add project assets
                      </p>
                      <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                        Upload any references, screenshots, logos, or imagery that should be part of the project context.
                      </p>
                    </div>
                    <input
                      className="hidden"
                      id="config-assets"
                      multiple
                      onChange={(event) => setAssets((current) => [...current, ...buildAssetItems(event.target.files)])}
                      type="file"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                    Assets
                  </p>
                  <div className="mt-4 grid gap-3">
                    {assets.length === 0 ? (
                      <p className="font-body text-sm leading-6 text-[color:var(--color-text-secondary)]">
                        No assets added yet.
                      </p>
                    ) : (
                      assets.map((asset) => (
                        <div key={asset.id} className="rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-3">
                          <div className="aspect-[4/3] overflow-hidden rounded-[14px] bg-[rgba(255,255,255,0.04)]">
                            <img alt={asset.name} className="h-full w-full object-cover" src={asset.url} />
                          </div>
                          <p className="font-body mt-3 truncate text-sm text-[color:var(--color-text)]">{asset.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Button className="w-full rounded-full" onClick={handleCreateProject}>
                  Create Project
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
            <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Workspace
            </p>
            <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-5xl">
              {currentProject?.name ?? "AI Slides Maker"}
            </h1>
            <p className="font-body mt-4 max-w-3xl text-base leading-8 text-[color:var(--color-text-secondary)]">
              Prompt on the left, outputs on the right. Assets and inspirations stay in the frontend for now while we shape the generation experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full px-5" variant="outline" onClick={() => setView("projects")}>
              Projects
            </Button>
            <Button className="rounded-full px-5" variant="outline" onClick={() => setView("config")}>
              Edit Config
            </Button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <Card className="border-white/10 bg-[rgba(255,255,255,0.05)]">
            <CardContent className="space-y-5">
              <div className="inline-flex rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] p-1">
                <button
                  className={`font-body rounded-full px-4 py-2 text-sm transition ${workspaceMode === "prompt" ? "bg-[color:var(--color-primary)] text-white" : "text-[color:var(--color-text-secondary)]"}`}
                  onClick={() => setWorkspaceMode("prompt")}
                  type="button"
                >
                  Prompt
                </button>
                <button
                  className={`font-body rounded-full px-4 py-2 text-sm transition ${workspaceMode === "ideas" ? "bg-[color:var(--color-primary)] text-white" : "text-[color:var(--color-text-secondary)]"}`}
                  onClick={() => setWorkspaceMode("ideas")}
                  type="button"
                >
                  Generate Ideas
                </button>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-subtitle text-lg text-[color:var(--color-text)]">
                    {workspaceMode === "prompt" ? "Prompt" : "Direction Seed"}
                  </p>
                  {workspaceMode === "ideas" && (
                    <p className="font-body text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                      {currentProject?.about ? "Ready" : "Locked"}
                    </p>
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
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <Button className="rounded-full px-5" onClick={handleMockGenerate} type="button">
                        Generate
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
                        disabled={!currentProject?.about}
                        onClick={handleGenerateIdeas}
                        type="button"
                      >
                        Generate Ideas
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {ideaOptions.length === 0 ? (
                        <div className="rounded-[22px] border border-dashed border-white/12 bg-[rgba(255,255,255,0.02)] px-4 py-6 text-center">
                          <Lightbulb className="mx-auto h-5 w-5 text-[color:var(--color-accent)]" />
                          <p className="font-body mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                            Generated ideas will appear here as ready-to-use prompts.
                          </p>
                        </div>
                      ) : (
                        ideaOptions.map((idea) => (
                          <div
                            key={idea.id}
                            className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-subtitle text-base text-[color:var(--color-text)]">
                                  {idea.title}
                                </p>
                                <p className="font-body mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                                  {idea.prompt}
                                </p>
                              </div>
                              <Button
                                className="shrink-0 rounded-full px-4"
                                disabled={idea.isGenerating}
                                onClick={() => handleGenerateFromIdea(idea)}
                                type="button"
                              >
                                {idea.isGenerating ? "Generating..." : "Generate"}
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
                    <span className="font-body text-sm text-[color:var(--color-text-secondary)]">
                      Add inspiration images
                    </span>
                    <input
                      className="hidden"
                      id="inspirations"
                      multiple
                      onChange={(event) => setInspirations((current) => [...current, ...buildAssetItems(event.target.files)])}
                      type="file"
                    />
                  </label>

                  {inspirations.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {inspirations.slice(0, 6).map((asset) => (
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
                  <span className="font-body text-sm text-[color:var(--color-text-secondary)]">
                    Number of generations
                  </span>
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
                        <p className="font-body text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
                          {ratio.label}
                        </p>
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
                  <p className="font-accent text-xs uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                    Output
                  </p>
                  <h2 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                    Generation Area
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="font-body rounded-full border border-white/10 px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
                    Assets: {currentProject?.assets.length ?? 0}
                  </div>
                  <div className="font-body rounded-full border border-white/10 px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
                    Inspirations: {inspirations.length}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {generatedItems.length === 0 ? (
                  <div className="lg:col-span-3 flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-[rgba(255,255,255,0.03)] px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] text-[color:var(--color-accent)]">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <h3 className="font-title mt-5 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                      No slides yet
                    </h3>
                    <p className="font-body mt-4 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      Generate slides from the left panel. Every output here will follow the selected aspect ratio and can later be used as reference context.
                    </p>
                  </div>
                ) : (
                  generatedItems.map((item) => (
                    <OutputTile
                      item={item}
                      key={item.id}
                      onOpen={setSelectedOutput}
                      onReference={handleReferenceClick}
                    />
                  ))
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                <p className="font-subtitle text-lg text-[color:var(--color-text)]">Project Assets</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {currentProject?.assets.length ? (
                    currentProject.assets.map((asset) => (
                      <div key={asset.id} className="w-[120px]">
                        <div className="aspect-square overflow-hidden rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)]">
                          <img alt={asset.name} className="h-full w-full object-cover" src={asset.url} />
                        </div>
                        <p className="font-body mt-2 truncate text-xs text-[color:var(--color-text-secondary)]">{asset.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="font-body text-sm text-[color:var(--color-text-secondary)]">
                      No assets attached to this project yet.
                    </p>
                  )}

                  <label className="flex h-[120px] w-[120px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-[rgba(255,255,255,0.03)] text-center transition hover:border-white/25">
                    <ImagePlus className="h-5 w-5 text-[color:var(--color-accent)]" />
                    <span className="font-body mt-2 px-3 text-xs leading-5 text-[color:var(--color-text-secondary)]">
                      Upload new asset
                    </span>
                    <input
                      className="hidden"
                      multiple
                      onChange={(event) => {
                        const nextAssets = buildAssetItems(event.target.files);

                        if (!currentProject || nextAssets.length === 0) {
                          return;
                        }

                        setProjects((current) =>
                          current.map((project) =>
                            project.id === currentProject.id
                              ? { ...project, assets: [...project.assets, ...nextAssets] }
                              : project,
                          ),
                        );
                      }}
                      type="file"
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
          <button
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={() => setSelectedOutput(null)}
            type="button"
          />
          <div className="relative z-10 w-full max-w-4xl rounded-[32px] border border-white/10 bg-[rgba(36,33,36,0.92)] p-6 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.85)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                  {selectedOutput.aspectRatio}
                </p>
                <h3 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                  {selectedOutput.title}
                </h3>
                <p className="font-body mt-3 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  {selectedOutput.prompt}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full px-5"
                  onClick={() => handleDownloadSelected()}
                  type="button"
                >
                  Download
                </Button>
                <Button
                  className="rounded-full px-5"
                  onClick={() => setSelectedOutput(null)}
                  type="button"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6">
              <div
                className={`w-full max-w-2xl rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 ${getSelectedRatioPreview(
                  selectedOutput.aspectRatio,
                )}`}
              >
                <div className="flex h-full flex-col justify-between rounded-[22px] border border-white/8 bg-[rgba(35,81,101,0.3)] p-6">
                  <div className="flex items-center justify-between">
                    <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                      Preview
                    </p>
                    <p className="font-body text-xs uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">
                      {selectedOutput.source}
                    </p>
                  </div>
                  <p className="font-body text-base leading-8 text-[color:var(--color-text)]">
                    {selectedOutput.prompt}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/8 p-4" />
                    <div className="rounded-2xl bg-white/8 p-4" />
                    <div className="rounded-2xl bg-white/8 p-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
