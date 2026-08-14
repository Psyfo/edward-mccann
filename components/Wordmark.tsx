import styles from "./Wordmark.module.css";

type Props = {
  /** "inline" for the header lockup, "stacked" for the two-line signature. */
  variant?: "inline" | "stacked";
  /** Include the letter-spaced ARCHITECTURE line. */
  withDescriptor?: boolean;
  className?: string;
};

/**
 * The approved mark (logo board, candidate 01): tracked caps with the "c" of
 * "Mc" raised and underscored. The raised c is the proprietary gesture, so it
 * is drawn with markup rather than baked into an image and stays selectable,
 * scalable and legible at every size.
 */
export function Wordmark({
  variant = "inline",
  withDescriptor = false,
  className,
}: Props) {
  return (
    <span
      className={[styles.mark, styles[variant], className].filter(Boolean).join(" ")}
      // The raised letterform would otherwise be announced as "M c CANN".
      aria-label="Edward McCann Architecture"
    >
      <span aria-hidden="true" className={styles.name}>
        EDWARD{variant === "stacked" ? <br /> : " "}M<span className={styles.raised}>c</span>CANN
      </span>
      {withDescriptor ? (
        <span aria-hidden="true" className={styles.descriptor}>
          ARCHITECTURE
        </span>
      ) : null}
    </span>
  );
}
