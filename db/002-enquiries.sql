-- Creates the enquiries table.
--
-- Unlike 001, this was not hand-authored. Creating a new table is purely
-- additive, so Payload's development push was allowed to make it, and this
-- file is a transcription of exactly what it produced, captured from the
-- database afterwards. That keeps a reproducible record for the production
-- database, which will not push.
--
-- Verified at the time of writing: the push added these ten columns and
-- altered nothing else, checked by diffing every column in the schema before
-- and after.
--
-- Every statement is safe to run twice.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_enquiries_work') THEN
    CREATE TYPE "public"."enum_enquiries_work" AS ENUM('houses', 'eat-drink', 'objects', 'public', 'other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_enquiries_status') THEN
    CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'replied', 'closed');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "enquiries" (
  "id"         serial PRIMARY KEY NOT NULL,
  "name"       varchar NOT NULL,
  "email"      varchar NOT NULL,
  "location"   varchar,
  "work"       "public"."enum_enquiries_work",
  "message"    varchar NOT NULL,
  "status"     "public"."enum_enquiries_status" DEFAULT 'new',
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "enquiries_updated_at_idx" ON "enquiries" ("updated_at");
CREATE INDEX IF NOT EXISTS "enquiries_created_at_idx" ON "enquiries" ("created_at");

-- Payload's document locking references every collection.
ALTER TABLE "payload_locked_documents_rels"
  ADD COLUMN IF NOT EXISTS "enquiries_id" integer;

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enquiries_id_idx"
  ON "payload_locked_documents_rels" ("enquiries_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_enquiries_fk'
  ) THEN
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk"
      FOREIGN KEY ("enquiries_id") REFERENCES "enquiries"("id") ON DELETE CASCADE;
  END IF;
END
$$;
