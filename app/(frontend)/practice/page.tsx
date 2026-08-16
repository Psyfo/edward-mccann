import type { Metadata } from "next";
import { openGraphFor } from "@/lib/schema";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/practice" },
  openGraph: openGraphFor("/practice"),
  title: "Practice",
  description:
    "Edward McCann Architecture is an RIBA Chartered and ARB registered practice. We believe in nose to tail design, in which initial concepts at inception are carried through to their resolution in the details and construction.",
};

// The practice's own words, verbatim from the existing About page. Only the
// formatting changes: the run-on credential strings become structured lists.
const CREDENTIALS = [
  { label: "ACCREDITATION", items: ["RIBA CHARTERED", "ARB REGISTERED"] },
  {
    label: "EDUCATION",
    items: [
      "CAMBRIDGE UNIVERSITY — ARB/RIBA PT.3",
      "ARCHITECTURAL ASSOCIATION — AA DIPL",
      "EDINBURGH UNIVERSITY — MA (HONS)",
      "CAMBERWELL COLLEGE OF ART — FOUNDATION",
    ],
  },
  {
    label: "PREVIOUS PRACTICES",
    items: ["ADJAYE ASSOCIATES", "EDWARD CULLINAN ARCHITECTS", "SCABAL"],
  },
];

const COLLEAGUES = [
  "Roua Horaneih", "Cecilia Dubois", "Stephanie Westrum", "Haruka Murai",
  "Chiaki Tanaka", "Tim Fisher", "Adrian Ma", "Sebastian Tiew", "Ahmed Sahar",
  "Tom Hatzor",
];

const COLLABORATORS = [
  "Rashid Ali", "Alex Fox", "Adam Williamson", "Squint Opera",
  "Atelier For Images", "Mat Chivers", "Juliet Haysom",
];

const RECOGNITION = [
  "DON'T MOVE IMPROVE — 2017",
  "DON'T MOVE IMPROVE — 2019, FEATURED",
  "DON'T MOVE IMPROVE — 2022, LONGLISTED",
  "GRAND DESIGNS — TELEVISION, 2019",
  "GRAND DESIGNS MAGAZINE — LOFT EXTENSIONS FEATURE",
];

export default function PracticePage() {
  return (
    <div className={styles.page}>
      <h1 className={`display ${styles.statement}`}>
        We believe in nose to tail design, in which initial concepts at
        inception are carried through to their resolution in the details and
        construction.
      </h1>

      <div className={styles.columns}>
        <div className={styles.prose}>
          <p className={`body-copy ${styles.para}`}>
            We are an RIBA Chartered and ARB registered architecture practice.
            We have a lot of experience in working on sites with complex and
            particular constraints. A lot of the work we have undertaken has
            been modification and retrofitting of existing buildings: rear
            extensions, basement extensions, loft extensions, internal
            reconfigurations and fitouts.
          </p>
          <p className={`body-copy ${styles.para}`}>
            It can be an extremely rewarding experience to see through the
            transformation of an existing building and unlock new possibilities
            within it. There are particular stages within a project when things
            are stripped back and alternative spaces can be seen beyond what is
            existing at the time. It is the job of your architect to reveal
            these possibilities to you in advance, within a process that allows
            you to make good decisions and get the most out of what for most
            people is a once in a lifetime project.
          </p>

          <h2 className={`section-label ${styles.heading}`}>Process</h2>
          <p className={`body-copy ${styles.para}`}>
            All projects are developed through a collaborative process. At the
            outset it is about developing the brief through conversation{" "}
            <span className="mark" aria-hidden="true">
              &#187;
            </span>{" "}
            a back and forth of design concepts and critique in relation to
            functional and design aspirations, as well as understanding site
            context and regulatory environment. This is followed by design
            development through drawing, modelling and visualisation.
          </p>
          <p className={`body-copy ${styles.para}`}>
            We can handle submission of plans to the council for planning
            approval. On approvals, technical design and production information
            is undertaken for the purpose of pricing, building control and
            tendering the building contract. Once on site we can undertake
            contract administration to ensure that works are carried out in
            accordance with the designs and satisfy building regulations. At all
            stages you the client are invited into the process to comment, steer
            and ultimately sign off proposals.
          </p>
          <p className={`body-copy ${styles.para}`}>
            Ultimately we have an interest in developing robust, well
            considered, environmentally conscious and beautiful buildings which
            leave our clients both satisfied and happy in their new environment.
          </p>
        </div>

        <aside className={styles.side}>
          {CREDENTIALS.map((group) => (
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
              {RECOGNITION.map((item) => (
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
          <p className={styles.names}>{COLLEAGUES.join(" · ")}</p>
        </section>
        <section>
          <h2 className={`notation ${styles.groupLabel}`}>COLLABORATORS</h2>
          <p className={styles.names}>{COLLABORATORS.join(" · ")}</p>
        </section>
      </div>
    </div>
  );
}
