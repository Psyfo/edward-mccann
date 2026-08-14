# Component Inventory

Reverse-engineered from the rendered site and archived source (theme: `burble4`, a customised concrete5 theme on Bootstrap 3). Values are measured computed styles at 1440x900 unless noted.

## Global components

### Header / navigation bar
- Structure: `<nav>` > fluid container > wordmark link (h2, 30px futura-pt caps) left; inline nav list right (`#inlineNav`, hidden below 992px).
- Nav links: adobe-garamond-pro 18.5px, black; **active page indicated by italics** (the only nav state signal); generous ~40px word gaps.
- No background, borders or shadow; header scrolls away (not sticky).
- Tablet/mobile: wordmark centres and wraps to two lines (24.6px), a Font Awesome "reorder" hamburger icon appears centred BELOW the wordmark, occupying its own row.

### Mobile navigation overlay (`#myNav.navOverlay`)
- Full-screen fixed overlay, background `rgba(247,247,247,0.7)` (translucent: page content ghosts through behind the menu text).
- Links: Garamond ~28px, centred vertically, plain black; close button "×" top right.
- Opened/closed by inline JS (`openNav()`/`closeNav()`) animating overlay width 0 → 100%.

### Footer
- Does not exist on any page. The theme CSS contains `footer#footer-theme` styles (unused). Pages simply stop.

### Back-to-top button
- Black square with white chevron, fixed bottom right, appears after scroll. Present on long pages. Not styled to match anything else on the site.

## Homepage components

### Project card (`.ccm-block-page-list-page-entry-mbt-grid-item.mbt-col-3`)
- Anatomy: square thumbnail area (`padding-bottom:100%` aligner box) > `<img>` (750x750 intrinsic) > hover layer > separate title link below.
- Column widths (the block's own CSS, with animated `transition: width 1s` between states):
  - <768px: 50% (2-up)
  - exactly 768px: 25% (4-up, via a `min-width:768` rule)
  - 769 to 991px: 50% `!important` (2-up)
  - 992 to 1199px: 33.33% `!important` (3-up)
  - ≥1200px: 25% (4-up, ~293px thumbnails at 1440)
- The 768/769 boundary is an off-by-one: iPad portrait (768px CSS) renders 4-up postage stamps while 769 to 991 gets large 2-up tiles.
- Title: h4, Garamond 21.6px regular, centred under the image. Rendered italic on screen (theme styles h4 titles italic on cards).
- Non-uniform image ratios (some thumbnails carry transparent letterbox padding) break the square rhythm and row baselines.

### Card hover state
- White wash over image (opacity-driven overlay `rgba(255,255,255,0.9)` region) + "View Project" label (Garamond 15.4px) inside a 1px black rule box, centred. Transition ~0.25s ease.
- On touch devices this affordance does not exist; cards are plain links.

## Project page components

### Title block
- h1, Garamond italic 29.3px, regular weight, left-aligned to the 975px content column, placed structurally before `<main>`. No metadata row (no year, location, status, category anywhere).

### Body text block
- Container: `.col-xs-12.marginbottom.justify`, 975px wide.
- Paragraphs: Garamond 15.4px / 30.8px line-height (2.0 leading), `text-align: justify`, black. Measure ≈ 120+ characters per line (roughly double comfortable book measure).
- Award badge images (e.g. `dmi_2019_badge-featured.jpg`, 284x118) float right inside the first paragraph on decorated projects.
- Photographer credit is a plain final paragraph ("Photos. Lyndon Douglas").

### Previous / next project links
- Two h3 links with Font Awesome chevrons ("« Antidote", "Hassett Road »"), placed BETWEEN the description and the image stack, styled like content headings. Order follows the fixed grid sequence, wrapping alphabet-free. After the ~30-image stack there is no navigation at all.

### Image stack
- One `<img>` per photograph, stacked with ~20px gaps, no captions, no zoom/lightbox, no distinction between photo, render, drawing or model shot.
- Landscape images: full 945px column width. Portrait images: `max-height` capped (~810px at 1440), centred, producing alternating ragged widths.
- All images share alt="Edward Mccann Architect London".
- Sources are concrete5 cache thumbnails (`/application/files/cache/thumbnails/<hash>.jpg`); some pages reference them on the `www.` host, which intermittently fails (QUIC protocol errors observed), leaving silent gaps.

## Press page components

### Press entry
- Pattern: h1 (italic, project name with trailing full stop) + one-sentence paragraph + `<ul>` of two links ("View the project here", "Read a press clipping.") + linked image + `<hr>` separator.
- The "clipping" links download raw image files (one is an iPhone photograph of a magazine spread) via extension-less `/download_file/view/<id>/229` URLs.

## About page components

- Italic centred h1; h3 section headings in caps Garamond (PROJECTS, PROCESS, EDWARD MCCANN); justified paragraph blocks at 975px; credential "lists" as run-on plain paragraphs; single image (RIBA + ARB logos, `RIBA_ARB.png`).

## Contact page components

- Bare paragraph stack; `<strong>` labels ("And", "Email", "Tel"); no mailto/tel links, no form, no map embed.

## Form components

- None exist anywhere on the site. The Bootstrap/theme CSS carries full styling for buttons, forms, alerts (including leftover theme greens `#75ca2a`, `#d4efbd` and Bootstrap link blue `#428bca`), all unused except where Bootstrap defaults leak through.

## 404 components

- Centred jumbo heading + apology paragraph + 5s JS redirect to `http://www.edwardmccann.studio/`.

## Implicit design tokens (as-built reality)

| Token | Value | Consistency |
|---|---|---|
| Ground | `#F7F7F7` | Everywhere |
| Ink | `#000` (plus `#222` incidentals) | Everywhere |
| Accent | none deliberate; Bootstrap blue `#428bca` leaks on unstyled links | Accidental |
| Display face | futura-pt 400 (wordmark only) | Single use |
| Text face | adobe-garamond-pro 400 roman/italic (everything else) | Consistent |
| Base sizes | 30 / 29.3 / 21.6 / 18.5 / 15.4 px (no scale logic; several are em-derived fractions) | Ad hoc |
| Leading | 2.0 on body copy | Consistent |
| Container | 975px text column; fluid 15px-gutter grid elsewhere | Two systems |
| Radius | 0 everywhere | Consistent |
| Motion | 0.2 to 1s mixed easings; several malformed `transition` declarations in CSS; 1s animated grid-column widths | Inconsistent |
| Iconography | Font Awesome 3.2.1 (hamburger, chevrons, ×) | Legacy |

No formal token system exists; the values above are the de facto system a redesign must consciously replace.
