# Content: open questions for the practice

The site is built from the practice's own words and photographs. Where the
archive did not carry a fact, the site declares the gap rather than inventing
one. This is the confirmation list.

## Facts to confirm

**Years.** Board 04 marked every year provisional and the index carries that
disclaimer on the page. The years currently shown are the design phase's
best-guess chronology. Seven projects have no year at all (`—`): Chamber, Folly,
Kew Tree House, Goat Hill House, Culford Mews, Hackney Road, Social House.

**Status.** Built and unbuilt is always declared, so any wrong status is a
credibility problem rather than a cosmetic one. Two are currently published as
`STATUS TO CONFIRM` because the project text reads as a proposal while the
design board listed them as built:

| Project | Published status | Why it needs confirming |
|---|---|---|
| Campden House | STATUS TO CONFIRM | Text describes the scheme in the present tense; imagery is largely model photography |
| Pennard House | STATUS TO CONFIRM | Text is written as "the proposals", suggesting design stage |
| Archway Road | PROPOSAL | Text says "the proposals add an additional floor" |

**Places corrected against the archive.** The design board's index had several
places and types that the practice's own project texts contradict. The site
follows the texts. Please confirm:

- Goat Hill House: published as Hastings, East Sussex (board said Somerset; the
  text says "overlooking Hastings")
- Campden House: published as Castle Cary, Somerset (board said Kensington W8;
  the text says "the edge of Castle Cary")
- The Victualler: published as Wapping E1W, Sourced as Old Street EC1 (the board
  had these two swapped)
- Park Village: published as a studio and events venue (board said house)
- Willow Tree: published as a public sculpture, competition win (board said house)
- Oval Road: published as a house extension (board said studio campus)

**Credits.** Only the photographer is known, and only for nine projects
(Lyndon Douglas, Emma Lewis, Travis Levius, Sebastian Tiew). Contractor, joiner
and structural engineer are named nowhere in the archive; the case-study credits
line says so rather than inventing names.

**Captions and declared media.** Every image is captioned with its medium, but
the medium is currently inferred from filenames, so it is confidently correct
only for drawings, models and the photographed projects. Images that could not
be classified show no medium line rather than a meaningless one. Per-image
captions in the practice's own voice would be the single biggest content
improvement available: the writing on the existing site proves the author can
do it well.

**Cape Town.** ✅ Confirmed 15 August 2026: 10 Kelvin Street, Gardens. Published
without a postal code, since none was given; add one if the practice wants post
sent there. How the two cities should be described relative to each other, a
second office or a second base, is still open.

**Practice name.** The site uses "Edward McCann Architecture" throughout. The
legacy site used five variants (Architecture, Architects, Architectural
Practice, Ed McCann, Mccann) and the domain says "studio".

## Image resolution: what to ask the practice for

The site is currently built from the imagery the old website published, which
was sized for a 945px column in 2018. That is the ceiling, and it is the one
thing no amount of work here can fix.

Measured across all 27 projects, taking the largest version of each cover that
exists anywhere (the legacy site or the design handoff):

| Available cover width | Projects |
|---|---|
| at least 1440px | 26 of 27 |
| at least 1920px | 4 of 27 |
| at least 2880px | none |

A full-bleed hero spans the viewport, so at the 21:9.5 crop it needs:

| Display | Pixels needed |
|---|---|
| Laptop, 1440 CSS px, standard density | 1440 x 651 |
| Desktop, 1920 CSS px, standard density | 1920 x 869 |
| Laptop, 1440 CSS px, retina (2x) | 2880 x 1303 |

So the heroes are adequate on a standard laptop, thin on a large desktop, and
soft on any retina screen, which is most of them.

**The ask:** original files from the photographers, uncropped, sRGB, longest
edge 3000px or more. Prioritise the projects that lead the site: Firs Avenue,
The Victualler, West Suffolk, Highpoint and Latimer Road. The credited
photographers are Lyndon Douglas (five projects), Travis Levius (three),
Emma Lewis and Sebastian Tiew (one each); seventeen projects have no credited
photographer, so their source may only exist with the practice.

Nothing needs to change in the build when better files arrive: drop them in and
re-run `npm run media:publish`.

## Editorial repairs already applied

Recorded here so nobody re-discovers them as bugs. Both are in
`tools/build-text.mjs`:

- **Chatsworth Road** shipped a lorem ipsum placeholder as its body text on the
  live site. The real description survived only in that page's meta
  description, which is what the site now uses.
- **Rylett Crescent** ended mid-word ("...Josef Albers square compositio"). The
  finished sentence was recovered from the same page's meta description.

Photographer credits that appeared as trailing "Photos. Name" paragraphs have
moved into the facts layer, where they are structured data.
