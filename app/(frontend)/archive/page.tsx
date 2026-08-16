import type { Metadata } from "next";
import { openGraphFor } from "@/lib/schema";
import Link from "next/link";
import { getByNumber, sectors, type Project } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/archive" },
  openGraph: openGraphFor("/archive"),
  title: "Index",
  description:
    "The complete archive of Edward McCann Architecture: 27 works, with place, year, type and status declared for each.",
};

type SortKey = "no" | "name" | "place" | "year" | "type" | "status";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "no", label: "NO." },
  { key: "name", label: "WORK" },
  { key: "place", label: "PLACE" },
  { key: "year", label: "YEAR" },
  { key: "type", label: "TYPE" },
  { key: "status", label: "STATUS" },
];

const SORT_KEYS = new Set<string>(COLUMNS.map((c) => c.key));

/**
 * The archive is rendered on the server, and every filter and sort state is a
 * real URL.
 *
 * It was briefly a client component driven by useSearchParams, which quietly
 * excluded the whole table from the prerendered HTML: the practice's complete
 * body of work existed only in the client payload, invisible to crawlers and to
 * anyone without JavaScript. Links cost nothing here and keep each state
 * shareable.
 */
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const sector = params.sector ?? "all";
  const sort = (SORT_KEYS.has(params.sort ?? "") ? params.sort : "no") as SortKey;

  const byNumber = await getByNumber();
  const filtered =
    sector === "all" ? byNumber : byNumber.filter((p) => p.sector === sector);

  // Unknowns sort last rather than leading the column.
  const rows: Project[] = [...filtered].sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    if (av === "—" && bv !== "—") return 1;
    if (bv === "—" && av !== "—") return -1;
    return String(av).localeCompare(String(bv), "en");
  });

  const href = (next: { sector?: string; sort?: string }) => {
    const q = new URLSearchParams();
    const s = next.sector ?? sector;
    const o = next.sort ?? sort;
    if (s !== "all") q.set("sector", s);
    if (o !== "no") q.set("sort", o);
    const qs = q.toString();
    return qs ? `/archive?${qs}` : "/archive";
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1 className={styles.title}>
          Index{" "}
          <span className={`notation ${styles.count}`}>
            {`— ${rows.length} WORKS`}
          </span>
        </h1>
        <nav className={styles.filters} aria-label="Filter by sector">
          <Link href={href({ sector: "all" })} className={styles.filter} data-active={sector === "all"}>
            ALL
          </Link>
          {sectors.map((s) => (
            <Link
              key={s.id}
              href={href({ sector: s.id })}
              className={styles.filter}
              data-active={sector === s.id}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {COLUMNS.map((col) => (
              <th key={col.key} scope="col" className={styles.th}>
                <Link
                  href={href({ sort: col.key })}
                  className={styles.sort}
                  data-active={sort === col.key}
                  aria-label={`Sort by ${col.label.replace(".", "")}`}
                >
                  {col.label}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.slug} className={styles.row}>
              <td className={`notation ${styles.no}`}>{p.no}</td>
              <td className={styles.work}>
                <Link href={`/projects/${p.slug}`} className={styles.link}>
                  <span className="title">{p.name}</span>
                </Link>
              </td>
              <td className={`notation ${styles.cell}`}>{p.place}</td>
              <td className={`notation ${styles.cell}`}>{p.year}</td>
              <td className={styles.type}>{p.type}</td>
              <td className={`notation ${styles.status}`} data-unbuilt={p.unbuilt}>
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={`notation ${styles.note}`}>
        Years are provisional pending confirmation with the practice. Built and
        unbuilt are always declared.
      </p>
    </div>
  );
}
