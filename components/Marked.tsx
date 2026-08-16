import { Fragment } from "react";

/**
 * Renders edited copy that contains the practice's accent mark.
 *
 * The double angle is stored as the character it is, so an editor types a
 * normal "»" and never has to know about markup. Here it becomes the oxide
 * mark the design uses, and is hidden from screen readers, where it would be
 * read aloud as punctuation for no reason.
 */
export function Marked({ text, className }: { text: string; className?: string }) {
  const parts = text.split("»");

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 ? (
            <span className={className ?? "mark"} aria-hidden="true">
              &#187;
            </span>
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
