# Design Intelligence & Creative Direction Handoff

For the creative/design model. Self-sufficient synthesis; deep evidence lives in the sibling files (see `README.md` for reading order). Audit date: 2026-08-14, of the live site https://edwardmccann.studio/.

## Project Context

Edward McCann Architecture: an RIBA Chartered, ARB registered architecture practice based in Hackney, East London, with a second address in Cape Town. Portfolio of 27 published projects: London residential remodels/extensions (several award-recognised), country houses (Somerset, Suffolk, Dorset, Sussex), hospitality fit-outs (Soho, Wapping, Old Street), a photography studio campus, public art (a competition-winning sculpture), furniture, and competition work. Principal's background: Cambridge, Architectural Association, Edinburgh; previously Adjaye Associates, Edward Cullinan Architects, SCABAL. Recognition: NLA Don't Move Improve 2017 + Featured 2019 + Longlisted 2022, Grand Designs TV (2019) and Magazine, public-art competition win. The current website is a 2018 concrete5 build, structurally untouched since ~2022, being replaced entirely (Next.js rebuild planned). This project is a full brand identity + digital experience creation, not a reskin.

## What Exists

- A typeset all-caps wordmark (futura-pt): EDWARD McCANN ARCHITECTURE. No logo artwork; a cropped, abandoned "EM" stencil monogram survives only as the favicon.
- adobe-garamond-pro (roman + italic, 400 only) for every other character on the site; italic doubles as nav-active state and title voice.
- Warm-white ground `#F7F7F7`, black ink, no brand colour; the loudest colour on the site is another organisation's red award badge, composited into thumbnails.
- Flat IA: home = 27-card project grid; About; Press (3 entries, frozen 2019); Contact. No footer, no CTA, no filtering, no project facts, no captions, no forms, no socials.
- ~470 images: strong recent professional photography (Lyndon Douglas, Emma Lewis, Travis Levius, Sebastian Tiew) mixed uncurated with CAD axons, model shots and dated record photography.
- Genuinely literate project texts (references: Sverre Fehn, Josef Albers, Lubetkin, Eames) and a client-first About with the phrase **"nose to tail design"**.
- Full scrape of everything in `../../site-archive/`; 86 screenshots + measured style probes in this folder.

## What Works

1. The writing: precise, material-literate, warm, hype-free. Best-in-category raw material.
2. Recent photography: brand-grade, comparable to the strongest peer sites.
3. The taste-instincts: work-first entry, monochrome restraint, serif voice + geometric caps duality, severity (no radius, no shadows, 1px rules).
4. Credit culture: photographers, colleagues, collaborators named.
5. Shallow, honest IA (nothing over two levels deep).

## What Does Not Work

1. No system: accidental type scale, one weight sitewide, justified 120-character lines, two clashing layout systems, column counts lurching 2/4/2/3/4 across breakpoints with a 1s width animation (off-by-one bug at exactly 768px).
2. No hierarchy of work: the DMI-featured house and a decade-old pop-up carry identical cards; renders and buildings indistinguishable; no year/location/status/type anywhere.
3. Image handling: hand-letterboxed badge-stamped PNG thumbnails (13.8 MB homepage), uncaptioned 20-30-image dumps in a 945px column, no full-bleed moments, intermittent cross-host image failures.
4. Dead ends everywhere: no CTA, no footer, prev/next buried mid-page, contact page is a bare address block.
5. Trust erosion: lorem ipsum live on Chatsworth Rd, truncated text on Rylett Crescent, "Dont" typos, five practice-name variants, press frozen while newer accolades exist as pixels in thumbnails, dead UA analytics.
6. Legacy stack: EOL PHP/CMS, Bootstrap 3, Font Awesome 3, no OG/SEO/structured data, www/non-www duplication, insecure 404 redirect.

## Current Brand Perception

To a first-time visitor: a small, probably dormant London practice that does house extensions; tasteful photographs; effortful to evaluate; no idea of level, status or breadth. To a careful reader: obviously talented, oddly self-effacing, digitally neglected.

## Desired Brand Perception

A literate, materially serious studio operating across houses, hospitality, objects and public work in London and beyond; confident, warm, precise; the kind of practice whose archive you browse like a publication and whose process you can imagine joining as a client. Premium through depth and discipline, never through luxury vocabulary.

## Audience

1. **Primary**: private residential clients (London extensions/remodels through country houses), typically commissioning once in a lifetime; they need proof of delivery, empathy and process clarity.
2. Hospitality/commercial operators (wine bars, restaurants, studios).
3. Press/awards juries and peers.
4. Collaborators and future staff.
5. (Client to confirm) South African market via Cape Town presence.

## Positioning

"Nose to tail design": one sensibility carried from first concept to built detail, across a deliberately broad portfolio (houses, places to eat and drink, objects, public work). East London roots, national reach, Cape Town axis. Pedigree (Cambridge/AA; Adjaye, Cullinan) as quiet substantiation, not headline. Against a category of interchangeable "considered/crafted" minimalism, McCann differentiates by *actually publishing depth*: captions, drawings, process, facts.

## Content Strategy

- Edit, don't rewrite: preserve the 19 strong project texts nearly verbatim; commission the 8 missing in the same voice; fix the defect log (`copy-inventory.md`).
- Introduce a facts layer for all 27 projects: year, place, status (built/in progress/planning/competition/concept), typology, team, photographer.
- Caption every image; declare media (photograph / visualisation / model / drawing).
- Rebuild About as Practice: statement, portrait+studio imagery (to be commissioned), structured credentials, people, collaborators, the two cities.
- Recognition as a living index (2017 → 2022 and onward), never raster badges.
- Journal only if the practice commits to feeding it.

## UX Direction

- Two-tier archive: curated Selected set leading; complete filterable Index (by type, place, year, status) beneath: 27 projects presented as editorial discipline.
- Case-study anatomy: opening image earned full-bleed → facts block → essay → captioned sequence (with drawings) → recognition → credits → next project. No dead ends; every page ends with a path.
- A real conversion layer: framed enquiry (what commissioning looks like, project types taken), persistent contact affordance, footer on every page.
- Preserve: shallow IA, work-first entry, reading calm. Target WCAG 2.2 AA from scratch.

## Visual Direction

Evolve, don't replace, the observed DNA: warm paper ground, black ink, geometric-caps structural voice against a humanist reading voice, severe minimal chrome (0 radius, no shadows, hairline rules), photography as the only chroma. Add the missing system: modular scale, real grid, art-directed imagery, brand-controlled recognition graphics. Purge every framework artefact (Bootstrap blue, FA glyphs, badge rasters).

## Photography Direction

Sequence as narrative (context → move → inhabitation → detail → drawing/model evidence); one art-directed cover per project; scale contrast with earned full-bleed moments; declared media labels; per-set colour management; commission portrait/studio imagery and re-edits of the 2-3 dated sets; credits as structured data. Masters up to ~2500-3600px are preserved in the archive; larger originals may need re-sourcing from photographers.

## Typography Direction

Either (a) recommit to the serif+geometric duality with contemporary cuts and full equipment (weights, small caps, tracked caps, ragged-right, ~70ch measures), or (b) a deliberate replacement pairing with equivalent character. Do not default into the category's single-grotesque monoculture; the old-new duality mirrors the practice's actual architecture. One italic meaning only. Numerals/metadata become a designed layer (facts blocks, index). Resolve the wordmark's "Mc" and tracking professionally. Licensing must move to client-controlled accounts (current Typekit kit belongs to an unknown account).

## Colour Direction

Authored neutrals: tuned paper + ink (current #F7F7F7/#000 is the validated starting hypothesis); defined surface/border steps; accent only if material-derived (charred timber, rammed earth, oxide, brick) and used sparingly; third-party colour banished from brand surfaces; AA floors everywhere. Note: no strong comparator occupies a dark ground; a dark or dark-capable treatment is genuinely available (cost: colour-managed photography).

## Layout / Grid Direction

One grid system spanning archive and essay: a fixed vertical rhythm unit; reading measures capped ~70ch ragged-right; full-bleed capability as an earned exception; index/table layouts as first-class designed components; whitespace rhythmic rather than uniform.

## Motion Direction

Few, meaningful: a 3-4 token system (state ~150-200ms, reveal ~300-400ms, navigation ~400-600ms, one easing family, reduced-motion honoured). Editorial pacing on galleries; a considered end-of-story handoff between projects; no layout animation, no parallax theatrics, no carousels-with-counters. Server-rendered speed is part of the brand (several admired peers are JS-fragile; being fast and crawlable is a differentiator).

## Responsive Principles

Mobile-first; at most two intentional archive layouts across the range; test 768/1024 exactly (the old site's worst bug lives at 768px); header chrome ≤ ~80px on mobile with reachable menu; opaque or blurred overlay if an overlay menu survives; real responsive images (srcset, modern formats, art-directed crops); fluid type within fixed measure caps.

## Preserve

Voice + best texts; "nose to tail design"; recent photography; work-first entry; warm monochrome severity; serif/caps duality as DNA; credit culture; shallow IA. (Full matrix: `opportunities.md`.)

## Refine

Linear case-study concept; grid-led home (add curation + metadata); About substance; wordmark instinct; recognition concept; adjacency navigation; overlay menu mechanics.

## Replace

Stack; justified text walls; uncaptioned dumps; badge-stamped thumbnails; lurching grid CSS; FA iconography; unknown-account font licensing; image-erasing hover.

## Introduce

Facts/metadata layer; conversion pathway; OG/SEO/structured data/redirects; Selected+Index archive; sector framing; people & studio layer; recognition data; (optional, commitment-gated) journal; (optional) dark-capable mode.

## Remove

Content defects (lorem ipsum, truncation, typos, entities); third-party branding in photography; name drift (one name everywhere); framework colour/icon debt; URL multiplicity; insecure 404 redirect; "View Project" labels; dead analytics.

## Creative Territories

A: **The Working Catalogue** (numbered archive rigour; AJP/31/44 lineage). B: **Nose to Tail / The Studio Notebook** (concept-to-construction editorial storytelling; Tuckey depth + McW brand-argument, on McCann's own phrase). C: **The Quiet Monograph** (authored, image-led, Smalley lineage). Full definitions with risk profiles: `recommended-design-direction.md`.

## Recommended Territory

**B, "Nose to Tail", carrying A's two-tier index as its archive layer.** It is the only territory whose materials are already verified in the audit (phrase, texts, sequencable imagery, mixed typologies needing a frame), it amplifies the observed DNA instead of replacing it, and it occupies the emptiest credible space in the comparator set (editorial depth: captions, drawings, process). C is the future evolution if publishing appetite proves real; it is premature today (press has been frozen since 2019).

## Design Risks

Over-correction into generic grotesque minimalism (the saturated category default); serif warmth drifting twee without a strict grid; badge nostalgia returning third-party rasters; journal without commitment; motion for its own sake; full-bleed ambitions exceeding preserved image resolution. (Full register: `risks-and-constraints.md`.)

## Technical Constraints

Greenfield rebuild (Next.js planned); nothing from the old stack survives except 31 URLs needing 301s (map in `page-inventory.md` + `../../site-archive/manifest.json`). Fonts must be re-licensed under client control. GA4 property exists (ownership unresolved). Image masters capped at preserved resolutions pending photographer re-sourcing. Email `info@edwardmccann.studio` must survive migration. No integrations, no cookie debt, no forms to migrate.

## Open Questions (for the client, non-blocking for territory work)

1. Practice name: Architecture / Architects / Studio? (Domain says `.studio`.)
2. Cape Town: active office? How should the two cities be told?
3. Status of each unbuilt/planning project today (Goat Hill, Culford Mews, Hackney Road, Social House, Kew, Chamber, Folly)?
4. Will the practice feed a journal? (Gates that section's existence.)
5. Are original full-res photo files retrievable from the four photographers?
6. Any projects to retire from the archive entirely?
7. Instagram or other channels to integrate, or deliberate absence?

## Non-Negotiables

1. The written voice survives.
2. Photography is presented at the scale it deserves, captioned, without third-party badges inside images.
3. Every project publishes facts (place, year, status, type, credits); built vs unbuilt is always honest.
4. WCAG 2.2 AA, fast server-rendered delivery, real responsive images.
5. One practice name, one canonical host, working redirects for all 31 legacy URLs.
6. Recognition is current (through DMI 2022 / Grand Designs) and stays maintainable.
7. Every journey ends with a path (no dead ends); contact is always one obvious step away.
8. No design decision may depend on the previous developer's accounts (fonts, analytics, hosting).
