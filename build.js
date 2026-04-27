#!/usr/bin/env node
/**
 * BUILD — Tarhuala data pipeline
 *
 * What this does:
 *   1. Reads site.json  -> writes public/data/site.json
 *   2. Reads novels/    -> converts .docx to chapter JSON, writes public/data/<novel>/
 *   3. Rebuilds public/data/novels.json from public/data/<novel>/info.json files
 *   4. Mirrors source deletions: chapters removed from novels/<Novel>/ are deleted
 *      from public/data/<id>/, and entire novels removed from novels/ are pruned.
 *   5. Writes public/data/stats.json with site-wide content insights for the author.
 *   6. Generates public/sitemap.xml from current novel + chapter data.
 *
 * What this NEVER does:
 *   - Overwrite public/css/style.css
 *   - Overwrite public/js/app.js
 *   - Overwrite any public/*.html file (except meta tags + sitemap.xml)
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

// Strip HTML tags and collapse whitespace, then count words. Used for stats only.
function htmlWordCount(html) {
  if (!html) return 0;
  const text = String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 0;
  return text.split(' ').length;
}

// Remove every chapter-N.json in novelDataDir whose number is NOT in keepSet.
// Returns the count of removed files.
function pruneChapterFiles(novelDataDir, keepSet) {
  if (!fs.existsSync(novelDataDir)) return 0;
  let removed = 0;
  for (const fname of fs.readdirSync(novelDataDir)) {
    const m = fname.match(/^chapter-(\d+)\.json$/);
    if (!m) continue;
    const num = parseInt(m[1], 10);
    if (!keepSet.has(num)) {
      try {
        fs.unlinkSync(path.join(novelDataDir, fname));
        console.log(`    - removed stale ${fname}`);
        removed++;
      } catch (e) {
        console.warn(`    x could not remove ${fname}:`, e.message);
      }
    }
  }
  return removed;
}

// Recursively delete a directory. Used when an entire novel is removed from source.
function rmRf(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p)) {
    const full = path.join(p, entry);
    if (fs.statSync(full).isDirectory()) rmRf(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(p);
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

// Returns { chapters: [...], sourceNums: Set<number> } when a zip exists.
// sourceNums is the set of chapter numbers that came from the zip (used to prune deletions).
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
  const sourceNums = new Set([...docxByNum.keys(), ...jsonByNum.keys()]);

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
  return { chapters: buildChapterListFromDisk(novelDataDir), sourceNums };
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

      // Snapshot the previous info.json for this novel before any mutation —
      // we need _sourceChapters to know what was sourced last build, for accurate deletion detection.
      let existingPreSync = {};
      const preSyncInfoPath = path.join(DATA_DIR, novelId, 'info.json');
      if (fs.existsSync(preSyncInfoPath)) {
        try { existingPreSync = JSON.parse(fs.readFileSync(preSyncInfoPath, 'utf-8')); } catch(e) {}
      }

      // Cover image. Source folder wins so updates propagate; otherwise
      // fall back to whatever already lives under public/images/.
      // SVG is the first extension findImage tries, so it takes priority.
      let coverUrl = null;
      const srcCover = findImage(novelPath, 'cover') || findImage(novelPath, 'front');
      if (srcCover) {
        const dest = path.join(IMG_DIR, novelId, 'cover' + srcCover.ext);
        copyFile(srcCover.path, dest);
        coverUrl = '/images/' + novelId + '/cover' + srcCover.ext;
      } else {
        coverUrl = resolveExistingCover(novelId);
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
      // sourceNums tracks which chapter numbers come from this build's source (zip or loose files).
      // If non-empty, we strict-sync: any chapter-N.json not in this set is removed.
      let chapterList = null;
      let sourceNums = new Set();

      const zipResult = await processNovelZip(novelPath, novelDataDir);
      if (zipResult) {
        chapterList = zipResult.chapters;
        sourceNums  = zipResult.sourceNums;
      }

      // Always also scan loose files so a docx added/edited next to the zip is reflected.
      const sourceFiles = fs.existsSync(novelPath) ? fs.readdirSync(novelPath) : [];

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

      for (const [num, sources] of [...byNum].sort((a, b) => a[0] - b[0])) {
        sourceNums.add(num);
        const outPath = path.join(novelDataDir, `chapter-${num}.json`);

        if (sources.docx) {
          // docx wins — always re-process so edits/overwrites are reflected.
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

      // Deletion sync. Two layers:
      //   1. prev_sourceChapters delta — anything tracked from source last build
      //      and absent now is removed (the original behaviour).
      //   2. Strict source-of-truth sync — when novels/<Name>/ exists *and*
      //      yields at least one chapter this build, the source folder is the
      //      authority: any chapter-N.json on disk that's not in sourceNums is
      //      removed too. Without this, chapter-N.json files added before the
      //      _sourceChapters tracking existed would linger forever.
      // To preserve genuinely hand-authored chapters (no source folder, or an
      // empty one), strict-sync is skipped when sourceNums is empty.
      const prevSourceNums = Array.isArray(existingPreSync && existingPreSync._sourceChapters)
        ? new Set(existingPreSync._sourceChapters)
        : new Set();
      const toRemove = new Set();
      for (const num of prevSourceNums) {
        if (!sourceNums.has(num)) toRemove.add(num);
      }
      if (sourceNums.size > 0) {
        for (const fname of fs.readdirSync(novelDataDir)) {
          const m = fname.match(/^chapter-(\d+)\.json$/);
          if (!m) continue;
          const num = parseInt(m[1], 10);
          if (!sourceNums.has(num)) toRemove.add(num);
        }
      }
      for (const num of toRemove) {
        const f = path.join(novelDataDir, `chapter-${num}.json`);
        if (fs.existsSync(f)) {
          try {
            fs.unlinkSync(f);
            console.log(`    - removed chapter-${num}.json (not in source)`);
          } catch (e) {
            console.warn(`    x could not remove chapter-${num}.json:`, e.message);
          }
        }
      }

      chapterList = buildChapterListFromDisk(novelDataDir);
      const syncTag = sourceNums.size > 0 ? `(source: ${sourceNums.size}, total on disk: ${chapterList.length})` : '(no source, preserved)';
      console.log('    chapters:', chapterList.length, syncTag);

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
        // Tracks that this novel has a source folder in novels/. If the folder is later
        // removed, the next build prunes the corresponding public/data/<id>/.
        _buildSource: 'novels',
        // Chapter numbers that came from this build's source files. Used next build
        // to detect *intentional* deletions (number was sourced before but no longer is).
        _sourceChapters: [...sourceNums].sort((a, b) => a - b),
      };
      fs.writeFileSync(existingInfoPath, JSON.stringify(info, null, 2));

      novels.push({
        id: info.id, title: info.title, genre: info.genre,
        tags: info.tags, status: info.status, rating: info.rating,
        description: info.description, theme: info.theme,
        chapterCount: chapterList.length, images: info.images,
      });
    }

    // Whole-novel deletion: if a public/data/<id>/ was previously built from a
    // novels/<Name> source folder (info.json has _buildSource: "novels") but that
    // source folder no longer exists, prune the entire data dir.
    // Otherwise (truly data-only novels), pick them up as before.
    const processedIds = new Set(novels.map(n => n.id));
    const dataDirs = fs.readdirSync(DATA_DIR)
      .filter(f => {
        const full = path.join(DATA_DIR, f);
        return fs.statSync(full).isDirectory() && !processedIds.has(f);
      });
    for (const dirName of dataDirs) {
      const infoPath = path.join(DATA_DIR, dirName, 'info.json');
      if (!fs.existsSync(infoPath)) continue;
      let info;
      try { info = JSON.parse(fs.readFileSync(infoPath, 'utf-8')); }
      catch(e) { console.warn('  x could not read info.json for', dirName); continue; }

      if (info && info._buildSource === 'novels') {
        // Source folder is gone — prune the whole novel from public/data/.
        rmRf(path.join(DATA_DIR, dirName));
        console.log('\n  - removed novel (source deleted):', info.title || dirName);
        continue;
      }

      // True data-only novel: keep it.
      buildChapterListFromDisk(path.join(DATA_DIR, dirName));
      novels.push({
        id: info.id, title: info.title, genre: info.genre,
        tags: info.tags, status: info.status, rating: info.rating,
        description: info.description, theme: info.theme,
        chapterCount: (info.chapters || []).length, images: info.images,
      });
      console.log('\n  Novel (data-only):', info.title);
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

  // Build version stamp — used by app.js to cache-bust /data/*.json fetches
  // so the browser + Vercel CDN always pick up the latest after a deploy.
  const buildStamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHMMSS

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
    '// Build version — app.js appends this to /data/*.json fetches as ?v=...',
    'const BUILD_VERSION = "' + buildStamp + '";',
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

    // JSON-LD — replace the first <script type="application/ld+json">…</script> block
    // (without an id, so dynamic ones from app.js are untouched) with a richer block.
    const jsonldForPage = (function() {
      if (!siteUrl) return null;
      const personLD = {
        '@type': 'Person',
        name: authorName,
        url: siteUrl,
      };
      if (fname === 'index.html') {
        return {
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', name: authorName, url: siteUrl + '/',
              description: seoBlock.description,
              author: personLD,
              potentialAction: { '@type': 'SearchAction', target: siteUrl + '/novels.html' } },
            { ...personLD, '@context': undefined,
              jobTitle: 'Author',
              description: site.bio || seoBlock.description },
          ],
        };
      }
      if (fname === 'novels.html') {
        return {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `All Novels — ${authorName}`,
          url: siteUrl + '/novels.html',
          description: pageDescriptions['novels.html'],
          author: personLD,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: novels.length,
            itemListElement: novels.map((n, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Book',
                name: n.title,
                url: `${siteUrl}/novel.html?id=${n.id}`,
                author: personLD,
                genre: n.genre,
                bookFormat: 'EBook',
                inLanguage: 'en',
                image: (n.images && n.images.cover) ? siteUrl + n.images.cover : undefined,
                numberOfPages: n.chapterCount,
              },
            })),
          },
        };
      }
      if (fname === 'about.html') {
        return {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            ...personLD,
            description: site.bio || seoBlock.description,
            knowsAbout: novelGenres,
          },
        };
      }
      return null;
    })();

    if (jsonldForPage) {
      const ldStr = JSON.stringify(jsonldForPage, (k, v) => v === undefined ? undefined : v);
      // Replace the first ld+json block that has no id attribute (page-static block).
      // Don't disturb id="jsonld-data" blocks (those belong to app.js dynamic injection).
      src = src.replace(
        /<script\s+type="application\/ld\+json"\s*>[\s\S]*?<\/script>/i,
        `<script type="application/ld+json">${ldStr}</script>`
      );
    }

    fs.writeFileSync(fpath, src);
  }
  console.log('  ok html meta tags patched (' + htmlFiles.length + ' files)');

  // 3e-2. Asset cache-busting — stamp every CSS + JS reference with today's build date.
  //       Runs on EVERY build so deployment always serves fresh assets.
  //       Handles both versioned (?v=XXXXXXXX) and unversioned references.
  const buildDate = new Date().toISOString().slice(0,10).replace(/-/g,''); // YYYYMMDD
  const assetPatterns = [
    // CSS
    { re: /\/css\/(style|css-additions)\.css(\?v=\d+)?/g,       tag: (m,n) => `/css/${n}.css?v=${buildDate}` },
    // JS
    { re: /\/js\/(app|router|reader|theme|banner-wiring|chapters_data)\.js(\?v=\d+)?/g, tag: (m,n) => `/js/${n}.js?v=${buildDate}` },
  ];
  const allHtmlFiles = fs.readdirSync(PUBLIC).filter(f => f.endsWith('.html'));
  let versionedCount = 0;
  for (const fname of allHtmlFiles) {
    const fpath = path.join(PUBLIC, fname);
    let src = fs.readFileSync(fpath, 'utf8');
    let changed = false;
    for (const { re, tag } of assetPatterns) {
      const next = src.replace(re, (m, name) => tag(m, name));
      if (next !== src) { src = next; changed = true; }
    }
    if (changed) { fs.writeFileSync(fpath, src); versionedCount++; }
  }
  console.log(`  ok asset versions stamped ?v=${buildDate} (${versionedCount} files updated)`);

  // 3f. Generate sitemap.xml from current data — every novel + every chapter URL.
  //     Auto-keeps in sync with deletions and additions.
  if (siteUrl) {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [];
    function pushUrl(loc, changefreq, priority, lastmod) {
      urls.push({ loc, changefreq, priority, lastmod: lastmod || today });
    }
    pushUrl(siteUrl + '/',              'daily',   '1.0');
    pushUrl(siteUrl + '/novels.html',   'daily',   '0.95');
    pushUrl(siteUrl + '/about.html',    'monthly', '0.7');

    for (const novel of novels) {
      pushUrl(`${siteUrl}/novel.html?id=${novel.id}`, 'weekly', '0.9');
      pushUrl(`${siteUrl}/chapters.html?id=${novel.id}`, 'weekly', '0.8');

      const novelDataDir = path.join(DATA_DIR, novel.id);
      if (!fs.existsSync(novelDataDir)) continue;
      const chFiles = fs.readdirSync(novelDataDir)
        .filter(f => /^chapter-\d+\.json$/.test(f))
        .sort((a, b) => parseInt(a.match(/(\d+)/)[1], 10) - parseInt(b.match(/(\d+)/)[1], 10));
      for (const fname of chFiles) {
        const num = parseInt(fname.match(/(\d+)/)[1], 10);
        const stat = fs.statSync(path.join(novelDataDir, fname));
        const lastmod = stat.mtime.toISOString().slice(0, 10);
        pushUrl(`${siteUrl}/chapter.html?id=${novel.id}&ch=${num}`, 'weekly', '0.7', lastmod);
      }
    }

    const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const sitemapXml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(u =>
        `  <url><loc>${xmlEsc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod>` +
        `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      ).join('\n') +
      '\n</urlset>\n';
    fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemapXml);
    console.log('  ok sitemap.xml (' + urls.length + ' urls)');

    // robots.txt — refresh sitemap URL so it always matches site.url.
    const robots =
      'User-agent: *\n' +
      'Allow: /\n' +
      'Disallow: /analytics.html\n' +
      'Disallow: /analytics\n\n' +
      `Sitemap: ${siteUrl}/sitemap.xml\n`;
    fs.writeFileSync(path.join(PUBLIC, 'robots.txt'), robots);
    console.log('  ok robots.txt');
  } else {
    console.log('  (skipped sitemap — site.url not set)');
  }

  // 3g. Site-wide content stats — for the analytics page (author insights).
  //     Read every chapter once so the analytics page can render statically.
  const statsNovels = [];
  let totalWords = 0;
  let totalChapters = 0;

  for (const novel of novels) {
    const novelDataDir = path.join(DATA_DIR, novel.id);
    if (!fs.existsSync(novelDataDir)) continue;

    const chFiles = fs.readdirSync(novelDataDir)
      .filter(f => /^chapter-\d+\.json$/.test(f))
      .sort((a, b) => parseInt(a.match(/(\d+)/)[1], 10) - parseInt(b.match(/(\d+)/)[1], 10));

    let novelWords = 0;
    let lastUpdated = 0;
    const chapterStats = [];

    for (const fname of chFiles) {
      const num = parseInt(fname.match(/(\d+)/)[1], 10);
      const fpath = path.join(novelDataDir, fname);
      const stat = fs.statSync(fpath);
      let words = 0, title = `Chapter ${num}`;
      try {
        const ch = JSON.parse(fs.readFileSync(fpath, 'utf-8'));
        words = htmlWordCount(ch.html || ch.content || '');
        title = ch.title || title;
      } catch (e) {}
      novelWords += words;
      if (stat.mtimeMs > lastUpdated) lastUpdated = stat.mtimeMs;
      chapterStats.push({ number: num, title, words });
    }

    totalWords += novelWords;
    totalChapters += chFiles.length;

    statsNovels.push({
      id:           novel.id,
      title:        novel.title,
      genre:        novel.genre,
      tags:         novel.tags || [],
      status:       novel.status,
      theme:        novel.theme,
      chapterCount: chFiles.length,
      words:        novelWords,
      avgWords:     chFiles.length ? Math.round(novelWords / chFiles.length) : 0,
      lastUpdated:  lastUpdated ? new Date(lastUpdated).toISOString() : null,
      chapters:     chapterStats,
    });
  }

  // Aggregate genres / tags / statuses
  const genreCounts = {};
  const tagCounts = {};
  const statusCounts = {};
  for (const n of statsNovels) {
    (n.genre || '').split('/').map(g => g.trim()).filter(Boolean).forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    (n.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
    if (n.status) statusCounts[n.status] = (statusCounts[n.status] || 0) + 1;
  }

  const stats = {
    generatedAt:      new Date().toISOString(),
    totalNovels:      statsNovels.length,
    totalChapters,
    totalWords,
    avgWordsPerChapter: totalChapters ? Math.round(totalWords / totalChapters) : 0,
    avgChaptersPerNovel: statsNovels.length ? +(totalChapters / statsNovels.length).toFixed(1) : 0,
    longestChapter:   statsNovels
      .flatMap(n => n.chapters.map(c => ({ novel: n.title, novelId: n.id, ...c })))
      .sort((a, b) => b.words - a.words)[0] || null,
    novels:           statsNovels,
    genres:           Object.entries(genreCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    tags:             Object.entries(tagCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    statuses:         Object.entries(statusCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  };
  fs.writeFileSync(path.join(DATA_DIR, 'stats.json'), JSON.stringify(stats, null, 2));
  console.log('  ok data/stats.json (' + totalChapters + ' chapters, ' + totalWords.toLocaleString() + ' words)');

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