# Information Architecture Analysis

## Current sitemap (observed)

```text
/                     Projects grid (27 items, fixed order)  ← homepage
/about                Practice statement + bio
/press                3 press entries (2017-2019)
/contact              Addresses + phone + email
/projects/<slug>      27 project pages (flat, no taxonomy)
/page_not_found       404 (JS redirect to homepage)
```

One level deep everywhere. No sections, no filtering, no search, no journal, no sitemap.xml. Every page is also reachable via `/index.php/...` aliases and on the `www.` host (four URL variants per page).

## Navigation model

- **Observed**: four labels (Projects, About, Press, Contact). "Projects" points at `/`, so the homepage and the portfolio are the same surface. Active state = italics. Prev/next links on project pages are the only cross-linking between projects; they follow the fixed grid order (Firs Avenue → Antidote → ... wraps around), which is neither chronological nor typological, so "next" is semantically random.
- **Interpretation**: the model says "we are our work": a credible instinct for a portfolio practice. But with zero curation, zero metadata and zero grouping, the architecture presents 27 heterogeneous items (built houses, unbuilt developments, a table, a sculpture, wine bars, a competition entry) as one undifferentiated wall. The site behaves like a **flat catalogue**, while the work would support a **narrative archive**.

## Content hierarchy problems (observed → consequence)

1. **No curation tier.** The DMI-featured, professionally photographed Firs Avenue and an old pop-up fit-out have identical cards. Consequence: the practice's best evidence cannot lead.
2. **No project metadata anywhere.** Location, year, status (built/unbuilt/competition), typology, photographer exist only inside prose, if at all. Consequence: no filtering, no sorting, no sense of trajectory; renders and buildings blur together (a prospective client cannot tell what was actually built).
3. **Buried differentiators.** The Adjaye/Cullinan pedigree, the Cape Town office, Grand Designs TV coverage, the competition win: each appears once, in body text or not at all. Consequence: the strongest positioning signals are invisible at the architecture level.
4. **Press is orphaned and stale.** Newer accolades exist only as pixels inside homepage thumbnails. Consequence: the validation layer undercuts itself.
5. **Dead ends.** Project pages end after ~20-30 images with no CTA, no related projects, no footer. Contact has no onward path. Consequence: every journey terminates; nothing loops toward enquiry.

## User journeys (walked)

**Prospective residential client** (primary audience): lands on grid → clicks a thumbnail that looks like their situation (no location/type cues to help) → long scroll of images → must scroll back up to navigate → eventually finds Contact via nav → bare address, no invitation, no form, no sense of process or fees pathway. Friction: qualification happens nowhere; trust-building assets (About credentials, press) sit off the main path.

**Hospitality/commercial client**: must discover Antidote/Victualler/Sourced by accident among houses; nothing signals the practice does this work at all.

**Journalist**: Press page suggests coverage stopped in 2019; no downloadable imagery, no boilerplate, no photographer licensing info.

**Prospective employee/collaborator**: About names colleagues and collaborators (a genuinely warm signal) but there is no studio page, no jobs note, no studio imagery.

## Duplicated / conflicting content

- Same body text duplicated into meta descriptions (or vice versa) on ~10 projects; 8 projects have no description at all.
- Practice name varies across five forms (see copy inventory).
- Homepage = Projects causes the "Projects" nav label to point at a page whose title is just the practice name.

## Missing content (category-standard, absent here)

- Practice/studio page with people, portrait, studio photography
- Project facts block (year, borough/county, status, team, contractor, structural engineer, photographer)
- Typology or place-based grouping
- Journal/news (the practice has award news it never posted)
- Any conversion surface (enquiry framing, what commissioning us looks like, fee/process primer)
- Footer (contact echo, socials, legal)

## Storytelling opportunity

- **Observed raw material**: 27 projects spanning East London terraces, Somerset and Suffolk country houses, Soho and Wapping hospitality, public art, furniture; literate copy; named collaborators; a London + Cape Town axis.
- **Interpretation**: the material supports a two-tier archive (a curated "Selected" narrative layer above a complete index with real metadata), and a sector-agnostic story ("one sensibility across houses, hospitality and objects") that comparators like Tuckey Design Studio use to make mixed portfolios coherent.
- **Recommendation**: rebuild the IA as: Home (positioned entry, curated work) / Work (complete, filterable index; each project a proper case study with facts + captioned sequence + related projects) / Practice (people, process, credentials, studio) / Recognition (living awards + press) / Journal (optional, only if it will be fed) / Contact (framed enquiry). Keep depth ≤2 levels; give every page an onward path.
