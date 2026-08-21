"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { SplashImage } from "@/lib/content";
import { splashFallback, splashSrcSet } from "@/lib/media";
import styles from "./Splash.module.css";

/** Matches the exit transition in Splash.module.css, with a little slack. */
const EXIT_MS = 1150;

/** The practice asked for a change every two to three seconds. */
const CYCLE_MS = 2600;

export type SplashSlide = {
  landscape: SplashImage | null;
  portrait: SplashImage | null;
};

type Props = {
  slides: SplashSlide[];
  /** Called once the exit has finished, so the work can come in behind it. */
  onDismissed: () => void;
};

/**
 * The entry splash: a full-bleed photograph with the practice's mark on it,
 * changing every few seconds, leaving when the visitor asks it to.
 *
 * The page lands straight on the image. There was a paper beat before it, for
 * effect, and the practice asked the fair question of whether it read as
 * loading instead; it went. The mark is ink, clean, no shadow and no scrim,
 * per the same review.
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
export function Splash({ slides, onDismissed }: Props) {
  const [leaving, setLeaving] = useState(false);
  const [active, setActive] = useState(0);

  const dismiss = useCallback(() => setLeaving(true), []);

  // The slideshow. It stops the moment the visitor dismisses, and it never
  // starts for a visitor who has asked for reduced motion: a picture that
  // replaces itself unbidden is exactly the motion they asked not to have.
  useEffect(() => {
    if (leaving || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, [leaving, slides.length]);

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

  const current = slides[active];

  // Which flat colour the mark should be, for whichever photograph is
  // actually visible. Landscape and portrait can be different photographs
  // with different tones, and only a CSS media query knows which one the
  // browser is showing, so both are set as custom properties and the
  // stylesheet picks between them the same way it already does for the
  // credit line.
  const style = {
    "--mark-landscape": current?.landscape?.tone === "light" ? "var(--ink)" : "var(--on-dark, #f5f2ed)",
    "--mark-portrait": current?.portrait?.tone === "light" ? "var(--ink)" : "var(--on-dark, #f5f2ed)",
  } as CSSProperties;

  return (
    <div
      className={`splash-overlay ${styles.splash}`}
      style={style}
      data-leaving={leaving}
      role="button"
      tabIndex={0}
      aria-label="Enter the site"
      onClick={dismiss}
    >
      {slides.map((slide, i) => {
        const image = slide.landscape ?? slide.portrait;
        if (!image) return null;
        return (
          <picture key={i} className={styles.photo} data-active={i === active}>
            {slide.portrait ? (
              <>
                <source
                  media="(orientation: portrait)"
                  type="image/avif"
                  srcSet={splashSrcSet(slide.portrait.src, "portrait", "avif")}
                  sizes="100vw"
                />
                <source
                  media="(orientation: portrait)"
                  type="image/jpeg"
                  srcSet={splashSrcSet(slide.portrait.src, "portrait", "jpg")}
                  sizes="100vw"
                />
              </>
            ) : null}
            {slide.landscape ? (
              <>
                <source
                  type="image/avif"
                  srcSet={splashSrcSet(slide.landscape.src, "landscape", "avif")}
                  sizes="100vw"
                />
                <source
                  type="image/jpeg"
                  srcSet={splashSrcSet(slide.landscape.src, "landscape", "jpg")}
                  sizes="100vw"
                />
              </>
            ) : null}
            {/* Decorative here: the photograph is atmosphere on the way in, and
                the same work is described properly on its own page. */}
            <img
              src={splashFallback(image.src, slide.landscape ? "landscape" : "portrait")}
              alt=""
              width={image.width}
              height={image.height}
              fetchPriority={i === 0 ? "high" : undefined}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </picture>
        );
      })}

      {/* The mark is drawn rather than loaded so it needs no second request.
          Clean, per the review: no shadow, no scrim, nothing behind it. Its
          fill is one flat colour, ink or paper, chosen per photograph so it
          stays readable; never a per-pixel effect, which the practice
          specifically did not want. */}
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

      {/* One credit per photograph, shown only in the orientation that actually
          displays its image, and only while its slide is up. */}
      {current?.landscape?.credit ? (
        <span className={`notation ${styles.credit} ${styles.creditLandscape}`} aria-hidden="true">
          {current.landscape.credit.toUpperCase()}
        </span>
      ) : null}
      {current?.portrait?.credit ? (
        <span className={`notation ${styles.credit} ${styles.creditPortrait}`} aria-hidden="true">
          {current.portrait.credit.toUpperCase()}
        </span>
      ) : null}
    </div>
  );
}
