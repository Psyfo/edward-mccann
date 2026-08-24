import Link from "next/link";
import { sectorLabel, type Project } from "@/lib/content";
import { srcSet, fallbackSrc } from "@/lib/media";
import styles from "./RelatedProjects.module.css";

type Props = {
  projects: Project[];
  total: number;
};

/**
 * Where a case study hands off to the rest of the archive.
 *
 * "Similar" means the sector the practice already declares for every
 * project, not a tag invented for this one page: nearest by catalogue
 * number within that sector, backfilled from the rest of the archive if the
 * sector itself cannot supply four. The sector line under each frame is what
 * makes a backfilled result honest rather than a mismatched claim.
 */
export function RelatedProjects({ projects, total }: Props) {
  if (projects.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Other similar projects">
      <div className={styles.head}>
        <h2 className={`section-label ${styles.heading}`}>Other similar projects</h2>
        <Link href="/archive" className={styles.archiveLink}>
          {`View the complete archive — ${total} works`}{" "}
          <span className="mark" aria-hidden="true">
            &#187;
          </span>
        </Link>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.link}>
            <span className={`${styles.frame} media`} data-fit={project.hero.fit ?? "cover"}>
              <picture>
                <source
                  type="image/avif"
                  srcSet={srcSet(project.hero, "avif")}
                  sizes="(max-width: 900px) 44vw, 22vw"
                />
                <img
                  src={fallbackSrc(project.hero)}
                  srcSet={srcSet(project.hero, "jpg")}
                  sizes="(max-width: 900px) 44vw, 22vw"
                  alt={project.hero.caption || ""}
                  width={project.hero.width}
                  height={project.hero.height}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </span>
            <span className={styles.caption}>
              <span className={styles.name}>{project.name}</span>
              <span className={`notation ${styles.sector}`}>{sectorLabel(project.sector)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
