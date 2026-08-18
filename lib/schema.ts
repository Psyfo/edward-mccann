import type { Project } from "./content";
import { PRACTICE_NAME, SITE_URL, studioAddresses, studioContact } from "./studio";

/**
 * Structured data: the same claims the pages already make, in the form search
 * engines and answer engines can read.
 *
 * The rule throughout is that nothing is asserted here which is not visible on
 * the page and known to be true. No invented founding dates, no social profiles
 * the practice does not have, no ratings. Structured data that overstates is
 * worse than none: it is the kind of thing that earns a manual penalty, and it
 * misleads anyone reading the answer rather than the site.
 */

type Json = Record<string, unknown>;

/**
 * Open Graph defaults, plus the page's own address.
 *
 * Next does not merge this object: a page that declares `openGraph` replaces
 * the layout's outright, so the site name and locale simply vanish from that
 * page. Every page therefore builds its Open Graph block from here rather than
 * relying on inheritance that does not happen.
 */
export function openGraphFor(path: string, extra: Json = {}): Json {
  return {
    type: "website",
    siteName: PRACTICE_NAME,
    locale: "en_GB",
    url: path,
    ...extra,
  };
}

const ORGANISATION_ID = `${SITE_URL}/#practice`;

/**
 * The practice itself. ArchitecturalService is a LocalBusiness subtype, which
 * is the accurate one: this is a practice with places you can visit, not a
 * publisher.
 */
export function organisationSchema(): Json {
  return {
    "@type": "ArchitecturalService",
    "@id": ORGANISATION_ID,
    name: PRACTICE_NAME,
    url: SITE_URL,
    email: studioContact().email,
    telephone: studioContact().telephone,
    description:
      "RIBA Chartered and ARB registered architecture practice in Hackney, East London, working on houses, places to eat and drink, objects and public work.",
    address: studioAddresses().map((a) => ({
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.locality,
      ...(a.postalCode ? { postalCode: a.postalCode } : {}),
      addressCountry: a.country,
    })),
    knowsAbout: [
      "Residential architecture",
      "Restaurant and bar design",
      "Furniture and objects",
      "Public work",
    ],
  };
}

/** The site, so a search engine can name it rather than guess from the title. */
export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: PRACTICE_NAME,
    publisher: { "@id": ORGANISATION_ID },
    inLanguage: "en-GB",
  };
}

/**
 * A project. CreativeWork rather than a building type, because what the
 * practice authored is the design; the building is its subject.
 */
export function projectSchema(project: Project, heroUrl: string): Json {
  // Years carry a provisional marker on the site itself, so only a plain
  // four-digit year is stated as fact here. Anything vaguer is left out.
  const year = /^\d{4}$/.test(project.year ?? "") ? project.year : undefined;

  return {
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/projects/${project.slug}#work`,
    name: project.name,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: heroUrl,
    ...(project.body[0] ? { description: project.body[0] } : {}),
    ...(year ? { dateCreated: year } : {}),
    ...(project.place && project.place !== "—"
      ? { locationCreated: { "@type": "Place", name: project.place } }
      : {}),
    creator: { "@id": ORGANISATION_ID },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/**
 * The work the landing page holds, as an ordered list.
 *
 * Worth having because the landing page carries almost no prose: the practice
 * asked for the statement and the per-project facts to come off it, so the
 * names of the works are most of what is left to describe the page by.
 */
export function collectionSchema(projects: Project[]): Json {
  return {
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/#work`,
    name: `${PRACTICE_NAME}, work`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/projects/${project.slug}`,
        name: project.name,
      })),
    },
  };
}

/** Where the page sits, so search results can show the path rather than a URL. */
export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${SITE_URL}${step.path}`,
    })),
  };
}

/**
 * Wraps nodes into one graph. A single script per page keeps the relationships
 * explicit (a work created by the practice, on this site) instead of leaving a
 * crawler to infer them from several loose blocks.
 */
export function jsonLd(...nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
