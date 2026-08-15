import type { Metadata } from "next";
import { Datelines } from "@/components/Datelines";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Every project begins with a conversation. Edward McCann Architecture, 105 Wilton Way, London E8, and 10 Kelvin Street, Gardens, Cape Town.",
};

const EMAIL = "info@edwardmccann.studio";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={`display ${styles.statement}`}>
          Every project begins with a conversation{" "}
          <span className={styles.mark} aria-hidden="true">
            &#187;
          </span>{" "}
          a back and forth.
        </h1>

        <p className={`body-copy ${styles.lede}`}>
          Tell us about your site and what you imagine for it. We take on
          houses, places to eat and drink, objects and public work, from first
          feasibility conversations to contract administration on site.
        </p>

        <a className={styles.button} href={`mailto:${EMAIL}`}>
          WRITE TO THE STUDIO{" "}
          <span className={styles.mark} aria-hidden="true">
            &#187;
          </span>
        </a>

        <div className={styles.addresses}>
          <section>
            <h2 className={`notation ${styles.city}`}>LONDON</h2>
            <p className={styles.address}>
              105 Wilton Way
              <br />
              London E8 1BH
            </p>
          </section>
          <section>
            <h2 className={`notation ${styles.city}`}>CAPE TOWN</h2>
            <p className={styles.address}>
              10 Kelvin Street
              <br />
              Gardens
            </p>
          </section>
        </div>

        <div className={styles.details}>
          <a href={`mailto:${EMAIL}`} className={`notation ${styles.detail}`}>
            {EMAIL.toUpperCase()}
          </a>
          <a href="tel:+447734593280" className={`notation ${styles.detail}`}>
            +44 7734 593 280
          </a>
        </div>

        <div className={styles.clocks}>
          <Datelines className={`notation ${styles.clock}`} />
        </div>
      </div>
    </div>
  );
}
