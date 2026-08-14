import factsData from "@/content/facts.json";
import figuresData from "@/content/figures.json";
import textData from "@/content/text.json";

export type SectorId = "houses" | "eat-drink" | "objects" | "public";

export type Sector = {
  id: SectorId;
  label: string;
};

export type Figure = {
  /** Path within the media bucket, e.g. "projects/latimer-road/03.jpg" */
  src: string;
  width: number;
  height: number;
  /** Declared medium, e.g. "PHOTOGRAPH" or "VISUALISATION". */
  medium: string;
  caption: string;
  credit: string | null;
};

export type Project = {
  no: string;
  slug: string;
  name: string;
  place: string;
  year: string;
  sector: SectorId;
  type: string;
  status: string;
  /** Drives the oxide status colour in the index: anything not built. */
  unbuilt: boolean;
  photographer: string | null;
  press: string[];
  /** Paragraphs of the practice's own text, verbatim. */
  body: string[];
  hero: Figure;
  figures: Figure[];
};

type FactsFile = {
  sectors: Sector[];
  projects: Omit<Project, "body" | "hero" | "figures">[];
  selected: string[];
};

const facts = factsData as unknown as FactsFile;
const figures = figuresData as unknown as Record<string, Figure[]>;
const text = textData as unknown as Record<string, string[]>;

function build(): Project[] {
  return facts.projects.map((p) => {
    const all = figures[p.slug] ?? [];
    const [hero, ...rest] = all;
    if (!hero) {
      throw new Error(
        `No imagery for project "${p.slug}". Run tools/extract-figures.mjs and tools/prepare-media.mjs.`,
      );
    }
    return {
      ...p,
      body: text[p.slug] ?? [],
      hero,
      figures: rest,
    };
  });
}

export const sectors: Sector[] = facts.sectors;
export const projects: Project[] = build();

export const byNumber: Project[] = [...projects].sort((a, b) =>
  a.no.localeCompare(b.no),
);

/** Reverse chronological: the archive reads newest first everywhere but the index. */
export const recentFirst: Project[] = [...byNumber].reverse();

export const selected: Project[] = facts.selected
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => Boolean(p));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * The next work in the archive, wrapping at the end, so a case study always
 * hands off rather than dead-ending.
 */
export function nextProject(slug: string): Project {
  const i = byNumber.findIndex((p) => p.slug === slug);
  return byNumber[(i + 1) % byNumber.length];
}

export function sectorLabel(id: SectorId): string {
  return sectors.find((s) => s.id === id)?.label ?? "";
}
