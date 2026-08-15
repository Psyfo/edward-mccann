import type { GlobalConfig } from "payload";

/** Contact details and the homepage statement: the few strings that appear in more than one place. */
export const StudioDetails: GlobalConfig = {
  slug: "studio-details",
  label: "Studio details",
  access: { read: () => true },
  fields: [
    {
      name: "positioningLine",
      type: "textarea",
      required: true,
      admin: { description: "The display statement on the homepage." },
    },
    {
      name: "contactStatement",
      type: "textarea",
      required: true,
      admin: { description: "The display line on the contact page." },
    },
    {
      name: "contactLede",
      type: "textarea",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "telephone",
      type: "text",
      required: true,
    },
    {
      name: "addresses",
      type: "array",
      minRows: 1,
      admin: { description: "London and Cape Town. The city name prints in mono above the address." },
      fields: [
        { name: "city", type: "text", required: true },
        { name: "lines", type: "textarea", required: true },
      ],
    },
  ],
};
