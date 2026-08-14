# UX Analysis

## Core journeys, scored against observed behaviour

### 1. "Can this practice do my project?" (primary job-to-be-done)

Observed path: grid → guess from thumbnails → project page → prose → back. Breakdowns:

- Thumbnails carry no type/location/status cues; a render and a built house look equivalent (Goat Hill's CAD axon sits beside Hassett's finished photography with identical card treatment).
- Project pages publish no facts. A client wanting "basement, listed building, Islington" must read 27 essays to discover Lonsdale Square.
- Nothing distinguishes built work from concepts; risk-averse clients cannot verify delivery record.

### 2. "I'm convinced, what now?" (conversion)

- No CTA exists anywhere: not on project pages, not after About, not on the grid. The email address is plain text (not even mailto). Interpretation: every successful journey ends with the user doing manual labour to start a conversation. For a practice whose About page explicitly sells a collaborative process, the absence of any process on-ramp is the single largest UX gap.

### 3. Orientation and wayfinding

- No breadcrumb, no footer, no persistent context. On a 21,000px project page the nav scrolls away immediately; returning to the grid requires scrolling all the way back (the back-to-top button helps but lands you on the title, not the nav).
- Prev/next links sit between text and images: users mid-gallery never see them; users who finish a gallery hit a dead end.
- The active-page italic in the nav is subtle to the point of invisibility for anyone who doesn't already know the convention.

### 4. Reading experience

- Justified 15.4px Garamond across a 975px measure (~120+ chars/line) with 2.0 leading: line-tracking errors and rivers on desktop; harsh word-spacing gaps at mobile widths (screenshot: `mobile/project-firs-avenue-mobile-justified-text.png`).
- Award badge floats interrupt the first paragraph, the exact place the eye starts.

### 5. Image consumption (the site's main activity)

- No lightbox/zoom despite detail-rich photography; portrait images shrink to ~55% column width while landscapes go full width, an arrhythmic scroll.
- No captions to anchor what you see (which floor? existing or proposed? photo or render?).
- Intermittently broken images (cross-host `www.` cache URLs failing QUIC) leave silent gaps users read as neglect.
- 13.8 MB homepage: on 4G this is a 10-second-plus first meaningful grid; lazyload exists but initial-viewport images are full-weight PNGs.

### 6. Mobile specifics

- Hamburger occupies its own row beneath a two-line wordmark: ~170px of chrome before content.
- The overlay menu is translucent (0.7 alpha): menu labels sit on top of ghosted thumbnails; contrast varies with whatever happens to be behind.
- Touch users never see "View Project" (hover-only); cards still work as links, so harm is cosmetic.
- 2-up cards at 375px (~165px tiles) are usable; the real breakage is 768px iPad portrait: 4-up 128px tiles (see responsive analysis).

### 7. Accessibility (observed defects)

- One alt string shared by ~470 images; heading order broken (no h1 on home, three on Press, h1 outside main landmark on projects); hamburger is an `<i>` with onclick (not a button, no keyboard access, no aria); overlay close is a link to `javascript:void(0)`; colour-only (italic-only) nav state; justified text harms dyslexic readers; focus styles are browser defaults on a site with no visible interactive affordances.
- Nothing catastrophic (it is mostly static content), but the rebuild should target WCAG 2.2 AA from scratch rather than patching.

## Friction inventory (ranked by user cost)

1. No conversion path or CTA (critical)
2. No project facts/filtering; built vs unbuilt ambiguity (critical)
3. Dead-end page endings + misplaced prev/next (high)
4. Page weight and broken images (high)
5. Justified long-measure reading (high)
6. 768px grid collapse (medium, device-specific)
7. Translucent mobile menu legibility (medium)
8. Press staleness undermining trust (medium)
9. Silent 404 redirect to insecure www (low frequency, poor impression)

## What works and should inform the rebuild (observed)

- Work-first entry: no splash, no intro friction; the grid IS the honest opening move.
- One-level IA: nothing is more than one click from anywhere; preserve this shallowness.
- The reading pace of a linear case study (text then images) suits the contemplative material; it needs anatomy (facts, captions, ending), not a different concept.
- Restraint: no popups, no chat widgets, no cookie theatre (no third-party trackers beyond GA). The rebuild should keep this cleanliness while adding the missing paths.
