TARHUALA — Redesign
===================

This zip contains a new "public/" folder — a DROP-IN REPLACEMENT for the
existing public/ folder in your Node.js site. Your build.js, server.js, 
package.json, and novels/ folder are unchanged.

TO DEPLOY
---------
1. Back up your current public/ folder (rename it public-old/ or similar).
2. Extract this zip into your project root — it will create public/.
3. Run `node server.js` (or `npm start`) as usual.
4. Data and images are preserved — the new JS/CSS/HTML reads them exactly
   as before.

WHAT'S INSIDE
-------------
/public
  index.html       — Home (hero + novel grid)
  novels.html      — All novels list
  novel.html       — Per-novel detail page
  chapter.html     — Chapter reader
  about.html       — About the author
  /css/style.css   — Full design system (tokens, themes, kbach)
  /js/app.js       — All page logic + kbach SVG library (auto-injected)
  /data            — Your existing novel data (preserved)
  /images          — Your existing images (preserved)

DESIGN NOTES
------------
- Dark/light mode auto-detects from system preference, persists in localStorage.
- Each novel declares its own accent via its info.json "theme" field.
  Supported values: "ember", "gold", "jade", "indigo".
  Legacy values "red" and "blue" still work (aliased to ember/indigo).
- Kbach (Khmer temple ornament) motifs appear as SVG primitives used
  differently on every page — no repetition.
- All motion respects `prefers-reduced-motion`.

ADDING A NEW NOVEL
------------------
Drop its folder into novels/ as before and re-run build.js. Set its
"theme" in info.json to one of the four accents for custom coloring.
