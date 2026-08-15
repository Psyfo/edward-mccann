"use client";

import { useEffect, useRef, useState } from "react";
import type { Figure } from "@/lib/content";
import { availableWidths, fallbackSrc, mediaUrl, srcSet } from "@/lib/media";
import styles from "./Examine.module.css";

/**
 * A single-image examine view.
 *
 * Deliberately not a lightbox in the gallery sense: there is no next or
 * previous, no carousel, no slideshow. It exists for one job the page cannot
 * do, which is reading a drawing. A plan shown at 390px is unreadable whether
 * it is in the page or in a modal, so the view offers a real magnified state
 * rather than just a bigger frame.
 */
export function Examine({
  figure,
  caption,
  onClose,
}: {
  figure: Figure;
  caption: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [magnified, setMagnified] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // showModal gives us the top layer, the backdrop, Escape handling and a
    // focus trap without reimplementing any of it.
    if (!dialog.open) dialog.showModal();

    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  // The largest rendition we published, which is what makes magnifying useful.
  const widths = availableWidths(figure);
  const largest = widths[widths.length - 1];

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={caption || "Examine image"}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes; clicks on
        // the content stop before they reach here.
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={styles.bar}>
        <p className={`notation ${styles.caption}`}>{caption}</p>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={() => setMagnified((m) => !m)}
            aria-pressed={magnified}
          >
            {magnified ? "FIT" : "MAGNIFY"}
          </button>
          <button type="button" className={styles.control} onClick={onClose} autoFocus>
            CLOSE <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>

      <div className={styles.viewport} data-magnified={magnified}>
        {/*
          Magnified, both sources are pinned to the largest rendition we
          published. Leaving the responsive srcSet in place would let the
          browser satisfy the request with a smaller file, which is precisely
          the detail the reader opened this view to see.
        */}
        <picture key={magnified ? "magnified" : "fit"}>
          <source
            type="image/avif"
            srcSet={magnified ? mediaUrl(figure.src, largest, "avif") : srcSet(figure, "avif")}
            sizes={magnified ? undefined : "100vw"}
          />
          <img
            className={styles.image}
            src={magnified ? mediaUrl(figure.src, largest, "jpg") : fallbackSrc(figure)}
            srcSet={magnified ? undefined : srcSet(figure, "jpg")}
            sizes={magnified ? undefined : "100vw"}
            alt={caption}
            width={figure.width}
            height={figure.height}
          />
        </picture>
      </div>
    </dialog>
  );
}
