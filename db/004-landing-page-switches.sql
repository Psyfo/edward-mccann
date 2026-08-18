-- Adds the landing page switches and the splash images to studio_details.
--
-- The practice asked for the positioning statement and the per-project facts to
-- come off the landing page. They are switched off rather than deleted, so
-- turning them back on is the practice's decision in the admin rather than a
-- developer's job, and the copy itself stays where it is.
--
-- Column naming follows what Payload's postgres adapter generates and was
-- checked against the existing schema: a group flattens to prefixed snake_case
-- (as media.derivative_src does), and an upload becomes an integer foreign key
-- with ON DELETE SET NULL (as projects_figures.image_id does). Deleting a photo
-- must empty the splash, not delete the studio details.
--
-- Safe to run twice.

ALTER TABLE "studio_details"
  ADD COLUMN IF NOT EXISTS "homepage_show_statement"     boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "homepage_show_project_facts" boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "homepage_show_sector_filter" boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS "homepage_splash_enabled"     boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS "homepage_splash_image_id"        integer,
  ADD COLUMN IF NOT EXISTS "homepage_splash_image_mobile_id" integer;

-- The single existing row predates these columns, so it holds nulls. Null and
-- false read the same to the site, but an explicit value is what the admin
-- shows as an unticked box rather than an empty one.
UPDATE "studio_details" SET
  "homepage_show_statement"     = COALESCE("homepage_show_statement", false),
  "homepage_show_project_facts" = COALESCE("homepage_show_project_facts", false),
  "homepage_show_sector_filter" = COALESCE("homepage_show_sector_filter", true),
  "homepage_splash_enabled"     = COALESCE("homepage_splash_enabled", true);

CREATE INDEX IF NOT EXISTS "studio_details_homepage_splash_image_idx"
  ON "studio_details" ("homepage_splash_image_id");
CREATE INDEX IF NOT EXISTS "studio_details_homepage_splash_image_mobile_idx"
  ON "studio_details" ("homepage_splash_image_mobile_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_details_homepage_splash_image_id_media_id_fk') THEN
    ALTER TABLE "studio_details"
      ADD CONSTRAINT "studio_details_homepage_splash_image_id_media_id_fk"
      FOREIGN KEY ("homepage_splash_image_id") REFERENCES "media"("id") ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_details_homepage_splash_image_mobile_id_media_id_fk') THEN
    ALTER TABLE "studio_details"
      ADD CONSTRAINT "studio_details_homepage_splash_image_mobile_id_media_id_fk"
      FOREIGN KEY ("homepage_splash_image_mobile_id") REFERENCES "media"("id") ON DELETE SET NULL;
  END IF;
END
$$;
