# Page Inventory

Derived from a live crawl on 2026-08-14. The site has no sitemap.xml or robots.txt; the route list below was extracted from rendered navigation and verified page by page. Raw HTML for every route is preserved in `../../site-archive/pages/`.

## Route map (32 routes)

| Route | Template | Title tag | Meta description | Notes |
|---|---|---|---|---|
| `/` | Project grid (homepage) | "Edward McCann Architecture" | Yes (practice positioning) | Doubles as the Projects page; nav marks "Projects" active here |
| `/about` | Text page | "Edward McCann Architecture - About" | Yes | Practice statement, process, bio, credentials |
| `/press` | Press list | "Press" | Yes | 3 entries, newest 2019 |
| `/contact` | Text page | "Edward McCann Architecture - Contact" | None | Two addresses (London, Cape Town), email, phone |
| `/projects/<slug>` (27) | Project detail | Mixed: bare name or "Name :: Edward Mccann Architects" | 19 of 27 have real descriptions, 8 have none | See project list below |
| `/page_not_found` | 404 | "Page Not Found :: Edward Mccann Architects" | None | JS meta-refresh redirect to `http://www.` (insecure downgrade) after 5s |

Aliases: every page is also reachable at `/index.php/<path>` (concrete5 dispatcher paths, used by some internal links) and on the `www.` host. Four URL variants per page resolve with 200 and self-referential canonicals only partially compensate.

## The 27 projects

Ordering below is the homepage grid order (no visible sorting logic: not alphabetical, not chronological, not by type).

| # | Slug | Display name | Type (inferred from copy) | Location | Images | Copy |
|---|---|---|---|---|---|---|
| 1 | firs-avenue | Firs Avenue | House reconfiguration + extension | London | 31 | 3 paras + credit |
| 2 | hassett-road | Hassett Road | Victorian terrace refurb + extension (charred timber) | Hackney | 25 | 1 para |
| 3 | rylett-crescent | Rylett Crescent | Reconfiguration + basement extension | West London | 30 | 1 para (truncated mid-word: "compositio") |
| 4 | goat-hill-house | Goat Hill House | New-build house | Hastings | 26 | 1 para |
| 5 | pennard-house | Pennard House | New house in walled garden, Grade II curtilage | Somerset | 13 | 2 paras |
| 6 | social-house | Social House | Student/studio housing concept | Town centre (unbuilt) | 10 | 1 para |
| 7 | west-suffolk | West Suffolk | New courtyard house (Grand Designs 2019) | Suffolk | 16 | 1 para |
| 8 | campden-house | Campden House | Edwardian house + pool extension | Castle Cary, Somerset | 23 | 1 para |
| 9 | oval-road | Oval Road | Victorian house extension (DMI 2017) | Camden | 23 | 1 para + credit |
| 10 | chatsworth-rd | Chatsworth Rd | Flat refurbishment | Hackney | 18 | **Lorem ipsum placeholder live in production** |
| 11 | park-village | Park Village | Photography studio / events venue interventions | Camden | 19 | 1 para |
| 12 | folly | Folly | Garden pergola | Country garden | 12 | 1 para |
| 13 | 312-hackney-road | Hackney Road | Mixed-use development (planning 2015) | Hackney | 11 | 1 para |
| 14 | lonsdale-square | Lonsdale Square | Grade II* basement reconfiguration | Islington | 20 | 1 para + credit |
| 15 | kew-tree-house-competition | Kew Tree House Competition | Competition entry | Kew | 7 | 3 paras |
| 16 | victualler | Victualler | Wine shop + bar fit-out | Wapping | 15 | 1 para + credit |
| 17 | ibberton | Ibberton | Barn conversion + landscape | Dorset | 34 | 1 para + credit |
| 18 | highpoint | Highpoint | Furniture (table) for Lubetkin's Highpoint II | Highgate | 7 | 1 para + credit |
| 19 | pearson-st | Pearson St | Grade II shop-to-house conversion | Hackney | 20 | 1 para + credit |
| 20 | union-wharf | Union Wharf | Roof extension | Islington (canal) | 15 | 1 para + credit |
| 21 | culford-mews | Culford Mews | New mews house (planning granted) | De Beauvoir | 13 | 1 para + status line |
| 22 | latimer-road | Latimer Road | Loft extension (Grand Designs Magazine) | West London | 19 | 1 para + credit |
| 23 | willow-tree | Willow Tree | Competition-winning public sculpture | East London (housing dev.) | 5 | 3 paras |
| 24 | sourced | Sourced | Pop-up food shop fit-out | Old Street Station | 10 | 1 para + credit |
| 25 | archway-road | Archway Road | Factory-to-residence redevelopment | North London | 11 | 1 para |
| 26 | chamber | Chamber | Art enclosure with Mat Chivers | Bathhouse installation | 10 | 1 para |
| 27 | antidote | Antidote | Wine bar + restaurant refit | Off Carnaby Street, Soho | 8 | 1 para |

## Template analyses

### Homepage / Projects grid (`/`)

- **Purpose**: portfolio index; the entire practice pitch is 27 thumbnails.
- **Primary audience**: prospective residential clients; secondarily press and peers.
- **Primary CTA**: implicit only ("View Project" hover overlay per card). No statement, no intro copy, no contact prompt, no footer.
- **Hierarchy**: wordmark (h2), then 27 equal-weight cards (h4 titles). No h1 exists on the page. No curation tier: the newest award-winner and a 2013-era fit-out carry identical weight.
- **Imagery**: 27 square-ish thumbnails, hand-prepared PNGs (some letterboxed with transparent padding, some with award badges baked into the pixels). 13.8 MB of thumbnail weight on this single page.
- **Interactions**: hover reveals a white wash + "View Project" label in a thin rule box; card title sits below image.
- **Responsive**: 4 columns ≥768px (128px thumbnails at 768: smaller than on phones), 2 columns <768px.
- **Strengths**: immediate immersion in work; the grid IS the practice; restrained chrome around it.
- **Weaknesses**: no positioning statement; ragged rows from mixed thumbnail ratios; badge clutter; no filtering or grouping by type/place/year; no footer; equal weighting hides the best work; enormous page weight.
- **Opportunities**: curated "selected" tier over a complete index; typology/location metadata on cards; consistent art-directed crops; HTML-level award tags instead of baked-in badges.

### Project detail (template for all 27)

- **Structure**: italic serif h1 title (placed above `<main>`), full-column hero image, 1-3 justified body paragraphs (975px wide, ~120+ characters per line), optional award badge floated right inside the first paragraph, photographer credit as a bare paragraph ("Photos. Lyndon Douglas"), prev/next project links (h3s, chevron icons), then every remaining image stacked vertically with no captions, no lightbox, no metadata block, no closing CTA. Firs Avenue reaches ~21,000px of scroll height at desktop.
- **Primary CTA**: none. The page dead-ends after the last image; prev/next sit above the images where nobody is when they finish.
- **Imagery**: landscape images render at 945px column width; portrait images cap at 810px height and centre with ragged edges. All content images share one alt string ("Edward Mccann Architect London").
- **Strengths**: strong photography on recent projects; genuinely literate descriptions; linear reading is calm.
- **Weaknesses**: justified text with rivers; no captions, plans or drawings labelled as such; no project facts (year, status, team, contractor, photographer as data); adjacent-project navigation misplaced; dead-end ending; image loading bugs (some src hosts point at `www.` and fail with QUIC errors); no structure distinguishing built work from renders/competitions.
- **Opportunities**: proper case-study anatomy (metadata block, captioned sequence, drawings, credits, next-project footer); make the writing a feature.

### About (`/about`)

- **Purpose**: practice statement + credentials.
- **Hierarchy**: italic h1 "About", intro, h3 PROJECTS, h3 PROCESS, values paragraph, centred h3 EDWARD MCCANN, bio blob, RIBA/ARB logos image.
- **Content present**: RIBA Chartered + ARB registered; "nose to tail design" philosophy; process walk-through; education (Cambridge, Architectural Association, Edinburgh, Camberwell foundation); previous practices (Adjaye Associates, Edward Cullinan Architects, SCABAL); named colleagues and collaborators (including Squint Opera, Mat Chivers, Juliet Haysom).
- **Weaknesses**: single 975px justified text wall; credentials run together as unpunctuated strings ("Education Cambridge University. ARB/RIBA Pt.3 Architectural Association..."); zero imagery (no portrait, no studio, no process photos); the practice's strongest trust signals are the hardest lines to read on the site.
- **Opportunities**: structured credentials, portrait/studio photography, surfacing the Adjaye/Cullinan lineage, linking collaborators to their projects.

### Press (`/press`)

- **Purpose**: validation. Three entries: Firs Avenue (Don't Move Improve 2019), Oval Road (DMI 2017), Latimer Road (Grand Designs Magazine).
- **Structure**: repeated [h1 title + sentence + two links + image + hr]. Three h1s on one page. "Press clippings" link to raw image downloads (one is an iPhone photo of a magazine spread).
- **Weaknesses**: stale (thumbnail badges prove later accolades: DMI longlist 2022 for Hassett Road, Grand Designs TV 2019 for West Suffolk, plus the Willow Tree competition win, none listed); download links instead of readable coverage; no publication logos/dates as data.
- **Opportunities**: a maintained recognition index (awards, TV, print, shortlists) with dates and outlets; or fold recognition into project pages and drop the standalone page.

### Contact (`/contact`)

- **Purpose**: reach the practice.
- **Content**: "Edward McCann Architects" (name variant), London address (9 The Colonnades, 105 Wilton Way, E8), "And", Cape Town address (30 Bokkemanskloof Rd, 7806) with SA phone, email (plain text, no mailto), UK phone ("+44 07734..." mixes country code with leading zero).
- **Weaknesses**: no h1; no form; no map; no hours; no invitation copy ("we are currently taking on..."); the two-city story appears nowhere else on the site and gets no framing here.
- **Opportunities**: the London + Cape Town axis is a differentiator hiding in a footnote; a proper enquiry pathway (project type, budget band, timeline) would qualify leads.

### 404 (`/page_not_found`)

Apologetic copy referencing a 2018-era relaunch, then a JS redirect after 5 seconds to `http://www.edwardmccann.studio/` (plain HTTP). Functional but off-brand and insecure.

## Unknowns

- Whether any additional unlinked pages exist (no sitemap; crawl covered all discovered links).
- Project years/status: not published anywhere; inferred only where copy mentions dates (Hackney Road planning 2015, Grand Designs 2019).
- Whether the Cape Town office is active or historical.
