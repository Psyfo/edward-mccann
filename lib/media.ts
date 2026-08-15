import type { Figure } from "./content";

/**
 * Images are pre-processed to fixed widths and formats by tools/prepare-media.mjs
 * and served straight from the bucket, so there is no runtime optimiser in the
 * request path and the self-hosted server never touches an image. Objects are
 * content-addressed, so they can be cached immutably forever.
 */
// The bucket's public download URL is neither secret nor likely to change, so
// it is the built-in default. An env var can still override it (for a CDN in
// front of the bucket, say), but no deployment breaks for want of one.
export const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ??
  "https://f005.backblazeb2.com/file/edward-mccann-media";

export const WIDTHS = [640, 1280, 2000] as const;

export function mediaUrl(src: string, width: number, format: "avif" | "jpg") {
  return `${MEDIA_BASE}/${src}-${width}.${format}`;
}

/** Widths actually generated for a figure: we never upscale past the source. */
export function availableWidths(figure: Figure) {
  const usable = WIDTHS.filter((w) => w <= figure.width * 1.2);
  return usable.length ? usable : [WIDTHS[0]];
}

export function srcSet(figure: Figure, format: "avif" | "jpg") {
  return availableWidths(figure)
    .map((w) => `${mediaUrl(figure.src, w, format)} ${w}w`)
    .join(", ");
}

export function fallbackSrc(figure: Figure) {
  const widths = availableWidths(figure);
  return mediaUrl(figure.src, widths[widths.length - 1], "jpg");
}

/**
 * A caption's declared-media line: "FIG. 03 — CAPTION — PHOTOGRAPH, CREDIT".
 *
 * "IMAGE" is the fallback for figures whose medium could not be established
 * from the archive, and declaring "IMAGE" declares nothing, so it is left off
 * rather than printed. Per-image media and captions are on the list of things
 * to confirm with the practice.
 */
export function figureCaption(figure: Figure, index: number) {
  const parts = [`FIG. ${String(index + 1).padStart(2, "0")}`];
  if (figure.caption) parts.push(figure.caption.toUpperCase());
  if (figure.medium !== "IMAGE") {
    parts.push(figure.credit ? `${figure.medium}, ${figure.credit.toUpperCase()}` : figure.medium);
  } else if (figure.credit) {
    parts.push(figure.credit.toUpperCase());
  }
  return parts.join(" — ");
}
