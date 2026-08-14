import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { SectorFilter } from "@/components/SectorFilter";
import { selected } from "@/lib/content";
import styles from "./page.module.css";

export default function HomePage() {
  const [lead, second, ...rest] = selected;

  return (
    <div className={styles.page}>
      <section className={styles.opening}>
        {/*
          The practice's own positioning line, verbatim from the About copy.
          It is the one piece of display type on the homepage.
        */}
        <h1 className={`display ${styles.statement}`}>
          Nose to tail design — initial concepts carried through to their
          resolution in the details and construction.
        </h1>
        <SectorFilter />
      </section>

      {/* Asymmetric lead row, then a three-up. Ratios are fixed so the grid
          keeps its rhythm regardless of source aspect. */}
      <section className={styles.leadRow} aria-label="Selected work">
        {lead ? (
          <ProjectCard
            project={lead}
            ratio="16 / 10.5"
            sizes="(max-width: 700px) 100vw, 60vw"
            priority
            size="lead"
          />
        ) : null}
        {second ? (
          <ProjectCard
            project={second}
            ratio="16 / 10.5"
            sizes="(max-width: 700px) 100vw, 38vw"
            priority
            size="lead"
          />
        ) : null}
      </section>

      <section className={styles.threeUp}>
        {rest.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            ratio="4 / 5"
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 30vw"
          />
        ))}
      </section>

      <div className={styles.tail}>
        <Link href="/index" className={styles.indexLink}>
          <span className={styles.indexTitle}>
            The complete archive — 27 works, 2012 to present
          </span>{" "}
          <span className="mark" aria-hidden="true">
            &#187;
          </span>
        </Link>
      </div>
    </div>
  );
}
