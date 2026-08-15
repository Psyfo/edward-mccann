"use server";

import { headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Receives the contact form.
 *
 * The order matters: the enquiry is stored first and the notification is sent
 * afterwards, so an outage at the email provider costs a notification rather
 * than a client. Everything reaches the database through the Local API, which
 * is why the collection refuses creates through the REST endpoint: there
 * should be exactly one way in, and it should be the one with these checks on
 * it.
 */

const WORK = ["houses", "eat-drink", "objects", "public", "other"] as const;
type Work = (typeof WORK)[number];

const asWork = (value: string): Work | null =>
  WORK.includes(value as Work) ? (value as Work) : null;

export type EnquiryState = {
  status: "idle" | "sent" | "error";
  errors?: Partial<Record<"name" | "email" | "location" | "work" | "message" | "form", string>>;
  values?: Record<string, string>;
};

/**
 * Five an hour from one address. Generous for a person, tedious for a script.
 * In memory on purpose: one container serves this site, and a dependency on
 * shared state would be a heavier thing to run than the problem justifies. If
 * the site is ever scaled out this becomes per instance, which is a weakening
 * rather than a break.
 */
const RECENT = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

function withinRateLimit(ip: string): boolean {
  const now = Date.now();
  const seen = (RECENT.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (RECENT.size > 500) {
    for (const [key, times] of RECENT) {
      if (times.every((t) => now - t >= WINDOW_MS)) RECENT.delete(key);
    }
  }

  if (seen.length >= LIMIT) {
    RECENT.set(ip, seen);
    return false;
  }

  seen.push(now);
  RECENT.set(ip, seen);
  return true;
}

async function notify(enquiry: { name: string; email: string; location: string; work: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_TO;
  const from = process.env.ENQUIRY_NOTIFY_FROM;
  if (!key || !to || !from) return;

  const lines = [
    `From: ${enquiry.name} <${enquiry.email}>`,
    enquiry.location ? `Site: ${enquiry.location}` : null,
    enquiry.work ? `Work: ${enquiry.work}` : null,
    "",
    enquiry.message,
  ].filter((l) => l !== null);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: enquiry.email,
      subject: `Enquiry from ${enquiry.name}`,
      text: lines.join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`notification rejected: ${response.status}`);
  }
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const name = read("name");
  const email = read("email");
  const location = read("location");
  const work = read("work");
  const message = read("message");
  const values = { name, email, location, work, message };

  // The honeypot. A field no person can see or tab into, so anything in it was
  // filled by something reading the markup. Answered with the same success the
  // sender would have got, since telling a script it failed only teaches it.
  if (read("company")) return { status: "sent" };

  const errors: EnquiryState["errors"] = {};
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length > 100) errors.name = "That is longer than this field allows.";

  if (!email) errors.email = "We need an address to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) {
    errors.email = "That does not look like an email address.";
  }

  if (location.length > 200) errors.location = "That is longer than this field allows.";
  if (work && !asWork(work)) errors.work = "Please choose one of the options.";

  if (!message) errors.message = "Tell us a little about the project.";
  else if (message.length < 10) errors.message = "A sentence or two would help.";
  else if (message.length > 4000) errors.message = "Please keep this under 4000 characters.";

  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  if (!withinRateLimit(ip)) {
    return {
      status: "error",
      errors: { form: "That is several messages in a short time. Please write to us directly instead." },
      values,
    };
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "enquiries",
      data: { name, email, location: location || null, work: asWork(work), message, status: "new" },
      overrideAccess: true,
    });
  } catch (error) {
    console.error("could not store enquiry", error);
    return {
      status: "error",
      errors: { form: "Something went wrong at our end. Please write to us directly." },
      values,
    };
  }

  // Stored, so the enquiry is safe from here. A failed notification is worth
  // logging and nothing more: telling the sender it failed would invite a
  // duplicate of something already received.
  try {
    await notify({ name, email, location, work, message });
  } catch (error) {
    console.error("enquiry stored but notification failed", error);
  }

  return { status: "sent" };
}
