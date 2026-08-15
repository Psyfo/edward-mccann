import Link from "next/link";
import { sectors } from "@/lib/content";
import styles from "./SectorFilter.module.css";

/**
 * The sector row from the homepage board. Each sector links into the index
 * pre-filtered, so the row works without JavaScript and every state is a real,
 * shareable URL.
 */
export function SectorFilter({ active }: { active?: string }) {
  return (
    <nav className={styles.row} aria-label="Filter work by sector">
      <Link
        href="/"
        className={styles.item}
        data-active={active === undefined || active === "selected"}
      >
        SELECTED
      </Link>
      {sectors.map((sector) => (
        <Link
          key={sector.id}
          href={`/archive?sector=${sector.id}`}
          className={styles.item}
          data-active={active === sector.id}
        >
          {sector.label}
        </Link>
      ))}
      <Link href="/archive" className={`${styles.item} ${styles.full}`}>
        FULL INDEX{" "}
        <span className="mark" aria-hidden="true">
          &#187;
        </span>
      </Link>
    </nav>
  );
}
