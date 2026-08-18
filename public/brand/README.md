# The EM mark

Edward McCann's own monogram, kept from the previous identity and redrawn as
vector. The source was the apple-touch-icon served by the old site, a 180px
bitmap; this is the same geometry rebuilt as shapes, so it stays sharp at any
size and can be recoloured without artefacts.

The palette is the only thing that changed: the mark now uses the brand's ink,
paper and oxide rather than pure black on white.

| File | Use |
|---|---|
| `em-mark-ink-on-paper.svg` | Primary. The favicon and app icons are built from this. |
| `em-mark-paper-on-ink.svg` | Reversed, for the ink ground (the contact page, dark surfaces). |
| `em-mark-ink.svg` | The bare mark, no tile, for title blocks and letterhead. |
| `em-mark-oxide.svg` | The bare mark in the accent colour. |

The tiled versions bleed to the left and right edges, which is how the original
was drawn. That is deliberate, not a cropping error.

The favicon the site serves has **no tile**: the mark sits on whatever the
browser puts behind it and takes its colour from the reader's theme, so it stays
legible on a light or a dark tab bar. That switch lives in a media query inside
`app/(frontend)/icon.svg`, which is the only place a favicon can carry one.

Two icons cannot do that and so are built from the tile by
`tools/make-app-icons.mjs`: the Apple touch icon, because iOS composites touch
icons onto black and would turn a transparent one into a dark square, and
`app/favicon.ico`, because the format has no way to express a media query. The
`.ico` is only a fallback for browsers that will not render an SVG favicon.

Ink `#161412` · Paper `#F5F2ED` · Oxide `#8F4A2B`

The typographic lockup (EDWARD McCANN with the raised, underscored "c") is a
different thing and lives in `components/Wordmark.tsx`.
