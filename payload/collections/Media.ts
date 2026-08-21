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
    // Filenames here are content hashes inherited from the legacy CMS, so the
    // library was unreadable when it listed them. Every record carries a
    // human name instead, and the filename is still available as a column.
    useAsTitle: "title",
    description:
      "Uploaded originals. The published derivatives are generated separately; see docs/content-open-questions.md.",
    defaultColumns: ["title", "medium", "credit", "filename", "updatedAt"],
    listSearchableFields: ["title", "caption", "credit", "filename"],
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Never let a record sit in the library nameless. An upload with no
        // title falls back to its filename, which is at least something to
        // search for until someone names it properly.
        if (data && !data.title && data.filename) {
          data.title = String(data.filename).replace(/\.[a-z0-9]+$/i, "");
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      index: true,
      admin: {
        description:
          "How this image is listed, e.g. \"Latimer Road, fig. 03\". Not shown on the site.",
      },
    },
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
        {
          name: "tone",
          type: "select",
          options: [
            { label: "Light (a dark mark reads well on it)", value: "light" },
            { label: "Dark (a light mark reads well on it)", value: "dark" },
          ],
          admin: {
            description:
              "Only used by the splash: which single flat colour the mark should be over this photograph. Sampled from the centre of the image, where the mark sits.",
          },
        },
      ],
    },
  ],
};
