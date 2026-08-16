import type { Metadata } from "next";
import { Marked } from "@/components/Marked";
import { getPracticeCopy } from "@/lib/content";
import { openGraphFor } from "@/lib/schema";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/practice" },
  openGraph: openGraphFor("/practice"),
  title: "Practice",
  description:
    "Edward McCann Architecture is an RIBA Chartered and ARB registered practice. We believe in nose to tail design, in which initial concepts at inception are carried through to their resolution in the details and construction.",
};

export default function PracticePage() {
  // The practice's own words, edited in the admin. A paragraph carrying a
  // heading starts a new section, which is how Process keeps its place in the
  // essay without the page hardcoding where it falls.
  const practice = getPracticeCopy();

  return (
    <div className={styles.page}>
      <h1 className={`display ${styles.statement}`}>{practice.statement}</h1>

      <div className={styles.columns}>
        <div className={styles.prose}>
          {practice.paragraphs.map((paragraph, i) => (
            <div key={i}>
              {paragraph.heading ? (
                <h2 className={`section-label ${styles.heading}`}>{paragraph.heading}</h2>
              ) : null}
              <p className={`body-copy ${styles.para}`}>
                <Marked text={paragraph.text} />
              </p>
            </div>
          ))}
        </div>

        <aside className={styles.side}>
          {practice.credentials.map((group) => (
            <section key={group.label} className={styles.group}>
              <h2 className={`notation ${styles.groupLabel}`}>{group.label}</h2>
              <ul className={`notation ${styles.list}`}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className={styles.group}>
            <h2 className={`notation ${styles.groupLabel}`}>RECOGNITION, 2017 — 2022</h2>
            <ul className={`notation ${styles.list}`}>
              {practice.recognition.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <div className="through-line" aria-hidden="true" />

      <div className={styles.people}>
        <section>
          <h2 className={`notation ${styles.groupLabel}`}>COLLEAGUES, PRESENT AND PAST</h2>
          <p className={styles.names}>{practice.colleagues.join(" · ")}</p>
        </section>
        <section>
          <h2 className={`notation ${styles.groupLabel}`}>COLLABORATORS</h2>
          <p className={styles.names}>{practice.collaborators.join(" · ")}</p>
        </section>
      </div>
    </div>
  );
}
