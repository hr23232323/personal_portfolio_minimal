# Musings

Each musing is its own hand-authored HTML page. No build step, no template.
Shared visual language lives in `components.css` + `components.js`; each
page picks the components it needs and can add bespoke pieces inline.

## Workflow

1. Draft the musing in markdown.
2. Paste the full body into Claude with: "build me a musing page for this."
3. Claude keeps every word verbatim and assembles an HTML page from the
   components below, adding any custom interactive piece the musing calls
   for inline.
4. Save the original markdown into `musings/sources/<slug>.md` so the
   prose has an archive independent of the rendered HTML.
5. Link the new file from `index.html` under the musings list.

## Page skeleton

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

  <!-- Open Graph + Twitter (so link previews aren't blank) -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="…">
  <meta property="og:description" content="…">
  <meta property="og:url" content="https://harshrana.com/musings/<slug>.html">
  <meta property="og:image" content="https://harshrana.com/favicon.svg">
  <meta property="og:site_name" content="Harsh Rana">
  <meta property="article:author" content="Harsh Rana">
  <meta property="article:published_time" content="YYYY-MM-DD">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@_harshrana">
  <meta name="twitter:creator" content="@_harshrana">
  <meta name="twitter:title" content="…">
  <meta name="twitter:description" content="…">
  <meta name="twitter:image" content="https://harshrana.com/favicon.svg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="components.css">
</head>
<body>
  <div class="progress"><div class="progress__bar" id="progressBar"></div></div>
  <div class="topbar__chapter" id="chapterPill"><b id="chapterNum">00</b> <span id="chapterTitle">Intro</span></div>

  <header class="topbar">
    <a href="/" class="topbar__back">← Index</a>
    <a href="/" class="topbar__brand">HARSH RANA</a>
  </header>

  <article class="post">
    <!-- hero, section-breaks, paragraphs, components… -->
  </article>

  <footer class="musing-footer">…</footer>
  <script src="components.js"></script>
</body>
</html>
```

## Components (in `components.css`)

| Class | Purpose |
|---|---|
| `.hero` + `.hero__eyebrow` / `h1` / `.hero__deck` / `.hero__meta` | Opening block: small kicker, oversize serif title with `<em>` for accent color, italic deck, author/read-time/date row |
| `.section-break` (`data-chapter`, `data-title`) | Chapter divider with ghosted numeral and kicker. The `data-*` attrs feed the floating chapter pill |
| `.lede` | First paragraph after the hero; gets a drop cap |
| `.codeblock` + `.codeblock__cap` / `.codeblock__body` | Captioned code with `.lang`, `.com`, `.str`, `.fn` spans |
| `.pull` | Centered italic pull quote, hairline rules above and below |
| `.stat` + `.stat__num` / `.stat__label` | Full-bleed type stat (e.g. `100×`, `20k+`) |
| `.threecol` | 3-up type grid for concept enumeration |
| `.contact-card` | Contact card linking to the native site form |
| `.signoff` + `.next` | Italic sign-off and read-next list |

## Bespoke pieces

Anything one-of-a-kind (e.g. the Tom interactive in
`software-engineering-age-of-agents.html`) lives inline in that page; its
own `<style>` and `<script>` blocks. Don't promote it to the shared
components unless a second musing actually needs it.

## Numbering

Musings are numbered sequentially: `Musing No. 01`, `No. 02`, … Set in the
`.hero__eyebrow` of each page.
