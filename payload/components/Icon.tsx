/**
 * The nav mark: the practice's own EM monogram, the same drawing the site uses
 * as its favicon.
 *
 * Drawn here rather than loaded as a file so it can take the admin's own
 * colours, which is what keeps it legible when the panel is in dark mode. The
 * bare mark is used, with no tile, because it sits on the admin's ground.
 */
export default function Icon() {
  return (
    <svg
      width="30"
      height="17"
      viewBox="0 40 180 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Edward McCann Architecture"
    >
      <g fill="var(--theme-text)">
        <rect x="0" y="40" width="69.5" height="20.5" />
        <rect x="0" y="78" width="42.5" height="21.5" />
        <rect x="0" y="119" width="69.5" height="20.5" />
        <polygon points="79.5,40 101.5,40 131.5,110.5 119.5,139.5" />
        <rect x="158" y="40" width="22" height="100" />
      </g>
    </svg>
  );
}
