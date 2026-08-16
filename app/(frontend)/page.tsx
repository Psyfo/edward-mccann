import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { SectorFilter } from "@/components/SectorFilter";
import { getSelected, getStudioCopy } from "@/lib/content";
import { jsonLd, organisationSchema, websiteSchema } from "@/lib/schema";
import styles from "./page.module.css";

export default async function HomePage() {
  const [lead, second, ...rest] = await getSelected();
  const studio = getStudioCopy();

  return (
    <div className={styles.page}>
      {/* Who the practice is and what this site is, stated once, on the page
          a search engine is most likely to treat as the practice's identity. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organisationSchema(), websiteSchema()) }}
      />
      <section className={styles.opening}>
        {/*
          The practice's own positioning line, edited in the admin. It is the
          one piece of display type on the homepage.
        */}
        <h1 className={`display ${styles.statement}`}>{studio.positioningLine}</h1>
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
        <Link href="/archive" className={styles.indexLink}>
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
