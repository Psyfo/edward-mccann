"use client";

import { ViewTransition } from "react";
import type { Project } from "@/lib/content";
import { fallbackSrc, srcSet } from "@/lib/media";
import styles from "./ProjectHero.module.css";

/**
 * The hero is the photograph and nothing else, per the practice's review: the
 * registration number, the ink gradient at the caption edge and the title
 * panel that broke into the frame have all gone. The title is set beneath it
 * by the page.
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
        </div>
      </ViewTransition>
    </header>
  );
}
