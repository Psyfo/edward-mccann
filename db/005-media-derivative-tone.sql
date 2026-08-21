-- Adds media.derivative_tone.
--
-- The entry splash draws its mark in one flat colour, ink or paper, chosen per
-- photograph so it stays readable: a black mark disappears against the darker
-- parts of some of the practice's own photographs. This is where that choice
-- is recorded, alongside the other derivative fields the media pipeline fills
-- in.
--
-- Shape matches the existing derivative_src / derivative_width /
-- derivative_height columns: a group field is flat prefixed columns on the
-- same table, confirmed against those three before writing this.
--
-- Safe to run twice.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_media_derivative_tone') THEN
    CREATE TYPE "public"."enum_media_derivative_tone" AS ENUM('light', 'dark');
  END IF;
END
$$;

ALTER TABLE "media"
  ADD COLUMN IF NOT EXISTS "derivative_tone" "public"."enum_media_derivative_tone";
