#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, 'musings', 'content');
const OUTPUT_DIR = path.join(__dirname, 'musings');
const TEMPLATE_PATH = path.join(__dirname, 'musings', 'musing-template.html');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Read template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Get all markdown files
const mdFiles = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

if (mdFiles.length === 0) {
  console.log('No markdown files found in musings/content/');
  process.exit(0);
}

console.log(`\n🔨 Building ${mdFiles.length} musing(s)...\n`);

// Process each markdown file
mdFiles.forEach(file => {
  const fileContent = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  if (!frontmatter.title || !frontmatter.date || !frontmatter.slug) {
    console.error(`❌ ${file}: Missing required frontmatter (title, date, slug)`);
    return;
  }

  const htmlContent = marked(content, { breaks: true });
  const output = template
    .replace(/{{TITLE}}/g, frontmatter.title)
    .replace(/{{DATE}}/g, frontmatter.date)
    .replace(/{{DESCRIPTION}}/g, frontmatter.description || frontmatter.title)
    .replace(/{{CONTENT}}/g, htmlContent);

  fs.writeFileSync(path.join(OUTPUT_DIR, `${frontmatter.slug}.html`), output, 'utf-8');
  console.log(`✓ ${file} → ${frontmatter.slug}.html`);
});

console.log(`\n✅ Build complete! ${mdFiles.length} musing(s) generated.\n`);
