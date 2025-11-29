# Harsh Rana - Personal Portfolio Website

A deliberately minimal, zero-framework personal portfolio built with vanilla HTML, CSS, and JavaScript.

**Philosophy:** _simple + easy to update >> new/cool/complex tech_

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Quick Start - Docker Development](#quick-start---docker-development)
3. [File Structure](#file-structure)
4. [Technology Stack](#technology-stack)
5. [Code Organization Guide](#code-organization-guide)
6. [How to Update](#how-to-update)
7. [Previous Versions](#previous-versions)

---

## Project Overview

This is a single-page portfolio website that showcases:
- **Professional background** - Education and work experience
- **Project portfolio** - Filterable carousel with Data Science and Software Development projects
- **Social links** - Fixed navigation sidebar with social media connections

### Key Features
- ✅ No build tools - deploy HTML/CSS/JS directly
- ✅ Instant load times - minimal external dependencies
- ✅ Mobile responsive - breakpoint at 500px
- ✅ Accessible - semantic HTML, ARIA labels
- ✅ Well-documented code - ready for updates and improvements

---

## Quick Start - Docker Development

### Prerequisites
- Docker installed ([get Docker](https://www.docker.com/get-started))
- Make (comes with macOS and Linux; Windows users can use WSL or install GNU Make)

### Setup & Development

```bash
# First time setup - builds the Docker image
make build

# Start development server with hot reload
make up

# Open your browser to:
# http://localhost

# That's it! Edit any CSS/JS/HTML file and your browser auto-refreshes
# 💡 Tip: Open DevTools (F12) to see the "[Hot Reload] Changes detected" message

# View logs (if needed)
make logs

# Stop the server
make down

# Clean up Docker resources
make clean
```

### What's Happening

The Makefile and Docker setup provides:

| Command | What it does |
|---------|-------------|
| `make build` | Builds Docker image with Caddy web server |
| `make up` | Starts container, enables hot reload (watches files) |
| `make down` | Stops the container |
| `make logs` | Shows live server logs |
| `make shell` | Opens a shell inside the container |
| `make clean` | Removes containers and image |

**Hot Reload Details:**
- Checks for file changes every 1 second
- Works for HTML, CSS, JS, images - everything!
- Only runs locally (localhost) - safe for production
- **Remember to remove before deploying** (see [Production](#production-considerations) section)

### Help

Run `make help` to see all available commands with descriptions.

---

## File Structure

```
personal_portfolio_minimal/
├── index.html                      # Main entry point (with hot reload script)
├── Dockerfile                      # Docker config (Caddy web server)
├── Makefile                        # Development commands
├── Caddyfile                       # Web server configuration
├── css/
│   ├── stylesheet.css              # CSS variables, custom fonts
│   └── styles.css                  # All layout and component styles
├── js/
│   └── scripts_main.js             # Interactive features (carousel, scroll effects)
├── img/                            # Images and assets
│   ├── projects/                   # Project screenshots (6 images)
│   ├── harsh_circle*.jpg           # Profile images
│   ├── word_art*.png               # Design assets
│   └── bullet_4.png                # Custom bullet icon
├── static/                         # Custom fonts
│   └── AvertaQuibi-*.woff2        # 4 font weights (Black, Bold, Regular, Semibold)
├── favicon-*.png                   # Favicon files
└── README.md                       # This file
```

**New Development Files:**
- **Dockerfile** - Containerizes the portfolio with Caddy web server
- **Makefile** - Simple commands: `make build`, `make up`, `make down`, etc.
- **Caddyfile** - Web server config with caching headers and compression

---

## Technology Stack

### Frontend
| Layer | Technology | Notes |
|-------|-----------|-------|
| **HTML** | HTML5 | Semantic markup, no templating |
| **CSS** | CSS3 + Variables | Flexbox, custom properties, responsive design |
| **JavaScript** | Vanilla ES6 | No frameworks or libraries |
| **Icons** | Font Awesome 5.2.0 | Social media icons (CDN) |
| **Fonts** | Custom (AvertaQuibi) + Google Fonts | Oswald, Raleway (CDN) |

### Deployment
- **Static site** - No build step required
- **Hosting** - Any web server (GitHub Pages, Netlify, etc.)

---

## Code Organization Guide

### index.html - Main Structure
The HTML file is organized into clear sections:

```
1. HEAD
   - Meta tags (viewport, SEO, open graph)
   - Links to stylesheets
   - External resources (Font Awesome, Google Fonts)

2. BODY SECTIONS
   a) Fixed Navigation Sidebar - Social links (Twitter, LinkedIn, GitHub, etc.)
   b) Hero/Landing Section - Full-screen headline with highlights
   c) Main Content
      - About Section - Background, education, work experience
      - Projects Section - Filterable carousel
      - Footer - Copyright
```

**To add/edit content:** Look for section comments (`<!-- SECTION_NAME -->`) to find what you need to modify.

### stylesheet.css - Design Variables
This file defines all design constants:

```css
:root {
  /* Text Colors */
  --text-primary: hsl(0, 0%, 25%);           /* Dark grey - main text */
  --text-secondary: hsl(240, 10%, 60%);      /* Medium grey */
  --text-highlight: hsla(76, 53%, 64%, 0.75);/* Yellow-green - highlights */
  --text-light: hsl(120, 50%, 100%);         /* White */

  /* Background Colors */
  --bg-primary: hsl(240, 10%, 100%);         /* White */
  --bg-secondary: hsl(353, 42%, 45%);        /* Red/burgundy - hero */
  --bg-grey: hsl(240, 10%, 80%);             /* Light grey */
}
```

**To change colors/fonts:** Update variables here - all uses throughout the site will automatically update.

### styles.css - Layout and Components
Organized by section with clear headers:

```
1. Base Styles - Body, headings, universal rules
2. Basic Layout - Main containers, flexbox structure
3. Landing Section - Hero area styling
4. Fixed Navigation - Sidebar nav styling
5. About Section - Background and experience styling
6. Projects Section - Carousel and card styling
7. Footer - Copyright styling
8. Mobile Responsive - 500px breakpoint adjustments
```

**Key classes:**
- `.main` - Main content wrapper
- `.section` - Content sections (about, projects)
- `.content` - Centered content container (70% width)
- `.project-carousel` - Carousel container (holds 2 rows side-by-side)
- `.project-tile` - Individual project cards

### scripts_main.js - Interactive Features
Three main features:

#### 1. **Project Carousel Filtering**
Functions that handle "Data Science" vs "Software Development" tab clicks:
- `ds_btn_click()` - Desktop animation for Data Science view
- `sd_btn_click()` - Desktop animation for Software Development view
- `ds_btn_click_mob()` - Mobile animation for Data Science view
- `sd_btn_click_mob()` - Mobile animation for Software Development view

**How it works:**
- Carousel is 200% width (holds 2 project rows)
- Clicking buttons triggers CSS transforms to slide between views
- Different distances: Desktop (-1022%), Mobile (-333%)
- Staggered animations for visual appeal

#### 2. **Scroll-Based Icon Color Change**
```javascript
document.addEventListener("scroll", function() { ... })
```
- Tracks if hero section is still visible
- White icons over hero, dark icons over main content
- Smooth visual transition as you scroll

#### 3. **Experience Section Switching** (Legacy)
- Originally used for tabbed experience switching
- Now experience items display inline
- Code kept for potential future reactivation

---

## How to Update

### Adding/Editing Content

**Update your headline:**
```html
<!-- index.html, line 106 -->
<h1>I'm interested in...your text here...</h1>
```

**Update work experience:**
```html
<!-- index.html, lines 105-142 -->
<!-- Edit the exp-1, exp-2, exp-3 divs with your details -->
```

**Update projects:**
```html
<!-- index.html, lines 170-312 -->
<!-- Edit the project-tile divs with new project info -->
```

**Update social links:**
```html
<!-- index.html, lines 67-93 -->
<!-- Edit href attributes and aria-labels -->
```

### Changing Colors/Fonts

**Change color scheme:**
```css
/* stylesheet.css, lines 32-45 */
--text-primary: hsl(0, 0%, 25%);      /* Change this */
--bg-secondary: hsl(353, 42%, 45%);   /* And this */
```

**Add new fonts:**
```css
/* stylesheet.css */
@font-face {
    font-family: 'MyFont';
    src: url('../static/MyFont.woff2') format('woff2');
}
```

### Modifying Layout

**Adjust content width (currently 70%):**
```css
/* styles.css, line 50 */
.content {
    width: 70%;  /* Change to 60%, 80%, etc. */
}
```

**Adjust mobile breakpoint (currently 500px):**
```css
/* styles.css, line 594 */
@media screen and (max-width: 500px) { ... }
```

### Testing

Since there's no build step:
1. Open `index.html` in a browser locally
2. Make changes to any file
3. Refresh browser to see updates
4. Deploy by uploading files to your server

---

## Design System Reference

### Color Palette
| Variable | Value | Usage |
|----------|-------|-------|
| `--text-primary` | Dark grey | Main body text |
| `--text-secondary` | Medium grey | Dates, secondary info |
| `--text-highlight` | Yellow-green | Highlighted keywords |
| `--text-light` | White | Text on dark backgrounds |
| `--bg-primary` | White | Main background |
| `--bg-secondary` | Red/burgundy | Hero section, footer |
| `--bg-grey` | Light grey | Hover states, borders |
| `--text-blue` | Blue | Links |

### Typography
- **Headlines** - AvertaQuibi-Bold
- **Body text** - AvertaQuibi-Regular
- **Secondary font** - Oswald (Google Fonts)
- **Fallback** - Helvetica, sans-serif

### Spacing
- Content width: 70% on desktop, adjusts on mobile
- Section padding: 5% 10%
- Mobile padding: 5% 5%

---

## Production Considerations

### Before Deploying

**Remove Hot Reload Script:**
The hot reload script should only exist in development. Before deploying:

1. Open `index.html`
2. Find and delete the hot reload script (comment block that starts with `<!-- HOT RELOAD - Development Only -->`)
3. This is the `<script>` block that checks `if (window.location.hostname === 'localhost'...)`
4. Save and commit

Alternatively, you can keep the script since it only activates on `localhost`, but it's cleaner to remove it.

### Docker for Production

If deploying with Docker:

1. **Build without volume mount:**
   ```bash
   docker build -t portfolio:prod .
   ```

2. **Run without volume mount:**
   ```bash
   docker run -d --name portfolio-prod -p 2015:2015 portfolio:prod
   ```

3. **The Caddyfile is production-ready:**
   - Gzip compression enabled
   - Cache headers configured
   - Security headers included
   - No debug features enabled

### Manual Deployment

Since this is a static site, you can deploy to any web server:

- **GitHub Pages** - Push to gh-pages branch
- **Netlify** - Connect repo, auto-deploys on push
- **Vercel** - Same as Netlify
- **Traditional hosting** - FTP/SFTP the files to your server
- **Docker** - Use the `Dockerfile` to containerize and deploy

No build process needed!

---

## Previous Versions

#### Current Design
![website-new](https://user-images.githubusercontent.com/19507491/186786837-9f248e0e-277d-4917-a0e8-47d69f5d0518.png)

#### V1 Design
![website-old](https://user-images.githubusercontent.com/19507491/186786802-b1c592f3-aa69-448a-a17f-b69a0e259c90.png)
