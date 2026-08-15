import type { GlobalConfig } from "payload";

/**
 * The Practice page's copy, which is the practice's own words from the existing
 * About page. Held as structured fields rather than one rich-text blob so the
 * page keeps its designed shape (statement, essay, credential lists) no matter
 * what is edited.
 */
export const PracticePage: GlobalConfig = {
  slug: "practice-page",
  label: "Practice page",
  access: { read: () => true },
  fields: [
    {
      name: "statement",
      type: "textarea",
      required: true,
      admin: { description: "The display line at the top of the page." },
    },
    {
      name: "paragraphs",
      type: "array",
      labels: { singular: "Paragraph", plural: "Essay" },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "credentials",
      type: "array",
      labels: { singular: "Group", plural: "Credential groups" },
      admin: { description: "e.g. ACCREDITATION, EDUCATION, PREVIOUS PRACTICES." },
      fields: [
        { name: "label", type: "text", required: true },
        {
          name: "items",
          type: "array",
          fields: [{ name: "text", type: "text", required: true }],
        },
      ],
    },
    {
      name: "recognition",
      type: "array",
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "colleagues",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      name: "collaborators",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
  ],
};
