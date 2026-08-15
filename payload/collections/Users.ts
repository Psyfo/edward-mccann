import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    description: "Who can sign in and edit the archive.",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
