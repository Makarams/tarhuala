# Novel Website

Zero-config author website. Everything is auto-detected from folders and files.  
You never write novel names, chapter titles, or descriptions in code.

---

## Setup

```bash
npm install
node create-samples.js   # optional: test chapters
npm start                 # builds + serves at http://localhost:3000
```

---

## File Structure (what you edit)

```
site.json                              ← your name, bio, SEO (edit once)
author.jpg                             ← author photo (root folder, optional)

novels/
├── My First Novel/                    ← folder name = novel title
│   ├── meta.json                      ← genre, tags, description
│   ├── cover.jpg                      ← book cover (optional)
│   ├── front.jpg                      ← front page design (optional)
│   ├── back.jpg                       ← back page design (optional)
│   ├── Chapter_1_The_Beginning.docx
│   ├── Chapter_2_The_Journey.docx
│   └── Chapter_15_The_End.docx
│
└── Another Novel/                     ← just add another folder
    ├── meta.json
    ├── cover.png
    ├── Chapter_1_Prologue.docx
    └── ...
```

### site.json

```json
{
  "author": "Your Pen Name",
  "tagline": "Short tagline shown under your name",
  "bio": "A longer paragraph about you shown on the home page.",
  "url": "https://yourdomain.com",
  "seo": {
    "title": "Your Name — Genre Fiction",
    "description": "Meta description for search engines.",
    "keywords": "your, keywords, here",
    "ogImage": "/images/og-cover.jpg"
  }
}
```

### meta.json (per novel)

```json
{
  "genre": "Dark Fantasy",
  "tags": ["Fantasy", "Action", "Horror"],
  "status": "Ongoing",
  "rating": "Mature",
  "description": "Your novel synopsis here."
}
```

If no `meta.json` exists, defaults are used (genre = "Fiction", status = "Ongoing").

### Chapter naming

Format: `Chapter_<number>_<Title_With_Underscores>.docx`

- `Chapter_1_The_Beginning.docx` → Chapter 1: "The Beginning"
- `Chapter_14_Clash_at_the_Market.docx` → Chapter 14: "Clash at the Market"
- `Chapter_100_Final_Stand.docx` → Chapter 100: "Final Stand"

Sorted by number automatically.

### Images

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`

| File | Where | Shows |
|------|-------|-------|
| `author.jpg` | project root | Home page avatar |
| `cover.jpg` | novel folder | Home cards + detail page |
| `front.jpg` | novel folder | Detail page (front page design) |
| `back.jpg` | novel folder | Detail page (back page design) |
| `og-cover.jpg` | `public/images/` | Social media share preview |

If missing, a placeholder box appears. No errors.

---

## Adding a New Novel

1. Create a folder in `novels/` (the name becomes the title)
2. Add `.docx` chapter files
3. Optionally add `meta.json`, `cover.jpg`, `front.jpg`, `back.jpg`
4. Run `npm run build`

That's it. No code to edit.

---

## Rebuild After Changes

```bash
npm run build
```

This converts all `.docx` files → JSON, copies images, and regenerates `index.html` with your SEO config.

---

## Deploy to Vercel

The site builds to a static `public/` folder.

```bash
npm i -g vercel
vercel
```

Or connect your repo to Vercel — it runs `npm run build` and deploys `public/` automatically.
`vercel.json` is included and configured.

---

## Project Structure (code — you don't need to touch this)

```
├── build.js              ← scans novels/ → generates public/data/ + public/index.html
├── server.js             ← local dev server
├── vercel.json           ← Vercel config
├── create-samples.js     ← generates test .docx files
├── site.json             ← YOUR site config
├── novels/               ← YOUR content
└── public/               ← BUILT output (deployed)
    ├── index.html        ← generated from site.json
    ├── css/style.css     ← styles + dark/light theme
    ├── js/
    │   ├── theme.js      ← dark/light toggle
    │   ├── router.js     ← SPA routing
    │   └── app.js        ← renders pages from JSON data
    ├── data/             ← generated from novels/
    └── images/           ← copied from novels/
```

---

## Customization

| What | Where |
|------|-------|
| Author name, bio, SEO | `site.json` |
| Novel info | `novels/[name]/meta.json` |
| Colors & fonts | `public/css/style.css` → CSS variables at the top |
| Port | `PORT` env variable (default: 3000) |
"# tarhuala" 
