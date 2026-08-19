"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import styles from "./SiteHeader.module.css";

const NAV = [
  { href: "/", label: "WORK", match: (p: string) => p === "/" || p.startsWith("/projects") || p === "/archive" },
  { href: "/practice", label: "PRACTICE", match: (p: string) => p.startsWith("/practice") },
  { href: "/press", label: "PRESS", match: (p: string) => p.startsWith("/press") },
  { href: "/contact", label: "CONTACT", match: (p: string) => p.startsWith("/contact") },
];

export function SiteHeader() {
  const pathname = usePathname();
  // Past this point the header is over content rather than its own band, so it
  // sheds its ground and thins slightly. Read on a frame so a fast scroll does
  // not queue a state update per event.
  const [scrolled, setScrolled] = useState(false);
  // The overlay is open only for the route it was opened on, so a navigation
  // closes it without an effect having to synchronise the two.
  const [openedFor, setOpenedFor] = useState<string | null>(null);
  const open = openedFor === pathname;
  const setOpen = (next: boolean) => setOpenedFor(next ? pathname : null);
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  // The overlay is a modal surface: it traps nothing complex, but it must
  // close on Escape and return focus to the control that opened it.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenedFor(null);
        openRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || undefined}>
        <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="Edward McCann Architecture, home">
          <Wordmark withDescriptor />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? `${styles.navLink} ${styles.active}` : styles.navLink}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          ref={openRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(true)}
        >
          <span className={styles.srOnly}>Open menu</span>
          {/* A plus, per the practice's review: two hairline strokes, the
              same weight as every rule on the site. */}
          <span className={styles.plus} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        </div>
      </header>

      {/* Opaque ink ground, per the mobile board: never a translucent scrim.
          A sibling of the header rather than a child: the header blends with
          the page beneath it, and a blending element flattens its children
          into that arithmetic, which would invert this panel's ink to paper. */}
      <div id={menuId} className={styles.overlay} data-open={open} aria-hidden={!open}>
        <div className={styles.overlayBar}>
          <Wordmark className={styles.overlayMark} />
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={() => {
              setOpen(false);
              openRef.current?.focus();
            }}
            tabIndex={open ? 0 : -1}
          >
            <span className={styles.srOnly}>Close menu</span>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <nav className={styles.overlayNav} aria-label="Primary, mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.match(pathname) ? styles.overlayActive : undefined}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
              <span className="mark" aria-hidden="true">
                &#187;
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
