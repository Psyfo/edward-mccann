# Risks & Constraints

What the design model (and the rebuild team) must not discover late.

## Content & asset risks

1. **Image ceiling**: preserved masters top out around 2500-3600px (CMS uploads). Ambitious full-bleed art direction may exceed comfortable quality on 4K screens; original files likely exist with the photographers (Lyndon Douglas, Emma Lewis, Travis Levius, Sebastian Tiew) but re-licensing/usage terms are **Unknown**.
2. **Content gaps block launch-completeness**: 8 projects lack descriptions; zero projects have structured facts; no portrait/studio imagery exists. Design must anticipate a phased content reality (templates that hold up with partial data) or the client must commit to a content sprint.
3. **Built vs unbuilt ambiguity**: several portfolio pieces are renders/competitions (Goat Hill status unknown, Social House, Hackney Road, Culford Mews planning-stage as of writing, Kew, possibly others). Presenting them undifferentiated is a trust risk; the design must include status vocabulary, and the client must confirm each project's current status (**open question**).
4. **Practice-name decision**: five variants live today; design cannot finalise a wordmark without the client choosing (Architecture vs Architects vs Studio). Domain says `.studio`.
5. **Dated projects aging the brand**: oldest work (Victualler-era photography, some fit-outs) may be 10+ years old. Curation decisions (what leads, what is archived, what is dropped) are the client's, and the two-tier archive pattern is the design hedge.

## Licensing / account risks

6. **Adobe Fonts kit `zou6bnl`** belongs to an unknown account (probably the previous developer). If Garamond Pro/Futura PT survive into the new identity, they must be re-licensed under the client's Adobe account; if not, the new faces need licences procured deliberately. Do not ship depending on the old kit.
7. **GA4 property G-3J3PKD0QQK** collects data today; ownership unknown. Claim it or replace it; do not silently lose the historical continuity decision.
8. **Award/broadcaster marks** (NLA Don't Move Improve, Grand Designs) are third-party brands; the rebuild should reference them textually/factually rather than reproducing logos without checking usage rules.
9. **Photography credits are contractual signals**: keep credits visible in the new design; photographer licensing for a redesigned context is assumed but unverified.

## Technical & operational constraints

10. **Handover inventory needed**: CMS admin, hosting, domain registrar, DNS, Adobe, Google accounts: none verified during this audit. The old stack (EOL PHP 7.2 / concrete5 8.4.3) is a live security liability until decommissioned; keep it read-only and plan the cutover.
11. **Redirect obligation**: 31 public URLs × host/alias variants must 301 to the new structure from day one; the archive's `manifest.json` + `page-inventory.md` are the map.
12. **Email continuity**: `info@edwardmccann.studio` is the only published contact; DNS/MX changes during migration must not break it.
13. **Cape Town question**: whether the SA office/number is current affects contact design and any localisation thinking (**open question for the client**).

## Design-process risks

14. **Over-correction risk**: the current site fails on execution, not taste. A redesign that discards the serif voice, the warm-white ground and the restrained register in favour of category-standard grotesque minimalism would make the practice *more* generic (see competitive-positioning: that territory is saturated).
15. **Motion temptation**: the quietness is closer to right than heavy animation; comparator research shows JS-fragile showpieces failing basic access. Add few meaningful motions over a fast server-rendered base.
16. **Journal trap**: introducing a news/journal section without a feeding commitment recreates the category's "starved journal" failure (Groupwork's "Just another WordPress site" is the cautionary tale).
17. **Badge nostalgia**: the client may want the award badges back on thumbnails (they were placed deliberately). The design must offer a better-looking home for recognition so the raster badges stay dead.

## Non-blockers (explicitly cleared)

- No legacy tech must be preserved; no integrations exist; no cookie/consent debt; content volume is small and fully archived in this repo; SEO equity beyond the URL paths is negligible. The rebuild is greenfield in every way that matters.
