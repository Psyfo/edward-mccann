"use client";

import { useState } from "react";
import type { SplashImage } from "@/lib/content";
import { Splash } from "./Splash";
import styles from "./Entry.module.css";

type Props = {
  splash: { landscape: SplashImage | null; portrait: SplashImage | null } | null;
  children: React.ReactNode;
};

/**
 * Holds the splash and the work, and hands over from one to the other.
 *
 * The important property is what happens when nothing runs. The work is always
 * rendered and always visible: the entrance is an animation that plays when the
 * splash has finished leaving, not a state the work has to be released from. So
 * a browser with scripts disabled, or a crawler that does not execute them, gets
 * the landing page and never knows a splash was intended.
 */
export function Entry({ splash, children }: Props) {
  const [entered, setEntered] = useState(!splash);

  return (
    <>
      {/* Without script the overlay could never be dismissed, so it is removed
          rather than left covering the page. Only shipped alongside a splash;
          a rule for something that is not there is just noise in the markup. */}
      {splash ? (
        <noscript>
          <style>{`.splash-overlay { display: none !important; }`}</style>
        </noscript>
      ) : null}

      {splash && !entered ? (
        <Splash
          landscape={splash.landscape}
          portrait={splash.portrait}
          onDismissed={() => setEntered(true)}
        />
      ) : null}

      <div className={styles.work} data-entered={entered}>
        {children}
      </div>
    </>
  );
}
