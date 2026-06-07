# Fontopsy 🔬

> **WhatTheFont meets a medical autopsy diagram — built for designers who want to understand, not just identify.**

Fontopsy is a free, open-source font identification and analysis tool. Drop a screenshot, get a complete typographic breakdown: anatomy overlay, free alternatives, and pairing suggestions in under five seconds.

**[Live Demo →](https://fontopsy.vercel.app)**

---

## Features

- **Font Identification** — Upload any image containing text; Google Cloud Vision OCR extracts the text, and a weighted metric-matching algorithm identifies the closest font from a curated library of 149 Google Fonts.
- **Typographic Anatomy Overlay** — Interactive SVG diagram showing baseline, x-height, cap height, ascender, and descender lines — labeled like a clinical diagram.
- **Free Alternatives** — Three free Google Fonts alternatives with live previews and one-click CSS copy.
- **Type Tester** — Type any text and see it rendered in all four fonts simultaneously at any size.
- **Font Pairings** — Curated display + body pairing suggestions with rationale.
- **Shareable Card** — Export a 1200×630 PNG card for client decks and social posts.
- **Recent Analyses** — Last 5 analyses saved locally for quick re-access.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS custom properties |
| OCR | Google Cloud Vision API |
| Font Library | Google Fonts (149-font curated corpus) |
| Image Upload | Uploadthing |
| Share Card | @vercel/og (Edge runtime) |
| Animations | Framer Motion + CSS keyframes |
| UI Primitives | Radix UI (Tooltip, Tabs, Slider) |
| Testing | Vitest (unit) + Playwright (E2E) |
| Hosting | Vercel |

---

## Local Development

### Prerequisites

- Node.js 20.11.0 (`nvm use 20.11.0`)
- pnpm 9.x (`corepack enable && corepack prepare pnpm@9 --activate`)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/fontopsy.git
cd fontopsy
pnpm install