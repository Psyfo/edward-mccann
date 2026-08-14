"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marks children as shown once they scroll into view, which drives the
 * clip-path wipe in globals.css. Reduced motion is handled in CSS rather than
 * here, so the observer stays a single code path.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // Anything already on screen at mount should be drawn immediately rather
    // than waiting for a scroll that may never come.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return { ref, shown };
}
