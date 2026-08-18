import Link from "next/link";
import type { Project } from "@/lib/content";
import { srcSet, fallbackSrc } from "@/lib/media";
import styles from "./WorkGrid.module.css";

type Props = {
  projects: Project[];
  /** The number, type, place and press line under each name. */
  showFacts: boolean;
};

const COLUMNS = 3;

/**
 * A stable number from a string.
 *
 * The scatter has to be decided the same way on the server and in the browser,
 * or the markup React sends and the markup it expects would disagree and the
 * page would flicker as it corrects itself. Math.random cannot do that, so the
 * layout is derived from the slug: the same project always sits the same way,
 * and it only moves when the practice renames or reorders something.
 */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const WIDTHS = [72, 80, 88, 96, 100];
const LEADS = [0, 4, 7, 11, 15];

/**
 * Where a project sits inside its column.
 *
 * The columns and the gutters between them never move: what varies is how much
 * of a column an image fills, which edge it sits against, and how far it is
 * pushed down. That keeps the underlying order legible while stopping the page
 * from reading as a table of thumbnails.
 */
function place(slug: string, indexInColumn: number) {
  const h = hash(slug);
  const width = WIDTHS[h % WIDTHS.length];
  const lead = LEADS[(h >> 5) % LEADS.length];
  // A full-width image has nowhere to sit but flush; anything narrower picks an
  // edge, and the middle is allowed so the columns do not read as two rails.
  const align = width === 100 ? "stretch" : ["start", "center", "end"][(h >> 11) % 3];
  return {
    width: `${width}%`,
    alignSelf: align as "start" | "center" | "end" | "stretch",
    // The first image in a column is offset too, so the three columns do not
    // all begin on the same line.
    marginTop: `calc(var(--u) * ${indexInColumn === 0 ? lead : lead + 5})`,
  };
}

/**
 * The complete work, in three columns, scattered.
 *
 * Every project is here rather than a curated few: the practice wanted the
 * landing page to be the archive. Images keep their own proportions and are
 * never cropped, so portrait and landscape sit together as they were shot.
 */
export function WorkGrid({ projects, showFacts }: Props) {
  // Dealt across the columns in order, so the numbering still reads left to
  // right and the document order matches the order of the work.
  const columns: Project[][] = Array.from({ length: COLUMNS }, () => []);
  projects.forEach((project, i) => columns[i % COLUMNS].push(project));

  return (
    <div className={styles.grid}>
      {columns.map((column, columnIndex) => (
        <div className={styles.column} key={columnIndex}>
          {column.map((project, i) => {
            const { width, alignSelf, marginTop } = place(project.slug, i);
            const facts = [project.no, project.type, project.place]
              .filter((v) => v && v !== "—")
              .join(" — ");

            return (
              <article className={styles.item} key={project.slug} style={{ width, alignSelf, marginTop }}>
                <Link href={`/projects/${project.slug}`} className={styles.link}>
                  <span
                    className={styles.frame}
                    style={{ aspectRatio: `${project.hero.width} / ${project.hero.height}` }}
                  >
                    <picture>
                      <source type="image/avif" srcSet={srcSet(project.hero, "avif")} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 30vw" />
                      <img
                        src={fallbackSrc(project.hero)}
                        srcSet={srcSet(project.hero, "jpg")}
                        sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 30vw"
                        alt={project.hero.caption || ""}
                        width={project.hero.width}
                        height={project.hero.height}
                        loading={columnIndex === 0 && i === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </picture>
                  </span>
                  <span className={styles.caption}>
                    <span className={`title ${styles.name}`}>{project.name}</span>
                    {showFacts && facts ? (
                      <span className={`notation ${styles.facts}`}>{facts}</span>
                    ) : null}
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}
