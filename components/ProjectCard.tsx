import Link from "next/link";
import type { Project } from "@/lib/content";
import { Plate } from "./Plate";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
  ratio: string;
  sizes: string;
  priority?: boolean;
  size?: "lead" | "standard";
};

/**
 * A card in the Selected grid: image, italic title, mono facts line. The whole
 * card is the link, so there is no "View Project" label to add.
 */
export function ProjectCard({ project, ratio, sizes, priority, size = "standard" }: Props) {
  const facts = [project.type, project.place]
    .filter((v) => v && v !== "—")
    .join(", ");
  const press = project.press[0];

  return (
    <Link href={`/projects/${project.slug}`} className={styles.card} data-size={size}>
      <Plate
        figure={project.hero}
        ratio={ratio}
        sizes={sizes}
        priority={priority}
        showCaption={false}
        transitionName={`hero-${project.slug}`}
      />
      <div className={styles.line}>
        <span className={`title ${styles.name}`}>{project.name}</span>
        <span className={`notation ${styles.facts}`}>
          {project.no} — {facts}
          {press ? ` — ${press}` : ""}
        </span>
      </div>
    </Link>
  );
}
