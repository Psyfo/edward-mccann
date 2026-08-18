"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { sectors, type Project, type SectorId } from "@/lib/content";
import { WorkGrid } from "./WorkGrid";
import styles from "./SectorFilter.module.css";

type Props = {
  projects: Project[];
  showFacts: boolean;
  showFilter: boolean;
};

const SECTOR_IDS = new Set<string>(sectors.map((s) => s.id));

/** replaceState fires no event of its own, so selecting a sector raises this. */
const SECTOR_EVENT = "em:sector";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(SECTOR_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(SECTOR_EVENT, onChange);
  };
}

function readSector(): SectorId | null {
  const value = new URLSearchParams(window.location.search).get("sector");
  return value && SECTOR_IDS.has(value) ? (value as SectorId) : null;
}

/**
 * The landing page's work, with the sector row filtering it in place.
 *
 * The row used to link into the pre-filtered index, which meant choosing a
 * sector navigated away from the page the visitor was already reading. Now the
 * grid itself narrows, and the address is the single source of truth: the
 * chosen sector lives in ?sector=, read as an external store, written with
 * replaceState. Filtering is a way of looking at this page, not a place you
 * went, so it stays shareable without stacking up in browser history.
 *
 * The server snapshot is always "everything", so the full archive is in the
 * page's HTML for anything that does not run scripts; a ?sector= in the
 * address applies as soon as the store is read in the browser.
 */
export function WorkBrowser({ projects, showFacts, showFilter }: Props) {
  const sector = useSyncExternalStore(subscribe, readSector, () => null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // The stack closes the way any menu should: on Escape, or on a tap that
  // lands anywhere outside it.
  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerOpen(false);
    };
    const onTap = (e: PointerEvent) => {
      const line = panelRef.current?.previousElementSibling;
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !line?.contains(target)) setPickerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onTap);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onTap);
    };
  }, [pickerOpen]);

  const select = useCallback((next: SectorId | null) => {
    window.history.replaceState(null, "", next ? `/?sector=${next}` : "/");
    window.dispatchEvent(new Event(SECTOR_EVENT));
  }, []);

  const visible = sector ? projects.filter((p) => p.sector === sector) : projects;

  return (
    <>
      {showFilter ? (
        <div className={styles.mobile}>
          {/* One quiet line on a phone, where the full row reads as clutter.
              The picker is the site's own rather than the platform's: an OS
              menu is rendered in the system's face and colours, and nothing
              breaks a page's spell faster. Tapping the line unfolds a
              hairline-ruled stack below, in the page's type on the page's
              ground. */}
          <div className={styles.pickerLine}>
            <button
              type="button"
              className={`notation ${styles.pickerButton}`}
              aria-expanded={pickerOpen}
              aria-controls={pickerId}
              onClick={() => setPickerOpen((o) => !o)}
            >
              <span className={styles.pickerValue}>
                {sector ? sectors.find((s) => s.id === sector)?.label : "ALL"}
              </span>
              <span className={styles.caret} aria-hidden="true" data-open={pickerOpen}>
                &#187;
              </span>
            </button>
            <Link href="/archive" className={`${styles.item} ${styles.full}`}>
              FULL INDEX{" "}
              <span className="mark" aria-hidden="true">
                &#187;
              </span>
            </Link>
          </div>
          <div id={pickerId} className={styles.options} data-open={pickerOpen} ref={panelRef}>
            <div className={styles.optionsInner}>
              <button
                type="button"
                className={`notation ${styles.option}`}
                aria-current={sector === null ? "true" : undefined}
                tabIndex={pickerOpen ? 0 : -1}
                onClick={() => {
                  select(null);
                  setPickerOpen(false);
                }}
              >
                ALL WORK
              </button>
              {sectors.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`notation ${styles.option}`}
                  aria-current={sector === s.id ? "true" : undefined}
                  tabIndex={pickerOpen ? 0 : -1}
                  onClick={() => {
                    select(s.id);
                    setPickerOpen(false);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showFilter ? (
        <nav className={styles.row} aria-label="Filter work by sector">
          <Link
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
          </Link>
          {sectors.map((s) => (
            <Link
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
            </Link>
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
