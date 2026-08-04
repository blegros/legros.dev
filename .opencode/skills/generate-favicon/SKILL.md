# generate-favicon

## Description
This skill provides a standard process and script for generating a complete set of favicons from a single master SVG file. It follows modern web best practices by relying on a scalable SVG as the primary icon, while providing PNG and ICO fallbacks for legacy browsers, iOS, and Android PWAs.

## When to use
Use this skill when:
- You need to generate favicons for a new website.
- You are updating an existing website's icon.
- You want to ensure cross-browser compatibility (iOS home screens, Android manifests, legacy desktop browsers) using a single source of truth (SVG).

## Requirements
- Node.js installed.
- A master SVG file (usually `favicon.svg`).

## How it works
The `generate.js` script inside this folder uses the `sharp` and `png-to-ico` packages to read the master SVG and output:
1. `favicon-16x16.png`
2. `favicon-32x32.png`
3. `apple-touch-icon.png` (180x180)
4. `favicon.ico`

### Standard HTML Meta Tags
After generation, inject the following into the `<head>` of your project (e.g., in Hugo, `layouts/_partials/custom_head.html`):

```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff">
```

## Instructions for Agent
1. Create the `favicon.svg` file first.
2. Run `npm install` inside the `.opencode/skills/generate-favicon` directory to install dependencies (`sharp`, `png-to-ico`).
3. Run `node .opencode/skills/generate-favicon/generate.js <path-to-favicon.svg> <output-directory>`
4. Create the `site.webmanifest` in the output directory.
5. Add the HTML meta tags to the project's `<head>`.
