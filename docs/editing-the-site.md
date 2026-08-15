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

## Accounts and roles

There are two roles.

**Owner** can do everything, including adding, removing and changing accounts.
**Editor** can do everything to the archive itself (projects, images, the
practice and studio pages) but cannot touch accounts at all.

The line sits there on purpose. Content is not the dangerous thing to lose: the
published site is built from the JSON snapshot committed to the repo, so a
deleted project is a git revert away and never disappears from the live site on
its own. Accounts are the dangerous thing. Anyone who can create administrators
can lock the owner out, and no amount of version control undoes that.

Two accounts exist:

- The **owner**, held by whoever runs the site. The first account ever created
  is always an owner; Payload creates it with access checks bypassed, so the
  collection forces the role rather than trusting the default.
- **agent@edwardmccann.invalid**, an **editor**, kept as a standing account so
  future edits and reviews need no account created and torn down each time, and
  nobody has to handle a password to make them. Its credentials live in Doppler
  as `PAYLOAD_AGENT_EMAIL` and `PAYLOAD_AGENT_PASSWORD`, never on disk.

To sign that account in and get a session token:

```bash
doppler run --project edward-mccann --config stg -- node tools/admin-session.mjs
```

Then set it on the admin origin: `document.cookie = "payload-token=<token>; path=/"`.

Its address uses the reserved `.invalid` domain deliberately: it can never
receive mail, so the account cannot be recovered by email. The password in
Doppler is the only way in, which is the intended trade for a credential nothing
should be emailing. To rotate it, re-run the account setup, which updates
Doppler in the same step.

Two things the Users collection refuses to let you do, because neither can be
undone from inside the admin afterwards:

- An editor cannot give itself the owner role, even though it is allowed to
  edit its own account in every other respect.
- The last remaining owner cannot be demoted or deleted. Make someone else an
  owner first.

To confirm all of that is actually enforced on a deployment rather than merely
written down:

```bash
doppler run --project edward-mccann --config stg -- node tools/verify-roles.mjs
```

## Enquiries

Messages sent from the contact form appear under **Enquiries** in the admin,
newest first. What the sender wrote is read only: an enquiry is a record of
what somebody actually said, and being able to edit it in place would quietly
destroy that. The one field that moves is **Status**, which is the practice's
own note to itself, new to replied to closed.

The form asks where the site is and what kind of work it is, so an enquiry
arrives with enough in it to judge without a round trip.

**Email notification is scaffolded but not switched on.** The enquiry is always
stored first, and a notification is attempted afterwards only if three values
are set in Doppler: `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO` and
`ENQUIRY_NOTIFY_FROM`. They exist as empty placeholders in all three configs.
Until they are filled, enquiries arrive silently in the admin and nothing is
emailed. Sending also needs a verified sender domain, so it cannot be finished
until the domain transfers.

That order is deliberate. If the email provider is down, the enquiry is already
in the database and only the notification is lost.

**Spam.** A hidden field no person can reach catches most of it, and one
address may send five messages an hour. A submission that trips either is
answered with the same confirmation a person sees, because telling a script it
failed only teaches it what to change. If real spam ever gets through, the next
step is a challenge at the network edge rather than more rules here.

**Deleting an enquiry** removes it permanently. Anyone who signs in can do it,
which is what makes an erasure request straightforward to honour.

## Checks worth running

```bash
npm run check                            # typecheck, lint, build
node tools/verify-media.mjs              # every referenced image really exists
node tools/smoke.mjs <url>               # every route serves the right page
```
