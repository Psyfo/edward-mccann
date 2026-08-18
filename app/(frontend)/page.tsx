import Link from "next/link";
import { Entry } from "@/components/Entry";
import { WorkBrowser } from "@/components/WorkBrowser";
import { getByNumber, getStudioCopy } from "@/lib/content";
import { collectionSchema, jsonLd, organisationSchema, websiteSchema } from "@/lib/schema";
import styles from "./page.module.css";

export default async function HomePage() {
  const projects = await getByNumber();
  const studio = getStudioCopy();
  const { homepage } = studio;

  const splash =
    homepage.splashEnabled && (homepage.splash.landscape || homepage.splash.portrait)
      ? homepage.splash
      : null;

  return (
    <div className={styles.page}>
      {/* Who the practice is, what this site is, and the work it holds. The
          third matters more than usual here: with the statement switched off
          there is almost no prose on this page, so the list of works is the
          substance a search engine has to go on. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(organisationSchema(), websiteSchema(), collectionSchema(projects)),
        }}
      />

      <Entry splash={splash}>
        <section className={styles.opening}>
          {homepage.showStatement ? (
            <h1 className={`display ${styles.statement}`}>{studio.positioningLine}</h1>
          ) : (
            // The statement is off at the practice's request, and a page with no
            // heading is a page a search engine cannot place. This says the same
            // thing to a crawler and a screen reader without printing it.
            <h1 className="visually-hidden">
              Edward McCann Architecture — houses, places to eat and drink, objects and public work
            </h1>
          )}
        </section>

        <WorkBrowser
          projects={projects}
          showFacts={homepage.showProjectFacts}
          showFilter={homepage.showSectorFilter}
        />

        <div className={styles.tail}>
          <Link href="/archive" className={styles.indexLink}>
            <span className={styles.indexTitle}>
              The complete archive — {projects.length} works, 2012 to present
            </span>{" "}
            <span className="mark" aria-hidden="true">
              &#187;
            </span>
          </Link>
        </div>
      </Entry>
    </div>
  );
}
