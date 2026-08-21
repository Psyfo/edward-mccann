import factsData from "@/content/facts.json";
import figuresData from "@/content/figures.json";
import pagesData from "@/content/pages.json";
import textData from "@/content/text.json";

export type SectorId = "houses" | "eat-drink" | "objects" | "public";

export type Sector = {
  id: SectorId;
  label: string;
};

export type Figure = {
  /** Path within the media bucket, e.g. "projects/latimer-road/a1b2c3d4" */
  src: string;
  width: number;
  height: number;
  /**
   * Whether the image may be cropped to fill a frame. Photographs may be;
   * drawings and white-ground renders may not, because cropping them destroys
   * the information they exist to carry. Set by tools/prepare-media.mjs.
   */
  fit?: "cover" | "contain";
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

/**
 * The sector list stays in code. It is not content: the four sectors are a
 * structural decision from the approved design, and the filter row, the index
 * and the project schema all have to agree on them.
 */
export const sectors: Sector[] = (factsData as { sectors: Sector[] }).sectors;

export function sectorLabel(id: SectorId): string {
  return sectors.find((s) => s.id === id)?.label ?? "";
}

type RawFigure = {
  src: string;
  width: number;
  height: number;
  fit?: string;
  medium?: string;
  caption?: string;
  credit?: string | null;
};

const rawFigures = figuresData as unknown as Record<string, RawFigure[]>;
const rawText = textData as unknown as Record<string, string[]>;

function toFigure(raw: RawFigure): Figure {
  return {
    src: raw.src,
    width: raw.width,
    height: raw.height,
    fit: raw.fit === "contain" ? "contain" : "cover",
    medium: raw.medium || "IMAGE",
    caption: raw.caption || "",
    credit: raw.credit ?? null,
  };
}

/**
 * The archive, read from the snapshot in content/.
 *
 * Payload is where the archive is edited; this file is what the site builds
 * from. tools/export-content.mjs turns the former into the latter, which keeps
 * the build free of any database (neither CI nor the image build has one) and
 * keeps the published site independent of Neon being awake.
 */
let cache: Project[] | null = null;

function build(): Project[] {
  if (cache) return cache;

  cache = (factsData as { projects: Omit<Project, "body" | "hero" | "figures">[] }).projects.map(
    (p): Project => {
      const all = (rawFigures[p.slug] ?? []).map(toFigure);
      const [hero, ...rest] = all;
      if (!hero) {
        throw new Error(
          `No imagery for project "${p.slug}". Run tools/export-content.mjs, or tools/prepare-media.mjs if the renditions are missing.`,
        );
      }
      return { ...p, body: rawText[p.slug] ?? [], hero, figures: rest };
    },
  );

  return cache;
}

export async function getProjects(): Promise<Project[]> {
  return build();
}

/** Chronological, which is how the index reads. */
export async function getByNumber(): Promise<Project[]> {
  const projects = await getProjects();
  return [...projects].sort((a, b) => a.no.localeCompare(b.no));
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

/**
 * The next work in the archive, wrapping at the end, so a case study always
 * hands off rather than dead-ending.
 */
export async function getNextProject(slug: string): Promise<Project> {
  const byNumber = await getByNumber();
  const i = byNumber.findIndex((p) => p.slug === slug);
  return byNumber[(i + 1) % byNumber.length];
}

/** The curated homepage set, in the order the design specifies. */
export async function getSelected(): Promise<Project[]> {
  const projects = await getProjects();
  const order = (factsData as { selected: string[] }).selected;
  return order
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}

/* --- Page copy ---------------------------------------------------------- */

export type SplashImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string | null;
  /** Which flat colour the mark should be over this photograph. */
  tone: "light" | "dark";
};

/** What the landing page shows. Every one of these is the practice's to change. */
export type HomepageSettings = {
  showStatement: boolean;
  showProjectFacts: boolean;
  showSectorFilter: boolean;
  splashEnabled: boolean;
  /** In order, changing every few seconds. Managed in the admin. */
  splashSlides: {
    landscape: SplashImage | null;
    portrait: SplashImage | null;
  }[];
};

export type StudioCopy = {
  /** The display statement on the homepage. */
  positioningLine: string;
  /** The display line on the contact page. */
  contactStatement: string;
  contactLede: string;
  email: string;
  telephone: string;
  addresses: { city: string; lines: string }[];
  homepage: HomepageSettings;
};

export type PracticeParagraph = { heading?: string; text: string };

export type PracticeCopy = {
  statement: string;
  paragraphs: PracticeParagraph[];
  credentials: { label: string; items: string[] }[];
  recognition: string[];
  colleagues: string[];
  collaborators: string[];
};

const pages = pagesData as { studio: StudioCopy; practice: PracticeCopy };

/**
 * The words on the homepage and contact page, as edited in the admin.
 *
 * Synchronous because it reads the committed snapshot like everything else
 * here, which also means the schema.org data and the visible page cannot
 * disagree: they are the same strings.
 */
export function getStudioCopy(): StudioCopy {
  return pages.studio;
}

/** The practice page's essay and lists, as edited in the admin. */
export function getPracticeCopy(): PracticeCopy {
  return pages.practice;
}
