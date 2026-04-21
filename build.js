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
  const allFiles = fs.readdirSync(novelDataDir);

  // Migrate legacy Chapter_N_Title.json → chapter-N.json
  // Format: Chapter_1_New_Beginning.json  (matches parseChapterFilename pattern)
  for (const fname of allFiles) {
    if (!/^Chapter_\d+_/i.test(fname) || !fname.endsWith('.json')) continue;
    const parsed = parseChapterFilename(fname.replace(/\.json$/, '') + '.docx');
    if (!parsed) continue;
    const canonical = `chapter-${parsed.number}.json`;
    const canonicalPath = path.join(novelDataDir, canonical);
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(novelDataDir, fname), 'utf-8'));
      // Normalise to the standard shape used by app.js: { number, title, html/content }
      const normalised = {
        number: parsed.number,
        title:  raw.title  || parsed.title,
        html:   raw.html   || raw.content || '',
      };
      fs.writeFileSync(canonicalPath, JSON.stringify(normalised, null, 2));
      console.log(`    migrated ${fname} → ${canonical}`);
    } catch (e) {
      console.warn(`    x could not migrate ${fname}:`, e.message);
    }
  }

  // Now read all canonical chapter-N.json files
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
  const allEntries = zip.getEntries().filter(e => !e.isDirectory);

  // Collect docx and json entries by chapter number.
  // Docx wins: if both exist for the same chapter, only process the docx.
  const docxByNum = new Map();
  const jsonByNum = new Map();
  for (const entry of allEntries) {
    const base = entry.entryName.split('/').pop();
    if (base.toLowerCase().endsWith('.docx')) {
      const ch = parseChapterFilename(base);
      if (ch) docxByNum.set(ch.number, { entry, ch });
    } else if (base.toLowerCase().endsWith('.json')) {
      const ch = parseChapterFilename(base.replace(/\.json$/i, '.docx'));
      if (ch) jsonByNum.set(ch.number, { entry, ch });
    }
  }

  // Process docx entries
  for (const { entry, ch } of docxByNum.values()) {
    const outPath = path.join(novelDataDir, `chapter-${ch.number}.json`);
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
    console.log(`      + docx ch${ch.number}: ${ch.title}`);
  }

  // Process json entries only when no docx exists for the same chapter number
  for (const [num, { entry, ch }] of jsonByNum) {
    if (docxByNum.has(num)) continue; // docx wins
    const outPath = path.join(novelDataDir, `chapter-${ch.number}.json`);
    try {
      const raw = JSON.parse(entry.getData().toString('utf-8'));
      const normalised = {
        number: ch.number,
        title:  raw.title   || ch.title,
        html:   raw.html    || raw.content || '',
      };
      fs.writeFileSync(outPath, JSON.stringify(normalised, null, 2));
      console.log(`      + json  ch${ch.number}: ${ch.title}`);
    } catch (e) { console.warn(`      x json ch${ch.number}:`, e.message); }
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
  let site = { author: '', tagline: '', bio: '', url: '', seo: {} };
  if (fs.existsSync(sitePath)) {
    try { site = JSON.parse(fs.readFileSync(sitePath, 'utf-8')); console.log('  ok site.json'); }
    catch (e) { console.warn('  x site.json:', e.message); }
  }
  // Write full site.json — all fields, no stripping. SEO keywords regenerated after novels are processed.
  // We write it again at the end once we know all novel titles.

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
        const sourceFiles = fs.readdirSync(novelPath);

        // Map chapter number → { docx?, json? } so we can apply "docx wins" rule
        const byNum = new Map();
        for (const f of sourceFiles) {
          if (f.toLowerCase().endsWith('.docx')) {
            const ch = parseChapterFilename(f);
            if (!ch) continue;
            if (!byNum.has(ch.number)) byNum.set(ch.number, {});
            byNum.get(ch.number).docx = ch;
          } else if (f.toLowerCase().endsWith('.json') && /^Chapter_\d+_/i.test(f)) {
            const ch = parseChapterFilename(f.replace(/\.json$/i, '.docx'));
            if (!ch) continue;
            if (!byNum.has(ch.number)) byNum.set(ch.number, {});
            byNum.get(ch.number).json = { ...ch, filename: f };
          }
        }

        for (const [, sources] of [...byNum].sort((a, b) => a[0] - b[0])) {
          const outPath = path.join(novelDataDir, `chapter-${(sources.docx || sources.json).number}.json`);

          if (sources.docx) {
            // docx wins
            const html = await docxToHtml(path.join(novelPath, sources.docx.filename));
            fs.writeFileSync(outPath, JSON.stringify({ number: sources.docx.number, title: sources.docx.title, html }));
            console.log(`      + docx ch${sources.docx.number}: ${sources.docx.title}`);
          } else if (sources.json) {
            // json fallback
            try {
              const raw = JSON.parse(fs.readFileSync(path.join(novelPath, sources.json.filename), 'utf-8'));
              const normalised = {
                number: sources.json.number,
                title:  raw.title   || sources.json.title,
                html:   raw.html    || raw.content || '',
              };
              fs.writeFileSync(outPath, JSON.stringify(normalised, null, 2));
              console.log(`      + json  ch${sources.json.number}: ${sources.json.title}`);
            } catch (e) { console.warn(`      x json ch${sources.json.number}:`, e.message); }
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
        // Migrate any Chapter_N_Title.json files to chapter-N.json before reading
        buildChapterListFromDisk(path.join(DATA_DIR, dirName));
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
              // Migrate any Chapter_N_Title.json files to chapter-N.json
              buildChapterListFromDisk(path.join(DATA_DIR, n.id));
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

  // 3. Write public/data/novels.json
  fs.writeFileSync(path.join(DATA_DIR, 'novels.json'), JSON.stringify(novels, null, 2));
  console.log('\n  ok novels.json ->', novels.length, 'novel(s)');

  // 3b. Sync public/js/novels.json (preserves banner images from the existing file)
  const jsNovelsPath = path.join(PUBLIC, 'js', 'novels.json');
  let jsNovelsExisting = [];
  if (fs.existsSync(jsNovelsPath)) {
    try { jsNovelsExisting = JSON.parse(fs.readFileSync(jsNovelsPath, 'utf-8')); } catch(e) {}
  }
  // Build a lookup so we can carry forward banner/extra image fields
  const jsNovelsById = {};
  for (const n of jsNovelsExisting) jsNovelsById[n.id] = n;

  const jsNovels = novels.map(n => {
    const prev = jsNovelsById[n.id] || {};
    const prevImages = prev.images || {};
    return {
      id:           n.id,
      title:        n.title,
      genre:        n.genre,
      tags:         n.tags,
      status:       n.status,
      rating:       n.rating,
      description:  n.description,
      theme:        n.theme,
      chapterCount: n.chapterCount,
      images: {
        cover:  n.images.cover  || prevImages.cover  || '',
        banner: prevImages.banner || '',   // kept from existing js/novels.json
      },
    };
  });
  fs.writeFileSync(jsNovelsPath, JSON.stringify(jsNovels, null, 2));
  console.log('  ok js/novels.json synced');

  // 3c. Write public/js/chapters_data.js — full chapter index per novel
  //     Format: const CHAPTERS_DATA = { "novel-id": [{ number, title }, ...], ... }
  const chaptersDataMap = {};
  for (const novel of novels) {
    const novelDataDir = path.join(DATA_DIR, novel.id);
    if (!fs.existsSync(novelDataDir)) { chaptersDataMap[novel.id] = []; continue; }

    const chFiles = fs.readdirSync(novelDataDir)
      .filter(f => /^chapter-\d+\.json$/.test(f));

    const chapters = [];
    for (const fname of chFiles) {
      const num = parseInt(fname.match(/chapter-(\d+)\.json/)[1], 10);
      try {
        const ch = JSON.parse(fs.readFileSync(path.join(novelDataDir, fname), 'utf-8'));
        chapters.push({ number: num, title: ch.title || `Chapter ${num}` });
      } catch(e) {
        chapters.push({ number: num, title: `Chapter ${num}` });
      }
    }
    chaptersDataMap[novel.id] = chapters.sort((a, b) => a.number - b.number);
  }

  const chaptersDataJs = [
    '// Auto-generated by build.js — do not edit manually.',
    '// Add Chapter_N_Title.json / .docx to novels/<Novel>/ then run: node build.js',
    '//',
    '// chaptersData[novelId] = [{ number, title }, ...]',
    'const CHAPTERS_DATA = ' + JSON.stringify(chaptersDataMap, null, 2) + ';',
    '',
    '// Total chapter count across all novels',
    'const TOTAL_CHAPTER_COUNT = Object.values(CHAPTERS_DATA)',
    '  .reduce(function(sum, chs){ return sum + chs.length; }, 0);',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(PUBLIC, 'js', 'chapters_data.js'), chaptersDataJs);
  console.log('  ok js/chapters_data.js ->', Object.values(chaptersDataMap).reduce((s,c)=>s+c.length,0), 'total chapter(s)');

  // 3d. Write public/data/site.json — ALL fields including url + seo.
  //     Auto-generate seo.keywords and seo.description from live novel data (no hardcoding).
  const novelTitles   = novels.map(n => n.title);
  const novelGenres   = [...new Set(novels.flatMap(n => (n.genre || '').split('/').map(g => g.trim()).filter(Boolean)))];
  const novelTags     = [...new Set(novels.flatMap(n => n.tags || []))];
  const siteUrl       = (site.url || '').replace(/\/$/, '');
  const authorName    = site.author || '';

  // Keywords = author + all novel titles + all genres + all tags + evergreen terms — zero hardcoding
  const autoKeywords  = [
    authorName,
    ...novelTitles,
    ...novelGenres,
    ...novelTags,
    'web novel', 'read online free', 'free chapters', 'online reading',
  ].filter(Boolean);
  const uniqueKeywords = [...new Set(autoKeywords.map(k => k.toLowerCase()))].join(', ');

  // Description = author tagline + novel list (entirely from data)
  const novelList = novelTitles.length
    ? novelTitles.join(', ')
    : 'ongoing series';
  const autoDesc = authorName
    ? `Read ${novelGenres.slice(0,3).join(', ')} web novels by ${authorName}. ${novelList} — free online fiction, updated regularly.`
    : `${novelList} — free online fiction, updated regularly.`;

  const seoBlock = Object.assign({}, site.seo || {}, {
    keywords:    uniqueKeywords,
    description: (site.seo && site.seo.descriptionOverride) || autoDesc,
    // title and ogImage kept from site.json if set, auto-generated otherwise
    title: (site.seo && site.seo.title) ||
           (authorName ? `${authorName} \u2014 ${novelGenres.slice(0,2).join(' & ')} Web Novels | Read Free Online` : 'Web Novels | Read Free Online'),
    ogImage: (site.seo && site.seo.ogImage) || '/images/og-cover.jpg',
  });

  const publicSiteJson = {
    author:  authorName,
    tagline: site.tagline || '',
    bio:     site.bio     || '',
    url:     siteUrl,
    seo:     seoBlock,
  };
  fs.writeFileSync(path.join(DATA_DIR, 'site.json'), JSON.stringify(publicSiteJson, null, 2));
  console.log('  ok data/site.json written (', novels.length, 'novels,', autoKeywords.length, 'keywords )');

  // 3e. Patch <meta> tags in all HTML files — no novel names or author ever hardcoded in HTML.
  //     Only patches description + keywords + OG fields; never touches structure/scripts/CSS.
  const htmlFiles = ['index.html', 'novels.html', 'about.html', 'novel.html', 'chapter.html', 'chapters.html'];

  // Per-page static descriptions (not novel-specific, so they don't need regeneration each build
  // beyond ensuring the author name and keywords are current).
  const pageDescriptions = {
    'index.html':    seoBlock.description,
    'novels.html':   authorName
      ? `Browse all web novels by ${authorName}. ${novelGenres.slice(0,3).join(', ')} fiction — read free online.`
      : 'Browse all web novels. Read free online.',
    'about.html':    authorName
      ? `About ${authorName} — web fiction author. ${novelGenres.slice(0,2).join(' & ')} novels, updated regularly.`
      : 'About the author. Web fiction, updated regularly.',
    'novel.html':    seoBlock.description,   // gets replaced dynamically by app.js per novel
    'chapter.html':  seoBlock.description,   // gets replaced dynamically by app.js per chapter
    'chapters.html': seoBlock.description,   // gets replaced dynamically by app.js per novel
  };

  function patchMetaTag(html, name, content) {
    // Handles both name= and property= meta tags (for OG)
    const escaped = content.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // name= variant
    html = html.replace(
      new RegExp(`(<meta\\s+name="${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"\\s+content=")[^"]*("\\s*/?>)`, 'i'),
      `$1${escaped}$2`
    );
    // property= variant (OG)
    html = html.replace(
      new RegExp(`(<meta\\s+property="${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"\\s+content=")[^"]*("\\s*/?>)`, 'i'),
      `$1${escaped}$2`
    );
    return html;
  }

  function patchTitle(html, title) {
    return html.replace(/(<title>)[^<]*/i, `$1${title.replace(/</g,'&lt;').replace(/>/g,'&gt;')}`);
  }

  for (const fname of htmlFiles) {
    const fpath = path.join(PUBLIC, fname);
    if (!fs.existsSync(fpath)) continue;
    let src = fs.readFileSync(fpath, 'utf-8');

    const desc = pageDescriptions[fname] || seoBlock.description;
    const pageTitle = seoBlock.title || authorName;

    src = patchMetaTag(src, 'description',         desc);
    src = patchMetaTag(src, 'keywords',             uniqueKeywords);
    src = patchMetaTag(src, 'author',               authorName);
    src = patchMetaTag(src, 'og:description',       desc);
    src = patchMetaTag(src, 'og:site_name',         authorName);
    src = patchMetaTag(src, 'twitter:description',  desc);
    // Only patch the main <title> on pages where it isn't set dynamically by app.js
    if (['index.html', 'novels.html', 'about.html'].includes(fname)) {
      src = patchTitle(src, pageTitle);
      src = patchMetaTag(src, 'og:title',           pageTitle);
      src = patchMetaTag(src, 'twitter:title',      pageTitle);
    }

    fs.writeFileSync(fpath, src);
  }
  console.log('  ok html meta tags patched (' + htmlFiles.length + ' files)');

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