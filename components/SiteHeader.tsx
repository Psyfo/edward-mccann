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
    <header className={styles.header}>
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
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Opaque ink ground, per the mobile board: never a translucent scrim. */}
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
    </header>
  );
}
