"use client";

import { useCallback, useEffect, useState } from "react";
import type { SplashImage } from "@/lib/content";
import { splashFallback, splashSrcSet } from "@/lib/media";
import styles from "./Splash.module.css";

/** Matches the exit transition in Splash.module.css, with a little slack. */
const EXIT_MS = 1150;

type Props = {
  landscape: SplashImage | null;
  portrait: SplashImage | null;
  /** Called once the exit has finished, so the work can come in behind it. */
  onDismissed: () => void;
};

/**
 * The entry splash: the practice's mark on a full screen, which becomes a
 * photograph, and leaves when the visitor asks it to.
 *
 * It is deliberately an overlay rather than a page of its own. A page would put
 * a near-empty document at the site's most important address, and the work
 * would be one navigation further away from anyone arriving from search. This
 * sits on top of the finished landing page instead: the grid, its links and its
 * headings are in the markup either way, so nothing about the splash changes
 * what a crawler or a reader without JavaScript receives. The stylesheet also
 * removes it outright when scripts do not run, because an overlay nobody can
 * dismiss would otherwise be a locked door.
 *
 * Shown on every load, at the practice's request.
 */
export function Splash({ landscape, portrait, onDismissed }: Props) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => setLeaving(true), []);

  // The exit ends on a timer rather than on transitionend. Keying it to the
  // transform transition looked tidier and was wrong: under reduced motion the
  // overlay only changes opacity, so that event never arrives and the splash
  // would sit there for ever, having already faded out, still swallowing
  // clicks. A duration is the one thing true in both cases.
  useEffect(() => {
    if (!leaving) return;
    const done = setTimeout(onDismissed, EXIT_MS);
    return () => clearTimeout(done);
  }, [leaving, onDismissed]);

  // Any of the ordinary ways of saying "go on then". A splash that only answers
  // to a click on itself is a trap for anyone using a keyboard.
  useEffect(() => {
    if (leaving) return;
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Enter", " ", "Spacebar"].includes(event.key)) {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
    };
  }, [dismiss, leaving]);

  // The page underneath must not scroll while the splash covers it, but the
  // lock is applied from here rather than in the stylesheet: without scripts
  // there is no splash, and a page that cannot scroll would be the one thing
  // worse than no splash at all.
  useEffect(() => {
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = leaving ? previous : "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [leaving]);

  const image = landscape ?? portrait;

  return (
    <div
      className={`splash-overlay ${styles.splash}`}
      data-leaving={leaving}
      data-has-image={Boolean(image)}
      role="button"
      tabIndex={0}
      aria-label="Enter the site"
      onClick={dismiss}
    >
      {image ? (
        <picture className={styles.photo}>
          {portrait ? (
            <>
              <source
                media="(orientation: portrait)"
                type="image/avif"
                srcSet={splashSrcSet(portrait.src, "portrait", "avif")}
                sizes="100vw"
              />
              <source
                media="(orientation: portrait)"
                type="image/jpeg"
                srcSet={splashSrcSet(portrait.src, "portrait", "jpg")}
                sizes="100vw"
              />
            </>
          ) : null}
          {landscape ? (
            <>
              <source
                type="image/avif"
                srcSet={splashSrcSet(landscape.src, "landscape", "avif")}
                sizes="100vw"
              />
              <source
                type="image/jpeg"
                srcSet={splashSrcSet(landscape.src, "landscape", "jpg")}
                sizes="100vw"
              />
            </>
          ) : null}
          {/* Decorative here: the photograph is atmosphere on the way in, and
              the same work is described properly on its own page. */}
          <img
            src={splashFallback(image.src, landscape ? "landscape" : "portrait")}
            alt=""
            width={image.width}
            height={image.height}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      ) : null}

      <span className={styles.scrim} aria-hidden="true" />

      {/* The mark is drawn rather than loaded so it can be paper on the
          photograph and ink on the paper ground, without a second request. */}
      <svg
        className={styles.mark}
        viewBox="0 40 180 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g>
          <rect x="0" y="40" width="69.5" height="20.5" />
          <rect x="0" y="78" width="42.5" height="21.5" />
          <rect x="0" y="119" width="69.5" height="20.5" />
          <polygon points="79.5,40 101.5,40 131.5,110.5 119.5,139.5" />
          <rect x="158" y="40" width="22" height="100" />
        </g>
      </svg>

      <span className={`notation ${styles.hint}`} aria-hidden="true">
        ENTER
      </span>

      {/* One credit per photograph, each shown only in the orientation that
          actually displays its image. Which one is on screen is decided by a
          media query, so React cannot know it, and a single credit would have
          put the wrong photographer's name under a picture. */}
      {landscape?.credit ? (
        <span className={`notation ${styles.credit} ${styles.creditLandscape}`} aria-hidden="true">
          {landscape.credit.toUpperCase()}
        </span>
      ) : null}
      {portrait?.credit ? (
        <span className={`notation ${styles.credit} ${styles.creditPortrait}`} aria-hidden="true">
          {portrait.credit.toUpperCase()}
        </span>
      ) : null}
    </div>
  );
}
