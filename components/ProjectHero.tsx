"use client";

import { ViewTransition } from "react";
import type { Project } from "@/lib/content";
import { fallbackSrc, srcSet } from "@/lib/media";
import styles from "./ProjectHero.module.css";

/**
 * A layered title block, not a scrim.
 *
 * Four stacked layers, in order: the full-bleed photograph; an ink gradient
 * confined to the caption edge; the archive number set huge and cropped by the
 * frame so it reads as a printed registration mark; and the title on a solid
 * paper panel that deliberately breaks the grid where it overlaps the image.
 */
export function ProjectHero({ project }: { project: Project }) {
  const figure = project.hero;

  return (
    <header className={styles.hero}>
      <ViewTransition name={`hero-${project.slug}`} share="morph" default="none">
        <div className={styles.frame} data-fit={figure.fit ?? "cover"}>
          <picture>
            <source type="image/avif" srcSet={srcSet(figure, "avif")} sizes="100vw" />
            <img
              className={styles.image}
              src={fallbackSrc(figure)}
              srcSet={srcSet(figure, "jpg")}
              sizes="100vw"
              alt=""
              width={figure.width}
              height={figure.height}
              fetchPriority="high"
              decoding="sync"
            />
          </picture>

          {/* Ink only at the caption edge, never a full wash. */}
          <div className={styles.edge} aria-hidden="true" />

          {/* The registration mark: cropped by the frame on purpose. */}
          <div className={styles.registration} aria-hidden="true">
            {project.no}
          </div>

        </div>
      </ViewTransition>

      <div className={styles.panel}>
        <h1 className={`title ${styles.name}`}>{project.name}</h1>
        {/*
          Declared media, but only when the declaration means something. The
          generic fallback is not a declaration, so it is omitted rather than
          printed: see docs/content-open-questions.md, where per-image media and
          credits are on the confirmation list.
        */}
        {figure.medium !== "IMAGE" ? (
          <p className={`notation ${styles.medium}`}>
            {figure.credit ? `${figure.medium}, ${figure.credit.toUpperCase()}` : figure.medium}
          </p>
        ) : null}
      </div>
    </header>
  );
}
