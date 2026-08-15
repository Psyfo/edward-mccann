import type { CollectionConfig } from "payload";

/**
 * A work in the archive.
 *
 * The fields mirror content/facts.json, content/text.json and
 * content/figures.json exactly, so going dynamic changes nothing the site
 * renders. Where a fact is unknown the field says so rather than being left to
 * look complete: built and unbuilt is always declared.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["no", "name", "place", "year", "status"],
    description: "The complete archive, numbered chronologically.",
    listSearchableFields: ["name", "place", "type"],
  },
  access: {
    read: () => true,
  },
  defaultSort: "no",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "no",
          type: "text",
          required: true,
          unique: true,
          admin: {
            width: "20%",
            description: "Archive number, e.g. 014. Zero-padded to three digits.",
          },
        },
        {
          name: "name",
          type: "text",
          required: true,
          admin: { width: "40%" },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          admin: {
            width: "40%",
            description:
              "The project's URL. Changing this breaks existing links, including the ones inherited from the old site.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "place",
          type: "text",
          defaultValue: "—",
          admin: { width: "50%", description: "e.g. Hackney, E8. An em dash if unknown." },
        },
        {
          name: "year",
          type: "text",
          defaultValue: "—",
          admin: {
            width: "25%",
            description: "Provisional until confirmed. An em dash if unknown.",
          },
        },
        {
          name: "sector",
          type: "select",
          required: true,
          defaultValue: "houses",
          options: [
            { label: "Houses", value: "houses" },
            { label: "Places to eat & drink", value: "eat-drink" },
            { label: "Objects", value: "objects" },
            { label: "Public work", value: "public" },
          ],
          admin: { width: "25%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "text",
          required: true,
          admin: {
            width: "50%",
            description: "Specific description, e.g. HOUSE / LOFT EXTENSION. Shown in caps.",
          },
        },
        {
          name: "status",
          type: "text",
          required: true,
          admin: {
            width: "30%",
            description: "e.g. BUILT, PLANNING GRANTED, COMPETITION WIN, STATUS TO CONFIRM.",
          },
        },
        {
          name: "unbuilt",
          type: "checkbox",
          admin: {
            width: "20%",
            description: "Prints the status in oxide. Tick for anything not built.",
          },
        },
      ],
    },
    {
      name: "photographer",
      type: "text",
      admin: { description: "Credited on the project's cover and in the credits line." },
    },
    {
      name: "press",
      type: "array",
      labels: { singular: "Entry", plural: "Recognition" },
      admin: {
        description:
          "Awards and coverage. These drive the Press page, so it can never fall out of date.",
      },
      fields: [{ name: "entry", type: "text", required: true }],
    },
    {
      name: "body",
      type: "array",
      labels: { singular: "Paragraph", plural: "Description" },
      admin: {
        description:
          "The practice's own words. Plain paragraphs rather than rich text: the design gives the essay one voice and no inline formatting.",
      },
      fields: [{ name: "text", type: "textarea", required: true }],
    },
    {
      name: "figures",
      type: "array",
      labels: { singular: "Figure", plural: "Figures" },
      admin: {
        description:
          "In order. The first is the project's cover, used on the homepage, the archive and as the case-study hero.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
