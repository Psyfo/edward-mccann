import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "calc(var(--u) * 10) var(--gutter)" }}>
      <h1 className="display" style={{ maxWidth: "22ch", margin: 0 }}>
        That page is not in the archive.
      </h1>
      <p className="body-copy" style={{ marginTop: "calc(var(--u) * 3)", color: "var(--ink-secondary)" }}>
        The work is all still here, indexed by number, place and year.
      </p>
      <p style={{ marginTop: "calc(var(--u) * 3)" }}>
        <Link href="/index" style={{ fontStyle: "italic", fontSize: "1.125rem" }}>
          The complete archive{" "}
          <span className="mark" aria-hidden="true">
            &#187;
          </span>
        </Link>
      </p>
    </div>
  );
}
