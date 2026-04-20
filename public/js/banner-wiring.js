/* ═══════════════════════════════════════════════════════════════════════════
   BANNER WIRING — add this logic into your existing app.js

   In novel.html:
     After you load the novel data and set novel-cover / novel-hero-bg-img,
     call  mountNovelBanner(novel)

   In chapter.html:
     After you load the chapter data and know which novel it belongs to,
     call  mountChapterBanner(novel)

   Both functions look for novel.images.banner. If it isn't present (e.g.
   novels that don't have a banner yet) they silently hide the section.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Mount the decorative banner on the novel detail page.
 * @param {Object} novel - the novel data object from novels.json / info.json
 */
function mountNovelBanner(novel) {
  const section = document.getElementById('novel-banner');
  const img     = document.getElementById('novel-banner-img');
  const eyebrow = document.getElementById('novel-banner-eyebrow');

  if (!section || !img) return;

  const bannerSrc = novel?.images?.banner;
  if (!bannerSrc) {
    section.hidden = true;
    return;
  }

  // Apply per-novel accent so the CSS overlay tint matches
  if (novel.theme) {
    document.documentElement.setAttribute('data-accent', novel.theme);
  }

  img.src = bannerSrc;
  img.alt = '';  // decorative

  if (eyebrow) {
    // Show a short tagline from genre, or just the theme label
    eyebrow.textContent = novel.genre
      ? novel.genre.split('/')[0].trim()
      : novel.theme || '';
  }

  section.hidden = false;
}


/**
 * Mount the slim decorative banner in the chapter reader.
 * @param {Object} novel - the parent novel data object
 */
function mountChapterBanner(novel) {
  const wrap  = document.getElementById('chapter-banner-wrap');
  const img   = document.getElementById('chapter-banner-img');
  const label = document.getElementById('chapter-banner-novel-label');

  if (!wrap || !img) return;

  const bannerSrc = novel?.images?.banner;
  if (!bannerSrc) {
    wrap.hidden = true;
    return;
  }

  if (novel.theme) {
    document.documentElement.setAttribute('data-accent', novel.theme);
  }

  img.src = bannerSrc;
  img.alt = '';

  if (label) {
    label.textContent = novel.title || '';
  }

  wrap.hidden = false;
}


/* ─── Example integration into existing novel-page init ──────────────────

   Assuming you already have something like:

   async function initNovelPage() {
     const slug  = getSlugFromURL();
     const novel = await fetchNovelData(slug);   // however you load it

     // ... existing code that sets title, cover, hero-bg-img, etc. ...

     mountNovelBanner(novel);   // ← ADD THIS LINE
   }

   ─── Example integration into existing chapter-page init ─────────────────

   async function initChapterPage() {
     const { novelSlug, chapterNum } = parseURL();
     const novel   = await fetchNovelData(novelSlug);
     const chapter = await fetchChapterData(novelSlug, chapterNum);

     // ... existing code that sets chapter title, body, nav links ...

     mountChapterBanner(novel);   // ← ADD THIS LINE
   }

   ──────────────────────────────────────────────────────────────────────── */
