# Edward McCann Architecture
## Website, UX, Visual Identity & Brand Intelligence Audit

You are acting as a **senior digital experience strategist, UX researcher, design systems analyst, frontend architect, visual design critic, and brand strategist**.

Your task is to perform a comprehensive forensic analysis of the existing Edward McCann website before a complete redesign.

The purpose of this exercise is **not to redesign the website yourself**.

Your purpose is to deeply understand what currently exists, how it behaves, what it communicates, what works, what does not, and what opportunities exist for a substantially better digital identity.

The final deliverable will be consumed by a separate high-end creative/design model. Treat your output as a **Design Intelligence & Creative Direction Handoff Package**.

---

## 1. Primary Objective

Analyse the existing Edward McCann website from five perspectives:

1. **Brand**
2. **Content**
3. **UX / information architecture**
4. **Visual design**
5. **Technical / implementation reality**

I want you to determine not merely what the website looks like, but what it is **trying to communicate** and what it actually communicates.

Do not blindly assume that existing design decisions are intentional.

Distinguish between:

- deliberate brand characteristics
- inherited design conventions
- implementation limitations
- accidental visual patterns
- strong elements worth preserving
- weak elements worth replacing
- opportunities that the current site does not exploit

Think like someone performing a **brand and digital experience archaeological excavation**.

---

# 2. First: Understand the Repository

Before forming opinions, inspect the project thoroughly.

Identify:

- framework
- routing structure
- page structure
- component architecture
- styling system
- typography
- fonts
- colour tokens
- spacing conventions
- breakpoints
- responsive implementation
- image handling
- asset structure
- animation libraries
- interaction patterns
- CMS/data sources
- reusable components
- navigation architecture
- metadata
- SEO implementation
- Open Graph implementation
- favicon/app icon
- existing logos and marks
- SVGs
- photographs
- illustrations
- icons
- background treatments
- video
- embedded content
- third-party services

Do not modify production functionality while conducting the audit.

If something is unclear, explicitly mark it as **Unknown** rather than guessing.

---

# 3. Use Playwright Aggressively

The rendered website is the source of truth for visual and behavioural analysis.

Use Playwright or the available browser automation tooling to inspect the actual application.

Do not rely solely on source code.

Visit and capture every meaningful page and state.

At minimum inspect:

- desktop
- tablet
- mobile

Where appropriate, capture:

- initial viewport
- scrolled state
- navigation open state
- menus
- hover states
- accordions
- galleries
- project filters
- carousels
- modal/lightbox states
- forms
- footer
- loading states
- transitions
- image behaviour
- sticky elements
- responsive transformations

If a state is interactive, actually interact with it.

Do not infer behaviour from source code when the behaviour can be observed directly.

---

# 4. Create a Screenshot Evidence Library

Create a dedicated analysis workspace:

`./design-intelligence/`

Create this structure:

```text
design-intelligence/
├── README.md
├── executive-summary.md
├── brand-analysis.md
├── content-analysis.md
├── information-architecture.md
├── ux-analysis.md
├── visual-analysis.md
├── responsive-analysis.md
├── interaction-analysis.md
├── photography-analysis.md
├── typography-analysis.md
├── colour-analysis.md
├── design-system-analysis.md
├── technical-analysis.md
├── competitive-positioning.md
├── opportunities.md
├── risks-and-constraints.md
├── recommended-design-direction.md
├── page-inventory.md
├── component-inventory.md
├── asset-inventory.md
├── copy-inventory.md
├── screenshot-index.md
├── design-handoff.md
└── screenshots/
    ├── desktop/
    ├── tablet/
    └── mobile/
```

Use sensible filenames.

For example:

```text
home-desktop.png
home-tablet.png
home-mobile.png
projects-desktop.png
project-detail-mobile.png
navigation-mobile-open.png
footer-desktop.png
```

If useful, create additional subdirectories for interaction states.

The screenshots should be useful to another model without requiring it to revisit the website.

---

# 5. Build a Page Inventory

Create a complete inventory of every meaningful route/page.

For each page document:

- URL/path
- purpose
- primary audience
- primary CTA
- secondary CTAs
- content hierarchy
- major sections
- imagery
- interaction patterns
- navigation relationship
- footer relationship
- responsive behaviour
- notable visual treatments
- strengths
- weaknesses
- redesign opportunities

Identify templates versus unique pages.

For example:

- Homepage
- Project listing
- Project detail
- About
- Practice
- Contact
- Services
- Journal/news
- etc.

Do not assume these pages exist. Derive the inventory from the actual website.

---

# 6. Analyse Information Architecture

Map the site's information architecture.

Determine:

- primary navigation
- secondary navigation
- page hierarchy
- content hierarchy
- project taxonomy
- discoverability
- user journeys
- conversion paths
- dead ends
- unnecessary friction
- duplicated content
- missing content
- opportunities for better storytelling

Describe how a prospective client, collaborator, journalist, or prospective employee might navigate the website.

Pay particular attention to whether the architecture practice's **work is being presented as a portfolio, a catalogue, a narrative, or a brand experience**.

---

# 7. Analyse the Brand

This is one of the most important sections.

Infer the current brand language from evidence.

Analyse:

### Brand personality

Describe the current brand using precise descriptors such as:

- restrained
- editorial
- institutional
- intellectual
- contemporary
- experimental
- luxurious
- minimal
- tactile
- technical
- human
- contextual
- academic
- artisanal
- commercial
- residential
- conceptual

Do not use these words merely because they sound appropriate.

Support each conclusion with observed evidence.

### Brand positioning

Determine:

- Who does this practice appear to be?
- What kind of architecture does it appear to represent?
- What level of practice does the website imply?
- What kind of clients does it appear designed to attract?
- Does it feel boutique, established, premium, experimental, commercial, institutional, etc.?
- What differentiates the practice?
- What should the redesigned identity amplify?

### Emotional impression

Describe what a visitor is likely to feel.

Separate:

**Observed**
from
**Interpretation**

---

# 8. Analyse Visual Language

Perform a proper visual design audit.

Analyse:

### Composition

- grid
- alignment
- margins
- whitespace
- density
- rhythm
- proportions
- asymmetry
- visual tension
- cropping
- scale
- negative space

### Typography

Identify, where possible:

- font families
- weights
- sizes
- line heights
- letter spacing
- hierarchy
- display typography
- body typography
- captions
- metadata
- navigation typography

Evaluate the typography's personality and suitability for an architecture practice.

### Colour

Document:

- primary colours
- secondary colours
- neutrals
- accents
- background colours
- text colours
- contrast
- colour relationships

Include actual observed values where possible.

### Imagery

Analyse:

- photography style
- aspect ratios
- cropping
- image sequencing
- full-bleed usage
- thumbnails
- project imagery
- architectural photography treatment
- people/environment/context imagery
- consistency

Determine whether photography is being treated as **content** or as a core component of the brand.

---

# 9. Analyse Design System Characteristics

Reverse-engineer the existing visual system.

Identify:

- spacing scale
- typography scale
- container widths
- grid structure
- border treatments
- radii
- buttons
- links
- cards
- navigation
- forms
- image containers
- project cards
- labels
- metadata
- transitions
- hover behaviour

Look for implicit design tokens even if no formal design system exists.

Document inconsistencies.

---

# 10. Analyse Responsive Behaviour

This is important.

Do not merely say whether the website is responsive.

Describe **how the design transforms between breakpoints**.

For each major component determine:

- what remains fixed
- what scales
- what stacks
- what disappears
- what changes order
- what becomes scrollable
- what becomes a menu
- what changes typography
- what changes image treatment
- what becomes full-width

Identify responsive behaviours that are:

- elegant
- acceptable
- awkward
- broken
- unnecessarily complicated

Create a concise breakpoint/component matrix.

---

# 11. Analyse Interaction & Motion

Document the interaction language.

Look for:

- hover transitions
- image transitions
- page transitions
- scrolling behaviour
- parallax
- reveal animations
- menu animation
- cursor behaviour
- loading behaviour
- microinteractions

Evaluate whether motion contributes to the brand or merely decorates the interface.

For an architecture practice, pay particular attention to whether motion reinforces:

- materiality
- spatial progression
- editorial pacing
- architectural scale
- precision
- restraint

---

# 12. Analyse Content & Copy

Inventory the actual content.

Analyse:

- headlines
- body copy
- project descriptions
- captions
- calls to action
- navigation labels
- metadata
- about/practice messaging

Determine:

- tone of voice
- vocabulary
- sentence structure
- formality
- clarity
- confidence
- specificity
- differentiation

Identify places where the copy feels generic.

Identify places where the existing copy contains valuable brand language that should be preserved.

Do not rewrite the entire site unless necessary.

This is an analysis exercise.

---

# 13. Analyse Photography & Art Direction

Treat the photography as part of the brand.

Determine:

- visual mood
- lighting
- composition
- colour temperature
- architectural framing
- human presence
- environmental context
- material detail
- negative space
- image sequencing

Describe what an ideal future photography direction might amplify.

---

# 14. Competitive / Category Positioning

If internet access is available, research a small set of genuinely relevant architecture practices and studios.

Do not produce a generic list of famous architecture firms.

Look for practices whose websites demonstrate strong:

- portfolio presentation
- editorial design
- architectural storytelling
- premium positioning
- restrained identity
- digital art direction

Analyse patterns rather than copying aesthetics.

Identify:

- category conventions
- overused patterns
- opportunities for differentiation
- visual territories Edward McCann could credibly occupy

Clearly distinguish external observations from your own recommendations.

---

# 15. Identify Design Opportunities

Create a prioritised opportunity matrix.

Categorise opportunities as:

### Preserve
Strong existing elements that should survive.

### Refine
Good ideas that need better execution.

### Replace
Elements whose underlying approach should change.

### Introduce
New capabilities or brand expressions that are currently missing.

### Remove
Elements creating clutter, confusion, or genericness.

Prioritise each opportunity:

- Critical
- High
- Medium
- Low

---

# 16. Develop a Recommended Creative Territory

Do NOT design the new website.

Instead, propose several possible creative territories.

For example:

**Territory A: Editorial Architecture**

**Territory B: Material & Spatial**

**Territory C: Quiet Precision**

These are merely examples.

Develop territories based on actual evidence.

For each territory provide:

- name
- one-sentence concept
- emotional qualities
- visual characteristics
- typography direction
- colour direction
- imagery direction
- layout direction
- motion direction
- brand personality
- advantages
- risks
- suitability

Then recommend the strongest territory and explain why.

---

# 17. Logo / Identity Implications

Do not design a logo.

Instead determine what the current identity suggests.

Analyse:

- wordmark
- monogram
- symbol
- typography
- initials
- existing mark
- architectural references
- geometry
- negative space
- abstraction

Recommend whether the new identity should explore:

- refined wordmark
- monogram
- abstract architectural symbol
- typographic identity
- symbol + wordmark
- flexible identity system

If there are interesting conceptual opportunities, document them for the design model.

---

# 18. Technical Reality

Document constraints that the designer must understand.

Include:

- current framework
- rendering architecture
- image pipeline
- CMS
- deployment assumptions
- existing reusable components
- technical debt affecting design
- browser considerations
- responsive constraints
- accessibility concerns
- performance concerns

Do not allow technical constraints to dictate the creative direction unnecessarily.

The designer should understand constraints without becoming constrained by them.

---

# 19. Final Design Handoff

The most important file is:

`design-intelligence/design-handoff.md`

This should be a concise but comprehensive handoff for a separate creative AI.

It should contain:

## Project Context

## What Exists

## What Works

## What Does Not Work

## Current Brand Perception

## Desired Brand Perception

## Audience

## Positioning

## Content Strategy

## UX Direction

## Visual Direction

## Photography Direction

## Typography Direction

## Colour Direction

## Layout / Grid Direction

## Motion Direction

## Responsive Principles

## Preserve

## Refine

## Replace

## Introduce

## Remove

## Creative Territories

## Recommended Territory

## Design Risks

## Technical Constraints

## Open Questions

## Non-Negotiables

The document should be written so that another design model can immediately understand the project without having to repeat the entire research process.

---

# 20. Executive Summary

Finally, produce:

`design-intelligence/executive-summary.md`

Maximum approximately 2,000 words.

This should answer:

> "If I had only 15 minutes to understand this website, this architecture practice, its current digital identity, and the opportunity for the redesign, what would I need to know?"

Be highly opinionated where the evidence supports it.

Be explicit where information is uncertain.

Never fabricate facts.

---

# 21. README

Create:

`design-intelligence/README.md`

Explain:

- what this folder contains
- how the analysis was conducted
- what pages were inspected
- what screenshots were captured
- what assumptions were made
- what remains unknown
- which files should be given to the design model
- which screenshots are particularly important

Include a recommended reading order.

---

# 22. Quality Bar

Do not produce generic design advice.

Avoid statements like:

> "The website could use better UX."

Instead explain:

> "The project archive currently behaves like a flat catalogue. Project imagery is visually strong, but the information hierarchy does not communicate a clear relationship between project type, location, year, and architectural intent. This creates an opportunity to make the archive feel more like an editorial body of work."

Every major conclusion should have evidence.

Separate:

**Observation**
What is actually present.

**Interpretation**
What that likely communicates.

**Recommendation**
What should potentially change.

Do not confuse these categories.

---

# 23. Final Instruction

Take your time.

Inspect the repository.

Inspect the rendered website.

Use Playwright extensively.

Capture screenshots.

Interact with the site.

Study the actual content.

Study the actual imagery.

Study the actual responsive behaviour.

Study the implementation.

Then synthesise everything into the `design-intelligence/` workspace.

The goal is not to create a prettier website.

The goal is to give the next creative model an unusually deep understanding of **Edward McCann as a brand, architecture practice, digital experience, and design opportunity**.

Do not start implementing the redesign.

Stop after producing the complete Design Intelligence & Creative Direction Handoff Package.