-- Adds users.role.
--
-- Written out by hand rather than left to Payload's development schema push,
-- because this database holds the real archive and push resolves drift without
-- asking. The shape here is exactly what the postgres adapter generates for a
-- select field (a dedicated enum type, nullable column, SQL default matching
-- defaultValue), verified against the existing media.fit and media.medium
-- columns, so the next push finds nothing to change.
--
-- Every statement is safe to run twice.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
    CREATE TYPE "public"."enum_users_role" AS ENUM('owner', 'editor');
  END IF;
END
$$;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "role" "public"."enum_users_role" DEFAULT 'editor';

-- Accounts that predate the column are null. Null already reads as editor in
-- the access rules, since absence must never be mistaken for authority, but
-- leaving it implicit would show an empty column in the admin.
UPDATE "users" SET "role" = 'editor' WHERE "role" IS NULL;

-- The first account created is the owner. Identifying it by age rather than by
-- address keeps personal details out of a public repository, and it matches
-- how Payload treats the first user anyway.
UPDATE "users" SET "role" = 'owner'
WHERE "id" = (SELECT "id" FROM "users" ORDER BY "created_at" ASC LIMIT 1);
