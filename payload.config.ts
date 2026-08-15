import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";

import { Media } from "./payload/collections/Media";
import { Projects } from "./payload/collections/Projects";
import { Users } from "./payload/collections/Users";
import { PracticePage } from "./payload/globals/PracticePage";
import { StudioDetails } from "./payload/globals/StudioDetails";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Edward McCann Architecture",
    },
    components: {
      graphics: {
        Logo: "@/payload/components/Logo",
        Icon: "@/payload/components/Icon",
      },
    },
  },

  collections: [Projects, Media, Users],
  globals: [PracticePage, StudioDetails],

  // No rich text anywhere by design: the essay has one voice and no inline
  // formatting, so body copy is plain textareas. Dropping the editor also
  // avoids the CLI's inability to require an ESM module with top-level await.
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? "" },
  }),

  plugins: [
    // Uploads go to the same Backblaze bucket the site already serves from,
    // under originals/, using the key that is scoped to that bucket alone.
    // Backblaze's S3 API needs path-style addressing.
    s3Storage({
      collections: {
        media: { prefix: "originals" },
      },
      bucket: process.env.B2_BUCKET_NAME ?? "",
      config: {
        endpoint: process.env.B2_S3_ENDPOINT,
        region: process.env.B2_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.B2_KEY_ID ?? "",
          secretAccessKey: process.env.B2_APPLICATION_KEY ?? "",
        },
      },
    }),
  ],

  sharp: undefined,
});
