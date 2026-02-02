---
title: Building a Simple Musings System
date: February 1, 2026
description: How I built a markdown-based publishing system for my portfolio
slug: musings-demo
---

I wanted a simple way to publish thoughts without the overhead of a CMS or complex framework. This is how I built a markdown-based musings system.

## The Problem

Most blogging systems are overkill for a personal portfolio. I needed something that:

- Let me write in markdown (fast, distraction-free)
- Generated static HTML (performant, portable)
- Required minimal tooling (keep it simple)
- Integrated with my existing static site

## The Solution

A simple build script that converts markdown to HTML. Here's how it works:

### 1. Write in Markdown

Create a `.md` file with frontmatter:

```markdown
---
title: My Article Title
date: February 1, 2026
description: A short description
slug: my-article-slug
---

Your content here...
```

### 2. Build with Node.js

A simple script reads the markdown files, parses frontmatter, converts content to HTML, and injects it into a template.

```javascript
const { marked } = require('marked');
const matter = require('gray-matter');

const { data, content } = matter(fileContent);
const html = marked(content);
```

### 3. Serve Static Files

The build happens during Docker image creation. The final container just serves static HTML with Caddy.

## Why This Works

**Simplicity**: Two dependencies, one build script, one template.

**Performance**: Static HTML is fast. No runtime processing.

**Portability**: Markdown files are future-proof. Easy to migrate.

**Developer Experience**: Write markdown, run build, deploy. That's it.

## Trade-offs

This approach sacrifices features for simplicity:

- No dynamic content
- No search (yet)
- No tags/categories (yet)
- Requires rebuild for changes

For a personal portfolio, these trade-offs are worth it. I can add features later if needed.

## Key Learnings

1. **Start simple** - Don't add features you don't need yet
2. **Optimize for writing** - Markdown is faster than HTML
3. **Build-time over runtime** - Generate static files when possible
4. **Docker multi-stage builds** - Keep final images small

---

**Questions or thoughts?** [Get in touch](mailto:hr23232323@gmail.com)
