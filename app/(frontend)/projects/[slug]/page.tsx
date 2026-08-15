import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate } from "@/components/Plate";
import { ProjectHero } from "@/components/ProjectHero";
import { ScrollProgress } from "@/components/ScrollProgress";
import { getByNumber, getNextProject, getProject, sectorLabel } from "@/lib/content";
import { mediaUrl } from "@/lib/media";
import styles from "./page.module.css";

type Params = { params: Promise<{ slug: string }> };

/**
 * Prerender every project when the database is reachable at build time, and
 * fall back to rendering on demand when it is not. The image build has no
 * database on this host, so without the fallback the build would fail rather
 * than simply producing a site that fills its cache on first request.
 */
export async function generateStaticParams() {
  try {
    return (await getByNumber()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const facts = [project.type, project.place, project.year, project.status]
    .filter((v) => v && v !== "—")
    .join(" — ");

  return {
    title: project.name,
    description: project.body[0]?.slice(0, 180) ?? facts,
    openGraph: {
      title: `${project.name} — Edward McCann Architecture`,
      description: facts,
      images: [{ url: mediaUrl(project.hero.src, 1280, "jpg"), width: 1280, alt: project.name }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const next = await getNextProject(slug);
  const facts: [string, string][] = [
    ["PLACE", project.place],
    ["YEAR", project.year],
    ["STATUS", project.status],
    ["TYPE", project.type],
    ["SECTOR", sectorLabel(project.sector)],
  ];
  if (project.photographer) facts.push(["PHOTOGRAPHY", project.photographer.toUpperCase()]);
  for (const item of project.press) facts.push(["PRESS", item]);

  return (
    <article>
      <ScrollProgress />
      <ProjectHero project={project} />

      <div className={styles.body}>
        <div className={styles.factsColumn}>
          <p className={`notation ${styles.no}`}>{project.no}</p>
          <dl className={`notation ${styles.facts}`}>
            {facts.map(([label, value], i) => (
              <div key={`${label}-${i}`} className={styles.fact}>
                <dt className={styles.factLabel}>{label}</dt>
                <dd className={styles.factValue} data-unbuilt={label === "STATUS" && project.unbuilt}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="through-line" aria-hidden="true" />
        </div>

        <div className={styles.prose}>
          {project.body.map((paragraph, i) => (
            <p key={i} className={`body-copy ${styles.paragraph}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {project.figures.length > 0 ? (
        <section className={styles.plates} aria-label={`${project.name}, images`}>
          {project.figures.map((figure, i) => {
            // Landscape plates run full measure; portraits pair up. This keeps
            // the sequence from alternating raggedly the way the old site did.
            const portrait = figure.height > figure.width;
            return (
              <Plate
                key={figure.src}
                figure={figure}
                index={i + 1}
                sizes={portrait ? "(max-width: 760px) 100vw, 46vw" : "(max-width: 760px) 100vw, 92vw"}
                className={portrait ? styles.portrait : styles.landscape}
              />
            );
          })}
        </section>
      ) : null}

      <footer className={styles.handoff}>
        <p className={`notation ${styles.credits}`}>
          {project.photographer
            ? `PHOTOGRAPHY — ${project.photographer.toUpperCase()}`
            : "CREDITS — TO BE CONFIRMED WITH THE PRACTICE"}
        </p>
        <Link href={`/projects/${next.slug}`} className={styles.next}>
          <span className={styles.nextLabel}>Next</span>{" "}
          <span className="title">{next.name}</span>{" "}
          <span className="mark" aria-hidden="true">
            &#187;
          </span>
        </Link>
      </footer>
    </article>
  );
}
