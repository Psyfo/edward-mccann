"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

/**
 * The through-line as reading progress: a hairline that draws across the top of
 * a case study and terminates in the solid square when the story is finished.
 * This is the one persistent motion element on the site.
 *
 * Uses a scroll-driven animation timeline where supported, so the browser runs
 * it off the main thread, and falls back to a passive scroll listener where it
 * is not. Reduced motion pins it complete.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const terminusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const terminus = terminusRef.current;
    if (!el || !terminus) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // CSS pins both to their end state.

    // Supported natively: let CSS drive it off the main thread.
    if (CSS.supports("animation-timeline: scroll()")) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      el.style.transform = `scaleX(${progress})`;
      const travel = (el.parentElement?.clientWidth ?? 0) - terminus.offsetWidth;
      terminus.style.transform = `translateX(${travel * progress}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div ref={ref} className={styles.line} />
      <div ref={terminusRef} className={styles.terminus} />
    </div>
  );
}
