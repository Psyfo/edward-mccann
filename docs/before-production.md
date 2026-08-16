# Before production

Things that are fine for staging and not fine for a live site. Written down as
they are found, so the cutover is a checklist rather than an archaeology
exercise. Content questions for the practice live in
[content-open-questions.md](./content-open-questions.md); this file is
infrastructure.

## One database serves all three environments

`DATABASE_URL` is currently the same Neon database in the `dev`, `stg` and `prd`
Doppler configs. That is convenient now, when staging is the only deployment and
its content is the content. It stops being acceptable the moment the site is
live, because a careless local script would then be writing to production.

Provision a second database, point `prd` at it, and copy the archive across with
`npm run content:export` plus a seed run rather than a raw dump, so the import
goes through Payload's own validation.

## The schema was built by development push, not migrations

Payload's postgres adapter pushes schema changes automatically outside
production, which is how every table here came to exist. There is therefore no
migration history to extend, and a production deployment will not push, so
schema changes need another route.

The interim arrangement is `db/*.sql`: hand-written, idempotent, applied with
`tools/db-apply.mjs` and reviewed like any other change. It exists so that the
changes made outside push are at least written down and repeatable. It is not a
migration framework and should not grow into one.

Adopting Payload migrations properly means generating a baseline that matches
the current database, recording it as already applied, and adding
`payload migrate` to the deploy. Worth doing before there is a production
database to get wrong, and it is a job of its own rather than something to
attach to an unrelated change.

## Search: built for launch day, switched off until then

Everything search engines read is in place and can be inspected now: canonical
addresses and Open Graph on every page, a share card for each one, per-project
cards using the project's own cover, a sitemap covering all 32 addresses, and
structured data describing the practice (with both addresses), each project as a
work it created, and where each page sits.

Nothing is asserted in that data which is not also visible on the page. No
founding date, no social profiles the practice does not have, no ratings, and no
project year unless it is a plain four-digit year, because the years are still
marked provisional.

**The site currently forbids indexing**, deliberately, so the staging address
never reaches search results. That is a single switch, and it fails safe: a
deployment that sets nothing stays hidden.

On the day the domain moves:

1. Set `NEXT_PUBLIC_SITE_URL` to `https://edwardmccann.studio` and
   `NEXT_PUBLIC_ALLOW_INDEXING` to `true`, then redeploy. Verified: with those
   set the build emits `Allow: /` and a sitemap on the real domain.
2. Check `https://edwardmccann.studio/robots.txt` says `Allow: /`, and that a
   page's canonical points at the real domain rather than the staging one.
3. Submit the sitemap in Google Search Console, and confirm the legacy addresses
   still resolve, since the old site's URLs were deliberately preserved.
4. Re-run `node tools/smoke.mjs https://edwardmccann.studio`.

Until step 1 happens, Lighthouse will score SEO poorly on staging and should:
it is reporting the indexing block, which is working as intended.

## Roles exist but there is only one owner

See [editing-the-site.md](./editing-the-site.md). The collection refuses to let
the last owner be demoted or deleted, so a second owner is worth creating before
the first one is ever at risk of being lost.
