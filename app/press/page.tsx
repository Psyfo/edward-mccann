import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Recognition and coverage for Edward McCann Architecture: Don't Move Improve 2017, 2019 and 2022, and Grand Designs television and magazine.",
};

/**
 * Recognition is derived from the project facts rather than maintained as a
 * separate page, so it can never drift out of date the way the legacy press
 * page did (frozen at 2019 while later accolades existed only as pixels baked
 * into thumbnails).
 */
export default function PressPage() {
  const recognised = projects
    .filter((p) => p.press.length > 0)
    .sort((a, b) => b.year.localeCompare(a.year));

  return (
    <div className={styles.page}>
      <h1 className={`display ${styles.title}`}>Recognition</h1>
      <p className={`body-copy ${styles.lede}`}>
        Coverage and awards, listed against the work itself.
      </p>

      <ul className={styles.list}>
        {recognised.map((project) => (
          <li key={project.slug} className={styles.item}>
            <Link href={`/projects/${project.slug}`} className={styles.link}>
              <span className={`notation ${styles.no}`}>{project.no}</span>
              <span className={`title ${styles.name}`}>{project.name}</span>
              <span className={`notation ${styles.credit}`}>
                {project.press.join(" · ")}
              </span>
              <span className="mark" aria-hidden="true">
                &#187;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
