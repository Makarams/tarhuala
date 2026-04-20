#!/usr/bin/env node
/**
 * BUILD — Tarhuala data pipeline
 *
 * What this does:
 *   1. Reads site.json  -> writes public/data/site.json
 *   2. Reads novels/    -> converts .docx to chapter JSON, writes public/data/<novel>/
 *   3. Rebuilds public/data/novels.json from public/data/<novel>/info.json files
 *
 * What this NEVER does:
 *   - Overwrite public/css/style.css
 *   - Overwrite public/js/app.js
 *   - Overwrite any public/*.html file
 *
 * public/ is the designed frontend — it is the source of truth.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

let mammoth;
try { mammoth = require('mammoth'); } catch(e) { mammoth = null; }

let AdmZip;
try { AdmZip = require('adm-zip'); } catch(e) { AdmZip = null; }

const ROOT       = __dirname;
const NOVELS_DIR = path.join(ROOT, 'novels');
const PUBLIC     = path.join(ROOT, 'public');
const DATA_DIR   = path.join(PUBLIC, 'data');
const IMG_DIR    = path.join(PUBLIC, 'images');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseChapterFilename(filename) {
  const base = path.basename(filename, '.docx');
  const m = base.match(/^Chapter_(\d+)_(.+)$/i);
  if (!m) return null;
  return { number: parseInt(m[1], 10), title: m[2].replace(/_/g, ' '), filename };
}

function findImage(dir, baseName) {
  if (!fs.existsSync(dir)) return null;
  for (const ext of ['.svg', '.jpg', '.jpeg', '.png', '.webp', '.avif']) {
    const p = path.join(dir, baseName + ext);
    if (fs.existsSync(p)) return { path: p, ext };
  }
  return null;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function resolveExistingCover(novelId) {
  const coversDir = path.join(IMG_DIR, 'covers');
  const f1 = findImage(coversDir, novelId);
  if (f1) return '/images/covers/' + novelId + f1.ext;
  const novelImgDir = path.join(IMG_DIR, novelId);
  const f2 = findImage(novelImgDir, 'cover');
  if (f2) return '/images/' + novelId + '/cover' + f2.ext;
  return null;
}

async function docxToHtml(docxPath) {
  if (!mammoth) return '';
  try {
    return (await mammoth.convertToHtml({ path: docxPath })).value || '';
  } catch (e) {
    console.warn('    x mammoth failed:', path.basename(docxPath), e.message);
    return '';
  }
}

function buildChapterListFromDisk(novelDataDir) {
  const files = fs.readdirSync(novelDataDir).filter(f => /^chapter-\d+\.json$/.test(f));
  const chapters = [];
  for (const fname of files) {
    const num = parseInt(fname.match(/chapter-(\d+)\.json/)[1], 10);
    try {
      const ch = JSON.parse(fs.readFileSync(path.join(novelDataDir, fname), 'utf-8'));
      chapters.push({ number: num, title: ch.title || `Chapter ${num}` });
    } catch(e) {
      chapters.push({ number: num, title: `Chapter ${num}` });
    }
  }
  return chapters.sort((a, b) => a.number - b.number);
}

async function processNovelZip(novelPath, novelDataDir) {
  const zipPath = path.join(novelPath, 'novel.zip');
  if (!fs.existsSync(zipPath) || !AdmZip) return null;
  console.log('    -> novel.zip found, extracting missing chapters...');
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries()
    .filter(e => e.entryName.toLowerCase().endsWith('.docx') && !e.isDirectory);
  for (const entry of entries) {
    const ch = parseChapterFilename(entry.entryName.split('/').pop());
    if (!ch) continue;
    const outPath = path.join(novelDataDir, `chapter-${ch.number}.json`);
    if (fs.existsSync(outPath)) continue; // already extracted — skip
    let html = '';
    if (mammoth) {
      try {
        const tmp = path.join(ROOT, `_tmp_${ch.number}.docx`);
        fs.writeFileSync(tmp, entry.getData());
        html = (await mammoth.convertToHtml({ path: tmp })).value || '';
        fs.unlinkSync(tmp);
      } catch (e) { console.warn('      x ch', ch.number, e.message); }
    }
    fs.writeFileSync(outPath, JSON.stringify({ number: ch.number, title: ch.title, html }));
  }
  // Build chapter list from ALL chapter-N.json files on disk (not just what was in zip)
  return buildChapterListFromDisk(novelDataDir);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function build() {
  console.log('\n-- Tarhuala build --\n');

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(IMG_DIR,  { recursive: true });

  // 1. site.json
  const sitePath = path.join(ROOT, 'site.json');
  let site = { author: 'Tarhuala', tagline: '', bio: '', url: '', seo: {} };
  if (fs.existsSync(sitePath)) {
    try { site = JSON.parse(fs.readFileSync(sitePath, 'utf-8')); console.log('  ok site.json'); }
    catch (e) { console.warn('  x site.json:', e.message); }
  }
  fs.writeFileSync(path.join(DATA_DIR, 'site.json'),
    JSON.stringify({ author: site.author, tagline: site.tagline, bio: site.bio }));

  const novels = [];

  // 2. Process novels/ if present
  if (fs.existsSync(NOVELS_DIR)) {
    const folders = fs.readdirSync(NOVELS_DIR)
      .filter(f => fs.statSync(path.join(NOVELS_DIR, f)).isDirectory());

    for (const folder of folders) {
      const novelPath    = path.join(NOVELS_DIR, folder);
      const novelId      = slugify(folder);
      const novelDataDir = path.join(DATA_DIR, novelId);
      fs.mkdirSync(novelDataDir, { recursive: true });
      console.log('\n  Novel:', folder);

      // Load meta - info.json (from novels/ folder) wins over meta.json
      let meta = {};
      const metaFile = path.join(novelPath, 'meta.json');
      const infoFile = path.join(novelPath, 'info.json');
      if (fs.existsSync(metaFile)) { try { meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8')); } catch(e) {} }
      if (fs.existsSync(infoFile)) { try { meta = Object.assign(meta, JSON.parse(fs.readFileSync(infoFile, 'utf-8'))); } catch(e) {} }

      // Cover image
      let coverUrl = resolveExistingCover(novelId);
      if (!coverUrl) {
        const src = findImage(novelPath, 'cover') || findImage(novelPath, 'front');
        if (src) {
          const dest = path.join(IMG_DIR, novelId, 'cover' + src.ext);
          copyFile(src.path, dest);
          coverUrl = '/images/' + novelId + '/cover' + src.ext;
        }
      }
      console.log('    cover:', coverUrl || '(none)');

      // Author image (copy once)
      const authorImgDir = path.join(IMG_DIR, 'author');
      if (!findImage(authorImgDir, 'author')) {
        const src = findImage(ROOT, 'author') || findImage(novelPath, 'author');
        if (src) {
          fs.mkdirSync(authorImgDir, { recursive: true });
          copyFile(src.path, path.join(authorImgDir, 'author' + src.ext));
          console.log('    author image copied');
        }
      }

      // Chapters
      let chapterList = await processNovelZip(novelPath, novelDataDir);
      if (!chapterList || chapterList.length === 0) {
        const docxFiles = fs.readdirSync(novelPath).filter(f => f.toLowerCase().endsWith('.docx'));
        const parsed = docxFiles.map(parseChapterFilename).filter(Boolean)
          .sort((a, b) => a.number - b.number);
        chapterList = [];
        for (const ch of parsed) {
          const outPath = path.join(novelDataDir, `chapter-${ch.number}.json`);
          if (!fs.existsSync(outPath)) {
            const html = await docxToHtml(path.join(novelPath, ch.filename));
            fs.writeFileSync(outPath, JSON.stringify({ number: ch.number, title: ch.title, html }));
          }
        }
        // Always build from disk so previously-converted chapters aren't lost
        chapterList = buildChapterListFromDisk(novelDataDir);
      }
      console.log('    chapters:', chapterList.length);

      // Merge: public/data/<id>/info.json editorial fields win over novels/meta
      // This means edits made via the previous sessions are preserved.
      const existingInfoPath = path.join(DATA_DIR, novelId, 'info.json');
      let existing = {};
      if (fs.existsSync(existingInfoPath)) {
        try { existing = JSON.parse(fs.readFileSync(existingInfoPath, 'utf-8')); } catch(e) {}
      }

      const info = {
        id:          novelId,
        title:       existing.title       || meta.title       || folder,
        genre:       existing.genre       || meta.genre       || 'Fiction',
        tags:        existing.tags        || meta.tags        || [],
        status:      existing.status      || meta.status      || 'Ongoing',
        rating:      existing.rating      || meta.rating      || 'Mature',
        description: existing.description || meta.description || '',
        theme:       existing.theme       || meta.theme       || 'ember',
        images:      { cover: coverUrl || (existing.images && existing.images.cover) || '' },
        chapters:    chapterList,
        platforms:   existing.platforms   || meta.platforms   || [],
      };
      fs.writeFileSync(existingInfoPath, JSON.stringify(info, null, 2));

      novels.push({
        id: info.id, title: info.title, genre: info.genre,
        tags: info.tags, status: info.status, rating: info.rating,
        description: info.description, theme: info.theme,
        chapterCount: chapterList.length, images: info.images,
      });
    }

    // Also pick up any novels that live only in public/data/ (no source folder in novels/)
    const processedIds = new Set(novels.map(n => n.id));
    const dataDirs = fs.readdirSync(DATA_DIR)
      .filter(f => {
        const full = path.join(DATA_DIR, f);
        return fs.statSync(full).isDirectory() && !processedIds.has(f);
      });
    for (const dirName of dataDirs) {
      const infoPath = path.join(DATA_DIR, dirName, 'info.json');
      if (!fs.existsSync(infoPath)) continue;
      try {
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
        novels.push({
          id: info.id, title: info.title, genre: info.genre,
          tags: info.tags, status: info.status, rating: info.rating,
          description: info.description, theme: info.theme,
          chapterCount: (info.chapters || []).length, images: info.images,
        });
        console.log('\n  Novel (data-only):', info.title);
      } catch(e) { console.warn('  x could not read info.json for', dirName); }
    }

  } else {
    // No novels/ dir — rebuild novels.json from existing public/data/<id>/info.json
    console.log('  (no novels/ dir — reading existing public/data/)');
    const existingJson = path.join(DATA_DIR, 'novels.json');
    if (fs.existsSync(existingJson)) {
      try {
        const existing = JSON.parse(fs.readFileSync(existingJson, 'utf-8'));
        for (const n of existing) {
          const infoPath = path.join(DATA_DIR, n.id, 'info.json');
          if (fs.existsSync(infoPath)) {
            try {
              const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
              novels.push({
                id: info.id, title: info.title, genre: info.genre,
                tags: info.tags, status: info.status, rating: info.rating,
                description: info.description, theme: info.theme,
                chapterCount: (info.chapters || []).length, images: info.images,
              });
            } catch(e) { novels.push(n); }
          } else {
            novels.push(n);
          }
        }
        console.log('  ok', novels.length, 'novel(s) from existing data');
      } catch(e) { console.warn('  x novels.json read error:', e.message); }
    }
  }

  // 3. Write novels.json
  fs.writeFileSync(path.join(DATA_DIR, 'novels.json'), JSON.stringify(novels, null, 2));
  console.log('\n  ok novels.json ->', novels.length, 'novel(s)');

  // 4. Sanity check (warn only — never create missing files)
  const required = [
    'index.html', 'novels.html', 'novel.html', 'chapter.html',
    'about.html', 'css/style.css', 'js/app.js',
  ];
  const missing = required.filter(f => !fs.existsSync(path.join(PUBLIC, f)));
  if (missing.length) {
    console.warn('\n  WARNING: missing public files (make sure these are committed to git):');
    missing.forEach(f => console.warn('    -', f));
  } else {
    console.log('  ok all public files present');
  }

  console.log('\n-- done --\n');
}

build().catch(err => { console.error('Build error:', err); process.exit(1); });
