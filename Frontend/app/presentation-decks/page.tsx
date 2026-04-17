"use client";

import { SlidesToolPage } from "@/components/slides-tool-page";

const presentationDeckConfig = {
  toolIndexLabel: "Tool 02",
  toolName: "Presentation Decks",
  projectsDescription: "Build polished presentation and pitch-deck slides with stronger narrative structure, richer copy, and premium modern layouts.",
  emptyProjectsDescription: "Start a new deck project to shape the story, upload brand or reference assets, and build presentation-ready slides in a persistent workspace.",
  configDescription: "Define the presentation context first. Add audience, storyline, and brand cues so the deck slides feel intentional and executive-ready from the first generation.",
  workspaceDescription: "Projects, deck ideas, presentation slides, references, and generated media are saved here so you can build a full story slide by slide.",
  defaultProjectName: "Presentation Decks",
  projectAboutPlaceholder:
    "Explain the company, product, audience, and the kind of story this deck should tell. Include tone, key proof points, and what a polished modern PPT should feel like.",
  promptPlaceholder:
    "Describe the presentation slide you want: headline, supporting copy, narrative angle, layout, proof points, and style. Type @ to reference an uploaded asset by name.",
  ideaSeedPlaceholder: "Optionally steer the kinds of presentation or pitch-deck slides you want generated.",
  noSlidesDescription: "Generate deck slides from the left panel. Each completed slide is saved as HTML so you can assemble a sharper, more cohesive presentation over time.",
  promptPanelTitle: "Deck Slide Prompt",
  ideasPanelTitle: "Deck Direction Seed",
  generateButtonLabel: "Generate Deck Slide",
  generateIdeasButtonLabel: "Generate Deck Ideas",
  projectAssetsDescription: "These are reusable across deck prompts. Type @ in the prompt box to reference them by name.",
  generationAreaTitle: "Deck Builder",
  promptPrefix:
    "Create a premium presentation or pitch-deck style slide. Make it feel like a beautiful modern PPT: strong headline hierarchy, richer supporting text, clearer business storytelling, structured sections, and polished executive-ready composition. The result should remain visually elegant, not crowded.",
  ideaSeedPrefix:
    "Generate ideas for presentation and pitch-deck slides. Favor slides with clearer narrative roles, stronger messaging, richer text content, and modern premium presentation design.",
} as const;

export default function PresentationDecksPage() {
  return <SlidesToolPage config={presentationDeckConfig} />;
}
