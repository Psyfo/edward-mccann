"use client";

import { useState } from "react";
import { ViewTransition } from "react";
import type { Figure } from "@/lib/content";
import { srcSet, fallbackSrc } from "@/lib/media";
import { Examine } from "./Examine";
import styles from "./Plate.module.css";

type Props = {
  figure: Figure;
  index?: number;
  ratio?: string;
  sizes: string;
  priority?: boolean;
  transitionName?: string;
  /** The landing cards set this false; project plates keep it true. */
  showCaption?: boolean;
  className?: string;
};

/** What a screen reader hears for the examine control. */
function figureCaption(figure: Figure, index: number): string {
  if (figure.caption) return figure.caption;
  return index > 0 ? `Image ${index}` : "Image";
}

/**
 * One image, still, whole and unannotated: the practice's review took away the
 * scroll-in reveal, the medium tab and the printed figure line, and the page
 * is quieter for it.
 *
 * The examine view stayed, because a drawing at reading size is still
 * unreadable, but it lost its visible tab: the image itself is the control,
 * on the surfaces where examining helps (drawings anywhere, everything on a
 * small screen), with the cursor and a screen-reader label carrying what the
 * tab used to say.
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
  const [examining, setExamining] = useState(false);
  const examinable = showCaption;
  const caption = figureCaption(figure, index);

  const image = (
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
  );

  const frame = (
    <div
      className={`${styles.frame} media`}
      style={{ aspectRatio: ratio ?? `${figure.width} / ${figure.height}` }}
      data-fit={figure.fit ?? "cover"}
    >
      {examinable ? (
        <button
          type="button"
          className={styles.examineArea}
          data-drawing={figure.fit === "contain"}
          onClick={() => setExamining(true)}
        >
          {image}
          <span className={styles.srOnly}>Examine {caption}</span>
        </button>
      ) : (
        image
      )}
    </div>
  );

  return (
    <figure className={[styles.plate, className].filter(Boolean).join(" ")}>
      {transitionName ? (
        <ViewTransition name={transitionName} share="morph" default="none">
          {frame}
        </ViewTransition>
      ) : (
        frame
      )}
      {examining ? (
        <Examine figure={figure} caption={caption} onClose={() => setExamining(false)} />
      ) : null}
    </figure>
  );
}
