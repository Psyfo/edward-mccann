"use client";

import { ViewTransition } from "react";
import type { Figure } from "@/lib/content";
import { fallbackSrc, figureCaption, srcSet } from "@/lib/media";
import { useReveal } from "./Reveal";
import styles from "./Plate.module.css";

type Props = {
  figure: Figure;
  index?: number;
  /** CSS aspect-ratio for the frame, e.g. "4 / 5". Defaults to the source ratio. */
  ratio?: string;
  sizes: string;
  /** LCP images opt out of lazy loading and of the reveal wipe. */
  priority?: boolean;
  /** Shared name for a view transition morph into the case-study hero. */
  transitionName?: string;
  showCaption?: boolean;
  className?: string;
};

/**
 * A single image "plate": the frame, the wipe reveal, the declared-media
 * caption. Images are plain <picture> elements pointing at pre-generated
 * bucket objects, so nothing is optimised at request time.
 */
export function Plate({
  figure,
  index = 0,
  ratio,
  sizes,
  priority = false,
  transitionName,
  showCaption = true,
  className,
}: Props) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const revealed = priority ? true : shown;

  const picture = (
    <div
      className={`${styles.frame} media reveal`}
      style={{ aspectRatio: ratio ?? `${figure.width} / ${figure.height}` }}
      data-shown={revealed}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(figure, "avif")} sizes={sizes} />
        <img
          src={fallbackSrc(figure)}
          srcSet={srcSet(figure, "jpg")}
          sizes={sizes}
          alt={figure.caption || ""}
          width={figure.width}
          height={figure.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
        />
      </picture>
      {/* The media declaration rides in from the edge on a paper chip. It is
          decorative duplication where a caption is already printed below, so
          it is only shown on cards that carry no caption. */}
      {!showCaption && figure.medium !== "IMAGE" ? (
        <span className={`notation ${styles.chip}`} aria-hidden="true">
          {figure.credit ? `${figure.medium} — ${figure.credit.toUpperCase()}` : figure.medium}
        </span>
      ) : null}
    </div>
  );

  return (
    <figure ref={ref} className={[styles.plate, className].filter(Boolean).join(" ")}>
      {transitionName ? (
        <ViewTransition name={transitionName} share="morph" default="none">
          {picture}
        </ViewTransition>
      ) : (
        picture
      )}
      {showCaption ? (
        <figcaption className={`notation ${styles.caption} reveal-caption`} data-shown={revealed}>
          {figureCaption(figure, index)}
        </figcaption>
      ) : null}
    </figure>
  );
}
