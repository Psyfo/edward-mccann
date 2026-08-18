import type { GlobalConfig } from "payload";

/**
 * Contact details, the shared strings, and what the landing page shows.
 *
 * The switches exist because the practice asked for things to be taken off the
 * landing page rather than deleted. Removing the code would make each one a
 * developer job to get back; a switch makes it the practice's own decision, and
 * the copy stays where it is either way.
 */
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
      name: "homepage",
      type: "group",
      label: "Landing page",
      admin: { description: "What the landing page shows. Nothing here is deleted when it is switched off." },
      fields: [
        {
          name: "showStatement",
          type: "checkbox",
          defaultValue: false,
          label: "Show the positioning statement",
          admin: { description: "The display line above the work. Off at the practice's request." },
        },
        {
          name: "showProjectFacts",
          type: "checkbox",
          defaultValue: false,
          label: "Show the facts line under each project",
          admin: { description: "Number, type, place and press. Off leaves the name alone." },
        },
        {
          name: "showSectorFilter",
          type: "checkbox",
          defaultValue: true,
          label: "Show the sector filter",
        },
        {
          name: "splashEnabled",
          type: "checkbox",
          defaultValue: true,
          label: "Show the entry splash",
          admin: { description: "The mark on a full screen, then a photograph, until the visitor dismisses it." },
        },
        {
          name: "splashImage",
          type: "upload",
          relationTo: "media",
          label: "Splash photograph, landscape",
          admin: { description: "Shown behind the mark on desktop. Without one the splash stays on paper, which is a valid state." },
        },
        {
          name: "splashImageMobile",
          type: "upload",
          relationTo: "media",
          label: "Splash photograph, portrait",
          admin: { description: "For phones, where a landscape crop loses the subject. Falls back to the landscape one." },
        },
      ],
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
