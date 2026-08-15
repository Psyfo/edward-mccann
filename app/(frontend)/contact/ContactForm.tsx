"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "./actions";
import styles from "./ContactForm.module.css";

const INITIAL: EnquiryState = { status: "idle" };

const WORK_OPTIONS = [
  { value: "houses", label: "A house" },
  { value: "eat-drink", label: "A place to eat or drink" },
  { value: "objects", label: "An object" },
  { value: "public", label: "Public work" },
  { value: "other", label: "Something else" },
];

/**
 * The enquiry form.
 *
 * It asks where the site is and what kind of work it is because those two
 * answers are what turn a message into something the practice can act on
 * without a round trip. Everything else a person might want to say belongs in
 * their own words, so the message field is the only long one.
 *
 * Built on useActionState so it still submits with JavaScript unavailable: the
 * form posts, the action runs, and the page comes back with the same state it
 * would have shown inline.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, INITIAL);

  if (state.status === "sent") {
    return (
      <div className={styles.form}>
        <h2 className={`notation ${styles.heading}`}>MESSAGE SENT</h2>
        <p className={styles.confirmation}>
          Thank you. We have your message and will come back to you shortly, usually
          within a few days.
        </p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className={styles.form} noValidate>
      <h2 className={`notation ${styles.heading}`}>OR SEND A NOTE</h2>

      {errors.form ? (
        <p className={styles.formError} role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className={styles.pair}>
        <Field id="name" label="YOUR NAME" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>

        <Field id="email" label="EMAIL" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <div className={styles.pair}>
        <Field id="location" label="WHERE IS THE SITE" error={errors.location}>
          <input
            id="location"
            name="location"
            type="text"
            maxLength={200}
            placeholder="Hackney, or anywhere"
            defaultValue={values.location}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
          />
        </Field>

        <Field id="work" label="WHAT KIND OF WORK" error={errors.work}>
          <span className={styles.selectWrap}>
            <select id="work" name="work" defaultValue={values.work ?? ""}>
              <option value="">Not sure yet</option>
              {WORK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
        </Field>
      </div>

      <Field id="message" label="ABOUT THE PROJECT" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      {/* Not for people. Anything typed here was typed by something reading the
          markup, which is the whole point of it being unreachable. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "SENDING" : "SEND"}{" "}
        <span className={styles.mark} aria-hidden="true">
          &#187;
        </span>
      </button>

      <p className={styles.privacy}>
        We use what you send here to reply to you and nothing else. It is not
        shared, and you can ask us to delete it at any time.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={styles.field}>
      <label className={`notation ${styles.label}`} htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <span className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </p>
  );
}
