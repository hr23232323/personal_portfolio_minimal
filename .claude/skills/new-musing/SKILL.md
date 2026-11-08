---
name: new-musing
description: Turn Harsh's markdown draft into a new musing or Applied AI piece (blog post) on harshrana.com, in the site's dusk style, and list it everywhere it needs to appear. Use when he pastes a draft and says "build me a musing page for this", "new musing", "new blog post", or similar.
---

# New musing

`musings/README.md` is the reference: page skeleton, components, images, the
four places a post gets listed, and caching. Read it first, then follow these
steps.

## 1. Get what you need

From the draft, work out the title, deck (one sentence), read time
(~230 words a minute) and slug (short, kebab-case). Work out the series:
an essay is a Musing, a practical how-to for everyday AI use is Applied AI
(ask if unclear). The number is that series' newest number plus one, and the
date is this month unless he says otherwise.

Ask Harsh only for what you can't work out:
- The **cover art** (800×1200 portrait) and **share image** (~1.9:1 landscape).
  Don't make these up. If he hasn't got them yet, build the page with the
  newest musing's images as placeholders and say so clearly.
- The phrase to accent in the title, if it isn't obvious.

## 2. Build the page

- Save the draft unchanged to `musings/sources/<slug>.md`.
- Create `musings/<slug>.html` by copying the newest musing's head, topbar,
  signoff and footer, then fill in the hero and body.
- **Keep every word verbatim.** Don't edit, tighten or "improve" the prose. Only
  add structure: section breaks where he has headings, `.lede` on the first
  paragraph, `.pull` for a line that is clearly a pull quote, code blocks for
  code. If something reads like a typo, ask rather than fix.
- If the piece calls for a chart or interactive bit, build it inline in that
  page using the color tokens. Keep it simple.
- Point the "Keep reading" cards at the two previous musings.

## 3. List it in all four places

The writing shelf (`musings/index.html`), the 3D bookshelf card and the text
version's Writing list (both in `index.html`), and `sitemap.xml`. Details are
in the README. Also point the previous musing's "Keep reading" at the new one.

## 4. Check it

Serve the repo root (`python3 -m http.server` from the repo) and look at the
new page at desktop and phone width (390px):
- The title and deck read clearly over the cover on both.
- No horizontal scroll on the phone, and bespoke pieces fit.
- The new post shows up on the writing shelf, on the 3D bookshelf card and in
  the text version.

Fix anything off, then show Harsh a screenshot or two.

## 5. Ship

Commit. Deploy (`make deploy`) and push only when Harsh says to.
