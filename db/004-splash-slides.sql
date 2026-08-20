-- Turns the two single splash uploads into a list the practice can manage.
--
-- The landing overlay cycles through photographs, but only one pair was ever
-- editable: the rest were placed in code, which meant the admin was quietly
-- lying about what it controlled. This is the table behind the new array.
--
-- Shape copied from studio_details_addresses, which is the array Payload's
-- postgres adapter already built here: varchar id as the primary key, _order
-- for the drag handle, _parent_id cascading from the parent global, and an
-- upload relation stored as <field>_id referencing media.
--
-- The old homepage_splash_image_id / _mobile_id columns are deliberately left
-- in place. They still hold the practice's first pair, this migration copies
-- it into the new list as the first slide, and keeping them costs nothing
-- while making the change reversible.
--
-- Every statement is safe to run twice.

CREATE TABLE IF NOT EXISTS "studio_details_homepage_splash_slides" (
  "_order"      integer NOT NULL,
  "_parent_id"  integer NOT NULL,
  "id"          varchar PRIMARY KEY NOT NULL,
  "landscape_id" integer,
  "portrait_id"  integer
);

CREATE INDEX IF NOT EXISTS "studio_details_homepage_splash_slides_order_idx"
  ON "studio_details_homepage_splash_slides" ("_order");

CREATE INDEX IF NOT EXISTS "studio_details_homepage_splash_slides_parent_id_idx"
  ON "studio_details_homepage_splash_slides" ("_parent_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_details_homepage_splash_slides_parent_id_fk') THEN
    ALTER TABLE "studio_details_homepage_splash_slides"
      ADD CONSTRAINT "studio_details_homepage_splash_slides_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "studio_details"("id") ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_details_homepage_splash_slides_landscape_id_fk') THEN
    ALTER TABLE "studio_details_homepage_splash_slides"
      ADD CONSTRAINT "studio_details_homepage_splash_slides_landscape_id_fk"
      FOREIGN KEY ("landscape_id") REFERENCES "media"("id") ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_details_homepage_splash_slides_portrait_id_fk') THEN
    ALTER TABLE "studio_details_homepage_splash_slides"
      ADD CONSTRAINT "studio_details_homepage_splash_slides_portrait_id_fk"
      FOREIGN KEY ("portrait_id") REFERENCES "media"("id") ON DELETE SET NULL;
  END IF;
END
$$;

-- Carry the existing pair over as the first slide, so nothing has to be
-- re-chosen in the admin and the list is never empty on arrival.
INSERT INTO "studio_details_homepage_splash_slides" ("_order", "_parent_id", "id", "landscape_id", "portrait_id")
SELECT 1, s."id", 'migrated-first-pair', s."homepage_splash_image_id", s."homepage_splash_image_mobile_id"
FROM "studio_details" s
WHERE s."homepage_splash_image_id" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "studio_details_homepage_splash_slides");
