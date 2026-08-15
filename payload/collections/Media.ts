import type { CollectionConfig } from "payload";

/**
 * Originals only.
 *
 * Payload stores the uploaded original in the bucket under `originals/`. The
 * derivatives the site actually serves (AVIF and JPEG at three widths,
 * content-addressed, immutably cached) are still produced by
 * tools/prepare-media.mjs, because that pipeline also decides whether an image
 * may be cropped and refuses anything too small to be project photography.
 * Letting Payload resize instead would quietly lose all of that.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    description:
      "Uploaded originals. The published derivatives are generated separately; see docs/content-open-questions.md.",
    defaultColumns: ["filename", "medium", "credit", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  upload: {
    // Payload's own resizing is deliberately off: the site's renditions come
    // from the media pipeline so that fit detection and content addressing
    // stay in one place.
    disableLocalStorage: true,
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description:
          "Only for images that carry meaning on their own. Decorative or purely illustrative images can be left blank.",
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description:
          "Set in the practice's own voice, e.g. 'The suite as one plan'. Printed in caps beneath the image.",
      },
    },
    {
      name: "medium",
      type: "select",
      defaultValue: "IMAGE",
      options: [
        { label: "Photograph", value: "PHOTOGRAPH" },
        { label: "Drawing", value: "DRAWING" },
        { label: "Model", value: "MODEL" },
        { label: "Visualisation", value: "VISUALISATION" },
        { label: "Not yet established", value: "IMAGE" },
      ],
      admin: {
        description:
          "Declared beneath every image. 'Not yet established' prints nothing rather than a meaningless label.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Photographer or author, if known." },
    },
    {
      name: "fit",
      type: "select",
      defaultValue: "cover",
      options: [
        { label: "May be cropped (photograph)", value: "cover" },
        { label: "Never crop (drawing or plan)", value: "contain" },
      ],
      admin: {
        description:
          "Cropping a photograph is art direction; cropping a plan destroys what it exists to show.",
      },
    },
    // Written by the media pipeline. Kept on the record so the site can build
    // its srcset without re-deriving anything at request time.
    {
      name: "derivative",
      type: "group",
      admin: {
        readOnly: true,
        description: "Filled in by the media pipeline.",
      },
      fields: [
        { name: "src", type: "text" },
        { name: "width", type: "number" },
        { name: "height", type: "number" },
      ],
    },
  ],
};
