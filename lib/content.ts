import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import factsData from "@/content/facts.json";

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

type MediaDoc = {
  caption?: string | null;
  medium?: string | null;
  credit?: string | null;
  fit?: string | null;
  derivative?: { src?: string | null; width?: number | null; height?: number | null } | null;
};

function toFigure(media: unknown): Figure | null {
  const doc = media as MediaDoc | null;
  const d = doc?.derivative;
  // A media record with no derivative has not been through the pipeline yet, so
  // there is nothing for the browser to load. Skipping is better than emitting
  // a broken image.
  if (!doc || !d?.src || !d.width || !d.height) return null;
  return {
    src: d.src,
    width: d.width,
    height: d.height,
    fit: doc.fit === "contain" ? "contain" : "cover",
    medium: doc.medium || "IMAGE",
    caption: doc.caption || "",
    credit: doc.credit || null,
  };
}

let cache: Project[] | null = null;

/**
 * Whether the database is reachable from wherever this is running.
 *
 * The container has DATABASE_URL at runtime, but this Coolify version cannot
 * mark an environment variable as build-time, so an image build may have no
 * database at all. Rather than fail the build, the pages fall back to being
 * rendered on demand: see safeStaticParams below.
 */
export async function databaseReachable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await getProjects();
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the archive from Payload.
 *
 * Cached for the lifetime of the process, which for a statically generated
 * build means the database is read once per build rather than once per page.
 */
export async function getProjects(): Promise<Project[]> {
  if (cache) return cache;

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "projects",
    limit: 500,
    sort: "no",
    depth: 1,
  });

  cache = result.docs.map((doc): Project => {
    const figures = ((doc.figures ?? []) as { image?: unknown }[])
      .map((row) => toFigure(row.image))
      .filter((f): f is Figure => f !== null);

    const [hero, ...rest] = figures;
    if (!hero) {
      throw new Error(
        `Project "${doc.slug}" has no usable imagery. Every project needs at least one figure that has been through the media pipeline.`,
      );
    }

    return {
      no: doc.no,
      slug: doc.slug,
      name: doc.name,
      place: doc.place ?? "—",
      year: doc.year ?? "—",
      sector: doc.sector as SectorId,
      type: doc.type,
      status: doc.status,
      unbuilt: Boolean(doc.unbuilt),
      photographer: doc.photographer ?? null,
      press: ((doc.press ?? []) as { entry: string }[]).map((p) => p.entry),
      body: ((doc.body ?? []) as { text: string }[]).map((p) => p.text),
      hero,
      figures: rest,
    };
  });

  return cache;
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
