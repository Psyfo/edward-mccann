/**
 * The practice's own particulars.
 *
 * These are printed on the contact page and also asserted to search engines as
 * structured data, and the two must never disagree: a machine-readable address
 * that contradicts the visible one is worse than none at all. So they are
 * written once, here.
 *
 * They will move into the studio-details global once the page copy globals are
 * wired through to the site. See docs/before-production.md.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export const PRACTICE_NAME = "Edward McCann Architecture";

export const EMAIL = "info@edwardmccann.studio";
export const TELEPHONE = "+44 7734 593 280";

export type StudioAddress = {
  city: string;
  lines: string[];
  /** schema.org PostalAddress parts, for structured data. */
  street: string;
  locality: string;
  postalCode?: string;
  country: string;
};

export const ADDRESSES: StudioAddress[] = [
  {
    city: "LONDON",
    lines: ["105 Wilton Way", "London E8 1BH"],
    street: "105 Wilton Way",
    locality: "London",
    postalCode: "E8 1BH",
    country: "GB",
  },
  {
    city: "CAPE TOWN",
    lines: ["10 Kelvin Street", "Gardens, 8001"],
    street: "10 Kelvin Street",
    locality: "Cape Town",
    postalCode: "8001",
    country: "ZA",
  },
];
