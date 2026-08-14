import Link from "next/link";
import { Datelines } from "./Datelines";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="through-line" aria-hidden="true" />
      <div className={styles.row}>
        <p className={styles.archive}>
          <Link href="/archive">
            <span className={styles.archiveTitle}>The complete archive</span>{" "}
            <span className={styles.archiveMeta}>— 27 works</span>{" "}
            <span className="mark" aria-hidden="true">
              &#187;
            </span>
          </Link>
        </p>
        <div className={styles.meta}>
          <Datelines className="notation" />
          <Link href="/contact" className={styles.cta}>
            START A CONVERSATION{" "}
            <span className="mark" aria-hidden="true">
              &#187;
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
