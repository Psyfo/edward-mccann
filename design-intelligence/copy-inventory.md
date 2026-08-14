# Copy Inventory

Every string a visitor can read, with verbatim quotes where the language matters. Complete raw text for all 32 pages is in `data/content-digest.json`; archived HTML in `../site-archive/pages/`.

## Global chrome

| Element | Copy | Notes |
|---|---|---|
| Wordmark | EDWARD McCANN ARCHITECTURE | Typeset text (futura-pt), not an image. "Mc" set with lowercase c |
| Navigation | Projects · About · Press · Contact | Active page set in italic |
| Card overlay | "View Project" | Identical on all 27 cards |
| Footer | (none exists) | No copyright line, no credits, nothing |
| 404 | "Sorry, this page no longer exists" + relaunch apology | References the 2018 relaunch, now itself dated |

## Practice naming (inconsistent across the site)

Observed variants, all live simultaneously:

1. "Edward McCann Architecture" (wordmark, homepage title, about/contact titles)
2. "Edward Mccann Architects" (project title suffixes ":: Edward Mccann Architects", 404 title; note lowercase "c")
3. "Edward McCann Architects" (contact page body, most meta descriptions)
4. "Edward McCann Architectural Practice" (Willow Tree meta)
5. "Ed McCann Architecture" (Lonsdale Square meta)

The email domain and URL say "edwardmccann.studio"; the word "studio" appears nowhere in the brand language.

## Key preservable brand language (verbatim)

From About:

> "We believe in nose to tail design in which initial concepts at inception are carried through to their resolution in the details and construction."

The single most ownable phrase on the site. East London food-culture register applied to architectural rigour; memorable, unpretentious, accurate to the offer (concept through contract administration).

> "It is the job of your architect to reveal these possibilities to you in advance within a process that allows you to make good decisions and get the most out of what for most people is a once in a lifetime project."

Client-first, plain-spoken, second person. Rare in this category.

> "developing the brief through conversation >> a back and forth of design concepts and critique"

The ">>" is a typographic quirk (likely accidental) but the sentiment defines the practice's process voice.

From project pages (evidence of a genuinely literate writer):

> "The exposed steel structure of the extension sits lightly against the existing masonry. Shadow gaps and exposed plaster and concrete in the kitchen abut skirting boards and cornices." (Firs Avenue)

> "A base reference in the design is Sverre Fehn's Nordic Pavilion where a simple grid of structure sets a frame through which the trees pass." (Kew Tree House)

> "The fire surrounds are composed of precast coloured concrete elements and a nod to Josef Albers square compositions." (Rylett Crescent)

> "The table design borrows from the engineered structure of the Eames Eiffel table... commissioned for an apartment in Highpoint II, a Grade I listed housing development designed by Berthold Lubetkin (Tecton)." (Highpoint)

> "The use of wine boxes as one of the principal elements in the wine library is a reference to the notion of the containment and transport of wine, integral to Wapping's history." (Victualler)

Register: descriptive, material-literate, culturally referenced (Fehn, Albers, Lubetkin, Eames), unhurried, no sales adjectives, no "luxury", no "bespoke".

## Photographer credits (as written)

- "Photos. Lyndon Douglas": Firs Avenue, Oval Road, Latimer Road, Victualler, Highpoint
- "Photos. Travis Levius": Lonsdale Square, Pearson St, Sourced
- "Photos. Emma Lewis": Ibberton
- "Photos. Sebastian Tiew": Union Wharf (also listed as a colleague on About)
- 17 projects credit no photographer

## Credentials and names (About page, run-on formatting as published)

> "Education Cambridge University. ARB/RIBA Pt.3 Architectural Association. AAdipl ARB Edinburgh University. MA(Hons) Camberwell College of Art. Foundation"

> "Previous Practices Adjaye Associates Edward Cullinan Architects SCABAL"

> "Colleagues present and past Roua Horaneih Cecilia Dubois Stephanie Westrum Haruka Murai Chiaki Tanaka Tim Fisher Adrian Ma Sebastian Tiew Ahmed Sahar Tom Hatzor"

> "Collaborators Rashid Ali Alex Fox Adam Williamson Squint Opera Atelier For Images Mat Chivers Juliet Haysom"

Formatting destroys legibility (missing separators/line breaks), but the content is high-value trust capital.

## Press page copy

- "Featured in the New London Architecture Dont Move Improve Awards 2019." (missing apostrophe in "Don't", recurs in 2017 entry)
- "Covered in Grand Designs Magazine as part of a feature on innovative loft extensions."
- Link labels: "View the project here", "Read a press clipping." / "See the press clipping." / "Read the press clipping." (three variants of the same label)

## Contact page copy (verbatim, complete)

> Edward McCann Architects
> 9 The Colonnades 105 Wilton Way London E8 1BH
> **And**
> 30 Bokkemanskloof Rd Cape Town 7806
> +27 (72) 309-5485
> **Email**: info@edwardmccann.studio
> **Tel**: +44 07734 593 280

The Cape Town address and number appear nowhere else; "based in East London" (meta description) is the only geography claim elsewhere. Phone formats are inconsistent ("+44 07734" mixes forms).

## Meta descriptions

19 of 27 project pages carry unique, substantive descriptions (some 150+ words, real copy rather than SEO filler); 8 have none. Site pages: home and about have short descriptors; contact has none. These descriptions are often better-structured than the on-page copy and are a usable content source for the rebuild.

## Copy defects log

| Location | Defect |
|---|---|
| Chatsworth Rd body | Full lorem ipsum paragraph live in production (meta description holds the real text) |
| Rylett Crescent body | Ends mid-word: "...Josef Albers square compositio" |
| Press entries | "Dont" for "Don't" (twice) |
| Prev/next labels | Malformed entities "&nbsp&nbsp" (missing semicolons) rendering as literal text in source |
| Titles | Two competing patterns: bare "Firs Avenue" vs "Antidote :: Edward Mccann Architects" |
| Alt text | All ~470 project images share "Edward Mccann Architect London" |
| About | "conversation >>" ASCII artefact; credential strings without separators |
| Contact | "+44 07734 593 280" retains the leading zero after the country code |

## Tone of voice summary

- **Observed**: plain, confident, materially precise, referential, warm toward clients, allergic to hype. Sentence structures are long but controlled. UK English.
- **Interpretation**: the practice writes like it designs: nothing decorative, everything load-bearing. The voice is a brand asset of the first order, currently sabotaged by justified text walls, entity glitches and placeholder lapses.
- **Recommendation**: preserve the voice and most project texts nearly verbatim; fix defects; add the missing 8 descriptions and structured facts (year, place, status, team, photography) rather than rewriting what works.
