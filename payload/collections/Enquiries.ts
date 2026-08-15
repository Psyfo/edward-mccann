import type { CollectionConfig } from "payload";

/**
 * Messages sent from the contact page.
 *
 * This is the first thing on the site that accepts input from the public, so
 * two rules shape it. Nothing may create a record through the API: the form's
 * server action writes through the Local API after its own checks, and leaving
 * the REST endpoint open would be a second way in that skips all of them.
 * And nothing here is readable without signing in, because every field is
 * somebody's personal information.
 *
 * What was submitted is kept read only in the admin. An enquiry is a record of
 * what a person actually sent, and editing it in place would quietly destroy
 * that. Only the status, which is the practice's own note to itself, can move.
 */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Enquiry", plural: "Enquiries" },
  admin: {
    useAsTitle: "name",
    description: "Messages sent from the contact page. Newest first.",
    defaultColumns: ["name", "location", "work", "status", "createdAt"],
    listSearchableFields: ["name", "email", "location", "message"],
  },
  defaultSort: "-createdAt",
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { readOnly: true } },
        { name: "email", type: "email", required: true, admin: { readOnly: true } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "location",
          type: "text",
          admin: { readOnly: true, description: "Where the site is." },
        },
        {
          name: "work",
          type: "select",
          options: [
            { label: "A house", value: "houses" },
            { label: "A place to eat or drink", value: "eat-drink" },
            { label: "An object", value: "objects" },
            { label: "Public work", value: "public" },
            { label: "Something else", value: "other" },
          ],
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Replied", value: "replied" },
        { label: "Closed", value: "closed" },
      ],
      admin: {
        position: "sidebar",
        description: "The practice's own note. The only field here that can be changed.",
      },
    },
  ],
};
