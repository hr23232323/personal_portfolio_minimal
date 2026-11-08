# Musings

The writing page (`/musings/`) holds two series:

- **Musings:** essays, on the bookshelf.
- **Applied AI:** practical pieces on handing everyday chores to AI, in their
  own section below the shelf. Each one ends with a "For your AI" box (with a
  copy button) and the same text published as `musings/<slug>-setup.md`, so
  readers can paste it or point their AI at the link.
  `tax-paperwork.html` is the first one; copy its bespoke styles for the next.

Both series use the same page skeleton and folder. Applied AI pieces are
written, not templated: structure follows the draft.

Each musing is its own hand-authored HTML page. No build step, no template.
Shared look lives in `components.css` + `components.js`; each page picks the
components it needs and adds bespoke pieces inline.

Everything is in the site's dusk style: navy ground, warm cream ink, gold
accent. Fonts are Newsreader (body serif), Bricolage Grotesque (sans) and
JetBrains Mono. Colors are tokens at the top of `components.css` (`--bg`,
`--ink`, `--accent`, `--rule`…); use those, never raw hex, in bespoke pieces.

## Workflow

1. Draft the musing in markdown.
2. Paste the full body into Claude with: "build me a musing page for this."
3. Claude keeps every word verbatim and builds `musings/<slug>.html` from the
   skeleton below, adding any custom interactive piece the musing calls for.
4. Save the original markdown to `musings/sources/<slug>.md` so the prose has
   an archive independent of the HTML.
5. Make the images (see Images).
6. List it in all four places (see Listing a new musing).
7. `make deploy`.

## Page skeleton

Copy the head of the newest musing and change the text. The parts that matter:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>… | Harsh Rana</title>
  <meta name="description" content="…">
  <link rel="canonical" href="https://harshrana.com/musings/<slug>.html">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <meta property="og:type" content="article">
  <meta property="og:title" content="…">
  <meta property="og:description" content="…">
  <meta property="og:url" content="https://harshrana.com/musings/<slug>.html">
  <meta property="og:image" content="https://harshrana.com/img/<slug>-social.png">
  <meta property="og:site_name" content="Harsh Rana">
  <meta property="article:author" content="Harsh Rana">
  <meta property="article:published_time" content="YYYY-MM-DD">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@_harshrana">
  <meta name="twitter:creator" content="@_harshrana">
  <meta name="twitter:title" content="…">
  <meta name="twitter:description" content="…">
  <meta name="twitter:image" content="https://harshrana.com/img/<slug>-social.png">
  <!-- Plus an Article JSON-LD block; copy it from the newest musing. -->

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&amp;family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="components.css?v=6">
  <script src="/musing-back.js?v=3" defer></script>
</head>
<body>
<div class="progress"><div class="progress__bar" id="progressBar"></div></div>
<div class="topbar__chapter" id="chapterPill"><b id="chapterNum">00</b> <span id="chapterTitle">Intro</span></div>

<header class="topbar">
  <a href="/musings/" class="topbar__back">← Writing</a>
  <a href="/" class="topbar__brand">Harsh Rana</a>
</header>

<article class="post">
  <section class="hero hero--<slug-word>">
    <img class="hero__art" src="/img/musings/covers/<name>-cover.webp" alt="" width="800" height="1200">
    <div class="hero__eyebrow">Musing No. 08 · Month YYYY</div>
    <h1>Title with one <em>accented</em> phrase</h1>
    <p class="hero__deck">One-sentence deck.</p>
    <div class="hero__meta">
      <span><b>Harsh Rana</b></span><span class="sep"></span>
      <span>N min read</span><span class="sep"></span>
      <span>Month YYYY</span>
    </div>
  </section>

  <!-- section-breaks, paragraphs, components… -->

  <div class="signoff">Until next time,<div class="signoff__name">Harsh</div></div>
  <div class="next"><!-- two .next__card links to recent musings --></div>
</article>

<footer class="musing-footer"><!-- Twitter / LinkedIn / GitHub / Email links --></footer>
<style>/* bespoke styles, incl. .hero--<slug-word> h1 font-size */</style>
<script src="components.js"></script>
</body>
</html>
```

The back link is fixed up by `/musing-back.js`: it becomes "← Home",
"← Writing" or "← Back" depending on where the reader came from, and uses
browser history, so readers from the text homepage land back on the text
version rather than the 3D world. Leave the default `href="/musings/"`.

## Components (in `components.css`)

| Class | Purpose |
|---|---|
| `.hero` + `.hero__art` / `.hero__eyebrow` / `h1` / `.hero__deck` / `.hero__meta` | Opening block over the cover art. A scrim keeps the text side dark; `<em>` in the title takes the gold accent |
| `.section-break` (`data-chapter`, `data-title`) | Chapter divider with ghosted numeral and kicker. The `data-*` attrs feed the floating chapter pill |
| `.lede` | First paragraph after the hero; gets a drop cap |
| `.pull` | Centered italic pull quote, hairline rules above and below |
| `.codeblock` + `.codeblock__cap` / `.codeblock__body` | Captioned code with `.lang`, `.com`, `.str`, `.fn` spans |
| `.stat` + `.stat__num` / `.stat__label` | Full-bleed type stat (e.g. `100×`, `20k+`) |
| `.threecol` | 3-up type grid for concept enumeration |
| `.contact-card` | Contact card |
| `.signoff` + `.next` / `.next__card` | Sign-off and "Keep reading" cards |

## Bespoke pieces

Anything one-of-a-kind (charts, the Tom interactive in
`software-engineering-age-of-agents.html`, the metric grids in
`try-harder-agent-evals.html`) lives inline in that page's own `<style>` and
`<script>`. Build them from the color tokens so they sit on the dark ground.
Don't promote a piece to the shared components unless a second musing needs it.

## Images

- **Cover:** `img/musings/covers/<name>-cover.webp`, 800×1200 portrait. Used by
  the hero, the writing shelf and the 3D bookshelf. Keep the busy part of the
  art away from the text side, and check the title reads on a phone.
- **Share image:** `img/<slug>-social.png`, roughly 1.9:1 landscape (the
  existing ones are ~1600×900). Used for link previews.

## Listing a new musing

A new musing has to be added in four places:

1. **`musings/index.html`** (the writing page): for a musing, add a
   `.book-spine` at the top of `.bookcase` with its `data-*` fields and spine
   colors, move `is-active` to it, point the `featured-*` block at it, and
   update the count in the bookcase `aria-label`. For Applied AI, add a
   `.guide` card at the top of `.guides`.
2. **`index.html`, 3D bookshelf card** (`<template id="card-writing">`): add an
   `<li>` with `data-cover="<name>-cover"` at the top of the right list
   (the numbered list for musings, the Applied AI list for those).
3. **`index.html`, text version** (the "Writing" list in `#text`): the newest
   Applied AI piece sits at the top as "Applied AI: <title>", then the three
   newest musings.
4. **`sitemap.xml`**: add the URL.

Also update the "Keep reading" cards on the previous musing if you want it to
point forward.

## Numbering

Each series is numbered on its own: `Musing No. 08`, `Applied AI No. 02`, …
Set in the `.hero__eyebrow` (and as `data-issue` on a musing's shelf spine).

## Caching

Pages always revalidate, so HTML changes reach readers on the next visit.
CSS and JS are cached for a day, so after editing `components.css`,
`library.css` or `musing-back.js`, bump its `?v=` number everywhere it's
linked (`make deploy` only does this for the 3D world).
