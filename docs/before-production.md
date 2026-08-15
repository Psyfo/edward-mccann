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

## Roles exist but there is only one owner

See [editing-the-site.md](./editing-the-site.md). The collection refuses to let
the last owner be demoted or deleted, so a second owner is worth creating before
the first one is ever at risk of being lost.
