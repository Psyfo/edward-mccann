import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/content";
import { srcSet, fallbackSrc } from "@/lib/media";
import styles from "./WorkGrid.module.css";

type Props = {
  projects: Project[];
  /** The number, type, place and press line under each name. */
  showFacts: boolean;
};

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
const EDGES = ["flex-start", "center", "flex-end"] as const;

/**
 * How a project sits inside its frame.
 *
 * Every frame in a row is the same height, so the names beneath them share a
 * line. The scatter therefore lives inside the frame: how much of it the image
 * fills and which edge it sits against, with the image's own proportions doing
 * the rest. Images are bottom aligned so each name stays tight to its image;
 * the loose space the variation creates falls above, where it reads as air
 * rather than as a caption drifting away from its work.
 */
function place(slug: string): CSSProperties {
  const h = hash(slug);
  const width = WIDTHS[h % WIDTHS.length];
  const justify = width === 100 ? "center" : EDGES[(h >> 11) % EDGES.length];
  return { "--w": `${width}%`, "--jx": justify } as CSSProperties;
}

/**
 * The complete work in three columns. Every project is here rather than a
 * curated few: the practice wanted the landing page to be the archive. Images
 * keep their own proportions and are never cropped.
 */
export function WorkGrid({ projects, showFacts }: Props) {
  return (
    <div className={styles.grid}>
      {projects.map((project, i) => {
        const facts = [project.no, project.type, project.place]
          .filter((v) => v && v !== "—")
          .join(" — ");

        return (
          <article className={styles.item} key={project.slug} style={place(project.slug)}>
            <Link href={`/projects/${project.slug}`} className={styles.link}>
              <span className={styles.frame}>
                <picture className={styles.picture}>
                  <source
                    type="image/avif"
                    srcSet={srcSet(project.hero, "avif")}
                    sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 30vw"
                  />
                  <img
                    src={fallbackSrc(project.hero)}
                    srcSet={srcSet(project.hero, "jpg")}
                    sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 30vw"
                    alt={project.hero.caption || ""}
                    width={project.hero.width}
                    height={project.hero.height}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </picture>
              </span>
              <span className={styles.caption}>
                <span className={styles.name}>{project.name}</span>
                {showFacts && facts ? (
                  <span className={`notation ${styles.facts}`}>{facts}</span>
                ) : null}
              </span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
