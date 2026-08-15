import { APIError, type CollectionConfig, type PayloadRequest } from "payload";

/**
 * Two roles, drawn where the damage is actually irreversible.
 *
 * Content is not the sensitive thing here: the published site builds from the
 * JSON snapshot committed to the repo, so a deleted project is a git revert
 * away and never reaches visitors on its own. Accounts are the sensitive
 * thing. Someone who can mint administrators can lock the owner out of their
 * own site, and no amount of version control undoes that. So editors get the
 * whole archive and none of the account management.
 */
type Role = "owner" | "editor";

/**
 * Fails closed. A record with no role, whether written before roles existed or
 * by some future script, is an editor. Absence must never read as authority.
 */
function isOwner(user: unknown): boolean {
  return (user as { role?: Role } | null | undefined)?.role === "owner";
}

/**
 * Refuses to leave the site with nobody who can manage accounts. Demoting or
 * deleting the last owner is the one mistake in here that cannot be undone
 * from inside the admin, since no remaining user could grant the role back.
 */
async function requireAnotherOwner(req: PayloadRequest, excluding: string | number) {
  const { totalDocs } = await req.payload.count({
    collection: "users",
    where: {
      and: [{ role: { equals: "owner" } }, { id: { not_equals: excluding } }],
    },
    req,
  });

  if (totalDocs === 0) {
    throw new APIError(
      "This is the only owner. Make someone else an owner first, otherwise no one would be able to manage accounts.",
      400,
    );
  }
}

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    description: "Who can sign in and edit the archive.",
    defaultColumns: ["email", "name", "role", "updatedAt"],
  },
  access: {
    // Only owners manage accounts. Editors can still see and update their own
    // record, so they can change their name or password without help.
    create: ({ req }) => isOwner(req.user),
    delete: ({ req }) => isOwner(req.user),
    read: ({ req }) =>
      isOwner(req.user) || (req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) =>
      isOwner(req.user) || (req.user ? { id: { equals: req.user.id } } : false),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // The very first account is always an owner. Payload creates it with
        // access control bypassed, so without this it would take the editor
        // default and no one could ever promote it.
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", req });
          if (totalDocs === 0) data.role = "owner";
        }

        if (operation === "update" && originalDoc?.role === "owner" && data.role === "editor") {
          await requireAnotherOwner(req, originalDoc.id);
        }

        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc = await req.payload.findByID({ collection: "users", id, req });
        if (doc?.role === "owner") await requireAnotherOwner(req, id);
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      options: [
        { label: "Owner", value: "owner" },
        { label: "Editor", value: "editor" },
      ],
      // Without this an editor could simply promote themselves on their own
      // record, since they are allowed to update it.
      access: {
        create: ({ req }) => isOwner(req.user),
        update: ({ req }) => isOwner(req.user),
      },
      admin: {
        description:
          "Editors can change everything in the archive. Owners can also add, remove and change accounts.",
      },
    },
  ],
};
