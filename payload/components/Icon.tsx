/**
 * The nav mark: the EM plan-monogram, the same drawing used as the site's
 * favicon. Two walls and three floor plates on one grid.
 */
export default function Icon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Edward McCann Architecture"
    >
      <rect width="100" height="100" fill="var(--theme-text)" />
      <g fill="var(--theme-bg)">
        <rect x="14" y="14" width="10" height="72" />
        <rect x="14" y="14" width="36" height="10" />
        <rect x="14" y="45" width="29" height="10" />
        <rect x="14" y="76" width="36" height="10" />
        <rect x="57" y="14" width="10" height="72" />
        <rect x="76" y="14" width="10" height="72" />
        <rect x="67" y="14" width="9" height="10" />
      </g>
    </svg>
  );
}
