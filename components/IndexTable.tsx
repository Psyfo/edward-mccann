"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Project, Sector } from "@/lib/content";
import styles from "./IndexTable.module.css";

type SortKey = "no" | "name" | "place" | "year" | "type" | "status";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "no", label: "NO." },
  { key: "name", label: "WORK" },
  { key: "place", label: "PLACE" },
  { key: "year", label: "YEAR" },
  { key: "type", label: "TYPE" },
  { key: "status", label: "STATUS" },
];

export function IndexTable({
  projects,
  sectors,
}: {
  projects: Project[];
  sectors: Sector[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const sector = params.get("sector") ?? "all";
  const [sort, setSort] = useState<SortKey>("no");

  const rows = useMemo(() => {
    const filtered =
      sector === "all" ? projects : projects.filter((p) => p.sector === sector);
    // Unknowns ("—") always sort last rather than leading the column.
    return [...filtered].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (av === "—" && bv !== "—") return 1;
      if (bv === "—" && av !== "—") return -1;
      return String(av).localeCompare(String(bv), "en");
    });
  }, [projects, sector, sort]);

  const setSector = (id: string) => {
    router.replace(id === "all" ? "/archive" : `/archive?sector=${id}`, { scroll: false });
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1 className={styles.title}>
          Index <span className={`notation ${styles.count}`}>— {rows.length} WORKS</span>
        </h1>
        <div className={styles.filters}>
          <button
            type="button"
            className={styles.filter}
            data-active={sector === "all"}
            onClick={() => setSector("all")}
          >
            ALL
          </button>
          {sectors.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.filter}
              data-active={sector === s.id}
              onClick={() => setSector(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {COLUMNS.map((col) => (
              <th key={col.key} scope="col" className={styles.th}>
                <button
                  type="button"
                  className={styles.sort}
                  data-active={sort === col.key}
                  onClick={() => setSort(col.key)}
                  aria-label={`Sort by ${col.label.replace(".", "")}`}
                >
                  {col.label}
                </button>
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
