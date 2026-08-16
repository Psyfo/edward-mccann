import { Fragment } from "react";
import type { Metadata } from "next";
import { openGraphFor } from "@/lib/schema";
import { Datelines } from "@/components/Datelines";
import { Marked } from "@/components/Marked";
import { getStudioCopy } from "@/lib/content";
import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  openGraph: openGraphFor("/contact"),
  title: "Contact",
  description:
    "Every project begins with a conversation. Edward McCann Architecture, 105 Wilton Way, London E8, and 10 Kelvin Street, Gardens, Cape Town 8001.",
};

/** Addresses are stored as one field, a line per line, the way they are set. */
function addressLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ContactPage() {
  const studio = getStudioCopy();
  const EMAIL = studio.email;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={`display ${styles.statement}`}>
          <Marked text={studio.contactStatement} className={styles.mark} />
        </h1>

        <p className={`body-copy ${styles.lede}`}>{studio.contactLede}</p>

        <a className={styles.button} href={`mailto:${EMAIL}`}>
          WRITE TO THE STUDIO{" "}
          <span className={styles.mark} aria-hidden="true">
            &#187;
          </span>
        </a>

        <div className={styles.addresses}>
          {studio.addresses.map((address) => (
            <section key={address.city}>
              <h2 className={`notation ${styles.city}`}>{address.city}</h2>
              <p className={styles.address}>
                {addressLines(address.lines).map((line, i, all) => (
                  <Fragment key={line}>
                    {line}
                    {i < all.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </p>
            </section>
          ))}
        </div>

        <ContactForm />

        <div className={styles.details}>
          <a href={`mailto:${EMAIL}`} className={`notation ${styles.detail}`}>
            {EMAIL.toUpperCase()}
          </a>
          <a
            href={`tel:${studio.telephone.replace(/\s/g, "")}`}
            className={`notation ${styles.detail}`}
          >
            {studio.telephone}
          </a>
        </div>

        <div className={styles.clocks}>
          <Datelines className={`notation ${styles.clock}`} />
        </div>
      </div>
    </div>
  );
}
