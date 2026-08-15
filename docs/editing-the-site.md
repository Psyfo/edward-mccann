# Editing the site

The archive is edited in Payload, at `/admin` on whichever deployment you are
using. Staging is <https://edward-mccann.lab.mahlangu.dev/admin>.

## How publishing works

Editing and publishing are separate steps, on purpose.

```text
Payload (/admin)  ->  npm run content:export  ->  commit  ->  deploy
   the database          content/*.json          reviewed      live
```

The site builds from the JSON snapshot in `content/`, not from the database.
That is a deliberate choice with two payoffs: the published site has **no
runtime dependency**, so if the database sleeps or fails only the admin is
affected and the public site carries on; and every content change arrives as a
**reviewable diff**, with the same history, blame and rollback as code.

The cost is that an edit is not live until it is exported and deployed. For a
practice that publishes a few times a year rather than continuously, that is the
right trade. It can be automated later with a publish button that triggers the
export and deploy.

## Adding or changing a project

1. Sign in at `/admin` and edit under **Projects**.
2. Figures are in order, and the first one is the cover: it appears on the
   homepage, in the archive and as the case-study hero.
3. Export, review and publish:

   ```bash
   npm run content:export
   git add content && git commit -m "content: ..." && git push
   ```

   The export refuses to run if the database returns no projects, or if any
   project has no usable imagery, so a broken export cannot empty the site.

## Adding images

Upload in the admin under **Media**, or directly on a project's figure. Payload
stores the original in the bucket under `originals/`.

**The site does not serve originals.** It serves renditions produced by the
media pipeline: AVIF and JPEG at three widths, content-addressed so they can be
cached forever. After uploading anything new, run:

```bash
npm run media:publish     # generate and upload the renditions
npm run content:export    # record them in the snapshot
```

Every image record has two fields worth understanding:

- **Fit.** Photographs may be cropped to fill a frame; drawings and plans must
  not be, because cropping them destroys what they exist to show. The pipeline
  guesses this from the image itself and is usually right, but it can be
  overridden per image.
- **Medium.** Printed beneath the image as a declaration. "Not yet established"
  prints nothing, which is deliberate: declaring "IMAGE" declares nothing.

## Page copy

The homepage statement, the contact page and the practice page copy live under
**Globals**, so they can be changed without a developer.

## What is not in the CMS

The four sectors (Houses, Places to eat and drink, Objects, Public work) and the
curated homepage selection are structural decisions from the approved design
rather than content, so they live in `content/facts.json`. Changing them is a
developer job, because the filter row, the archive and the project schema all
have to agree.

## Accounts

Two accounts exist:

- **omotola@mahlangu.dev**, the owner account.
- **agent@edwardmccann.invalid**, a standing account for automated and assisted
  work, so a future session can review or make edits without anyone handling a
  password. Its credentials live in Doppler as `PAYLOAD_AGENT_EMAIL` and
  `PAYLOAD_AGENT_PASSWORD`, never on disk.

To sign that account in and get a session token:

```bash
doppler run --project edward-mccann --config stg -- node tools/admin-session.mjs
```

Then set it on the admin origin: `document.cookie = "payload-token=<token>; path=/"`.

The address uses the reserved `.invalid` domain deliberately: it can never
receive mail, so the account cannot be recovered by email. The password in
Doppler is the only way in, which is the intended trade for a credential nothing
should be emailing.

**Both accounts are full administrators.** Payload has no roles configured here,
so either can edit content, delete it and manage users. If the standing account
should be able to edit content but not manage users, that is a small change to
the Users collection, worth making before the site is public.

To rotate the password, re-run the account setup, which updates Doppler in the
same step.

## Checks worth running

```bash
npm run check                            # typecheck, lint, build
node tools/verify-media.mjs              # every referenced image really exists
node tools/smoke.mjs <url>               # every route serves the right page
```
