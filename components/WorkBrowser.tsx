"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sectors, type Project, type SectorId } from "@/lib/content";
import { WorkGrid } from "./WorkGrid";
import styles from "./SectorFilter.module.css";

type Props = {
  projects: Project[];
  showFacts: boolean;
  showFilter: boolean;
};

const SECTOR_IDS = new Set<string>(sectors.map((s) => s.id));

/**
 * The landing page's work, with the sector row filtering it in place.
 *
 * The row used to link into the pre-filtered index, which meant choosing a
 * sector navigated away from the page the visitor was already reading. Now the
 * grid itself narrows. The address is kept in step so a filtered view can
 * still be copied and shared, but through replaceState: filtering is a way of
 * looking at this page, not a place you went, so it should not stack up in
 * browser history.
 *
 * The first render always shows everything, on the server and in the browser
 * alike, so the full archive is in the page's HTML for anything that does not
 * run scripts. Any ?sector= in the address is applied after mounting.
 */
export function WorkBrowser({ projects, showFacts, showFilter }: Props) {
  const [sector, setSector] = useState<SectorId | null>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("sector");
    if (fromUrl && SECTOR_IDS.has(fromUrl)) setSector(fromUrl as SectorId);
  }, []);

  const select = (next: SectorId | null) => {
    setSector(next);
    window.history.replaceState(null, "", next ? `/?sector=${next}` : "/");
  };

  const visible = sector ? projects.filter((p) => p.sector === sector) : projects;

  return (
    <>
      {showFilter ? (
        <nav className={styles.row} aria-label="Filter work by sector">
          <a
            href="/"
            className={styles.item}
            data-active={sector === null}
            aria-current={sector === null ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              select(null);
            }}
          >
            ALL WORK
          </a>
          {sectors.map((s) => (
            <a
              key={s.id}
              href={`/?sector=${s.id}`}
              className={styles.item}
              data-active={sector === s.id}
              aria-current={sector === s.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                select(s.id);
              }}
            >
              {s.label}
            </a>
          ))}
          <Link href="/archive" className={`${styles.item} ${styles.full}`}>
            FULL INDEX{" "}
            <span className="mark" aria-hidden="true">
              &#187;
            </span>
          </Link>
        </nav>
      ) : null}

      <section aria-label="Work">
        {/* Keyed by sector so a change remounts the grid: the scatter re-deals
            for the works that remain, and the fade-in reads as the page
            answering rather than rows vanishing. */}
        <WorkGrid key={sector ?? "all"} projects={visible} showFacts={showFacts} />
      </section>
    </>
  );
}
