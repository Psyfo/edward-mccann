-- Adds practice_page_paragraphs.heading.
--
-- The practice page carries a "Process" heading partway down its essay. The
-- global had no way to express that, so wiring the page to it would have
-- silently flattened the page into one run of text. An optional heading on each
-- paragraph lets an editor start a new section without a developer.
--
-- Recorded here for the production database. Note that Payload's development
-- push did apply this column, but then hung: it holds the connection open
-- waiting on a decision it cannot ask for without a terminal. Additive or not,
-- that is why schema changes here are written out and applied deliberately.
--
-- Safe to run twice.

ALTER TABLE "practice_page_paragraphs"
  ADD COLUMN IF NOT EXISTS "heading" varchar;
