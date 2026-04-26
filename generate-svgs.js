#!/usr/bin/env node
/**
 * generate-svgs.js
 * Generates all SVG images for the Tarhuala site:
 *   - public/images/covers/mutation-of-the-apocalypse.svg
 *   - public/images/covers/monarch-of-depravity.svg
 *   - public/images/covers/marked-by-false-gods.svg
 *   - public/images/banners/hero-banner.svg
 *   - public/images/author/author.svg
 *
 * Run: node generate-svgs.js
 */

const fs = require('fs');
const path = require('path');

const COVERS_DIR   = path.join(__dirname, 'public/images/covers');
const BANNERS_DIR  = path.join(__dirname, 'public/images/banners');
const AUTHOR_DIR   = path.join(__dirname, 'public/images/author');

[COVERS_DIR, BANNERS_DIR, AUTHOR_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// MUTATION OF THE APOCALYPSE — ember/crimson — 400×600
// ─────────────────────────────────────────────────────────────────────────────
const mutationSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
<defs>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="5"/>
    <feColorMatrix values="0 0 0 0 0.07  0 0 0 0 0.01  0 0 0 0 0.01  0 0 0 0.55 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="glow" x="-35%" y="-35%" width="170%" height="170%">
    <feGaussianBlur stdDeviation="7" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="haloglow" x="-55%" y="-55%" width="210%" height="210%">
    <feGaussianBlur stdDeviation="22" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <radialGradient id="bg" cx="50%" cy="36%" r="70%">
    <stop offset="0%" stop-color="#2e0c06"/>
    <stop offset="40%" stop-color="#160504"/>
    <stop offset="100%" stop-color="#040101"/>
  </radialGradient>
  <radialGradient id="corona" cx="50%" cy="36%" r="54%">
    <stop offset="0%" stop-color="#ff4820" stop-opacity="0.6"/>
    <stop offset="45%" stop-color="#c03010" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="suncore" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#fffbe8"/>
    <stop offset="15%" stop-color="#ffb050"/>
    <stop offset="45%" stop-color="#e84030"/>
    <stop offset="80%" stop-color="#801808"/>
    <stop offset="100%" stop-color="#3a0a04" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="1"/>
  </linearGradient>
  <radialGradient id="vig" cx="50%" cy="40%" r="76%">
    <stop offset="44%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.94"/>
  </radialGradient>
</defs>

<!-- background + corona -->
<rect width="400" height="600" fill="url(#bg)"/>
<ellipse cx="200" cy="218" rx="228" ry="208" fill="url(#corona)"/>

<!-- horizon haze -->
<ellipse cx="200" cy="348" rx="240" ry="28" fill="#b03010" opacity="0.22"/>
<ellipse cx="200" cy="362" rx="200" ry="18" fill="#7a1a08" opacity="0.28"/>
<rect x="0" y="338" width="400" height="6" fill="#e84030" opacity="0.13"/>

<!-- ── SUN ── -->
<g transform="translate(200 218)" filter="url(#haloglow)">
  <circle r="150" fill="none" stroke="#d94030" stroke-width="1" opacity="0.07"/>
  <circle r="128" fill="none" stroke="#d94030" stroke-width="1.5" opacity="0.13"/>
  <circle r="106" fill="none" stroke="#e85030" stroke-width="1" opacity="0.19"/>
  <circle r="84"  fill="none" stroke="#ff6030" stroke-width="0.8" opacity="0.28"/>
</g>
<g transform="translate(200 218)" filter="url(#glow)">
  <!-- sun disc -->
  <circle r="74" fill="url(#suncore)"/>
  <!-- 8-ray burst -->
  <g fill="#ff9040" opacity="0.65">
    <path d="M 0,-116 L 4,-80 L 0,-70 L -4,-80 Z"/>
    <path d="M 0,116 L 4,80 L 0,70 L -4,80 Z"/>
    <path d="M -116,0 L -80,4 L -70,0 L -80,-4 Z"/>
    <path d="M 116,0 L 80,4 L 70,0 L 80,-4 Z"/>
    <g transform="rotate(45)">
      <path d="M 0,-106 L 3.5,-74 L 0,-66 L -3.5,-74 Z" opacity="0.75"/>
      <path d="M 0,106 L 3.5,74 L 0,66 L -3.5,74 Z" opacity="0.75"/>
      <path d="M -106,0 L -74,3.5 L -66,0 L -74,-3.5 Z" opacity="0.75"/>
      <path d="M 106,0 L 74,3.5 L 66,0 L 74,-3.5 Z" opacity="0.75"/>
    </g>
  </g>
  <!-- petal shapes -->
  <g fill="#d94030" fill-opacity="0.52" stroke="#eb6040" stroke-width="0.9">
    <path d="M 0,-92 C -23,-74 -23,-42 0,-29 C 23,-42 23,-74 0,-92 Z"/>
    <path d="M 0,92  C -23,74  -23,42  0,29  C 23,42  23,74  0,92  Z"/>
    <path d="M -92,0 C -74,-23 -42,-23 -29,0 C -42,23 -74,23 -92,0 Z"/>
    <path d="M 92,0  C 74,-23  42,-23  29,0  C 42,23  74,23  92,0  Z"/>
  </g>
  <g fill="#c02818" fill-opacity="0.36" stroke="#d94030" stroke-width="0.6" transform="rotate(45)">
    <path d="M 0,-86 C -15,-72 -15,-44 0,-37 C 15,-44 15,-72 0,-86 Z"/>
    <path d="M 0,86  C -15,72  -15,44  0,37  C 15,44  15,72  0,86  Z"/>
    <path d="M -86,0 C -72,-15 -44,-15 -37,0 C -44,15 -72,15 -86,0 Z"/>
    <path d="M 86,0  C 72,-15  44,-15  37,0  C 44,15  72,15  86,0  Z"/>
  </g>
  <!-- inner rings + core -->
  <circle r="58" fill="none" stroke="#ff9050" stroke-width="1.2" opacity="0.52"/>
  <circle r="44" fill="none" stroke="#ff7030" stroke-width="0.8" opacity="0.42"/>
  <circle r="23" fill="#0e0505" stroke="#d94030" stroke-width="1.6"/>
  <circle r="14" fill="#e04030" opacity="0.92"/>
  <circle r="8"  fill="#ffb068"/>
  <circle r="3.2" fill="#fffbe8"/>
</g>

<!-- fracture veins in sky -->
<g stroke="#d94830" stroke-width="1.6" fill="none" opacity="0.52" stroke-linecap="round">
  <path d="M 54 108 Q 98 155 118 202 Q 138 250 105 298"/>
  <path d="M 346 102 Q 308 158 286 206 Q 264 258 298 302"/>
  <path d="M 22 194 Q 76 208 98 234 Q 118 262 84 308"/>
  <path d="M 378 188 Q 326 210 304 238 Q 282 268 316 310"/>
  <path d="M 132 72 Q 152 136 142 186"/>
  <path d="M 268 70 Q 252 134 264 184"/>
  <path d="M 180 48 Q 188 90 182 132"/>
  <path d="M 224 44 Q 218 88 226 130"/>
</g>
<g fill="#ff7030" opacity="0.72">
  <circle cx="118" cy="202" r="2.8"/><circle cx="105" cy="298" r="2"/>
  <circle cx="286" cy="206" r="2.8"/><circle cx="298" cy="302" r="2"/>
  <circle cx="98"  cy="234" r="2.2"/><circle cx="304" cy="238" r="2.2"/>
  <circle cx="142" cy="186" r="1.8"/><circle cx="264" cy="184" r="1.8"/>
</g>

<!-- floating ash -->
<g fill="#ff6030">
  <circle cx="44"  cy="162" r="1.3" opacity="0.62"/>
  <circle cx="88"  cy="136" r="0.9" opacity="0.52"/>
  <circle cx="148" cy="118" r="1.1" opacity="0.58"/>
  <circle cx="252" cy="116" r="1.0" opacity="0.52"/>
  <circle cx="310" cy="134" r="1.2" opacity="0.62"/>
  <circle cx="356" cy="158" r="0.8" opacity="0.48"/>
  <circle cx="66"  cy="296" r="1.1" opacity="0.42"/>
  <circle cx="336" cy="290" r="0.9" opacity="0.42"/>
  <circle cx="186" cy="86"  r="0.8" opacity="0.52"/>
  <circle cx="218" cy="82"  r="1.1" opacity="0.44"/>
  <circle cx="160" cy="48"  r="0.7" opacity="0.4"/>
  <circle cx="240" cy="38"  r="0.7" opacity="0.38"/>
  <circle cx="290" cy="54"  r="0.6" opacity="0.36"/>
</g>

<!-- RUINS SILHOUETTE -->
<g fill="#0a0202">
  <rect x="0" y="490" width="400" height="110"/>
  <!-- skyline rubble -->
  <polygon points="0,490 0,465 10,474 20,456 32,470 46,452 60,466 74,444 88,460 104,442 120,456 140,448 152,466 168,440 184,454 200,446 218,460 234,444 250,456 266,444 282,460 298,446 314,456 330,442 348,455 364,446 378,460 392,450 400,462 400,490"/>
  <!-- left tall ruin tower -->
  <polygon points="0,490 0,414 10,404 18,394 26,402 34,388 42,400 52,392 62,490"/>
  <!-- right ruin tower -->
  <polygon points="338,490 338,418 346,408 354,396 362,408 370,392 380,406 390,416 400,420 400,490"/>
  <!-- mid ruin chunks -->
  <polygon points="138,490 138,466 144,458 150,468 158,452 166,466 174,490"/>
  <polygon points="240,490 240,470 248,460 256,472 264,456 272,470 280,490"/>
  <!-- arched window hint on left tower -->
  <path d="M 18 430 Q 26 420 34 430 L 34 450 L 18 450 Z" fill="#140302"/>
</g>
<rect x="0" y="456" width="400" height="144" fill="url(#groundFade)"/>

<!-- vignette + grain -->
<rect width="400" height="600" fill="url(#vig)"/>
<rect width="400" height="600" filter="url(#grain)" opacity="0.58"/>

<!-- CORNER FRAMES -->
<g stroke="#d94830" stroke-width="1.9" fill="none" stroke-linecap="round">
  <path d="M 14 46 L 14 14 L 46 14"/>
  <path d="M 354 14 L 386 14 L 386 46"/>
  <path d="M 14 554 L 14 586 L 46 586"/>
  <path d="M 386 554 L 386 586 L 354 586"/>
</g>
<g fill="#d94830" opacity="0.92">
  <circle cx="14" cy="14" r="3.2"/><circle cx="386" cy="14" r="3.2"/>
  <circle cx="14" cy="586" r="3.2"/><circle cx="386" cy="586" r="3.2"/>
</g>
<g fill="#d94830" opacity="0.5" stroke="#d94830" stroke-width="0.5">
  <path d="M 22 22 Q 34 22 34 34 Q 22 34 22 22 Z"/>
  <path d="M 378 22 Q 366 22 366 34 Q 378 34 378 22 Z"/>
  <path d="M 22 578 Q 34 578 34 566 Q 22 566 22 578 Z"/>
  <path d="M 378 578 Q 366 578 366 566 Q 378 566 378 578 Z"/>
</g>
<rect x="10" y="10" width="380" height="580" fill="none" stroke="#d94830" stroke-width="0.6" opacity="0.38"/>

<!-- TITLE AREA -->
<rect x="0" y="456" width="400" height="144" fill="#040101" opacity="0.88"/>
<line x1="28" y1="465" x2="372" y2="465" stroke="#d94830" stroke-width="0.9" opacity="0.55"/>
<!-- title divider ornament -->
<g transform="translate(200 478)" fill="#d94830" opacity="0.72">
  <path d="M -32,0 Q -16,-6 0,0 Q 16,6 32,0" fill="none" stroke="#d94830" stroke-width="0.9"/>
  <circle cx="0" cy="0" r="2.4"/>
  <circle cx="-28" cy="0" r="1.3"/><circle cx="28" cy="0" r="1.3"/>
  <path d="M -46,0 L -38,0" stroke="#d94830" stroke-width="0.7"/>
  <path d="M 38,0 L 46,0" stroke="#d94830" stroke-width="0.7"/>
</g>
<text x="200" y="510" text-anchor="middle"
  font-family="Georgia,serif" font-size="27" font-weight="700" letter-spacing="3"
  fill="#f5e0d0" filter="url(#glow)">MUTATION</text>
<text x="200" y="536" text-anchor="middle"
  font-family="Georgia,serif" font-size="11" font-weight="400" letter-spacing="6"
  fill="#d94830" opacity="0.92">OF THE APOCALYPSE</text>
<text x="200" y="557" text-anchor="middle"
  font-family="Georgia,serif" font-size="8" font-weight="400" letter-spacing="4"
  fill="#7a6258" opacity="0.82">TARHUALA</text>
</svg>`;

// ─────────────────────────────────────────────────────────────────────────────
// MONARCH OF DEPRAVITY — gold/obsidian — 400×600
// ─────────────────────────────────────────────────────────────────────────────
const monarchSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
<defs>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="3" seed="13"/>
    <feColorMatrix values="0 0 0 0 0.06  0 0 0 0 0.04  0 0 0 0 0.01  0 0 0 0.48 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="8" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="crownhalo" x="-55%" y="-55%" width="210%" height="210%">
    <feGaussianBlur stdDeviation="20" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#130a01"/>
    <stop offset="40%" stop-color="#0a0500"/>
    <stop offset="100%" stop-color="#020100"/>
  </linearGradient>
  <radialGradient id="goldAura" cx="50%" cy="40%" r="56%">
    <stop offset="0%" stop-color="#d4a434" stop-opacity="0.42"/>
    <stop offset="52%" stop-color="#6a4008" stop-opacity="0.14"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="goldMetal" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f8e890"/>
    <stop offset="22%" stop-color="#e8c040"/>
    <stop offset="55%" stop-color="#c89820"/>
    <stop offset="80%" stop-color="#8a6010"/>
    <stop offset="100%" stop-color="#3a2808"/>
  </linearGradient>
  <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#fff8d0" stop-opacity="0.65"/>
    <stop offset="50%" stop-color="#f0c040" stop-opacity="0"/>
    <stop offset="100%" stop-color="#c08010" stop-opacity="0.45"/>
  </linearGradient>
  <linearGradient id="scrollFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a0500" stop-opacity="0"/>
    <stop offset="100%" stop-color="#020100" stop-opacity="1"/>
  </linearGradient>
  <radialGradient id="vig" cx="50%" cy="38%" r="76%">
    <stop offset="40%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.92"/>
  </radialGradient>
</defs>

<rect width="400" height="600" fill="url(#bg)"/>
<ellipse cx="200" cy="248" rx="235" ry="215" fill="url(#goldAura)"/>

<!-- throne arch -->
<path d="M 72 530 Q 72 90 200 68 Q 328 90 328 530" fill="none" stroke="#d4a434" stroke-width="0.9" opacity="0.14"/>
<path d="M 95 530 Q 95 116 200 98 Q 305 116 305 530" fill="none" stroke="#d4a434" stroke-width="0.5" opacity="0.09"/>
<!-- column hints -->
<g stroke="#d4a434" stroke-width="0.5" fill="none" opacity="0.07">
  <line x1="58" y1="0" x2="58" y2="600"/>
  <line x1="118" y1="0" x2="118" y2="600"/>
  <line x1="282" y1="0" x2="282" y2="600"/>
  <line x1="342" y1="0" x2="342" y2="600"/>
</g>

<!-- ── CROWN ── -->
<g transform="translate(200 196)" filter="url(#crownhalo)">
  <ellipse cx="0" cy="18" rx="116" ry="58" fill="#d4a434" opacity="0.14"/>
</g>
<g transform="translate(200 196)" filter="url(#glow)">
  <!-- base band -->
  <rect x="-92" y="32" width="184" height="36" rx="5" fill="url(#goldMetal)"/>
  <rect x="-92" y="32" width="184" height="36" rx="5" fill="url(#goldShine)"/>
  <!-- filigree wave on band -->
  <path d="M -78 50 Q -65 40 -52 50 Q -39 60 -26 50 Q -13 40 0 50 Q 13 40 26 50 Q 39 60 52 50 Q 65 40 78 50"
    stroke="#8a6010" stroke-width="0.8" fill="none" opacity="0.55"/>
  <!-- gem studs on band -->
  <g fill="#1a0900" opacity="0.5">
    <circle cx="-70" cy="50" r="3.5"/><circle cx="-46" cy="50" r="3.5"/>
    <circle cx="-23" cy="50" r="3.5"/><circle cx="0"   cy="50" r="4"/>
    <circle cx="23"  cy="50" r="3.5"/><circle cx="46"  cy="50" r="3.5"/>
    <circle cx="70"  cy="50" r="3.5"/>
  </g>
  <!-- gem highlights -->
  <g fill="#e8c040" opacity="0.4">
    <circle cx="-70" cy="48" r="1.2"/><circle cx="-46" cy="48" r="1.2"/>
    <circle cx="-23" cy="48" r="1.2"/><circle cx="0"   cy="48" r="1.5"/>
    <circle cx="23"  cy="48" r="1.2"/><circle cx="46"  cy="48" r="1.2"/>
    <circle cx="70"  cy="48" r="1.2"/>
  </g>

  <!-- center tall spire -->
  <polygon points="0,-90 -16,32 16,32" fill="url(#goldMetal)"/>
  <polygon points="0,-90 -16,32 16,32" fill="url(#goldShine)"/>
  <!-- center spire cap jewel -->
  <polygon points="0,-102 7,-82 0,-68 -7,-82" fill="#d4a434" filter="url(#glow)"/>
  <polygon points="0,-102 7,-82 0,-68 -7,-82" fill="url(#goldShine)"/>
  <circle cx="0" cy="-86" r="6" fill="#f8e890" opacity="0.92"/>

  <!-- left-mid spires (pair) -->
  <polygon points="-46,-62 -58,32 -34,32" fill="url(#goldMetal)"/>
  <polygon points="-46,-62 -58,32 -34,32" fill="url(#goldShine)" opacity="0.7"/>
  <polygon points="-46,-74 -51,-58 -46,-48 -41,-58" fill="#d4a434"/>
  <circle cx="-46" cy="-60" r="4.5" fill="#f8d060" opacity="0.82"/>

  <polygon points="46,-62 34,32 58,32" fill="url(#goldMetal)"/>
  <polygon points="46,-62 34,32 58,32" fill="url(#goldShine)" opacity="0.7"/>
  <polygon points="46,-74 41,-58 46,-48 51,-58" fill="#d4a434"/>
  <circle cx="46" cy="-60" r="4.5" fill="#f8d060" opacity="0.82"/>

  <!-- outer short spires -->
  <polygon points="-80,-40 -90,32 -70,32" fill="url(#goldMetal)" opacity="0.9"/>
  <polygon points="-80,-50 -84,-38 -80,-30 -76,-38" fill="#d4a434" opacity="0.75"/>
  <polygon points="80,-40 70,32 90,32" fill="url(#goldMetal)" opacity="0.9"/>
  <polygon points="80,-50 76,-38 80,-30 84,-38" fill="#d4a434" opacity="0.75"/>
</g>

<!-- kbach filigree above crown -->
<g transform="translate(200 114)" fill="none" stroke="#d4a434" stroke-width="0.8" opacity="0.38">
  <path d="M -88 0 Q -66 -22 -44 0 Q -22 22 0 0 Q 22 -22 44 0 Q 66 22 88 0"/>
  <path d="M -66 -16 Q -44 -32 -22 -16 Q 0 0 22 -16 Q 44 -32 66 -16" opacity="0.6"/>
</g>
<g transform="translate(200 114)" fill="#d4a434" opacity="0.55">
  <circle cx="0" cy="0" r="3.8"/>
  <circle cx="-44" cy="0" r="2.2"/><circle cx="44" cy="0" r="2.2"/>
  <circle cx="-88" cy="0" r="1.6"/><circle cx="88" cy="0" r="1.6"/>
</g>

<!-- gold dust particles -->
<g fill="#d4a434">
  <circle cx="36"  cy="144" r="1.1" opacity="0.62"/>
  <circle cx="78"  cy="106" r="1.5" opacity="0.52"/>
  <circle cx="142" cy="84"  r="1.0" opacity="0.56"/>
  <circle cx="258" cy="82"  r="1.1" opacity="0.56"/>
  <circle cx="324" cy="104" r="1.3" opacity="0.52"/>
  <circle cx="366" cy="142" r="1.0" opacity="0.46"/>
  <circle cx="55"  cy="268" r="0.9" opacity="0.38"/>
  <circle cx="348" cy="262" r="0.9" opacity="0.38"/>
  <circle cx="108" cy="306" r="0.8" opacity="0.32"/>
  <circle cx="294" cy="304" r="0.8" opacity="0.32"/>
  <circle cx="176" cy="62"  r="0.7" opacity="0.42"/>
  <circle cx="226" cy="58"  r="0.8" opacity="0.38"/>
</g>

<!-- throne base / steps -->
<g fill="#060300" opacity="0.82">
  <rect x="0" y="488" width="400" height="112"/>
  <rect x="56"  y="488" width="288" height="9"  rx="1.5" fill="#0b0700" opacity="0.9"/>
  <rect x="78"  y="476" width="244" height="13" rx="1.5" fill="#0d0800" opacity="0.72"/>
  <rect x="108" y="464" width="184" height="13" rx="1.5" fill="#100900" opacity="0.62"/>
  <!-- throne pillars -->
  <rect x="92"  y="374" width="20" height="116" rx="3" fill="#110a00"/>
  <rect x="288" y="374" width="20" height="116" rx="3" fill="#110a00"/>
  <!-- pillar caps -->
  <rect x="86"  y="368" width="32" height="9" rx="3" fill="#1c1200" opacity="0.92"/>
  <rect x="282" y="368" width="32" height="9" rx="3" fill="#1c1200" opacity="0.92"/>
</g>
<g stroke="#d4a434" stroke-width="0.55" fill="none" opacity="0.28">
  <rect x="92"  y="374" width="20" height="116" rx="3"/>
  <rect x="288" y="374" width="20" height="116" rx="3"/>
  <rect x="86"  y="368" width="32" height="9" rx="3"/>
  <rect x="282" y="368" width="32" height="9" rx="3"/>
</g>
<rect x="0" y="452" width="400" height="148" fill="url(#scrollFade)"/>

<!-- vignette + grain -->
<rect width="400" height="600" fill="url(#vig)"/>
<rect width="400" height="600" filter="url(#grain)" opacity="0.52"/>

<!-- CORNER FRAMES -->
<g stroke="#d4a434" stroke-width="2" fill="none" stroke-linecap="round">
  <path d="M 14 52 L 14 14 L 52 14"/>
  <path d="M 348 14 L 386 14 L 386 52"/>
  <path d="M 14 548 L 14 586 L 52 586"/>
  <path d="M 386 548 L 386 586 L 348 586"/>
</g>
<g fill="#d4a434" opacity="0.92">
  <circle cx="14" cy="14" r="3.5"/><circle cx="386" cy="14" r="3.5"/>
  <circle cx="14" cy="586" r="3.5"/><circle cx="386" cy="586" r="3.5"/>
</g>
<g stroke="#d4a434" stroke-width="0.5" fill="none" opacity="0.32">
  <path d="M 22 58 L 22 22 L 58 22"/><path d="M 342 22 L 378 22 L 378 58"/>
  <path d="M 22 542 L 22 578 L 58 578"/><path d="M 378 542 L 378 578 L 342 578"/>
</g>
<rect x="10" y="10" width="380" height="580" fill="none" stroke="#d4a434" stroke-width="0.5" opacity="0.22"/>

<!-- TITLE AREA -->
<rect x="0" y="458" width="400" height="142" fill="#030200" opacity="0.92"/>
<line x1="28" y1="466" x2="372" y2="466" stroke="#d4a434" stroke-width="0.9" opacity="0.58"/>
<g transform="translate(200 481)" fill="#d4a434" opacity="0.68">
  <path d="M -34,0 Q -17,-6 0,0 Q 17,6 34,0" fill="none" stroke="#d4a434" stroke-width="0.9"/>
  <circle cx="0" cy="0" r="2.6"/>
  <circle cx="-30" cy="0" r="1.3"/><circle cx="30" cy="0" r="1.3"/>
  <path d="M -50,0 L -40,0" stroke="#d4a434" stroke-width="0.7"/>
  <path d="M 40,0 L 50,0"  stroke="#d4a434" stroke-width="0.7"/>
</g>
<text x="200" y="514" text-anchor="middle"
  font-family="Georgia,serif" font-size="26" font-weight="700" letter-spacing="2"
  fill="#f5e488" filter="url(#glow)">MONARCH</text>
<text x="200" y="539" text-anchor="middle"
  font-family="Georgia,serif" font-size="11" font-weight="400" letter-spacing="5"
  fill="#d4a434" opacity="0.92">OF DEPRAVITY</text>
<text x="200" y="559" text-anchor="middle"
  font-family="Georgia,serif" font-size="8" font-weight="400" letter-spacing="4"
  fill="#7a6a5a" opacity="0.82">TARHUALA</text>
</svg>`;

// ─────────────────────────────────────────────────────────────────────────────
// MARKED BY FALSE GODS — jade/dark forest — 400×600
// ─────────────────────────────────────────────────────────────────────────────
const markedSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
<defs>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.84" numOctaves="4" seed="9"/>
    <feColorMatrix values="0 0 0 0 0.02  0 0 0 0 0.05  0 0 0 0 0.03  0 0 0 0.52 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="8" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="idolglow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="24" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#091609"/>
    <stop offset="42%" stop-color="#040d05"/>
    <stop offset="100%" stop-color="#010301"/>
  </linearGradient>
  <radialGradient id="jadeAura" cx="50%" cy="44%" r="58%">
    <stop offset="0%" stop-color="#38a870" stop-opacity="0.45"/>
    <stop offset="48%" stop-color="#165c32" stop-opacity="0.14"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="eyeCore" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#c8ffdc"/>
    <stop offset="18%" stop-color="#50c490"/>
    <stop offset="55%" stop-color="#186a42"/>
    <stop offset="100%" stop-color="#092418" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="marshFog" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0e2c16" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="1"/>
  </linearGradient>
  <radialGradient id="vig" cx="50%" cy="42%" r="78%">
    <stop offset="40%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.92"/>
  </radialGradient>
</defs>

<rect width="400" height="600" fill="url(#bg)"/>
<ellipse cx="200" cy="252" rx="232" ry="214" fill="url(#jadeAura)"/>

<!-- rain drip lines -->
<g stroke="#2a8a50" stroke-width="0.5" fill="none" opacity="0.2">
  <path d="M 28  0 Q 18 148 34 308 Q 50 456 24 600"/>
  <path d="M 76  0 Q 66 178 80 358 Q 94 508 70 600"/>
  <path d="M 142 0 Q 128 198 146 378 Q 162 542 138 600"/>
  <path d="M 222 0 Q 212 168 228 348 Q 242 502 216 600"/>
  <path d="M 298 0 Q 286 188 302 366 Q 318 516 292 600"/>
  <path d="M 360 0 Q 348 158 366 328 Q 380 478 354 600"/>
</g>

<!-- ── IDOL / FALSE GOD SYMBOL ── a broken eye-in-hand motif -->
<!-- outer mandala rings -->
<g transform="translate(200 238)" filter="url(#idolglow)">
  <circle r="138" fill="none" stroke="#38a870" stroke-width="0.8" opacity="0.12"/>
  <circle r="118" fill="none" stroke="#38a870" stroke-width="1" opacity="0.18"/>
  <circle r="96"  fill="none" stroke="#50c490" stroke-width="0.8" opacity="0.24"/>
</g>
<g transform="translate(200 238)" filter="url(#glow)">
  <!-- 8 spokes -->
  <g stroke="#38a870" stroke-width="1.3" fill="none" opacity="0.58">
    <line x1="0" y1="-112" x2="0" y2="-74"/>
    <line x1="0" y1="112"  x2="0" y2="74"/>
    <line x1="-112" y1="0" x2="-74" y2="0"/>
    <line x1="112"  y1="0" x2="74"  y2="0"/>
    <g transform="rotate(45)">
      <line x1="0" y1="-104" x2="0" y2="-70"/>
      <line x1="0" y1="104"  x2="0" y2="70"/>
      <line x1="-104" y1="0" x2="-70" y2="0"/>
      <line x1="104"  y1="0" x2="70"  y2="0"/>
    </g>
  </g>

  <!-- petal shapes -->
  <g fill="#1a6040" fill-opacity="0.52" stroke="#38a870" stroke-width="0.95">
    <path d="M 0,-90 C -22,-72 -22,-40 0,-28 C 22,-40 22,-72 0,-90 Z"/>
    <path d="M 0,90  C -22,72  -22,40  0,28  C 22,40  22,72  0,90  Z"/>
    <path d="M -90,0 C -72,-22 -40,-22 -28,0 C -40,22 -72,22 -90,0 Z"/>
    <path d="M 90,0  C 72,-22  40,-22  28,0  C 40,22  72,22  90,0  Z"/>
  </g>
  <g fill="#144e30" fill-opacity="0.36" stroke="#286a48" stroke-width="0.7" transform="rotate(45)">
    <path d="M 0,-84 C -15,-68 -15,-40 0,-33 C 15,-40 15,-68 0,-84 Z"/>
    <path d="M 0,84  C -15,68  -15,40  0,33  C 15,40  15,68  0,84  Z"/>
    <path d="M -84,0 C -68,-15 -40,-15 -33,0 C -40,15 -68,15 -84,0 Z"/>
    <path d="M 84,0  C 68,-15  40,-15  33,0  C 40,15  68,15  84,0  Z"/>
  </g>

  <!-- inner rings -->
  <circle r="54" fill="none" stroke="#50c490" stroke-width="1.1" opacity="0.44"/>
  <circle r="40" fill="none" stroke="#38a870" stroke-width="0.75" opacity="0.38"/>

  <!-- ring nodes -->
  <g fill="#50c490" opacity="0.72">
    <circle cx="0"   cy="-54" r="2.8"/><circle cx="0"   cy="54"  r="2.8"/>
    <circle cx="-54" cy="0"   r="2.8"/><circle cx="54"  cy="0"   r="2.8"/>
    <circle cx="-38" cy="-38" r="2.2"/><circle cx="38" cy="-38" r="2.2"/>
    <circle cx="-38" cy="38"  r="2.2"/><circle cx="38" cy="38"  r="2.2"/>
  </g>

  <!-- broken vertical crack through center — the "false" -->
  <line x1="0" y1="-38" x2="3" y2="-10" stroke="#0a1e0c" stroke-width="3"/>
  <line x1="3" y1="-10" x2="-2" y2="12" stroke="#0a1e0c" stroke-width="3"/>
  <line x1="-2" y1="12"  x2="1" y2="38" stroke="#0a1e0c" stroke-width="3"/>

  <!-- eye in center -->
  <ellipse cx="0" cy="0" rx="22" ry="14" fill="#061208" stroke="#38a870" stroke-width="1.5"/>
  <ellipse cx="0" cy="0" rx="13" ry="8" fill="url(#eyeCore)"/>
  <circle cx="0" cy="0" r="5.5" fill="#050e06" stroke="#38a870" stroke-width="0.8"/>
  <circle cx="0" cy="0" r="3" fill="#38a870"/>
  <circle cx="-1.5" cy="-1.5" r="1.2" fill="#ffffff" opacity="0.85"/>
</g>

<!-- root / ichor tendrils from center -->
<g stroke="#2a8a50" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.62">
  <path d="M 152 298 Q 136 332 144 370 Q 158 402 144 436"/>
  <path d="M 172 312 Q 162 350 168 392 Q 178 426 164 462"/>
  <path d="M 200 320 Q 196 362 202 404 Q 208 440 196 476"/>
  <path d="M 228 312 Q 238 350 232 392 Q 222 426 236 462"/>
  <path d="M 248 298 Q 264 332 256 370 Q 242 402 256 436"/>
  <!-- side tendrils -->
  <path d="M 112 238 Q 80 250 62 272 Q 48 294 22 300"/>
  <path d="M 288 238 Q 320 250 338 272 Q 352 294 378 300"/>
</g>
<!-- tendril terminus nodes -->
<g fill="#50c490" opacity="0.68">
  <circle cx="144" cy="370" r="3"/><circle cx="144" cy="436" r="2.4"/>
  <circle cx="168" cy="392" r="3"/><circle cx="164" cy="462" r="2.4"/>
  <circle cx="202" cy="404" r="3.4"/><circle cx="196" cy="476" r="2.6"/>
  <circle cx="232" cy="392" r="3"/><circle cx="236" cy="462" r="2.4"/>
  <circle cx="256" cy="370" r="3"/><circle cx="256" cy="436" r="2.4"/>
  <circle cx="62"  cy="272" r="2.4"/><circle cx="22" cy="300" r="2"/>
  <circle cx="338" cy="272" r="2.4"/><circle cx="378" cy="300" r="2"/>
</g>

<!-- floating spores -->
<g fill="#50c490">
  <circle cx="42"  cy="162" r="1.5" opacity="0.62"/>
  <circle cx="88"  cy="128" r="1.0" opacity="0.52"/>
  <circle cx="152" cy="102" r="1.3" opacity="0.58"/>
  <circle cx="248" cy="100" r="1.1" opacity="0.52"/>
  <circle cx="314" cy="124" r="1.4" opacity="0.58"/>
  <circle cx="360" cy="160" r="1.0" opacity="0.48"/>
  <circle cx="66"  cy="318" r="0.9" opacity="0.38"/>
  <circle cx="338" cy="312" r="0.9" opacity="0.38"/>
  <circle cx="172" cy="78"  r="0.8" opacity="0.52"/>
  <circle cx="230" cy="74"  r="1.1" opacity="0.48"/>
  <circle cx="118" cy="376" r="0.8" opacity="0.42"/>
  <circle cx="286" cy="372" r="0.8" opacity="0.42"/>
</g>

<!-- marsh silhouette -->
<g fill="#010402" opacity="0.9">
  <rect x="0" y="488" width="400" height="112"/>
  <!-- reed grass -->
  <polygon points="0,488 0,456 7,440 14,456 20,436 28,452 34,446 42,466 50,452 58,470 66,460 74,476 84,488"/>
  <polygon points="74,488 74,468 82,452 90,462 98,446 106,458 114,450 122,460 130,443 138,456 144,448 152,488"/>
  <polygon points="148,488 152,466 158,452 166,462 172,446 180,460 188,488"/>
  <polygon points="224,488 232,466 238,450 246,460 254,446 262,460 270,452 278,488"/>
  <polygon points="276,488 284,450 290,462 298,446 306,458 314,448 322,462 332,454 340,488"/>
  <polygon points="338,488 346,470 354,460 362,476 370,460 378,452 386,466 394,448 400,460 400,488"/>
  <!-- lily pads -->
  <ellipse cx="96"  cy="508" rx="24" ry="8" fill="#060e07" opacity="0.92"/>
  <ellipse cx="200" cy="502" rx="30" ry="9" fill="#060e07" opacity="0.92"/>
  <ellipse cx="316" cy="510" rx="22" ry="7" fill="#060e07" opacity="0.92"/>
</g>
<rect x="0" y="452" width="400" height="148" fill="url(#marshFog)"/>

<!-- vignette + grain -->
<rect width="400" height="600" fill="url(#vig)"/>
<rect width="400" height="600" filter="url(#grain)" opacity="0.52"/>

<!-- CORNER FRAMES -->
<g stroke="#38a870" stroke-width="2" fill="none" stroke-linecap="round">
  <path d="M 14 52 L 14 14 L 52 14"/>
  <path d="M 348 14 L 386 14 L 386 52"/>
  <path d="M 14 548 L 14 586 L 52 586"/>
  <path d="M 386 548 L 386 586 L 348 586"/>
</g>
<g fill="#38a870" opacity="0.92">
  <circle cx="14" cy="14" r="3.5"/><circle cx="386" cy="14" r="3.5"/>
  <circle cx="14" cy="586" r="3.5"/><circle cx="386" cy="586" r="3.5"/>
</g>
<g stroke="#38a870" stroke-width="0.5" fill="none" opacity="0.32">
  <path d="M 22 58 L 22 22 L 58 22"/><path d="M 342 22 L 378 22 L 378 58"/>
  <path d="M 22 542 L 22 578 L 58 578"/><path d="M 378 542 L 378 578 L 342 578"/>
</g>
<rect x="10" y="10" width="380" height="580" fill="none" stroke="#38a870" stroke-width="0.5" opacity="0.26"/>

<!-- TITLE AREA -->
<rect x="0" y="458" width="400" height="142" fill="#010402" opacity="0.94"/>
<line x1="28" y1="466" x2="372" y2="466" stroke="#38a870" stroke-width="0.9" opacity="0.55"/>
<g transform="translate(200 480)" fill="#38a870" opacity="0.68">
  <path d="M -34,0 Q -17,-6 0,0 Q 17,6 34,0" fill="none" stroke="#38a870" stroke-width="0.9"/>
  <circle cx="0" cy="0" r="2.6"/>
  <circle cx="-30" cy="0" r="1.3"/><circle cx="30" cy="0" r="1.3"/>
  <path d="M -50,0 L -40,0" stroke="#38a870" stroke-width="0.7"/>
  <path d="M 40,0 L 50,0"  stroke="#38a870" stroke-width="0.7"/>
</g>
<text x="200" y="511" text-anchor="middle"
  font-family="Georgia,serif" font-size="23" font-weight="700" letter-spacing="2"
  fill="#cff5df" filter="url(#glow)">MARKED BY</text>
<text x="200" y="534" text-anchor="middle"
  font-family="Georgia,serif" font-size="11" font-weight="400" letter-spacing="5"
  fill="#38a870" opacity="0.92">FALSE GODS</text>
<text x="200" y="555" text-anchor="middle"
  font-family="Georgia,serif" font-size="8" font-weight="400" letter-spacing="4"
  fill="#7a6a5a" opacity="0.82">TARHUALA</text>
</svg>`;

// ─────────────────────────────────────────────────────────────────────────────
// HERO BANNER — dark apocalyptic panorama — 1600×600
// ─────────────────────────────────────────────────────────────────────────────
const heroBannerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" width="1600" height="600">
<defs>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.62 0.68" numOctaves="4" seed="17"/>
    <feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.01  0 0 0 0 0.01  0 0 0 0.45 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="12" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="softglow" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="32" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <radialGradient id="bg" cx="50%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#1e0804"/>
    <stop offset="40%" stop-color="#0e0403"/>
    <stop offset="100%" stop-color="#040101"/>
  </radialGradient>
  <radialGradient id="emberGlow" cx="50%" cy="22%" r="60%">
    <stop offset="0%" stop-color="#c83010" stop-opacity="0.55"/>
    <stop offset="40%" stop-color="#8a1808" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="jadeGlow" cx="22%" cy="50%" r="35%">
    <stop offset="0%" stop-color="#1a7040" stop-opacity="0.35"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="goldGlow" cx="78%" cy="50%" r="35%">
    <stop offset="0%" stop-color="#c89820" stop-opacity="0.32"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="1"/>
  </linearGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="80%">
    <stop offset="50%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.88"/>
  </radialGradient>
</defs>

<!-- background -->
<rect width="1600" height="600" fill="url(#bg)"/>

<!-- atmosphere glows -->
<ellipse cx="800" cy="140" rx="900" ry="320" fill="url(#emberGlow)"/>
<ellipse cx="352" cy="300" rx="480" ry="280" fill="url(#jadeGlow)"/>
<ellipse cx="1248" cy="300" rx="480" ry="280" fill="url(#goldGlow)"/>

<!-- horizon glow band -->
<rect x="0" y="330" width="1600" height="10" fill="#c83010" opacity="0.12"/>
<rect x="0" y="338" width="1600" height="5"  fill="#ff6030" opacity="0.07"/>

<!-- ── CENTER: FRACTURED APOCALYPSE SUN ── -->
<g transform="translate(800 160)" filter="url(#softglow)">
  <circle r="200" fill="none" stroke="#c83010" stroke-width="1.5" opacity="0.07"/>
  <circle r="170" fill="none" stroke="#c83010" stroke-width="2" opacity="0.12"/>
  <circle r="138" fill="none" stroke="#e05030" stroke-width="1.5" opacity="0.18"/>
  <circle r="105" fill="none" stroke="#ff6030" stroke-width="1" opacity="0.25"/>
</g>
<g transform="translate(800 160)" filter="url(#glow)">
  <!-- sun disc -->
  <circle r="82">
    <radialGradient id="sc" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbe8"/>
      <stop offset="14%" stop-color="#ffb050"/>
      <stop offset="42%" stop-color="#e84030"/>
      <stop offset="78%" stop-color="#7a1808"/>
      <stop offset="100%" stop-color="#3a0a04" stop-opacity="0"/>
    </radialGradient>
  </circle>
  <circle r="82" fill="url(#sc)"/>
  <!-- rays -->
  <g fill="#ff9040" opacity="0.62">
    <path d="M 0,-130 L 5,-92 L 0,-80 L -5,-92 Z"/>
    <path d="M 0,130  L 5,92  L 0,80  L -5,92  Z"/>
    <path d="M -130,0 L -92,5 L -80,0 L -92,-5 Z"/>
    <path d="M 130,0  L 92,5  L 80,0  L 92,-5  Z"/>
    <g transform="rotate(45)">
      <path d="M 0,-118 L 4,-86 L 0,-76 L -4,-86 Z" opacity="0.72"/>
      <path d="M 0,118  L 4,86  L 0,76  L -4,86  Z" opacity="0.72"/>
      <path d="M -118,0 L -86,4 L -76,0 L -86,-4 Z" opacity="0.72"/>
      <path d="M 118,0  L 86,4  L 76,0  L 86,-4  Z" opacity="0.72"/>
    </g>
  </g>
  <!-- core -->
  <circle r="26" fill="#0e0505" stroke="#d94030" stroke-width="2"/>
  <circle r="16" fill="#e04030" opacity="0.92"/>
  <circle r="9"  fill="#ffb068"/>
  <circle r="3.5" fill="#fffbe8"/>
</g>

<!-- fracture cracks radiating from sun -->
<g stroke="#d94830" stroke-width="2" fill="none" opacity="0.44" stroke-linecap="round">
  <path d="M 440 80  Q 550 140 600 220 Q 650 300 580 380"/>
  <path d="M 1160 74 Q 1060 144 1010 226 Q 960 308 1034 386"/>
  <path d="M 280 180 Q 380 210 420 260 Q 456 310 390 380"/>
  <path d="M 1320 172 Q 1224 208 1186 262 Q 1148 318 1214 386"/>
  <path d="M 560 40  Q 620 120 608 196"/>
  <path d="M 1040 36 Q 984 118 998 194"/>
  <path d="M 700 18  Q 740 96  730 162"/>
  <path d="M 900 14  Q 864 94  878 160"/>
</g>
<g fill="#ff7030" opacity="0.72">
  <circle cx="600" cy="220" r="3.5"/><circle cx="580" cy="380" r="2.8"/>
  <circle cx="1010" cy="226" r="3.5"/><circle cx="1034" cy="386" r="2.8"/>
  <circle cx="420" cy="260" r="2.8"/><circle cx="1186" cy="262" r="2.8"/>
  <circle cx="608" cy="196" r="2.2"/><circle cx="998" cy="194" r="2.2"/>
</g>

<!-- ── LEFT PANEL: JADE TENDRILS (Marked by False Gods) ── -->
<g stroke="#2a8a50" stroke-width="1.8" fill="none" opacity="0.48" stroke-linecap="round">
  <path d="M 80  420 Q 100 380 120 350 Q 150 310 180 300"/>
  <path d="M 60  440 Q 90  400 110 370 Q 140 335 168 328"/>
  <path d="M 140 460 Q 158 420 170 390 Q 190 360 210 352"/>
  <path d="M 200 440 Q 210 400 220 375 Q 234 348 250 340"/>
  <path d="M 20  380 Q 60  350 88  330 Q 120 310 152 308"/>
</g>
<g fill="#50c490" opacity="0.62">
  <circle cx="180" cy="300" r="4"/><circle cx="168" cy="328" r="3"/>
  <circle cx="210" cy="352" r="3.5"/><circle cx="250" cy="340" r="3"/>
  <circle cx="152" cy="308" r="3"/>
</g>

<!-- ── RIGHT PANEL: GOLD FILIGREE (Monarch of Depravity) ── -->
<g fill="none" stroke="#d4a434" stroke-width="1.2" opacity="0.35">
  <path d="M 1400 240 Q 1380 220 1360 240 Q 1340 260 1320 240 Q 1300 220 1280 240"/>
  <path d="M 1420 270 Q 1400 250 1380 270 Q 1360 290 1340 270 Q 1320 250 1300 270"/>
  <path d="M 1440 300 Q 1420 280 1400 300 Q 1380 320 1360 300 Q 1340 280 1320 300"/>
</g>
<g fill="#d4a434" opacity="0.42">
  <circle cx="1340" cy="240" r="2.2"/><circle cx="1360" cy="270" r="2.2"/>
  <circle cx="1380" cy="300" r="2.2"/><circle cx="1400" cy="240" r="1.6"/>
  <circle cx="1320" cy="300" r="1.6"/>
</g>

<!-- ── RUINS SILHOUETTE (full width) ── -->
<g fill="#060202">
  <rect x="0" y="490" width="1600" height="110"/>
  <!-- main rubble line -->
  <polygon points="0,490 0,460 16,470 30,448 46,462 64,444 80,458 100,438 120,454 140,436 162,450 184,440 200,456 222,438 244,452 268,436 290,450 318,436 338,452 360,440 384,456 408,438 432,454 456,436 480,450 510,438 536,454 562,440 590,456 618,442 644,456 670,440 698,456 728,440 758,456 790,440 828,456 862,442 896,456 930,442 966,456 1002,440 1040,458 1076,440 1112,456 1148,440 1186,456 1222,440 1260,456 1298,440 1338,456 1378,440 1418,458 1456,442 1494,456 1532,440 1568,456 1600,448 1600,490"/>
  <!-- left tower ruin -->
  <polygon points="0,490 0,400 14,390 24,378 34,388 44,372 54,384 68,374 82,490"/>
  <!-- right tower ruin -->
  <polygon points="1518,490 1518,406 1530,394 1542,382 1554,394 1566,378 1578,390 1592,400 1600,408 1600,490"/>
  <!-- mid left ruin block -->
  <polygon points="340,490 340,462 348,452 356,464 366,448 376,464 388,490"/>
  <!-- center left ruin -->
  <polygon points="680,490 680,468 690,456 700,470 710,454 720,468 730,490"/>
  <!-- center right ruin -->
  <polygon points="872,490 872,468 882,454 894,468 904,454 916,468 926,490"/>
  <!-- mid right ruin block -->
  <polygon points="1218,490 1218,462 1228,452 1238,464 1248,448 1258,464 1268,490"/>
</g>
<rect x="0" y="454" width="1600" height="146" fill="url(#groundFade)"/>

<!-- floating ash particles -->
<g fill="#ff6030">
  <circle cx="142" cy="178" r="1.6" opacity="0.58"/>
  <circle cx="280" cy="148" r="1.2" opacity="0.52"/>
  <circle cx="428" cy="112" r="1.5" opacity="0.55"/>
  <circle cx="568" cy="88"  r="1.1" opacity="0.48"/>
  <circle cx="700" cy="62"  r="1.3" opacity="0.52"/>
  <circle cx="898" cy="58"  r="1.4" opacity="0.5"/>
  <circle cx="1040" cy="78" r="1.2" opacity="0.52"/>
  <circle cx="1172" cy="96" r="1.4" opacity="0.55"/>
  <circle cx="1320" cy="132" r="1.3" opacity="0.5"/>
  <circle cx="1464" cy="168" r="1.5" opacity="0.56"/>
  <circle cx="210" cy="290" r="1.0" opacity="0.4"/>
  <circle cx="480" cy="310" r="0.9" opacity="0.38"/>
  <circle cx="1100" cy="298" r="0.9" opacity="0.38"/>
  <circle cx="1390" cy="286" r="1.0" opacity="0.4"/>
</g>
<g fill="#50c490">
  <circle cx="88"  cy="242" r="1.2" opacity="0.45"/>
  <circle cx="168" cy="208" r="0.9" opacity="0.4"/>
  <circle cx="234" cy="272" r="1.1" opacity="0.42"/>
  <circle cx="322" cy="248" r="0.8" opacity="0.38"/>
</g>
<g fill="#d4a434">
  <circle cx="1278" cy="238" r="1.1" opacity="0.45"/>
  <circle cx="1360" cy="208" r="0.9" opacity="0.4"/>
  <circle cx="1438" cy="264" r="1.2" opacity="0.42"/>
  <circle cx="1524" cy="244" r="0.8" opacity="0.38"/>
</g>

<!-- vignette + grain -->
<rect width="1600" height="600" fill="url(#vig)"/>
<rect width="1600" height="600" filter="url(#grain)" opacity="0.52"/>

<!-- OUTER FRAME -->
<rect x="0" y="0" width="1600" height="600" fill="none" stroke="#c83010" stroke-width="2" opacity="0.2"/>
<rect x="6" y="6" width="1588" height="588" fill="none" stroke="#c83010" stroke-width="0.5" opacity="0.12"/>

<!-- TITLE TEXT -->
<text x="800" y="268" text-anchor="middle"
  font-family="Georgia,serif" font-size="88" font-weight="700" letter-spacing="12"
  fill="#f0e0d0" filter="url(#glow)" opacity="0.92">TARHUALA</text>
<text x="800" y="316" text-anchor="middle"
  font-family="Georgia,serif" font-size="18" font-weight="400" letter-spacing="10"
  fill="#d94830" opacity="0.78">DARK FANTASY  &amp;  APOCALYPTIC FICTION</text>
<!-- small kbach divider under subtitle -->
<g transform="translate(800 338)" fill="#d94830" opacity="0.6">
  <path d="M -60,0 Q -30,-8 0,0 Q 30,8 60,0" fill="none" stroke="#d94830" stroke-width="1"/>
  <circle cx="0" cy="0" r="3.5"/>
  <circle cx="-56" cy="0" r="1.8"/><circle cx="56" cy="0" r="1.8"/>
  <line x1="-80" y1="0" x2="-66" y2="0" stroke="#d94830" stroke-width="1"/>
  <line x1="66"  y1="0" x2="80"  y2="0" stroke="#d94830" stroke-width="1"/>
</g>
</svg>`;

// ─────────────────────────────────────────────────────────────────────────────
// AUTHOR SVG — stylized portrait — 480×640
// ─────────────────────────────────────────────────────────────────────────────
const authorSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640" width="480" height="640">
<defs>
  <radialGradient id="bg" cx="50%" cy="36%" r="68%">
    <stop offset="0%" stop-color="#1e0e08"/>
    <stop offset="52%" stop-color="#100806"/>
    <stop offset="100%" stop-color="#050303"/>
  </radialGradient>
  <radialGradient id="figGrad" cx="50%" cy="28%" r="58%">
    <stop offset="0%" stop-color="#d8c09a"/>
    <stop offset="38%" stop-color="#bca076"/>
    <stop offset="100%" stop-color="#6e4e32"/>
  </radialGradient>
  <radialGradient id="faceLight" cx="44%" cy="36%" r="52%">
    <stop offset="0%" stop-color="#ecd4ac"/>
    <stop offset="58%" stop-color="#c89868"/>
    <stop offset="100%" stop-color="#7e4e26"/>
  </radialGradient>
  <radialGradient id="robeGrad" cx="50%" cy="20%" r="82%">
    <stop offset="0%" stop-color="#2c1c12"/>
    <stop offset="52%" stop-color="#1c1008"/>
    <stop offset="100%" stop-color="#080402"/>
  </radialGradient>
  <radialGradient id="emberAura" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#c43030" stop-opacity="0.38"/>
    <stop offset="100%" stop-color="#c43030" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="inkGlow" cx="50%" cy="62%" r="62%">
    <stop offset="0%" stop-color="#3e1e0e" stop-opacity="1"/>
    <stop offset="100%" stop-color="#050303" stop-opacity="1"/>
  </radialGradient>
  <filter id="softblur" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="faceGlow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="4.5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="inkSmoke" x="-50%" y="-50%" width="200%" height="200%">
    <feTurbulence type="fractalNoise" baseFrequency="0.022 0.036" numOctaves="4" seed="11" result="noise"/>
    <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
    <feComponentTransfer in="gray" result="dark">
      <feFuncA type="linear" slope="0.16"/>
    </feComponentTransfer>
    <feComposite in="dark" in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" seed="21"/>
    <feColorMatrix values="0 0 0 0 0.04  0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 0.42 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
</defs>

<!-- background -->
<rect width="480" height="640" fill="url(#bg)"/>
<ellipse cx="240" cy="158" rx="210" ry="190" fill="url(#emberAura)"/>
<rect width="480" height="640" fill="url(#inkGlow)" filter="url(#inkSmoke)"/>

<!-- ── FRAME ── -->
<!-- outer border -->
<rect x="28" y="28" width="424" height="584" fill="none" stroke="#c43030" stroke-width="1.4"/>
<rect x="33" y="33" width="414" height="574" fill="none" stroke="#c43030" stroke-width="0.4" stroke-opacity="0.45"/>

<!-- Corner kbach medallions — TL -->
<g transform="translate(28,28)" fill="none" stroke="#c43030">
  <circle r="18" stroke-width="1.1"/>
  <circle r="12" stroke-width="0.5" stroke-opacity="0.55"/>
  <g fill="#c43030" stroke="none">
    <path d="M0,-11 C-3.5,-8 -3.5,-3.5 0,-1.5 C3.5,-3.5 3.5,-8 0,-11Z"/>
    <path d="M11,0  C8,-3.5  3.5,-3.5 1.5,0 C3.5,3.5 8,3.5 11,0Z"/>
    <path d="M0,11  C3.5,8  3.5,3.5 0,1.5 C-3.5,3.5 -3.5,8 0,11Z"/>
    <path d="M-11,0 C-8,3.5 -3.5,3.5 -1.5,0 C-3.5,-3.5 -8,-3.5 -11,0Z"/>
  </g>
  <circle r="3" fill="#c43030" stroke="none"/>
</g>
<!-- TR -->
<g transform="translate(452,28)" fill="none" stroke="#c43030">
  <circle r="18" stroke-width="1.1"/>
  <circle r="12" stroke-width="0.5" stroke-opacity="0.55"/>
  <g fill="#c43030" stroke="none">
    <path d="M0,-11 C-3.5,-8 -3.5,-3.5 0,-1.5 C3.5,-3.5 3.5,-8 0,-11Z"/>
    <path d="M11,0  C8,-3.5  3.5,-3.5 1.5,0 C3.5,3.5 8,3.5 11,0Z"/>
    <path d="M0,11  C3.5,8  3.5,3.5 0,1.5 C-3.5,3.5 -3.5,8 0,11Z"/>
    <path d="M-11,0 C-8,3.5 -3.5,3.5 -1.5,0 C-3.5,-3.5 -8,-3.5 -11,0Z"/>
  </g>
  <circle r="3" fill="#c43030" stroke="none"/>
</g>
<!-- BL -->
<g transform="translate(28,612)" fill="none" stroke="#c43030">
  <circle r="18" stroke-width="1.1"/>
  <circle r="12" stroke-width="0.5" stroke-opacity="0.55"/>
  <g fill="#c43030" stroke="none">
    <path d="M0,-11 C-3.5,-8 -3.5,-3.5 0,-1.5 C3.5,-3.5 3.5,-8 0,-11Z"/>
    <path d="M11,0  C8,-3.5  3.5,-3.5 1.5,0 C3.5,3.5 8,3.5 11,0Z"/>
    <path d="M0,11  C3.5,8  3.5,3.5 0,1.5 C-3.5,3.5 -3.5,8 0,11Z"/>
    <path d="M-11,0 C-8,3.5 -3.5,3.5 -1.5,0 C-3.5,-3.5 -8,-3.5 -11,0Z"/>
  </g>
  <circle r="3" fill="#c43030" stroke="none"/>
</g>
<!-- BR -->
<g transform="translate(452,612)" fill="none" stroke="#c43030">
  <circle r="18" stroke-width="1.1"/>
  <circle r="12" stroke-width="0.5" stroke-opacity="0.55"/>
  <g fill="#c43030" stroke="none">
    <path d="M0,-11 C-3.5,-8 -3.5,-3.5 0,-1.5 C3.5,-3.5 3.5,-8 0,-11Z"/>
    <path d="M11,0  C8,-3.5  3.5,-3.5 1.5,0 C3.5,3.5 8,3.5 11,0Z"/>
    <path d="M0,11  C3.5,8  3.5,3.5 0,1.5 C-3.5,3.5 -3.5,8 0,11Z"/>
    <path d="M-11,0 C-8,3.5 -3.5,3.5 -1.5,0 C-3.5,-3.5 -8,-3.5 -11,0Z"/>
  </g>
  <circle r="3" fill="#c43030" stroke="none"/>
</g>

<!-- mid-border ornaments -->
<g transform="translate(240,28)" fill="#c43030">
  <path d="M0,-9 C-3.5,-6 -3.5,-2 0,0 C3.5,-2 3.5,-6 0,-9Z"/>
  <path d="M0,9 C3.5,6 3.5,2 0,0 C-3.5,2 -3.5,6 0,9Z"/>
  <circle r="1.8"/>
</g>
<g transform="translate(240,612)" fill="#c43030">
  <path d="M0,-9 C-3.5,-6 -3.5,-2 0,0 C3.5,-2 3.5,-6 0,-9Z"/>
  <path d="M0,9 C3.5,6 3.5,2 0,0 C-3.5,2 -3.5,6 0,9Z"/>
  <circle r="1.8"/>
</g>
<g transform="translate(28,320)" fill="#c43030">
  <path d="M-9,0 C-6,-3.5 -2,-3.5 0,0 C-2,3.5 -6,3.5 -9,0Z"/>
  <path d="M9,0 C6,3.5 2,3.5 0,0 C2,-3.5 6,-3.5 9,0Z"/>
  <circle r="1.8"/>
</g>
<g transform="translate(452,320)" fill="#c43030">
  <path d="M-9,0 C-6,-3.5 -2,-3.5 0,0 C-2,3.5 -6,3.5 -9,0Z"/>
  <path d="M9,0 C6,3.5 2,3.5 0,0 C2,-3.5 6,-3.5 9,0Z"/>
  <circle r="1.8"/>
</g>

<!-- ── FIGURE ── -->
<!-- robe body -->
<path d="M 124 640 Q 72 582 84 520 Q 90 470 108 428 Q 128 378 148 348 L 240 328 L 332 348 Q 352 378 372 428 Q 390 470 396 520 Q 408 582 356 640 Z"
  fill="url(#robeGrad)"/>

<!-- inner robe fold shadows -->
<path d="M 196 482 Q 208 420 240 388 Q 272 420 284 482 Q 264 504 240 510 Q 216 504 196 482 Z" fill="#0c0806"/>
<path d="M 144 562 Q 166 498 196 468 Q 212 508 208 562" fill="none" stroke="#1c1008" stroke-width="2.5"/>
<path d="M 336 562 Q 314 498 284 468 Q 268 508 272 562" fill="none" stroke="#1c1008" stroke-width="2.5"/>

<!-- robe collar + V detail -->
<path d="M 188 368 Q 214 380 240 377 Q 266 380 292 368 Q 272 396 240 400 Q 208 396 188 368 Z" fill="#1c1008"/>
<path d="M 218 374 L 240 400 L 262 374" fill="none" stroke="#c43030" stroke-width="0.9"/>
<!-- kbach collar emblem -->
<g transform="translate(240,374)" fill="none" stroke="#c43030" stroke-width="0.8" opacity="0.7">
  <path d="M-10,0 C-7,-4 -3,-4 0,-1 C3,-4 7,-4 10,0"/>
  <circle cx="0" cy="0" r="2" fill="#c43030" stroke="none" opacity="0.8"/>
</g>

<!-- neck -->
<path d="M 216 300 Q 216 330 213 350 L 267 350 Q 264 330 264 300 Z" fill="#b88462"/>

<!-- ── HEAD ── -->
<ellipse cx="240" cy="252" rx="74" ry="88" fill="url(#faceLight)" filter="url(#faceGlow)"/>

<!-- hair — dark, flowing -->
<path d="M 168 228 Q 166 172 184 144 Q 206 114 240 108 Q 274 114 296 144 Q 314 172 312 228 Q 302 208 296 188 Q 280 158 240 152 Q 200 158 184 188 Q 178 208 168 228 Z" fill="#100a04"/>
<path d="M 168 228 Q 160 260 162 292 Q 165 298 172 288 Q 176 268 180 246 Z" fill="#100a04"/>
<path d="M 312 228 Q 320 260 318 292 Q 315 298 308 288 Q 304 268 300 246 Z" fill="#100a04"/>
<!-- hair wisps -->
<path d="M 218 114 Q 234 104 240 108 Q 234 101 226 106 Z" fill="#1c1008"/>
<path d="M 258 116 Q 248 104 240 108 Q 250 101 260 108 Z" fill="#1c1008"/>

<!-- ── FACE FEATURES ── -->
<!-- eye shadow depth -->
<ellipse cx="210" cy="248" rx="18" ry="12" fill="#8c5e32" opacity="0.48"/>
<ellipse cx="270" cy="248" rx="18" ry="12" fill="#8c5e32" opacity="0.48"/>

<!-- eyes -->
<ellipse cx="210" cy="248" rx="12" ry="8.5" fill="#1c1008"/>
<ellipse cx="270" cy="248" rx="12" ry="8.5" fill="#1c1008"/>
<!-- iris -->
<circle cx="210" cy="249" r="6" fill="#2e1808"/>
<circle cx="270" cy="249" r="6" fill="#2e1808"/>
<!-- pupil -->
<circle cx="210" cy="249" r="3.2" fill="#080404"/>
<circle cx="270" cy="249" r="3.2" fill="#080404"/>
<!-- catchlight -->
<circle cx="212" cy="247" r="1.4" fill="#ecd8b8" opacity="0.82"/>
<circle cx="272" cy="247" r="1.4" fill="#ecd8b8" opacity="0.82"/>
<!-- eyelids -->
<path d="M 197 244 Q 210 240 223 244" fill="none" stroke="#1c0e06" stroke-width="1.7"/>
<path d="M 257 244 Q 270 240 283 244" fill="none" stroke="#1c0e06" stroke-width="1.7"/>
<path d="M 198 252 Q 210 256 222 252" fill="none" stroke="#8c5e32" stroke-width="0.9"/>
<path d="M 258 252 Q 270 256 282 252" fill="none" stroke="#8c5e32" stroke-width="0.9"/>

<!-- brows — angled, severe -->
<path d="M 196 232 Q 208 226 226 231" fill="none" stroke="#0e0806" stroke-width="2.8" stroke-linecap="round"/>
<path d="M 254 231 Q 270 226 284 232" fill="none" stroke="#0e0806" stroke-width="2.8" stroke-linecap="round"/>

<!-- nose -->
<path d="M 240 256 Q 232 272 228 282 Q 234 286 240 285 Q 246 286 252 282 Q 248 272 240 256 Z" fill="#9e6e42" opacity="0.72"/>
<path d="M 232 280 Q 240 284 248 280" fill="none" stroke="#7c4e22" stroke-width="1.1"/>

<!-- cheek shadows -->
<ellipse cx="192" cy="272" rx="24" ry="16" fill="#7c4e22" opacity="0.24"/>
<ellipse cx="288" cy="272" rx="24" ry="16" fill="#7c4e22" opacity="0.24"/>

<!-- lips -->
<path d="M 222 296 Q 230 292 240 294 Q 250 292 258 296 Q 250 300 240 302 Q 230 300 222 296 Z" fill="#6e2e1a"/>
<path d="M 222 296 Q 230 293 240 294 Q 250 293 258 296" fill="none" stroke="#8e3e28" stroke-width="0.9"/>
<path d="M 232 294 Q 240 291 248 294" fill="none" stroke="#9e5030" stroke-width="0.65" opacity="0.62"/>

<!-- ── HANDS ── -->
<!-- left arm / hand -->
<path d="M 144 422 Q 158 400 174 384 Q 188 378 196 390 Q 202 402 194 416 Q 186 426 178 432 Q 168 438 160 430 Q 150 423 144 422 Z" fill="#b88462"/>
<path d="M 194 390 Q 200 384 205 392" fill="none" stroke="#9e7252" stroke-width="1.6"/>
<path d="M 191 397 Q 197 390 202 397" fill="none" stroke="#9e7252" stroke-width="1.4"/>
<path d="M 188 404 Q 194 398 199 404" fill="none" stroke="#9e7252" stroke-width="1.4"/>

<!-- right arm — holding quill pen -->
<path d="M 336 422 Q 322 400 306 383 Q 292 376 284 387 Q 277 398 286 413 Q 293 424 302 430 Q 312 436 320 430 Q 329 424 336 422 Z" fill="#b88462"/>
<!-- quill -->
<path d="M 285 387 Q 308 358 328 322 Q 332 316 335 320 Q 338 325 334 333 Q 318 366 298 394 Z" fill="#eedcb8"/>
<path d="M 335 320 Q 340 313 337 308 Q 334 312 332 318" fill="#d8c898"/>
<!-- nib + ember tip -->
<path d="M 335 320 L 342 306 L 338 304 L 333 319 Z" fill="#c43030"/>
<circle cx="341" cy="307" r="2" fill="#ff6040" opacity="0.7" filter="url(#glow)"/>

<!-- floating writing runes / glyphs -->
<g opacity="0.18" fill="none" stroke="#c43030" stroke-width="0.9">
  <path d="M 364 278 Q 375 272 381 278 Q 387 285 381 293 Q 375 300 366 296 Q 358 290 364 278"/>
  <path d="M 370 308 Q 386 304 392 313"/>
  <path d="M 362 326 Q 372 320 378 328 Q 384 336 378 342"/>
  <path d="M 356 348 Q 371 343 378 352"/>
  <path d="M 366 368 Q 375 362 380 370"/>
</g>

<!-- film grain over everything -->
<rect width="480" height="640" filter="url(#grain)" opacity="0.45"/>

<!-- ── NAME PLATE ── -->
<rect x="28" y="576" width="424" height="36" fill="#0c0806"/>
<rect x="28" y="576" width="424" height="1.5" fill="#c43030" opacity="0.9"/>
<!-- kbach ornament flanking the name -->
<g transform="translate(240,594)" fill="#c43030" opacity="0.7">
  <path d="M -60,0 Q -30,-5 0,0 Q 30,5 60,0" fill="none" stroke="#c43030" stroke-width="0.8"/>
  <circle r="2" fill="#c43030"/>
  <circle cx="-56" cy="0" r="1.2"/><circle cx="56" cy="0" r="1.2"/>
</g>
<text x="240" y="599" font-family="Georgia, serif" font-size="14" letter-spacing="7" fill="#c8b898" text-anchor="middle" font-weight="600">TARHUALA</text>
<text x="240" y="612" font-family="Georgia, serif" font-size="8" letter-spacing="3.5" fill="#6e4e32" text-anchor="middle">System Fiction & Dark Fantasy</text>

<!-- vignette -->
<radialGradient id="vignette" cx="50%" cy="50%" r="72%">
  <stop offset="58%" stop-color="transparent"/>
  <stop offset="100%" stop-color="#030201" stop-opacity="0.74"/>
</radialGradient>
<rect width="480" height="640" fill="url(#vignette)"/>
</svg>`;

// ─────────────────────────────────────────────────────────────────────────────
// Write files
// ─────────────────────────────────────────────────────────────────────────────
const files = [
  [path.join(COVERS_DIR,  'mutation-of-the-apocalypse.svg'), mutationSVG],
  [path.join(COVERS_DIR,  'monarch-of-depravity.svg'),       monarchSVG],
  [path.join(COVERS_DIR,  'marked-by-false-gods.svg'),       markedSVG],
  [path.join(BANNERS_DIR, 'hero-banner.svg'),                heroBannerSVG],
  [path.join(AUTHOR_DIR,  'author.svg'),                     authorSVG],
];

files.forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Written:', path.relative(__dirname, filePath));
});

console.log('\nAll SVGs generated successfully.');
