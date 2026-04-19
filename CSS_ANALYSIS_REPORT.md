# CSS Selector Analysis Report for Tarhuala Website

## Executive Summary

Analyzed both CSS files (style.css and patch.css) against all HTML files and JavaScript files to identify unused CSS selectors (classes and IDs).

**Total CSS Selectors Found:** 150+
**Unused Selectors:** None found - ALL selectors defined in CSS are used in HTML or JavaScript

## Analysis Methodology

1. ✅ Extracted all CSS class selectors (`.className`) from both style.css and patch.css
2. ✅ Extracted all CSS ID selectors (`#elementId`) from both style.css and patch.css
3. ✅ Searched for usage of these selectors in:
   - All 7 HTML files (index.html, about.html, chapters.html, chapter.html, novels.html, novel.html, analytics.html)
   - All 5 JavaScript files (app.js, theme.js, reader.js, router.js, chapters_data.js)
4. ✅ Verified CSS-only selectors (pseudo-elements, pseudo-classes, media queries, animations)

## Key Findings

### Completely Used Selectors
All CSS classes and IDs defined in the CSS files are used in the HTML and JavaScript files.

### CSS Structure Overview

**style.css contains:**
- Design tokens and CSS variables (colors, typography, layout)
- Navigation styles
- Button and component styles
- Home hero section
- Featured hero section (base version, extended in patch.css)
- Novels grid and list views
- Novel detail pages
- Chapter reader interface
- Analytics page styles
- Responsive design breakpoints

**patch.css contains:**
- Alternative/enhanced versions of featured hero components
- Novel card snippets
- Responsive media queries for featured hero
- Home hero stats responsive breakpoints

### Animation and Keyframe Usage

All animations defined in CSS are referenced:
- `slowSpin` - used in `.page-hero-rose`, `.home-hero-rose`, `.novel-hero-rose`, `.featured-hero-ornament`
- `voidPulse` - used in `.home-hero::before`
- `scrollBob` - used in `.hero-scroll-cue`
- `featuredSpin` - used in `.featured-hero-emblem` (patch.css)

### Media Query Coverage

All media queries contain selectors that are actively used in the HTML:
- `@media (max-width: 480px)` - `.novels-grid`, `.home-hero-stats`
- `@media (max-width: 600px)` - featured hero responsive
- `@media (max-width: 680px)` - navigation, novels grid responsive
- `@media (max-width: 700px)` - novel list responsive, analytics responsive
- `@media (max-width: 760px)` - chapters page, chapter reader, novel list
- `@media (max-width: 900px)` - featured hero responsive

## CSS Classes Used in HTML

### Navigation Components
- `.site-nav`, `.nav-brand`, `.nav-emblem`, `.nav-links`, `.nav-link`, `.nav-right`, `.icon-btn`, `.nav-toggle`

### Buttons and CTA
- `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-outline`

### Typography and Components
- `.eyebrow`, `.page-title`, `.page-hero-sub`, `.kb-vborder`, `.pill`, `.pill-status`, `.pill-rating`, `.tag`

### Home Page
- `.home-hero`, `.home-hero-bg`, `.home-hero-rose`, `.home-hero-content`, `.home-hero-eyebrow`, `.home-hero-title`, `.home-hero-tagline`, `.home-hero-cta`, `.home-hero-stats`
- `.hero-stat`, `.hero-stat-num`, `.hero-stat-label`, `.hero-stat-sep`, `.hero-scroll-cue`, `.hero-scroll-cue-line`

### Featured Hero (Home Page)
- `.featured-hero`, `.featured-hero-bg`, `.featured-hero-bg-overlay`, `.featured-hero-inner`, `.featured-hero-badge`, `.featured-hero-emblem`, `.featured-hero-eyebrow`, `.featured-hero-body`, `.featured-hero-genre`, `.featured-hero-title`, `.featured-hero-chapter-line`, `.featured-hero-ch-label`, `.featured-hero-ch-sep`, `.featured-hero-ch-title`, `.featured-hero-snippet`, `.featured-hero-cta`, `.featured-hero-ornament`

### Novels Display
- `.novels-section`, `.novels-section-inner`, `.section-head`, `.novels-grid`
- `.novel-card`, `.novel-card-link`, `.novel-card-cover`, `.novel-card-badges`, `.novel-card-title`, `.novel-card-body`, `.novel-card-genre`, `.novel-card-latest`, `.novel-card-snippet`, `.novel-card-tags`, `.novel-card-foot`, `.novel-chcount`, `.novel-read-cta`

### Novel List Page
- `.novels-list-wrap`, `.novels-list-inner`
- `.novel-list-item`, `.novel-list-link`, `.novel-list-cover-wrap`, `.novel-list-cover`, `.novel-list-body`, `.novel-list-genre`, `.novel-list-title`, `.novel-list-desc`, `.novel-list-foot`, `.novel-list-cta`, `.novel-list-rose`

### Novel Detail Page
- `.novel-hero`, `.novel-hero-bg`, `.novel-hero-bg-img`, `.novel-hero-rose`, `.novel-hero-inner`, `.novel-cover-wrap`, `.novel-cover-frame`, `.kb-corner`, `.novel-detail-cover`
- `.novel-hero-text`, `.novel-title`, `.novel-hero-meta`, `.novel-hero-desc`, `.novel-hero-tags`, `.novel-platforms`, `.platform-link`, `.novel-hero-cta`

### Chapters Section
- `.novel-chapters-section`, `.novel-chapters-inner`, `.chapters-toolbar`, `.chapters-count`, `.chapters-sort`, `.sort-btn`, `.chapters-full-list`, `.ch-item`, `.ch-link`, `.ch-num`, `.ch-title-text`, `.ch-arrow`

### Reader Interface
- `.reader-settings-panel`, `.rsp-label`, `.reader-body`, `.reader-bar__font-label`

### Page Structure
- `.page-hero-bar`, `.page-hero-inner`, `.page-hero-rose`
- `.back-to-top`, `.site-footer`, `.footer-inner`, `.footer-brand`, `.footer-links`, `.footer-link`, `.footer-meta`, `.footer-cw`, `.footer-analytics-link`

### Analytics Page
- `.analytics-wrap`, `.analytics-header`, `.analytics-title`, `.analytics-subtitle`, `.analytics-reset-btn`
- `.kpi-grid`, `.kpi-card`, `.kpi-label`, `.kpi-value`, `.kpi-sub`
- `.insight-strip`, `.insight-card`, `.insight-title`, `.insight-value`, `.insight-sub`
- `.analytics-grid`, `.card`, `.card-title`, `.bar-chart`, `.bar-row`, `.bar-label`, `.bar-track`, `.bar-fill`, `.bar-count`
- `.sparkline-wrap`, `.spark-bar`, `.spark-label`, `.reads-wrap`, `.reads-table`, `.rank-num`, `.ch-title`, `.novel-badge`
- `.reads-mobile`, `.reads-mobile-item`, `.reads-mobile-top`, `.reads-mobile-title`, `.reads-mobile-meta`, `.empty-state`

### Utilities
- `.grain-overlay`, `.kbach-defs`, `.kb-rose`, `.kb-corner`

## CSS IDs Used in HTML

- `#site-nav`, `#nav-links`, `#theme-toggle`, `#nav-toggle`
- `#home-hero`, `#featured-hero`, `#featured-hero-bg-img`
- `#featured-hero-genre`, `#featured-hero-title`, `#featured-hero-ch-label`, `#featured-hero-ch-title`, `#featured-hero-snippet`, `#featured-hero-cta`
- `#stat-novels`, `#stat-chapters`
- `#novel-genre`, `#novel-title`, `#novel-status`, `#novel-chcount`, `#novel-rating`, `#novel-desc`, `#novel-tags`, `#novel-platforms`, `#novel-read-btn`, `#novel-chapters`
- `#novel-cover`, `#novel-hero-bg-img`
- `#chapters-novel-title`, `#chapters-hero-sub`, `#visible-count`, `#chapters-full-list`, `#chapters-search-input`, `#chapters-empty`
- `#novel-cover`
- `#back-to-top`
- `#copy-year`, `#footer-copy`
- Analytics IDs: `#reset-stats-btn`, `#kpi-visits`, `#kpi-reads`, `#kpi-novels-read`, `#kpi-total-chapters`, `#kpi-progress`, `#kpi-last-visit`, `#kpi-last-visit-rel`, `#ins-active-day`, `#ins-active-day-sub`, `#ins-today-visits`, `#ins-avg-visits`, `#novel-reads-chart`, `#visit-sparkline`, `#sparkline-label`, `#top-chapters-body`, `#top-chapters-mobile`

## Recommendations

### ✅ No Action Required

All CSS selectors in both style.css and patch.css are actively used in the website. There are no unused CSS rules that can be safely removed.

### Observations

1. **Well-maintained CSS**: The codebase shows good organization with all defined selectors being utilized.

2. **Responsive Design**: Comprehensive media query coverage ensures all breakpoints are properly styled with used selectors.

3. **Patch.css Usage**: The patch.css file contains alternative and extended styles for the featured hero component and is properly integrated.

4. **Animation Usage**: All CSS animations and keyframes are properly referenced and used.

5. **Semantic Classnames**: The CSS uses semantic, descriptive class names that make it easy to identify the purpose of each selector.

## Conclusion

After comprehensive analysis of both CSS files against all HTML and JavaScript files in the Tarhuala website project:

- **Total CSS selectors analyzed**: 150+
- **Unused selectors found**: 0
- **CSS optimization opportunity**: None - All styles are being utilized

The CSS architecture is clean and well-maintained with no unused selectors to remove. The website demonstrates good CSS hygiene practices.

---

**Analysis Date:** 2024
**Files Analyzed:** 
- CSS: style.css, patch.css
- HTML: index.html, about.html, chapters.html, chapter.html, novels.html, novel.html, analytics.html  
- JS: app.js, theme.js, reader.js, router.js, chapters_data.js
