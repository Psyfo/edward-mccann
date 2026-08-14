# Executive Summary

*The 15-minute version of everything this audit found. Audited live at https://edwardmccann.studio/ on 2026-08-14; full evidence in the sibling files.*

## The practice, as the evidence shows it

Edward McCann Architecture is an RIBA Chartered, ARB registered practice based in Wilton Way, Hackney, with a second address in Cape Town that the site mentions exactly once, on the contact page. The published portfolio is 27 projects: London residential remodels and extensions (Hackney, Islington, Camden, Kensington, west London), country houses in Somerset, Suffolk, Dorset and Sussex, hospitality fit-outs (a Soho wine bar and restaurant, a Wapping wine shop, an Old Street pop-up), a Camden photography-studio campus, a competition-winning public sculpture, an art enclosure built with sculptor Mat Chivers, a table for a flat in Lubetkin's Grade I Highpoint II, and competition work for Kew.

The principal trained at Cambridge, the Architectural Association and Edinburgh, and worked at Adjaye Associates, Edward Cullinan Architects and SCABAL. The work has been recognised repeatedly: NLA Don't Move Improve 2017, Featured 2019, Longlisted 2022; Grand Designs television (West Suffolk, 2019) and Grand Designs Magazine (Latimer Road). Professional photography exists for the strongest projects (Lyndon Douglas, Emma Lewis, Travis Levius, Sebastian Tiew).

Almost none of the above is discoverable without effort. That is the finding.

## The website, in one paragraph

A 2018 concrete5 build (EOL PHP 7.2, Bootstrap 3, jQuery, Font Awesome 3) whose CSS was last touched in July 2022. The homepage is a flat grid of 27 hand-made PNG thumbnails (13.8 MB of images on one page), several with award badges photoshopped into the pixels. Project pages are a title, a justified 120-character-wide Garamond essay, and 20-30 uncaptioned images stacked in a 945px column with no facts, no lightbox, no captions and no ending. There is no footer, no CTA, no form, no social link, no Open Graph, no sitemap. Press stops in 2019 while newer accolades sit as pixels inside thumbnails. One project ships lorem ipsum as its body text; another's text ends mid-word; the practice's name appears in five different forms; analytics point at a property Google retired years ago. Some images intermittently fail to load because half the site links itself on the `www.` host and half without.

## What is actually good (and must survive)

Two assets are genuinely strong and one instinct is right:

1. **The writing.** Project descriptions are precise, material-literate and quietly referential (Sverre Fehn, Josef Albers, Lubetkin, the Eames Eiffel base) without a single "luxury" or "bespoke" anywhere. The About page contains an ownable philosophy phrase, "nose to tail design", and a client-first register ("It is the job of your architect to reveal these possibilities to you in advance") that almost no competitor can write.
2. **The recent photography.** The Douglas/Lewis/Levius/Tiew sets are brand-grade and would hold their own on any strong peer site. The site spends them at postage-stamp scale.
3. **The taste instincts.** Work-first entry, warm near-white ground, black ink, a geometric caps wordmark against a humanist serif, no decoration anywhere. The ingredients of a distinguished identity are present; what is absent is any system: one font weight sitewide, an accidental type scale, two clashing layout systems, and a card grid whose column count lurches 2/4/2/3/4 across breakpoints with a one-second animation (and a genuine off-by-one bug at exactly 768px: iPad portrait gets 128px thumbnails, smaller than phones).

## The core diagnosis

**The presentation contradicts the practice.** The evidence describes a pedigreed, literate, materially serious studio working across houses, hospitality, objects and public art in two countries. The website communicates a small, possibly dormant extensions practice that had a site built in 2018. Every differentiator (pedigree, breadth, recognition, dual cities, the philosophy phrase, the writing) exists on the site exactly once, buried, or not at all. The redesign brief is therefore not beautification and not reinvention: it is **repositioning through presentation**: build the system the existing taste deserves and surface the evidence that already exists.

## The category, and the opening

Research across strong comparators (McLaren Excell, Al-Jawad Pike, 31/44, William Smalley, Proctor & Shaw, Studio McW, Tuckey Design Studio; details in `competitive-positioning.md`) shows a converged formula: near-white minimalism, four-item nav, uniform grids, captionless galleries, "considered/crafted" prose. The genuinely admired sites each add one act of discipline: AJP's numbered index, 31/44's Selected/Catalogue split, Tuckey's captioned process-rich case studies, Smalley's authored monograph. The open territory for McCann is **editorial depth**: captions, drawings, facts and process, which the practice's existing writing and image archive can support immediately, plus a curated-Selected-over-complete-Index archive that makes 27 mixed projects read as discipline rather than thinness. Notably, no strong comparator occupies a dark ground; McCann's charred-timber material story makes that a real (optional) differentiator.

## Recommended direction (developed in `recommended-design-direction.md`)

Three territories were developed from evidence: **A. The Working Catalogue** (numbered-archive rigour), **B. Nose to Tail / The Studio Notebook** (concept-to-construction editorial storytelling on the practice's own phrase), **C. The Quiet Monograph** (authored, image-led). The recommendation is **B, carrying A's index as its archive layer**: it is the only territory whose raw materials are verified as already existing, it evolves rather than replaces the observed brand DNA, and it claims the emptiest credible space in the peer landscape. C stays on the shelf until the practice proves publishing appetite (its press page has been frozen since 2019, which is the honest counter-signal).

## What the design phase must resolve

The wordmark needs professional drawing (and the abandoned "EM" favicon monogram is a legitimate thread to explore); the practice name needs one form (Architecture vs Architects vs the domain's "studio"); the serif+geometric type DNA should be recommitted with real equipment or deliberately replaced, but not defaulted into the category's grotesque monoculture; neutrals need authoring; recognition needs a brand-controlled home so raster badges never return; and every template must end somewhere (the current site has no CTA, no footer and no conversion path at all).

## Hard constraints worth knowing now

Fonts are served from a Typekit kit on an unknown account (re-license or replace). Image masters top out at ~2500-3600px (full-bleed ambitions may need photographer re-sourcing). Eight projects have no text; zero have structured facts; several are unbuilt with unknown current status: a content sprint is part of this project. A GA4 property collects data under unresolved ownership. Thirty-one legacy URLs (times host/alias variants) need 301s. Everything else is greenfield: no integrations, no consent debt, nothing from the old stack worth keeping.

## Certainty statement

Everything above about the rendered site, its markup, CSS, assets, copy and behaviour is directly observed and archived in this repository (`../site-archive/`, `screenshots/`, `probes/`, `data/`). Statements about project status (built vs unbuilt), the Cape Town office, account ownerships and photographer licensing are flagged Unknown and listed as open questions in `design-handoff.md`. Nothing in this package is invented.

*(~1,050 words)*
