import { getStudioCopy } from "./content";

/**
 * The practice's own particulars.
 *
 * These are printed on the contact page and also asserted to search engines as
 * structured data, and the two must never disagree: a machine-readable address
 * that contradicts the visible one is worse than none at all. So both read the
 * same edited copy, and editing it in the admin changes both.
 *
 * Only the site's own address stays in the environment, because it is a
 * property of the deployment rather than of the practice.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export const PRACTICE_NAME = "Edward McCann Architecture";

/**
 * Splits "Gardens, 8001" into the parts schema.org wants. The last line of a
 * UK or South African address carries the postal code, so anything after the
 * final comma that looks like one is treated as such, and the rest is the
 * locality. Addresses that do not fit are passed through whole rather than
 * guessed at.
 */
function postalParts(lines: string[]) {
  const [street, ...rest] = lines;
  const tail = rest.join(", ");
  const match = tail.match(/^(.*?),?\s*([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}|\d{4,5})$/i);
  return {
    street,
    locality: (match ? match[1] : tail).replace(/,\s*$/, ""),
    postalCode: match ? match[2].trim() : undefined,
  };
}

export function studioAddresses() {
  return getStudioCopy().addresses.map((a) => {
    const lines = a.lines
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const { street, locality, postalCode } = postalParts(lines);
    return {
      city: a.city,
      lines,
      street,
      locality,
      postalCode,
      country: a.city === "CAPE TOWN" ? "ZA" : "GB",
    };
  });
}

export function studioContact() {
  const { email, telephone } = getStudioCopy();
  return { email, telephone };
}
