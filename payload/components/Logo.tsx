/**
 * The login screen's mark: the approved wordmark, drawn in markup so the raised
 * underscored "c" stays crisp at any size, exactly as it is on the site.
 */
export default function Logo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        color: "var(--theme-text)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "1.75rem",
          letterSpacing: "0.22em",
          lineHeight: 1.25,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        EDWARD M
        <span
          style={{
            fontSize: "0.7em",
            verticalAlign: "0.32em",
            borderBottom: "0.14em solid currentColor",
            letterSpacing: 0,
            marginRight: "0.06em",
          }}
        >
          c
        </span>
        CANN
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: "0.6875rem",
          letterSpacing: "0.42em",
          color: "var(--theme-elevation-600)",
          textTransform: "uppercase",
        }}
      >
        ARCHITECTURE
      </span>
    </div>
  );
}
