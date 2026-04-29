/* =====================================================================
   TARHUALA — app.js
   ===================================================================== */
(function(){
  'use strict';

  var html = document.documentElement;
  var THEME_KEY = 'tarhuala-theme';
  var FONT_KEY  = 'tarhuala-font-size';

  /* ------------------------------------------------------------------
     KBACH SVG SYMBOL LIBRARY
     Injected once into body. Referenced via <use href="#kb-...">.
     All use currentColor so they adapt to the active accent.
     ------------------------------------------------------------------ */
  var KBACH_SVG = [
    '<svg xmlns="http://www.w3.org/2000/svg" class="kbach-defs" aria-hidden="true" focusable="false">',
      '<defs>',
        /* 4-petal lotus rosette — primary motif */
        '<symbol id="kb-rose" viewBox="-50 -50 100 100">',
          '<circle r="48" fill="none" stroke="currentColor" stroke-width="1.6"/>',
          '<circle r="44" fill="none" stroke="currentColor" stroke-width=".6"/>',
          '<g fill="currentColor" stroke="currentColor" stroke-width=".8">',
            '<path d="M 0,-40 C -13,-30 -13,-11 0,-4 C 13,-11 13,-30 0,-40 Z"/>',
            '<path d="M 40,0 C 30,-13 11,-13 4,0 C 11,13 30,13 40,0 Z"/>',
            '<path d="M 0,40 C 13,30 13,11 0,4 C -13,11 -13,30 0,40 Z"/>',
            '<path d="M -40,0 C -30,13 -11,13 -4,0 C -11,-13 -30,-13 -40,0 Z"/>',
          '</g>',
          '<g fill="none" stroke="currentColor" stroke-width=".7" stroke-linecap="round">',
            '<path d="M 13,-13 Q 27,-23 32,-17 Q 28,-8 21,-9"/>',
            '<path d="M 13,13 Q 27,23 21,29 Q 12,25 9,17"/>',
            '<path d="M -13,13 Q -27,23 -32,17 Q -28,8 -21,9"/>',
            '<path d="M -13,-13 Q -27,-23 -21,-29 Q -12,-25 -9,-17"/>',
          '</g>',
          '<circle r="6" fill="currentColor"/>',
          '<circle r="2.5" fill="currentColor"/>',
        '</symbol>',

        /* 8-petal royal rosette — for larger ornaments / hero backgrounds */
        '<symbol id="kb-rose-8" viewBox="-110 -110 220 220">',
          '<circle r="105" fill="none" stroke="currentColor" stroke-width="1.4"/>',
          '<circle r="100" fill="none" stroke="currentColor" stroke-width=".5"/>',
          '<circle r="94" fill="none" stroke="currentColor" stroke-width=".8"/>',
          '<g fill="currentColor" stroke="currentColor" stroke-width=".7">',
            '<path d="M 0,-90 C -20,-74 -20,-34 0,-22 C 20,-34 20,-74 0,-90 Z"/>',
            '<g transform="rotate(45)"><path d="M 0,-84 C -11,-70 -11,-40 0,-32 C 11,-40 11,-70 0,-84 Z"/></g>',
            '<g transform="rotate(90)"><path d="M 0,-90 C -20,-74 -20,-34 0,-22 C 20,-34 20,-74 0,-90 Z"/></g>',
            '<g transform="rotate(135)"><path d="M 0,-84 C -11,-70 -11,-40 0,-32 C 11,-40 11,-70 0,-84 Z"/></g>',
            '<g transform="rotate(180)"><path d="M 0,-90 C -20,-74 -20,-34 0,-22 C 20,-34 20,-74 0,-90 Z"/></g>',
            '<g transform="rotate(225)"><path d="M 0,-84 C -11,-70 -11,-40 0,-32 C 11,-40 11,-70 0,-84 Z"/></g>',
            '<g transform="rotate(270)"><path d="M 0,-90 C -20,-74 -20,-34 0,-22 C 20,-34 20,-74 0,-90 Z"/></g>',
            '<g transform="rotate(315)"><path d="M 0,-84 C -11,-70 -11,-40 0,-32 C 11,-40 11,-70 0,-84 Z"/></g>',
          '</g>',
          '<circle r="32" fill="none" stroke="currentColor" stroke-width=".7"/>',
          '<g fill="currentColor" stroke="currentColor" stroke-width=".5">',
            '<g transform="rotate(22.5)"><path d="M 0,-28 C -7,-21 -7,-7 0,-3 C 7,-7 7,-21 0,-28 Z"/></g>',
            '<g transform="rotate(112.5)"><path d="M 0,-28 C -7,-21 -7,-7 0,-3 C 7,-7 7,-21 0,-28 Z"/></g>',
            '<g transform="rotate(202.5)"><path d="M 0,-28 C -7,-21 -7,-7 0,-3 C 7,-7 7,-21 0,-28 Z"/></g>',
            '<g transform="rotate(292.5)"><path d="M 0,-28 C -7,-21 -7,-7 0,-3 C 7,-7 7,-21 0,-28 Z"/></g>',
          '</g>',
          '<circle r="9" fill="currentColor"/>',
          '<circle r="4" fill="currentColor"/>',
        '</symbol>',

        /* Diamond — interstitial filler / scene-break marker / bullet */
        '<symbol id="kb-diamond" viewBox="-14 -14 28 28">',
          '<path d="M 0,-12 L 4,-4 L 12,0 L 4,4 L 0,12 L -4,4 L -12,0 L -4,-4 Z" ',
            'fill="currentColor" stroke="currentColor" stroke-width=".8"/>',
          '<circle r="2" fill="currentColor"/>',
        '</symbol>',

        /* Corner ornament — used on cover frames and panels */
        '<symbol id="kb-corner" viewBox="0 0 24 24">',
          '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">',
            '<path d="M 2 12 L 2 2 L 12 2"/>',
            '<path d="M 2 8 L 2 5" stroke-width="2.5"/>',
            '<path d="M 5 2 L 8 2" stroke-width="2.5"/>',
          '</g>',
          '<g fill="currentColor">',
            '<circle cx="2" cy="2" r="2"/>',
          '</g>',
          '<g fill="currentColor" stroke="currentColor" stroke-width=".6">',
            '<path d="M 11 11 Q 16 12 17 17 Q 12 16 11 11 Z"/>',
          '</g>',
        '</symbol>',

        /* Small scroll flourish — mini ornament */
        '<symbol id="kb-flourish" viewBox="-30 -10 60 20">',
          '<g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">',
            '<path d="M -26 0 Q -16 -6 -8 0 Q 0 6 8 0 Q 16 -6 26 0"/>',
            '<circle cx="0" cy="0" r="2" fill="currentColor"/>',
            '<circle cx="-22" cy="0" r="1.2" fill="currentColor"/>',
            '<circle cx="22" cy="0" r="1.2" fill="currentColor"/>',
          '</g>',
        '</symbol>',

        /* Naga curl — Khmer serpent scroll, for asymmetric ornament */
        '<symbol id="kb-naga" viewBox="-24 -24 48 48">',
          '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">',
            '<path d="M -20 0 Q -14 -14 0 -14 Q 14 -14 14 0 Q 14 8 6 8 Q 0 8 0 2 Q 0 -2 4 -2"/>',
            '<circle cx="4" cy="-2" r="1.2" fill="currentColor"/>',
          '</g>',
          '<g fill="currentColor">',
            '<circle cx="-20" cy="0" r="2"/>',
          '</g>',
        '</symbol>',

        /* Pediment triangle — temple roof shape, for section caps */
        '<symbol id="kb-pediment" viewBox="-30 -14 60 28">',
          '<g fill="currentColor" fill-opacity=".5" stroke="currentColor" stroke-width=".8">',
            '<path d="M -28 10 L 0 -10 L 28 10 L 24 10 L 0 -6 L -24 10 Z"/>',
          '</g>',
          '<g fill="currentColor">',
            '<circle cx="0" cy="-10" r="2.5"/>',
            '<circle cx="-18" cy="6" r="1.5"/>',
            '<circle cx="18" cy="6" r="1.5"/>',
          '</g>',
        '</symbol>',

        /* Double-rosette — concentric rings with radial spokes */
        '<symbol id="kb-rose-double" viewBox="-50 -50 100 100">',
          '<circle r="46" fill="none" stroke="currentColor" stroke-width="1.2"/>',
          '<circle r="36" fill="none" stroke="currentColor" stroke-width=".6"/>',
          '<g stroke="currentColor" stroke-width=".7" fill="none">',
            '<line x1="0" y1="-44" x2="0" y2="-38"/>',
            '<line x1="0" y1="44" x2="0" y2="38"/>',
            '<line x1="-44" y1="0" x2="-38" y2="0"/>',
            '<line x1="44" y1="0" x2="38" y2="0"/>',
            '<line x1="-31" y1="-31" x2="-27" y2="-27"/>',
            '<line x1="31" y1="-31" x2="27" y2="-27"/>',
            '<line x1="-31" y1="31" x2="-27" y2="27"/>',
            '<line x1="31" y1="31" x2="27" y2="27"/>',
          '</g>',
          '<g fill="currentColor" stroke="currentColor" stroke-width=".6">',
            '<path d="M 0,-30 C -8,-22 -8,-10 0,-6 C 8,-10 8,-22 0,-30 Z"/>',
            '<path d="M 30,0 C 22,-8 10,-8 6,0 C 10,8 22,8 30,0 Z"/>',
            '<path d="M 0,30 C 8,22 8,10 0,6 C -8,10 -8,22 0,30 Z"/>',
            '<path d="M -30,0 C -22,8 -10,8 -6,0 C -10,-8 -22,-8 -30,0 Z"/>',
          '</g>',
          '<circle r="5" fill="currentColor"/>',
          '<circle r="1.5" fill="currentColor"/>',
        '</symbol>',

        /* ── kb-eye — eldritch eye with iris geometry ── */
        '<symbol id="kb-eye" viewBox="-60 -30 120 60">',
          '<path d="M -56,0 Q -28,-26 0,-26 Q 28,-26 56,0 Q 28,26 0,26 Q -28,26 -56,0 Z"',
            ' fill="none" stroke="currentColor" stroke-width="1.4"/>',
          '<circle r="18" fill="none" stroke="currentColor" stroke-width="1"/>',
          '<circle r="10" fill="currentColor" stroke="currentColor" stroke-width=".8"/>',
          '<circle r="4" fill="currentColor"/>',
          '<circle r="1.5" fill="currentColor"/>',
          /* radial lashes */
          '<g stroke="currentColor" stroke-width=".7">',
            '<line x1="0" y1="-22" x2="0" y2="-26"/>',
            '<line x1="0" y1="22" x2="0" y2="26"/>',
            '<line x1="-22" y1="0" x2="-26" y2="0"/>',
            '<line x1="22" y1="0" x2="26" y2="0"/>',
            '<line x1="-15" y1="-15" x2="-18" y2="-18"/>',
            '<line x1="15" y1="-15" x2="18" y2="-18"/>',
            '<line x1="-15" y1="15" x2="-18" y2="18"/>',
            '<line x1="15" y1="15" x2="18" y2="18"/>',
          '</g>',
        '</symbol>',

        /* ── kb-spiral — void spiral / tentacle curl ── */
        '<symbol id="kb-spiral" viewBox="-50 -50 100 100">',
          '<path d="M 0,0 C 0,-14 10,-22 22,-18 C 34,-14 38,0 30,10 C 22,20 8,20 0,12 C -8,4 -6,-8 2,-12 C 10,-16 18,-10 16,-2 C 14,6 6,8 2,4"',
            ' fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
          '<circle cx="2" cy="4" r="2.5" fill="currentColor"/>',
          '<circle cx="0" cy="0" r="1.2" fill="currentColor"/>',
          /* outer ring */
          '<circle r="46" fill="none" stroke="currentColor" stroke-width=".6"/>',
          '<g stroke="currentColor" stroke-width=".5">',
            '<line x1="0" y1="-44" x2="0" y2="-40"/>',
            '<line x1="44" y1="0" x2="40" y2="0"/>',
            '<line x1="0" y1="44" x2="0" y2="40"/>',
            '<line x1="-44" y1="0" x2="-40" y2="0"/>',
          '</g>',
        '</symbol>',

        /* ── kb-rose-6 — 6-petal variant for chapter ornaments ── */
        '<symbol id="kb-rose-6" viewBox="-52 -52 104 104">',
          '<circle r="50" fill="none" stroke="currentColor" stroke-width="1.2"/>',
          '<circle r="44" fill="none" stroke="currentColor" stroke-width=".5"/>',
          '<g fill="currentColor" stroke="currentColor" stroke-width=".8">',
            '<path d="M 0,-38 C -11,-28 -11,-10 0,-4 C 11,-10 11,-28 0,-38 Z"/>',
            '<g transform="rotate(60)"><path d="M 0,-38 C -11,-28 -11,-10 0,-4 C 11,-10 11,-28 0,-38 Z"/></g>',
            '<g transform="rotate(120)"><path d="M 0,-38 C -11,-28 -11,-10 0,-4 C 11,-10 11,-28 0,-38 Z"/></g>',
            '<g transform="rotate(180)"><path d="M 0,-38 C -11,-28 -11,-10 0,-4 C 11,-10 11,-28 0,-38 Z"/></g>',
            '<g transform="rotate(240)"><path d="M 0,-38 C -11,-28 -11,-10 0,-4 C 11,-10 11,-28 0,-38 Z"/></g>',
            '<g transform="rotate(300)"><path d="M 0,-38 C -11,-28 -11,-10 0,-4 C 11,-10 11,-28 0,-38 Z"/></g>',
          '</g>',
          '<circle r="7" fill="currentColor"/>',
          '<circle r="3" fill="currentColor"/>',
        '</symbol>',


        /* ── kb-medallion — Angkor stone medallion, dense concentric roundel ── */
        '<symbol id="kb-medallion" viewBox="-100 -100 200 200">',
          /* Outer double ring */
          '<circle r="96" fill="none" stroke="currentColor" stroke-width="2"/>',
          '<circle r="90" fill="none" stroke="currentColor" stroke-width="0.8"/>',
          /* Radiating border tick marks — 24 ticks */
          '<g stroke="currentColor" stroke-width="1.2">',
            '<line x1="0" y1="-90" x2="0" y2="-96"/>',
            '<line x1="0" y1="90" x2="0" y2="96"/>',
            '<line x1="-90" y1="0" x2="-96" y2="0"/>',
            '<line x1="90" y1="0" x2="96" y2="0"/>',
            '<line x1="-63.6" y1="-63.6" x2="-67.9" y2="-67.9"/>',
            '<line x1="63.6" y1="-63.6" x2="67.9" y2="-67.9"/>',
            '<line x1="-63.6" y1="63.6" x2="-67.9" y2="67.9"/>',
            '<line x1="63.6" y1="63.6" x2="67.9" y2="67.9"/>',
            '<line x1="-34.6" y1="-82" x2="-37" y2="-87.7"/>',
            '<line x1="34.6" y1="-82" x2="37" y2="-87.7"/>',
            '<line x1="-34.6" y1="82" x2="-37" y2="87.7"/>',
            '<line x1="34.6" y1="82" x2="37" y2="87.7"/>',
            '<line x1="-82" y1="-34.6" x2="-87.7" y2="-37"/>',
            '<line x1="82" y1="-34.6" x2="87.7" y2="-37"/>',
            '<line x1="-82" y1="34.6" x2="-87.7" y2="37"/>',
            '<line x1="82" y1="34.6" x2="87.7" y2="37"/>',
          '</g>',
          /* Outer petal ring — 8 broad cusps like lotus ring */
          '<g fill="currentColor" stroke="currentColor" stroke-width="0.6">',
            '<path d="M0,-86 C-18,-72 -18,-52 0,-42 C18,-52 18,-72 0,-86Z"/>',
            '<path d="M0,86 C18,72 18,52 0,42 C-18,52 -18,72 0,86Z"/>',
            '<path d="M-86,0 C-72,18 -52,18 -42,0 C-52,-18 -72,-18 -86,0Z"/>',
            '<path d="M86,0 C72,-18 52,-18 42,0 C52,18 72,18 86,0Z"/>',
            '<g transform="rotate(45)">',
              '<path d="M0,-80 C-14,-68 -14,-50 0,-42 C14,-50 14,-68 0,-80Z"/>',
              '<path d="M0,80 C14,68 14,50 0,42 C-14,50 -14,68 0,80Z"/>',
              '<path d="M-80,0 C-68,14 -50,14 -42,0 C-50,-14 -68,-14 -80,0Z"/>',
              '<path d="M80,0 C68,-14 50,-14 42,0 C50,14 68,14 80,0Z"/>',
            '</g>',
          '</g>',
          /* Middle ring */
          '<circle r="36" fill="none" stroke="currentColor" stroke-width="1.4"/>',
          '<circle r="30" fill="none" stroke="currentColor" stroke-width="0.6"/>',
          /* Inner 6-petal rosette */
          '<g fill="currentColor" stroke="currentColor" stroke-width="0.5">',
            '<path d="M0,-26 C-9,-19 -9,-8 0,-4 C9,-8 9,-19 0,-26Z"/>',
            '<g transform="rotate(60)"><path d="M0,-26 C-9,-19 -9,-8 0,-4 C9,-8 9,-19 0,-26Z"/></g>',
            '<g transform="rotate(120)"><path d="M0,-26 C-9,-19 -9,-8 0,-4 C9,-8 9,-19 0,-26Z"/></g>',
            '<g transform="rotate(180)"><path d="M0,-26 C-9,-19 -9,-8 0,-4 C9,-8 9,-19 0,-26Z"/></g>',
            '<g transform="rotate(240)"><path d="M0,-26 C-9,-19 -9,-8 0,-4 C9,-8 9,-19 0,-26Z"/></g>',
            '<g transform="rotate(300)"><path d="M0,-26 C-9,-19 -9,-8 0,-4 C9,-8 9,-19 0,-26Z"/></g>',
          '</g>',
          /* Spandrel cusps between outer and middle rings — 8 small teardrops */
          '<g fill="none" stroke="currentColor" stroke-width="0.8">',
            '<path d="M0,-60 C-5,-54 -5,-46 0,-42 C5,-46 5,-54 0,-60Z"/>',
            '<g transform="rotate(45)"><path d="M0,-58 C-4,-52 -4,-44 0,-40 C4,-44 4,-52 0,-58Z"/></g>',
            '<g transform="rotate(90)"><path d="M0,-60 C-5,-54 -5,-46 0,-42 C5,-46 5,-54 0,-60Z"/></g>',
            '<g transform="rotate(135)"><path d="M0,-58 C-4,-52 -4,-44 0,-40 C4,-44 4,-52 0,-58Z"/></g>',
            '<g transform="rotate(180)"><path d="M0,-60 C-5,-54 -5,-46 0,-42 C5,-46 5,-54 0,-60Z"/></g>',
            '<g transform="rotate(225)"><path d="M0,-58 C-4,-52 -4,-44 0,-40 C4,-44 4,-52 0,-58Z"/></g>',
            '<g transform="rotate(270)"><path d="M0,-60 C-5,-54 -5,-46 0,-42 C5,-46 5,-54 0,-60Z"/></g>',
            '<g transform="rotate(315)"><path d="M0,-58 C-4,-52 -4,-44 0,-40 C4,-44 4,-52 0,-58Z"/></g>',
          '</g>',
          /* Centre dot */
          '<circle r="5" fill="currentColor"/>',
          '<circle r="2" fill="currentColor" stroke="none"/>',
        '</symbol>',

        /* ── kb-cross — cult equal-arm cross with kbach flourishes ── */
        '<symbol id="kb-cross" viewBox="-40 -40 80 80">',
          '<rect x="-5" y="-38" width="10" height="76" rx="2" fill="currentColor" fill-opacity=".4" stroke="currentColor" stroke-width=".8"/>',
          '<rect x="-38" y="-5" width="76" height="10" rx="2" fill="currentColor" fill-opacity=".4" stroke="currentColor" stroke-width=".8"/>',
          '<circle r="8" fill="currentColor" fill-opacity=".7"/>',
          '<circle r="3" fill="currentColor"/>',
          '<g fill="currentColor" fill-opacity=".6">',
            '<circle cx="0" cy="-28" r="3"/>',
            '<circle cx="0" cy="28" r="3"/>',
            '<circle cx="-28" cy="0" r="3"/>',
            '<circle cx="28" cy="0" r="3"/>',
          '</g>',
        '</symbol>',

        /* Sun / theme toggle icons */
        '<symbol id="ic-sun" viewBox="0 0 24 24">',
          '<circle cx="12" cy="12" r="4" fill="currentColor"/>',
          '<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">',
            '<line x1="12" y1="2" x2="12" y2="5"/>',
            '<line x1="12" y1="19" x2="12" y2="22"/>',
            '<line x1="2" y1="12" x2="5" y2="12"/>',
            '<line x1="19" y1="12" x2="22" y2="12"/>',
            '<line x1="5" y1="5" x2="7" y2="7"/>',
            '<line x1="17" y1="17" x2="19" y2="19"/>',
            '<line x1="5" y1="19" x2="7" y2="17"/>',
            '<line x1="17" y1="7" x2="19" y2="5"/>',
          '</g>',
        '</symbol>',
        '<symbol id="ic-moon" viewBox="0 0 24 24">',
          '<path d="M 20 14 A 8 8 0 1 1 10 4 A 6 6 0 0 0 20 14 Z" fill="currentColor"/>',
        '</symbol>',

        /* Arrow icons */
        '<symbol id="ic-arrow-up" viewBox="0 0 24 24">',
          '<path d="M 12 4 L 12 20 M 5 11 L 12 4 L 19 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
        '</symbol>',
        '<symbol id="ic-cog" viewBox="0 0 24 24">',
          '<g fill="none" stroke="currentColor" stroke-width="1.6">',
            '<circle cx="12" cy="12" r="3"/>',
            '<path d="M 12 2 L 12 5 M 12 19 L 12 22 M 2 12 L 5 12 M 19 12 L 22 12 M 4.9 4.9 L 7 7 M 17 17 L 19.1 19.1 M 4.9 19.1 L 7 17 M 17 7 L 19.1 4.9" stroke-linecap="round"/>',
          '</g>',
        '</symbol>',

        /* LitRPG icons */
        '<symbol id="ic-sword" viewBox="0 0 24 24">',
          '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
            '<path d="M 14.5 2 L 22 2 L 22 9.5 L 10 21.5 L 2.5 21.5 L 2.5 14 Z" fill="currentColor" fill-opacity=".2"/>',
            '<line x1="7" y1="17" x2="10" y2="20"/>',
            '<line x1="19" y1="5" x2="14.5" y2="9.5"/>',
          '</g>',
        '</symbol>',
        '<symbol id="ic-chevron-up" viewBox="0 0 24 24">',
          '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
            '<path d="M 4 16 L 12 9 L 20 16"/>',
            '<path d="M 4 20 L 12 13 L 20 20" opacity=".5"/>',
          '</g>',
        '</symbol>',
        '<symbol id="ic-coin" viewBox="0 0 24 24">',
          '<circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.5"/>',
          '<circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1"/>',
          '<circle cx="12" cy="12" r="2.5" fill="currentColor" fill-opacity=".6"/>',
          '<line x1="12" y1="7" x2="12" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
          '<line x1="12" y1="15" x2="12" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        '</symbol>',
        '<symbol id="ic-plus" viewBox="0 0 24 24">',
          '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">',
            '<circle cx="12" cy="12" r="9" stroke-width="1.5" fill="currentColor" fill-opacity=".12"/>',
            '<line x1="12" y1="7" x2="12" y2="17"/>',
            '<line x1="7" y1="12" x2="17" y2="12"/>',
          '</g>',
        '</symbol>',
        '<symbol id="ic-warning" viewBox="0 0 24 24">',
          '<path d="M 12 2 L 22 20 L 2 20 Z" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
          '<line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
          '<circle cx="12" cy="17" r="1" fill="currentColor"/>',
        '</symbol>',
        '<symbol id="ic-diamond-alt" viewBox="0 0 24 24">',
          '<g fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="1.4">',
            '<path d="M 12 3 L 20 12 L 12 21 L 4 12 Z"/>',
          '</g>',
          '<circle cx="12" cy="12" r="2" fill="currentColor"/>',
        '</symbol>',
        '<symbol id="ic-scroll" viewBox="0 0 24 24">',
          '<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">',
            '<path d="M 5 4 C 3 4 3 6 3 7 L 3 17 C 3 19 3 21 5 21 L 19 21 C 21 21 21 19 21 18 L 21 7 C 21 5 19 5 17 5 L 7 5" fill="currentColor" fill-opacity=".15"/>',
            '<circle cx="5" cy="6" r="1.5"/>',
            '<line x1="8" y1="10" x2="17" y2="10"/>',
            '<line x1="8" y1="13" x2="17" y2="13"/>',
            '<line x1="8" y1="16" x2="14" y2="16"/>',
          '</g>',
        '</symbol>',
      '</defs>',
    '</svg>'
  ].join('');

  function injectKbach(){
    if (document.getElementById('kbach-defs-root')) return;
    var wrap = document.createElement('div');
    wrap.id = 'kbach-defs-root';
    wrap.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    wrap.innerHTML = KBACH_SVG;
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  /* ------------------------------------------------------------------
     THEME
     ------------------------------------------------------------------ */
  function setTheme(t){
    html.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch(e){}
    document.querySelectorAll('[data-theme-icon]').forEach(function(el){
      el.innerHTML = t === 'dark'
        ? '<svg width="16" height="16"><use href="#ic-sun"/></svg>'
        : '<svg width="16" height="16"><use href="#ic-moon"/></svg>';
    });
  }
  (function initTheme(){
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch(e){}
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
  })();

  /* ------------------------------------------------------------------
     UTILITIES
     ------------------------------------------------------------------ */
  function qs(id){ return document.getElementById(id); }
  function escHtml(s){
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function getParam(k){
    return new URLSearchParams(location.search).get(k) || '';
  }
  /* Cache-bust data URLs with the current build version. We pick up the
     ?v=YYYYMMDD that build.js already stamps onto /js/app.js so every fetch
     to /data/* gets a fresh URL after each deploy. Falls back to Date.now()
     if the script tag has no version (e.g. local file open). */
  var _cbToken = (function(){
    try {
      if (typeof BUILD_VERSION === 'string') return BUILD_VERSION;
      var s = document.currentScript && document.currentScript.src;
      var m = s && s.match(/[?&]v=([^&]+)/);
      if (m) return m[1];
    } catch(e) {}
    return String(Date.now());
  })();
  function cb(url){
    return url + (url.indexOf('?') === -1 ? '?v=' : '&v=') + _cbToken;
  }
    /* Returns varied kbach ornament - picks from pool based on a seed */
  var KBACH_POOL = ['#kb-rose','#kb-rose-6','#kb-rose-double','#kb-medallion','#kb-eye','#kb-cross'];
  var _roseIdx = 0;
  function roseIcon(size, seed){
    var href = seed !== undefined ? KBACH_POOL[seed % KBACH_POOL.length] : '#kb-rose';
    return '<span class="kb-rose" style="width:' + (size||'12px') + ';height:' + (size||'12px') + '">' +
             '<svg><use href="' + href + '"/></svg>' +
           '</span>';
  }
  function titleCase(s){
    return String(s || '').replace(/-/g,' ').replace(/\b\w/g, function(c){ return c.toUpperCase(); });
  }

  /* ------------------------------------------------------------------
     SITE DATA — loaded once, used everywhere
     ------------------------------------------------------------------ */
  var _site = { author: '', tagline: '', bio: '', url: '', seo: {} };
  var _siteReady = false;
  var _siteCallbacks = [];

  function onSiteReady(fn){ _siteReady ? fn(_site) : _siteCallbacks.push(fn); }

  function siteAuthor(){ return _site.author || document.title.split('—').pop().trim() || ''; }

  /* ------------------------------------------------------------------
     BOOTSTRAP on DOMContentLoaded
     ------------------------------------------------------------------ */
  function boot(){
    injectKbach();
    wireTheme();
    wireNav();
    wireBackToTop();
    wireRevealObserver();
    wireSiteInfo();   // loads site.json, then fires routeByPage once ready
  }

  function wireTheme(){
    var btn = qs('theme-toggle');
    if (!btn) return;
    setTheme(html.getAttribute('data-theme') || 'dark');
    btn.addEventListener('click', function(){
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  function wireNav(){
    var toggle = qs('nav-toggle');
    var links  = qs('nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function wireBackToTop(){
    var btt = qs('back-to-top');
    if (!btt) return;
    function onScroll(){
      btt.classList.toggle('is-visible', window.scrollY > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    btt.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScroll();
  }

  function wireRevealObserver(){
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    function refreshObservation(){
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el){
        io.observe(el);
      });
    }
    refreshObservation();
    window._revealRefresh = refreshObservation;
  }

  function wireSiteInfo(){
    fetch(cb('/data/site.json'))
      .then(function(r){ return r.json(); })
      .then(function(d){
        if (d) {
          _site.author  = d.author  || '';
          _site.tagline = d.tagline || '';
          _site.bio     = d.bio     || '';
          _site.url     = d.url     || window.location.origin;
          _site.seo     = d.seo     || {};
        }
        var name = _site.author;
        if (name) {
          document.querySelectorAll('[data-site-name]').forEach(function(el){
            el.textContent = name;
          });
          var fc = qs('footer-copy'); if (fc) fc.textContent = name;
        }
      })
      .catch(function(){})
      .finally(function(){
        var yr = qs('copy-year'); if (yr) yr.textContent = new Date().getFullYear();
        _siteReady = true;
        var cbs = _siteCallbacks.slice(); _siteCallbacks = [];
        cbs.forEach(function(fn){ try{ fn(_site); }catch(e){} });
        routeByPage();
      });
  }

  /* ------------------------------------------------------------------
     PAGE ROUTING
     ------------------------------------------------------------------ */
  function routeByPage(){
    recordVisit();
    if (qs('novels-grid'))       loadNovelsGrid();
    if (qs('novels-list'))       loadNovelsList();
    if (qs('novel-hero'))        loadNovelDetail();
    if (qs('chapter-body'))      loadChapter();
    if (qs('chapters-full-list') && !qs('novel-hero')) loadChaptersPage();
    if (qs('about-novels'))      loadAboutNovels();
  }

  /* ------------------------------------------------------------------
     PER-USER TRACKING — localStorage-based visitor analytics
     Key: 'tarhuala-analytics'
     ------------------------------------------------------------------ */
  var ANALYTICS_KEY = 'tarhuala-analytics';

  function getAnalytics(){
    try{ return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}'); }catch(e){ return {}; }
  }
  function saveAnalytics(a){
    try{ localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a)); }catch(e){}
  }
  function recordVisit(){
    var a = getAnalytics();
    a.totalVisits = (a.totalVisits || 0) + 1;
    var now = new Date().toISOString();
    a.lastVisit = now;
    if (!a.firstVisit) a.firstVisit = now;
    var page = (window.location.pathname.replace(/.*\//, '') || 'index.html') + (window.location.search || '');
    a.pages = a.pages || {};
    a.pages[page] = (a.pages[page] || 0) + 1;
    saveAnalytics(a);
  }
  function recordChapterRead(novelId, chNum){
    if (!novelId) return;
    var a = getAnalytics();
    a.chapters = a.chapters || {};
    var key = novelId + ':' + chNum;
    a.chapters[key] = (a.chapters[key] || 0) + 1;
    saveAnalytics(a);
  }
  function updateStatDisplays(){}

  /* ------------------------------------------------------------------
     HOME — novels grid + featured hero
     ------------------------------------------------------------------ */
  function loadNovelsGrid(){
    var grid = qs('novels-grid');
    var statsNovels   = qs('stat-novels');
    var statsChapters = qs('stat-chapters');

    fetch(cb('/data/novels.json'))
      .then(function(r){ return r.json(); })
      .then(function(novels){
        if (statsNovels) statsNovels.textContent = novels.length;

        // Featured hero: use newest novel (last declared), fetch its latest chapter snippet
        var featured = novels[novels.length - 1];
        setupFeaturedHero(featured);

        // Render grid cards (snippets loaded async per card)
        grid.innerHTML = novels.map(renderNovelCard).join('');

        // Load per-novel info for chapter counts + latest chapter snippet for cards
        var total = 0;
        var pending = novels.length;
        if (!pending){
          if (statsChapters) statsChapters.textContent = '0';
          return;
        }
        novels.forEach(function(n){
          fetch(cb('/data/' + n.id + '/info.json'))
            .then(function(r){ return r.json(); })
            .then(function(info){
              var chapters = info.chapters || [];
              var c = chapters.length || n.chapterCount || 0;
              total += c;
              var el = qs('chcount-' + n.id);
              if (el) el.textContent = c + ' ch.';

              // Load latest chapter for snippet
              if (chapters.length > 0){
                var latest = chapters[chapters.length - 1];
                var latestEl = qs('latest-ch-' + n.id);
                if (latestEl) latestEl.textContent = 'Ch. ' + latest.number + ' — ' + (latest.title || '');
                fetchChapterSnippet(n.id, latest.number, 'snippet-' + n.id);
              }
            })
            .catch(function(){
              total += n.chapterCount || 0;
              var el = qs('chcount-' + n.id);
              if (el && n.chapterCount) el.textContent = n.chapterCount + ' ch.';
            })
            .finally(function(){
              pending--;
              if (pending === 0 && statsChapters){
                statsChapters.textContent = String(total);
              }
            });
        });
        if (window._revealRefresh) window._revealRefresh();
      })
      .catch(function(){});
  }

  function fetchChapterSnippet(novelId, chNum, targetElId){
    fetch(cb('/data/' + novelId + '/chapter-' + chNum + '.json'))
      .then(function(r){ return r.json(); })
      .then(function(ch){
        var el = qs(targetElId);
        if (!el) return;
        var text = '';
        if (ch.paragraphs && ch.paragraphs.length){
          // Find first real prose paragraph
          for (var i = 0; i < ch.paragraphs.length; i++){
            var p = ch.paragraphs[i];
            if (p && p.length > 40 && !/^\*{2,}/.test(p.trim())){
              text = p.replace(/\n/g,' ').replace(/\s+/g,' ').trim();
              break;
            }
          }
        } else if (ch.html){
          // Strip HTML tags
          var tmp = document.createElement('div');
          tmp.innerHTML = ch.html;
          text = (tmp.textContent || tmp.innerText || '').replace(/\s+/g,' ').trim();
        }
        if (text) el.textContent = text.slice(0, 160) + (text.length > 160 ? '…' : '');
      })
      .catch(function(){});
  }

  function setupFeaturedHero(novel){
    var hero = qs('featured-hero');
    if (!hero || !novel) return;

    var cover = (novel.images && novel.images.cover) || '/images/covers/' + novel.id + '.svg';

    // Background banner image — use novel's banner as atmospheric backdrop
    var bgImg = qs('featured-hero-bg-img');
    var bannerSrc = (novel.images && novel.images.banner) || '/images/banners/' + novel.id + '-banner.svg';
    if (bgImg){ bgImg.src = bannerSrc; bgImg.onerror = function(){ this.style.display='none'; }; }

    // Foreground cover (visible, prominent)
    var coverImg = qs('featured-hero-cover-img');
    if (coverImg){
      coverImg.src = cover;
      coverImg.alt = novel.title || '';
      coverImg.onerror = function(){ this.style.opacity = 0.2; };
    }

    var titleEl = qs('featured-hero-title');
    var genreEl = qs('featured-hero-genre');
    var ctaEl   = qs('featured-hero-cta');

    if (titleEl) titleEl.textContent = novel.title;
    if (genreEl) genreEl.textContent = novel.genre || '';
    if (ctaEl)   ctaEl.href = 'novel.html?id=' + encodeURIComponent(novel.id);

    hero.setAttribute('data-novel-theme', novel.theme || 'ember');
    hero.removeAttribute('hidden');

    // Load info for latest chapter number + snippet
    fetch(cb('/data/' + novel.id + '/info.json'))
      .then(function(r){ return r.json(); })
      .then(function(info){
        var chapters = info.chapters || [];
        if (!chapters.length) return;
        var latest = chapters[chapters.length - 1];
        var chLabel = qs('featured-hero-ch-label');
        var chTitle = qs('featured-hero-ch-title');
        if (chLabel) chLabel.textContent = 'Chapter ' + latest.number;
        if (chTitle) chTitle.textContent = latest.title || '';

        // Update CTA to go directly to latest chapter
        if (ctaEl) ctaEl.href = 'chapter.html?id=' + novel.id + '&ch=' + latest.number;

        // Load snippet from latest chapter
        fetchChapterSnippet(novel.id, latest.number, 'featured-hero-snippet');
      })
      .catch(function(){});
  }

  function renderNovelCard(n){
    var theme = n.theme || 'ember';
    var cover = (n.images && n.images.cover) || '/images/covers/' + n.id + '.svg';
    var tags  = (n.tags || []).slice(0, 4).map(function(t){
      return '<span class="tag">' + escHtml(t) + '</span>';
    }).join('');
    return '' +
      '<article class="novel-card reveal" data-novel-theme="' + escHtml(theme) + '">' +
        '<a href="novel.html?id=' + escHtml(n.id) + '" class="novel-card-link">' +
          '<div class="novel-card-cover">' +
            '<img src="' + escHtml(cover) + '" alt="' + escHtml(n.title) + '" class="novel-cover-img" loading="lazy" onerror="this.style.opacity=0.2"/>' +
            '<div class="novel-card-badges">' +
              (n.status ? '<span class="pill pill-status">' + escHtml(n.status) + '</span>' : '') +
              (n.rating ? '<span class="pill pill-rating">' + escHtml(n.rating) + '</span>' : '') +
            '</div>' +
            '<div class="novel-card-title-over">' +
              '<span class="novel-card-title">' + escHtml(n.title) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="novel-card-body">' +
            '<div class="novel-card-genre">' + escHtml(n.genre || '') + '</div>' +
            '<h3 class="novel-card-title">' + escHtml(n.title) + '</h3>' +
            '<div class="novel-card-latest" id="latest-ch-' + escHtml(n.id) + '">Loading…</div>' +
            '<div class="novel-card-snippet" id="snippet-' + escHtml(n.id) + '"></div>' +
            '<div class="novel-card-tags">' + tags + '</div>' +
            '<div class="novel-card-foot">' +
              '<span class="novel-chcount" id="chcount-' + escHtml(n.id) + '">' +
                roseIcon('10px') + ' ' + ((n.chapterCount || 0) + ' ch.') +
              '</span>' +
              '<span class="novel-read-cta">Read <span>&rarr;</span></span>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</article>';
  }

  /* ------------------------------------------------------------------
     NOVELS LIST PAGE
     ------------------------------------------------------------------ */
  function loadNovelsList(){
    var list = qs('novels-list');
    var subLabel = qs('novels-list-sub');
    var metaEl  = qs('novels-simple-meta');
    var emptyEl = qs('novels-list-empty');
    fetch(cb('/data/novels.json'))
      .then(function(r){ return r.json(); })
      .then(function(novels){
        novels = Array.isArray(novels) ? novels : [];
        if (subLabel) subLabel.textContent = novels.length + ' Novel' + (novels.length !== 1 ? 's' : '') + ' · Tarhuala';
        if (metaEl)   metaEl.textContent   = novels.length + ' published work' + (novels.length !== 1 ? 's' : '');
        if (!novels.length){
          list.innerHTML = '';
          if (emptyEl) emptyEl.classList.add('show');
          return;
        }
        if (emptyEl) emptyEl.classList.remove('show');
        list.innerHTML = novels.map(renderNovelListItem).join('');
        if (window._revealRefresh) window._revealRefresh();
      })
      .catch(function(){
        if (subLabel) subLabel.textContent = 'Failed to load';
        if (metaEl)   metaEl.textContent   = '0 published works';
        if (emptyEl)  emptyEl.classList.add('show');
      });
  }

  function renderNovelListItem(n){
    var theme = n.theme || 'ember';
    var cover = (n.images && n.images.cover) || '/images/covers/' + n.id + '.svg';
    var descHtml = (n.description || '').split(/\n\n+/).map(function(p){
      var trimmed = p.trim();
      if (!trimmed) return '';
      return '<p class="novel-list-desc-p">' + escHtml(trimmed).replace(/\n/g, '<br>') + '</p>';
    }).filter(Boolean).join('');
    return '' +
      '<article class="novel-list-item reveal" data-novel-theme="' + escHtml(theme) + '">' +
        '<a href="novel.html?id=' + escHtml(n.id) + '" class="novel-list-link">' +
          '<div class="novel-list-cover-wrap">' +
            '<img src="' + escHtml(cover) + '" alt="' + escHtml(n.title) + '" class="novel-list-cover" loading="lazy" onerror="this.style.opacity=\'0.2\'"/>' +
          '</div>' +
          '<div class="novel-list-body">' +
            '<div class="novel-list-genre">' + escHtml(n.genre || '') + '</div>' +
            '<h2 class="novel-list-title">' + escHtml(n.title) + '</h2>' +
            '<div class="novel-list-desc">' + descHtml + '</div>' +
            '<div class="novel-list-foot">' +
              (n.status ? '<span class="pill pill-status">' + escHtml(n.status) + '</span>' : '') +
              '<span class="novel-list-cta">Read ' + roseIcon('11px') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="novel-list-rose" aria-hidden="true"><svg><use href="#kb-rose-double"/></svg></div>' +
        '</a>' +
      '</article>';
  }

  /* ------------------------------------------------------------------
     NOVEL DETAIL PAGE
     ------------------------------------------------------------------ */
  function loadNovelDetail(){
    var novelId = getParam('id');
    var titleEl = qs('novel-title');
    if (!novelId){
      if (titleEl) titleEl.textContent = 'Novel not found';
      return;
    }
    fetch(cb('/data/' + novelId + '/info.json'))
      .then(function(r){ return r.json(); })
      .then(function(info){
        html.setAttribute('data-novel-theme', info.theme || 'ember');
        var set = function(id, v){ var e = qs(id); if (e) e.textContent = v || ''; };
        set('novel-title', info.title);
        set('novel-genre', info.genre);
        // Description: render multi-paragraph (split on \n\n or \n)
        var descEl = qs('novel-desc');
        if (descEl) {
          var descText = info.description || '';
          var paras = descText.split(/\n\n+/);
          descEl.innerHTML = paras.map(function(p){
            var t = p.trim();
            return t ? '<p>' + escHtml(t).replace(/\n/g,'<br>') + '</p>' : '';
          }).filter(Boolean).join('');
        }
        set('novel-status', info.status);
        set('novel-rating', info.rating);
        var chapters = info.chapters || [];
        set('novel-chcount', chapters.length);
        set('visible-count', chapters.length);
        var tagsEl = qs('novel-tags');
        if (tagsEl && info.tags){
          tagsEl.innerHTML = info.tags.map(function(t){
            return '<span class="tag">' + escHtml(t) + '</span>';
          }).join('');
        }
        var platEl = qs('novel-platforms');
        if (platEl && info.platforms && info.platforms.length){
          platEl.innerHTML = info.platforms.map(function(p){
            var icon = p.name === 'WebNovel'
              ? '<svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" style="vertical-align:-2px;margin-right:5px"><path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm.75 11.25h-1.5v-4.5h1.5v4.5zm0-6h-1.5v-1.5h1.5v1.5z"/></svg>'
              : '<svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" style="vertical-align:-2px;margin-right:5px"><path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm1 11H9V9h2v4zm0-6H9V5h2v2z"/></svg>';
            return '<a href="' + escHtml(p.url) + '" target="_blank" rel="noopener" class="platform-link">' +
              icon + escHtml(p.name) +
            '</a>';
          }).join('');
          platEl.hidden = false;
        }
        var coverEl = qs('novel-cover');
        if (coverEl){
          coverEl.src = (info.images && info.images.cover) || '/images/covers/' + novelId + '.svg';
          coverEl.alt = info.title || '';
          coverEl.onerror = function(){ this.style.opacity = '0.2'; };
        }
        var bgEl = qs('novel-hero-bg-img');
        if (bgEl){
          bgEl.src = (info.images && info.images.banner) || '/images/banners/' + novelId + '-banner.svg';
          bgEl.onerror = function(){ this.style.display='none'; };
        }
        var readBtn = qs('novel-read-btn');
        if (readBtn && chapters.length > 0){
          readBtn.href = 'chapter.html?id=' + novelId + '&ch=' + chapters[0].number;
        }
        var _author = siteAuthor();
        var _siteUrl = _site.url || window.location.origin;
        document.title = (info.title || 'Novel') + (_author ? ' \u2014 ' + _author : '');
        updatePageSEO({
          title: (info.title || 'Novel') + (_author ? ' \u2014 ' + _author : ''),
          description: info.description || ('Read ' + (info.title||'') + (_author ? ' by ' + _author : '') + ' — System Fiction & Dark Fantasy online.'),
          url: _siteUrl + '/novel.html?id=' + novelId,
          image: (info.images && info.images.cover) ? (_siteUrl + info.images.cover) : null,
          type: 'book',
          keywords: [info.genre, _author, 'web novel', 'read online'].concat(info.tags||[]).filter(Boolean).join(', '),
          jsonld: JSON.stringify({
            '@context':'https://schema.org','@type':'Book',
            'name': info.title, 'author':{'@type':'Person','name': _author},
            'description': info.description,
            'genre': info.genre,
            'url': _siteUrl + '/novel.html?id=' + novelId,
            'image': (info.images&&info.images.cover) ? (_siteUrl + info.images.cover) : undefined,
            'numberOfPages': info.chapters ? info.chapters.length : undefined,
            'inLanguage': 'en'
          })
        });
        renderChapterList(chapters, 'asc', novelId);
        document.querySelectorAll('.sort-btn').forEach(function(btn){
          btn.addEventListener('click', function(){
            document.querySelectorAll('.sort-btn').forEach(function(b){
              b.classList.toggle('active', b === btn);
            });
            renderChapterList(chapters, btn.dataset.order, novelId);
          });
        });
        if (typeof mountNovelBanner === 'function') mountNovelBanner(info);
        if (window._revealRefresh) window._revealRefresh();
      })
      .catch(function(){
        if (titleEl) titleEl.textContent = 'Novel not found';
      });
  }

  /* ------------------------------------------------------------------
     SEO — update meta tags dynamically after data loads
     ------------------------------------------------------------------ */
  function updatePageSEO(opts){
    opts = opts || {};
    // Title
    if (opts.title) document.title = opts.title;
    // Description
    setMeta('name', 'description', opts.description || '');
    // Keywords
    if (opts.keywords) setMeta('name', 'keywords', opts.keywords);
    // Canonical
    if (opts.url) setOrCreateLink('canonical', opts.url);
    // OG tags
    setMeta('property', 'og:title',       opts.title       || document.title);
    setMeta('property', 'og:description', opts.description || '');
    setMeta('property', 'og:type',        opts.type        || 'website');
    if (opts.url)   setMeta('property', 'og:url',   opts.url);
    if (opts.image) setMeta('property', 'og:image', opts.image);
    // Twitter
    setMeta('name', 'twitter:title',       opts.title       || document.title);
    setMeta('name', 'twitter:description', opts.description || '');
    if (opts.image) setMeta('name', 'twitter:image', opts.image);
    // JSON-LD structured data
    if (opts.jsonld){
      var existing = document.getElementById('jsonld-data');
      if (existing) existing.parentNode.removeChild(existing);
      var sc = document.createElement('script');
      sc.type = 'application/ld+json';
      sc.id   = 'jsonld-data';
      sc.textContent = opts.jsonld;
      document.head.appendChild(sc);
    }
  }
  function setMeta(attrName, attrVal, content){
    var el = document.querySelector('meta[' + attrName + '="' + attrVal + '"]');
    if (!el){
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }
  function setOrCreateLink(rel, href){
    var el = document.querySelector('link[rel="' + rel + '"]');
    if (!el){
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  /* ------------------------------------------------------------------
     CHAPTERS LIST PAGE  (chapters.html?id=novelId)
     ------------------------------------------------------------------ */
  function loadChaptersPage(){
    var novelId = getParam('id');
    var titleEl = qs('chapters-novel-title');
    var subEl   = qs('chapters-hero-sub');
    if (!novelId){
      if (titleEl) titleEl.textContent = 'Novel not found';
      return;
    }
    fetch(cb('/data/' + novelId + '/info.json'))
      .then(function(r){ return r.json(); })
      .then(function(info){
        html.setAttribute('data-novel-theme', info.theme || 'ember');
        if (titleEl) titleEl.textContent = info.title || titleCase(novelId);
        if (subEl)   subEl.textContent   = (info.chapters ? info.chapters.length : 0) + ' Chapters · ' + (info.genre || '');
        var chapters = info.chapters || [];
        var _author = siteAuthor();
        var _siteUrl = _site.url || window.location.origin;
        var _novelTitle = info.title || titleCase(novelId);
        document.title = _novelTitle + ' \u2014 Chapters' + (_author ? ' \u2014 ' + _author : '');
        updatePageSEO({
          title: _novelTitle + ' \u2014 All Chapters' + (_author ? ' \u2014 ' + _author : ''),
          description: 'Browse all chapters of ' + _novelTitle + (_author ? ' by ' + _author : '') + '. Free System Fiction & Dark Fantasy online.',
          url: _siteUrl + '/chapters.html?id=' + novelId,
          image: (info.images && info.images.cover) ? (_siteUrl + info.images.cover) : null,
          type: 'book',
          keywords: [_novelTitle, 'chapters', _author, 'read online', 'system fiction', 'dark fantasy'].filter(Boolean).join(', ')
        });
        renderChapterList(chapters, 'asc', novelId);
        document.querySelectorAll('.sort-btn').forEach(function(btn){
          btn.addEventListener('click', function(){
            document.querySelectorAll('.sort-btn').forEach(function(b){
              b.classList.toggle('active', b === btn);
            });
            renderChapterList(chapters, btn.dataset.order, novelId);
          });
        });
        if (window._revealRefresh) window._revealRefresh();
      })
      .catch(function(){
        if (titleEl) titleEl.textContent = 'Novel not found';
      });
  }

  function renderChapterList(chapters, order, novelId){
    var list = qs('chapters-full-list');
    if (!list) return;
    var sorted = [].concat(chapters).sort(function(a,b){
      return order === 'desc' ? b.number - a.number : a.number - b.number;
    });
    var vc = qs('visible-count'); if (vc) vc.textContent = sorted.length;
    list.innerHTML = sorted.map(function(ch){
      return '' +
        '<li class="ch-item">' +
          '<a href="chapter.html?id=' + escHtml(novelId) + '&ch=' + ch.number + '" class="ch-link">' +
            '<span class="ch-num">Ch. ' + ch.number + '</span>' +
            '<span class="ch-title-text">' + escHtml(ch.title) + '</span>' +
            '<span class="ch-arrow">&rarr;</span>' +
          '</a>' +
        '</li>';
    }).join('');
  }


  /* ------------------------------------------------------------------
     CHAPTER READER
     ------------------------------------------------------------------ */
  function loadChapter(){
    var chapterBody = qs('chapter-body');
    var novelId = getParam('id');
    var chNum   = parseInt(getParam('ch') || '1', 10);
    var breadcrumbNovel = qs('breadcrumb-novel-link');
    if (breadcrumbNovel && novelId){
      breadcrumbNovel.href = 'novel.html?id=' + novelId;
      breadcrumbNovel.textContent = titleCase(novelId);
    }
    var ni = qs('nav-index');
    if (ni && novelId) ni.href = 'novel.html?id=' + novelId + '#novel-chapters';
    if (!novelId){
      chapterBody.innerHTML = '<p>No novel specified.</p>';
      return;
    }
    var _novelInfo = null;
    fetch(cb('/data/' + novelId + '/info.json'))
      .then(function(r){ return r.json(); })
      .then(function(info){
        _novelInfo = info;
        html.setAttribute('data-novel-theme', info.theme || 'ember');
        var chapters = info.chapters || [];
        var idx = chapters.findIndex(function(c){ return c.number === chNum; });
        if (breadcrumbNovel) breadcrumbNovel.textContent = info.title || novelId;
        var prevBtn = qs('nav-prev');
        var nextBtn = qs('nav-next');
        if (prevBtn){
          if (idx > 0) prevBtn.href = 'chapter.html?id=' + novelId + '&ch=' + chapters[idx-1].number;
          else prevBtn.classList.add('disabled');
        }
        if (nextBtn){
          if (idx > -1 && idx < chapters.length - 1) nextBtn.href = 'chapter.html?id=' + novelId + '&ch=' + chapters[idx+1].number;
          else nextBtn.classList.add('disabled');
        }
        return fetch(cb('/data/' + novelId + '/chapter-' + chNum + '.json'));
      })
      .then(function(r){ return r.json(); })
      .then(function(ch){
        var _author  = siteAuthor();
        var _siteUrl = _site.url || window.location.origin;
        var novelTitle = (_novelInfo && _novelInfo.title) || titleCase(novelId);
        var chTitle = 'Chapter ' + ch.number + (ch.title ? ': ' + ch.title : '');
        var pageTitle = chTitle + ' \u2014 ' + novelTitle + (_author ? ' \u2014 ' + _author : '');
        var chDesc = 'Read ' + chTitle + ' of ' + novelTitle + (_author ? ' by ' + _author : '') + '. Free System Fiction & Dark Fantasy online.';
        document.title = pageTitle;
        updatePageSEO({
          title: pageTitle,
          description: chDesc,
          url: _siteUrl + '/chapter.html?id=' + novelId + '&ch=' + chNum,
          image: (_novelInfo && _novelInfo.images && _novelInfo.images.cover)
            ? (_siteUrl + _novelInfo.images.cover) : null,
          type: 'article',
          keywords: [novelTitle, chTitle, _author, 'read online', 'system fiction', 'dark fantasy'].filter(Boolean).join(', '),
          jsonld: JSON.stringify({
            '@context':'https://schema.org','@type':'Article',
            'headline': chTitle,
            'description': chDesc,
            'author':{'@type':'Person','name': _author},
            'isPartOf':{'@type':'Book','name': novelTitle,
              'url': _siteUrl + '/novel.html?id=' + novelId},
            'url': _siteUrl + '/chapter.html?id=' + novelId + '&ch=' + chNum,
            'position': ch.number,
            'publisher':{'@type':'Organization','name': _author, 'url': _siteUrl}
          })
        });
        var nl = qs('chapter-num-label'); if (nl) nl.textContent = 'Chapter ' + ch.number;
        var tl = qs('chapter-title');     if (tl) tl.textContent = ch.title || '';
        var bc = qs('breadcrumb-chapter'); if (bc) bc.textContent = 'Chapter ' + ch.number;
        recordChapterRead(novelId, chNum); updateStatDisplays();
        if (ch.html)              chapterBody.innerHTML = sanitizeChapterHtml(ch.html);
        else if (ch.paragraphs)   chapterBody.innerHTML = formatParagraphs(ch.paragraphs);
        else                      chapterBody.innerHTML = '<p>Chapter content unavailable.</p>';
        if (typeof mountChapterBanner === 'function' && _novelInfo) mountChapterBanner(_novelInfo);
      })
      .catch(function(){
        chapterBody.innerHTML = '<p>Failed to load chapter.</p>';
      });

    /* Reader font-size controls */
    var fontSize = 18;
    try { fontSize = parseInt(localStorage.getItem(FONT_KEY) || '18', 10); } catch(e){}
    function applyFontSize(){
      html.style.setProperty('--reader-font-size', fontSize + 'px');
      var v = qs('font-size-val'); if (v) v.textContent = fontSize + 'px';
      try { localStorage.setItem(FONT_KEY, fontSize); } catch(e){}
    }
    applyFontSize();
    var sb = qs('reader-settings-btn');
    var sp = qs('reader-settings-panel');
    if (sb && sp){
      sb.addEventListener('click', function(e){
        e.stopPropagation();
        sp.setAttribute('data-open', sp.getAttribute('data-open') === 'true' ? 'false' : 'true');
      });
      document.addEventListener('click', function(e){
        if (!sp.contains(e.target) && e.target !== sb) sp.setAttribute('data-open', 'false');
      });
    }
    var fs_ = qs('font-smaller');
    var fl  = qs('font-larger');
    if (fs_) fs_.addEventListener('click', function(){ fontSize = Math.max(14, fontSize - 1); applyFontSize(); });
    if (fl)  fl.addEventListener('click',  function(){ fontSize = Math.min(26, fontSize + 1); applyFontSize(); });
  }

  function sceneBreakHtml(){
    return '<p class="scene-break"><svg><use href="#kb-diamond"/></svg></p>';
  }

  /* --------- LitRPG CLASSIFICATION ----------
     Given a bracketed notification like "[Level 1 Zombie Killed, Awarding 50 Exp!]"
     or "[Leveling Up: Level 5!]", return a typed toast with the right icon + variant.
     Stat lines (Name:, Level:, Stats:...) are caught earlier and grouped into a
     status-screen component. */

  /* Per-novel narrative voice for system messages.
     Pulls the active novel theme from <html> and returns the entity speaking. */
  function activeTheme(){
    var t = document.documentElement.getAttribute('data-novel-theme')
         || document.documentElement.getAttribute('data-accent');
    if (t === 'red') return 'ember';
    if (t === 'green') return 'jade';
    if (t === 'blue') return 'indigo';
    return t || 'jade';
  }

  /* Map a (variant, message-text) pair to a label drawn from the novel's voice.
     Each novel has a primary "voice" plus a secondary used for broadcasts/loot. */
  var ENTITY = {
    /* Mutation of the Apocalypse — global mutation broadcast vs personal stats */
    ember:  { primary:'Mutation', kill:'Mutation', levelup:'Mutation',
              reward:'Mutation',  broadcast:'Broadcast', error:'Anomaly' },
    /* Marked by False Gods — tutorial voice / eldritch chorus */
    jade:   { primary:'Voice',    kill:'Voice',    levelup:'Voice',
              reward:'Voice',     broadcast:'Chorus',    error:'Voice' },
    /* Monarch of Depravity — death deity compact */
    gold:   { primary:'Compact',  kill:'Compact',  levelup:'Compact',
              reward:'Offering',  broadcast:'Omen',      error:'Compact' },
    /* Mistakenly Dragged Survival — nightmare game instance log */
    indigo: { primary:'Instance', kill:'Instance', levelup:'Instance',
              reward:'Instance',  broadcast:'Observer',  error:'Error' },
    /* Masquerade in Noble Court — original-life knowledge */
    ivory:  { primary:'Memory',   kill:'Memory',   levelup:'Memory',
              reward:'Memory',    broadcast:'Whisper',   error:'Memory' },
    /* Manager Who Builds Worlds — constellation manager authority */
    cyan:   { primary:'Authority',kill:'Authority',levelup:'Authority',
              reward:'Authority', broadcast:'Authority', error:'Authority' }
  };

  function entityLabel(variant, text){
    var theme = activeTheme();
    var map = ENTITY[theme] || ENTITY.jade;
    if (variant === 'error') return map.error || 'Anomaly';
    /* Use broadcast tone when the message reads as a wide/global announcement */
    if (text && /HUMANS OF EARTH|All Players|Observer|Broadcast|Worldwide|Initiating Earth/i.test(text)) {
      return map.broadcast || map.primary;
    }
    return map[variant] || map.primary;
  }

  function classifyToast(text){
    var inner = text.replace(/^\[\s*|\s*\]$/g, '').trim();
    var v, body = inner;

    if (/Error\b/i.test(inner)) {
      v = 'error';
    } else if (/Killed.*Exp|Awarding .* Exp/i.test(inner)) {
      v = 'kill';
    } else if (/Leveling Up|Level ?Up|Player Class|Class Change|Taking Out the/i.test(inner)) {
      v = 'levelup';
    } else if (/Leveling Exp Reach|Exp Reach/i.test(inner)) {
      v = 'levelup';
    } else if (/Received? .* Coin|Coins?:/i.test(inner)) {
      v = 'reward';
    } else if (/Receiving .* (Stat|Skill) Point|Stat Points?:|Skill Points?:/i.test(inner)) {
      v = 'reward';
    } else if (/^Receiving:|^Receiv(ed|ing)/i.test(inner) || /Scroll!$/i.test(inner)) {
      v = 'reward';
    } else if (/Allocating/i.test(inner)) {
      v = 'allocate';
    } else if (/Auction|Bid|Auctioning/i.test(inner)) {
      v = 'reward';
    } else if (/Kingdom|City|Title.*activated|Honor.*surpass|Glory.*exceed|Pride.*surpass/i.test(inner)) {
      v = 'levelup';
    } else if (/Achievement.*Cleared|Achievement.*Unlocked/i.test(inner)) {
      v = 'reward';
    } else if (/Transfer of Ownership|Current owner/i.test(inner)) {
      v = 'meta';
    } else if (/Dungeon.*Cleared|Dungeon.*Closed|Dungeon:.*Open/i.test(inner)) {
      v = 'meta';
    } else if (/Detected|Detecting |Initiating|Confirming|Profile/i.test(inner)) {
      v = 'meta';
    } else if (/Requirement|Unlock|Quest|Mission|Title/i.test(inner)) {
      v = 'meta';
    } else {
      v = 'meta';
    }

    var decorated = escHtml(body);

    return '<div class="sys-toast v-' + v + '">' +
             '<span class="sys-toast-text">[' + decorated + ']</span>' +
           '</div>';
  }

  /* Rarity chips — inline replacement for [Common]/[Rare]/[Epic]/etc. inside prose */
  var RARITY_WORDS = ['common','uncommon','bronze','silver','gold','rare','epic','legendary','heroic','mithril','platinum','mythic','divine'];
  function rarityChipify(text){
    // Replace [Rarity] tokens with styled chips — keep them inline
    return text.replace(/\[([A-Z][a-z]+)\]/g, function(m, word){
      var lower = word.toLowerCase();
      if (RARITY_WORDS.indexOf(lower) !== -1) {
        return '<span class="rarity-chip r-' + lower + '">' + word + '</span>';
      }
      return m;
    });
  }

  /* Status-screen renderer — handles character sheets, item cards, broadcasts, achievements */
  function renderStatusScreen(lines){
    // Strip leading 'System' or 'Character Profile' header lines — they're labels not data
    while (lines.length && /^(?:System|Character Profile)\s*:?\s*$/i.test(lines[0].trim())) {
      lines = lines.slice(1);
    }

    // Determine type from content
    var title = (ENTITY[activeTheme()] || ENTITY.jade).primary;
    var type  = 'generic';
    var itemName = '';
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (/^Name:/i.test(ln) && lines.some(function(l){ return /^Level:/i.test(l); })) {
        title = 'Character Profile'; type = 'charsheet'; break;
      }
      if (/^Name:/i.test(ln) && lines.some(function(l){ return /^Rank:/i.test(l); })) {
        // Use the actual item name as the card title
        var nameMatch = ln.match(/^Name:\s*(.+)/i);
        itemName = nameMatch ? nameMatch[1].trim() : 'Item';
        // Strip trailing (x/y) count from title display
        title = itemName.replace(/\s*\(\d+\/\d+\)\s*$/, '');
        type = 'itemcard'; break;
      }
      if (/^Achievement Cleared|^Achievement Unlocked/i.test(ln)) {
        title = 'Achievement'; type = 'achievement'; break;
      }
      if (/^Auction/i.test(ln)) {
        title = 'Auction House'; type = 'auction'; break;
      }
      if (/^HUMANS OF EARTH/i.test(ln)) {
        type = 'broadcast'; break;
      }
    }

    /* ── Achievement block ── */
    if (type === 'achievement') {
      var achLines = lines.slice(1); // skip header
      var achHtml  = '';
      var rarityRe = /^\[(Bronze|Silver|Gold|Platinum|Mithril|Heroic|Epic|Rare|Legendary|Mythic|Divine|Common|Uncommon)\]/i;
      var rewardMode = false;
      achLines.forEach(function(ln){
        if (/^Rewards?:/i.test(ln)) {
          rewardMode = true;
          achHtml += '<div class="ach-reward-label">Rewards</div>';
          return;
        }
        if (rewardMode) {
          achHtml += '<div class="ach-reward-item">' + rarityChipify('[' + ln.replace(/\[|\]/g,'') + ']') + ' ' + escHtml(ln.replace(/\[.*?\]\s*/,'')) + '</div>';
          return;
        }
        var rm = ln.match(/^\[(Bronze|Silver|Gold|Platinum|Mithril|Heroic|Epic|Rare|Legendary|Mythic|Divine|Common|Uncommon)\]\s*(.+)/i);
        if (rm) {
          var tier = rm[1].toLowerCase();
          achHtml += '<div class="ach-title">' +
            '<span class="rarity-chip r-' + tier + '">' + rm[1] + '</span>' +
            '<span class="ach-title-text">' + escHtml(rm[2]) + '</span>' +
          '</div>';
        } else {
          achHtml += '<div class="ach-desc">' + escHtml(ln) + '</div>';
        }
      });
      return '<div class="status-screen ss-achievement">' +
               '<div class="status-screen-header">' +
                 '<span class="kb-rose"><svg><use href="#kb-rose"/></svg></span>' +
                 '<span>' + title + '</span>' +
               '</div>' +
               '<div class="ach-body">' + achHtml + '</div>' +
             '</div>';
    }

    /* ── Item card ── */
    if (type === 'itemcard') {
      var itemHtml = '';
      var inAbilities = false;
      lines.forEach(function(ln){
        // [SkillName]: description — ability line
        var abilityMatch = ln.match(/^\[([^\]]+)\]\s*:\s*(.+)$/);
        if (abilityMatch) {
          var skillName = abilityMatch[1];
          var skillDesc = abilityMatch[2];
          // Extract uses like "(3 uses/day)" and style separately
          var usesMatch = skillDesc.match(/(\(\d+\s+uses?\/\w+\))$/i);
          var descPart = usesMatch ? skillDesc.slice(0, skillDesc.lastIndexOf(usesMatch[1])).trim() : skillDesc;
          itemHtml += '<div class="item-ability-row">' +
            '<span class="item-ability-label">[' + escHtml(skillName) + ']</span>' +
            '<span class="item-ability-val">' + escHtml(descPart) +
              (usesMatch ? ' ' + escHtml(usesMatch[1]) : '') +
            '</span>' +
          '</div>';
          return;
        }
        var m = ln.match(/^([A-Z][A-Za-z ]*?):\s*(.*)$/);
        if (!m) return;
        var lbl = m[1].trim(); var val = m[2].trim();
        if (lbl === 'Name') {
          // Don't em-ify numbers in item name — show as-is
          itemHtml += '<div class="item-name">' + escHtml(val) + '</div>';
        } else if (lbl === 'Rank') {
          var r = val.toLowerCase();
          itemHtml += '<div class="item-rank"><span class="rarity-chip r-' + r + '">' + escHtml(val) + '</span></div>';
        } else if (lbl === 'Description') {
          itemHtml += '<div class="item-desc">' + escHtml(val) + '</div>';
        } else if (lbl === 'Abilities' || lbl === 'Ability') {
          itemHtml += '<div class="item-ability-header">Abilities</div>';
          inAbilities = true;
        } else if (val !== '') {
          var decorated = rarityChipify(escHtml(val));
          itemHtml += '<div class="item-ability-row"><span class="item-ability-label">' + escHtml(lbl) + '</span><span class="item-ability-val">' + decorated + '</span></div>';
        } else {
          itemHtml += '<div class="item-ability-row"><span class="item-ability-val">' + rarityChipify(escHtml(lbl)) + '</span></div>';
        }
      });
      return '<div class="status-screen ss-item">' +
               '<div class="status-screen-header">' +
                 '<span class="kb-rose"><svg><use href="#kb-rose"/></svg></span>' +
                 '<span>' + escHtml(title) + '</span>' +
               '</div>' +
               '<div class="item-body">' + itemHtml + '</div>' +
             '</div>';
    }

    /* ── Broadcast ── */
    if (type === 'broadcast') {
      var bHtml = lines.map(function(ln){
        return '<div class="broadcast-line">' + escHtml(ln) + '</div>';
      }).join('');
      return '<div class="status-screen ss-broadcast">' +
               '<div class="broadcast-body">' + bHtml + '</div>' +
             '</div>';
    }

    /* ── Generic / Character Sheet ── */
    var rowsHtml = '';
    lines.forEach(function(ln){
      if (!ln.trim()) return;

      // [SkillName]: description — ability line inside character sheet
      var abilityMatch = ln.match(/^\[([^\]]+)\]\s*:\s*(.+)$/);
      if (abilityMatch) {
        var sName = abilityMatch[1];
        var sDesc = abilityMatch[2];
        var usesMatch = sDesc.match(/(\(\d+\s+uses?\/\w+\))$/i);
        var descPart = usesMatch ? sDesc.slice(0, sDesc.lastIndexOf(usesMatch[1])).trim() : sDesc;
        rowsHtml += '<div class="status-screen-row ss-row-full ss-ability-row">' +
          '<span class="status-screen-label">[' + escHtml(sName) + ']</span>' +
          '<span class="status-screen-value">' + escHtml(descPart) +
            (usesMatch ? ' ' + escHtml(usesMatch[1]) : '') +
          '</span>' +
        '</div>';
        return;
      }

      var m = ln.match(/^([A-Z][A-Za-z ]*?):\s*(.*)$/);
      if (m && m[2] !== '') {
        var lbl = m[1].trim();
        var val = m[2].trim();
        var valHtml;
        // Don't em-ify numbers in Name field
        if (lbl === 'Name') {
          valHtml = escHtml(val);
        } else {
          valHtml = rarityChipify(escHtml(val));
        }
        // Special styling: Coins and achievement/item counts with ᐃ
        if (/^Coins?$/i.test(lbl)) {
          valHtml = '<em class="stat-coins">' + escHtml(val.replace(/\s*ᐃ.*$/, '').trim()) + '</em>';
          if (/ᐃ/.test(val)) valHtml += ' <span class="stat-delta up">ᐃ</span>';
        }
        if (/^Achievements?|^Items?$/i.test(lbl) && /ᐃ/.test(val)) {
          valHtml = escHtml(val.replace(/\s*ᐃ.*$/, '').trim()) + ' <span class="stat-delta up">ᐃ</span>';
        }
        rowsHtml += '<div class="status-screen-row">' +
                      '<span class="status-screen-label">' + escHtml(lbl) + '</span>' +
                      '<span class="status-screen-value">' + valHtml + '</span>' +
                    '</div>';
      } else if (m && m[2] === '') {
        rowsHtml += '<div class="status-screen-section">' + escHtml(m[1]) + '</div>';
      } else {
        // free-form: standalone lines (full-width, no inner 2-column grid)
        var chipified = rarityChipify(escHtml(ln));
        rowsHtml += '<div class="status-screen-row ss-row-full">' +
                      '<span class="status-screen-value">' + chipified + '</span>' +
                    '</div>';
      }
    });

    return '<div class="status-screen' + (type === 'charsheet' ? ' ss-charsheet' : '') + '">' +
             '<div class="status-screen-header">' +
               '<span class="kb-rose"><svg><use href="#kb-rose"/></svg></span>' +
             '</div>' +
             '<div class="status-screen-grid">' + rowsHtml + '</div>' +
           '</div>';
  }

  /* Splits raw HTML from docx/mammoth (one big <p> with <br><br> breaks)
     into properly separated paragraphs, status screens, toasts, and scene breaks. */
  function sanitizeChapterHtml(raw){
    if (!raw) return '<p>Chapter content unavailable.</p>';
    var s = String(raw);

    // Strip chapter-title h1 (we render it separately)
    s = s.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');

    // Normalize br tags and split on 2+ consecutive <br>
    s = s.replace(/<br\s*\/?>/gi, '\n');
    s = s.replace(/\r\n/g, '\n');
    s = s.replace(/\n{2,}/g, '\n\n');

    // Unwrap existing <p> tags so we can re-paragraph consistently
    s = s.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n');

    // Strip known anti-piracy watermark lines wholesale
    var piracy = /(stolen|illicitly|illicit|Amazon|unauthorized|unlawfully|misappropriated|belongs on Royal Road|Royal Road|narrative has been stolen|report this chapter|report any instances|if discovered on [A-Z])/i;

    var bracketLineRx = /^\[[^\]]+\]$/;
    // All known stat/system screen field names, including ability lines like [Skill]: desc
    var statLineRx = /^(?:HUMANS OF EARTH|System\s*:|Character Profile\s*:|(?:Name|Age|Race|Gender|Class|Subclass|Level|Rank|Stats?|Agi|Str|Int|Vit|Dex|Luk|Per|Skills?|Abilities|Ability|Unallocated[^:]*|Health|Mana|Stamina|Attack|Defense|Speed|Wisdom|Luck|Endurance|Constitution|Charisma|Dexterity|Magic|MP|HP|SP|EXP?|Experience|Description|Coins?|Items?|Achievements?[^:]*)\s*:|\[[^\]]+\]\s*:)/i;
    var sceneRx = /^\s*(?:\*{3,}|\*+|·{3,}|\.{3,}|…)\s*$/;
    // --- marks explicit start/end of a system block
    var blockDelimRx = /^\s*-{3,}\s*$/;

    var chunks = s.split(/\n\n+/);

    /* Pass 1: consolidate consecutive single-line sys/stat chunks into group.
       --- delimiters force-open and force-close a stat group. */
    var rebuilt = [];
    var curGroup = null;
    var inDelimBlock = false; // true when inside --- ... ---

    function flushGroup(){
      if (!curGroup) return;
      if (curGroup.kind === 'stat') {
        // Skip empty stat groups (e.g. orphaned --- delimiter)
        if (curGroup.lines.length > 0) {
          rebuilt.push({ type: 'status', lines: curGroup.lines });
        }
      } else {
        if (curGroup.lines.length > 0) {
          rebuilt.push({ type: 'toasts', lines: curGroup.lines });
        }
      }
      curGroup = null;
    }

    for (var k = 0; k < chunks.length; k++) {
      var c = chunks[k].trim();
      if (!c) continue;

      // Special case: piracy watermark injected into a --- delimiter paragraph
      // (e.g. "---\nThis narrative is on Amazon without..."). Extract the delimiter.
      if (piracy.test(c)) {
        var firstLine = c.split('\n')[0].trim();
        if (blockDelimRx.test(firstLine)) {
          // Process the embedded delimiter, discard the piracy text
          if (!inDelimBlock) {
            flushGroup();
            curGroup = { kind: 'stat', lines: [] };
            inDelimBlock = true;
          } else {
            flushGroup();
            inDelimBlock = false;
          }
        }
        continue; // Always skip the piracy chunk itself
      }

      // --- delimiter: toggles a forced stat block
      if (blockDelimRx.test(c)) {
        if (!inDelimBlock) {
          // Opening ---: flush anything pending, start a fresh stat group
          flushGroup();
          curGroup = { kind: 'stat', lines: [] };
          inDelimBlock = true;
        } else {
          // Closing ---: flush the block
          flushGroup();
          inDelimBlock = false;
        }
        continue;
      }

      var isSingle = (c.indexOf('\n') === -1);

      // Inside a --- block: everything goes into the stat group,
      // EXCEPT bare bracket notifications which should be toasts
      if (inDelimBlock) {
        if (!curGroup) curGroup = { kind: 'stat', lines: [] };
        // Multi-line chunk inside block: split lines; bracket-only lines become toasts
        if (!isSingle) {
          c.split('\n').forEach(function(ln){
            var t = ln.trim();
            if (!t) return;
            // A line that is exactly [text] with no colon after = notification toast
            if (bracketLineRx.test(t) && !/\]\s*:/.test(t)) {
              flushGroup();
              rebuilt.push({ type: 'toast_single', text: t });
              curGroup = { kind: 'stat', lines: [] }; // re-open for any remaining lines
            } else {
              if (!curGroup) curGroup = { kind: 'stat', lines: [] };
              curGroup.lines.push(t);
            }
          });
        } else if (bracketLineRx.test(c) && !/\]\s*:/.test(c)) {
          // Single bracket notification inside --- block: flush stat, emit as toast
          flushGroup();
          rebuilt.push({ type: 'toast_single', text: c });
        } else {
          curGroup.lines.push(c);
        }
        continue;
      }

      if (isSingle && statLineRx.test(c)) {
        if (!curGroup || curGroup.kind !== 'stat') { flushGroup(); curGroup = { kind: 'stat', lines: [] }; }
        curGroup.lines.push(c);
        continue;
      }
      if (isSingle && bracketLineRx.test(c)) {
        if (!curGroup || curGroup.kind !== 'toast') { flushGroup(); curGroup = { kind: 'toast', lines: [] }; }
        curGroup.lines.push(c);
        continue;
      }
      flushGroup();
      rebuilt.push({ type: 'chunk', text: c });
    }
    flushGroup();

    /* Pass 2: render each item */
    var out = [];
    for (var i2 = 0; i2 < rebuilt.length; i2++) {
      var item = rebuilt[i2];
      if (item.type === 'status') {
        out.push(renderStatusScreen(item.lines));
      } else if (item.type === 'toast_single') {
        out.push(classifyToast(item.text));
      } else if (item.type === 'toasts') {
        // Wrap consecutive toasts in a .sys-group for tight stacking
        if (item.lines.length > 1) {
          var group = '<div class="sys-group">';
          item.lines.forEach(function(ln){ group += classifyToast(ln); });
          group += '</div>';
          out.push(group);
        } else {
          out.push(classifyToast(item.lines[0]));
        }
      } else {
        processProseChunk(item.text, out);
      }
    }

    return out.join('\n') || '<p>Chapter content unavailable.</p>';
  }

  function processProseChunk(chunk, out) {
    var lines = chunk.split('\n').map(function(x){ return x.trim(); }).filter(Boolean);
    var buf = [];
    var statBuf = [];
    var piracy = /(stolen|illicitly|illicit|Amazon|unauthorized|unlawfully|misappropriated|belongs on Royal Road|Royal Road|narrative has been stolen|report this chapter|report any instances|if discovered on [A-Z])/i;
    var sceneRx = /^\s*(?:\*{3,}|-{3,}|\*+|·{3,}|\.{3,}|…)\s*$/;
    var bracketLineRx = /^\[[^\]]+\]$/;
    var statLineRx = /^(?:HUMANS OF EARTH|(?:Name|Age|Race|Gender|Class|Subclass|Level|Stats?|Agi|Str|Int|Vit|Dex|Luk|Per|Skills?|Unallocated[^:]*|Health|Mana|Stamina|Attack|Defense|Speed|Wisdom|Luck|Endurance|Constitution|Charisma|Dexterity|Magic|MP|HP|SP|EXP?|Experience)\s*:)/i;

    function flushPara(){
      if (buf.length){
        var text = buf.join(' ').replace(/\s+/g, ' ').trim();
        if (text) out.push('<p>' + inlineFormat(text) + '</p>');
        buf = [];
      }
    }
    function flushStat(){
      if (statBuf.length){ out.push(renderStatusScreen(statBuf)); statBuf = []; }
    }
    for (var j = 0; j < lines.length; j++) {
      var ln = lines[j];
      if (piracy.test(ln)) continue;
      if (sceneRx.test(ln)) { flushPara(); flushStat(); out.push(sceneBreakHtml()); continue; }
      if (bracketLineRx.test(ln)) { flushPara(); flushStat(); out.push(classifyToast(ln)); continue; }
      if (statLineRx.test(ln)) { flushPara(); statBuf.push(ln); continue; }
      flushStat(); buf.push(ln);
    }
    flushPara(); flushStat();
  }

  /* Light inline formatting for paragraph text */
  function inlineFormat(text){
    var t = escHtml(text);
    // Rarity chips for [Common]/[Rare]/[Epic]/[Silver]/[Gold]/[Legendary]
    t = t.replace(/\[([A-Z][a-z]+)\]/g, function(m, word){
      var lower = word.toLowerCase();
      if (RARITY_WORDS.indexOf(lower) !== -1) {
        return '<span class="rarity-chip r-' + lower + '">' + word + '</span>';
      }
      return '[' + word + ']';
    });
    return t;
  }

  function formatParagraphs(paragraphs){
    var bracketRx = /^\[[^\]]+\]$/;
    var statRx = /^(?:HUMANS OF EARTH|(?:Name|Age|Race|Gender|Class|Subclass|Level|Stats?|Agi|Str|Int|Vit|Dex|Luk|Per|Skills?|Unallocated[^:]*|Health|Mana|Stamina|Attack|Defense|Speed|Wisdom|Luck|Endurance|Constitution|Charisma|Dexterity|Magic|MP|HP|SP|EXP?|Experience)\s*:)/i;
    var sceneRx = /^\s*(?:\*{3,}|-{3,}|\*+)\s*$/;
    var piracy = /stolen|Amazon|unauthorized|misappropriated/i;
    var out = [], statBuf = [], toastBuf = [];
    function flushStat(){
      if (statBuf.length){ out.push(renderStatusScreen(statBuf)); statBuf = []; }
    }
    function flushToast(){
      if (toastBuf.length){
        if (toastBuf.length > 1) {
          out.push('<div class="sys-group">' + toastBuf.map(classifyToast).join('') + '</div>');
        } else {
          out.push(classifyToast(toastBuf[0]));
        }
        toastBuf = [];
      }
    }
    for (var i = 0; i < paragraphs.length; i++){
      var parts = paragraphs[i].split(/\n\n+/);
      for (var j = 0; j < parts.length; j++){
        var s = parts[j].trim();
        if (!s) continue;
        if (piracy.test(s)) continue;
        if (sceneRx.test(s)) { flushStat(); flushToast(); out.push(sceneBreakHtml()); continue; }
        if (statRx.test(s)) { flushToast(); statBuf.push(s); continue; }
        if (bracketRx.test(s)) { flushStat(); toastBuf.push(s); continue; }
        flushStat(); flushToast();
        out.push('<p>' + inlineFormat(s) + '</p>');
      }
    }
    flushStat(); flushToast();
    return out.join('');
  }

  /* ------------------------------------------------------------------
     ABOUT PAGE — novels section
     ------------------------------------------------------------------ */
  function loadAboutNovels(){
    var wrap = qs('about-novels');
    if (!wrap) return;
    fetch(cb('/data/novels.json'))
      .then(function(r){ return r.json(); })
      .then(function(novels){
        if (!Array.isArray(novels) || !novels.length){ wrap.innerHTML = ''; return; }
        wrap.innerHTML = novels.map(function(n){
          var cover = (n.images && n.images.cover) || '/images/covers/' + n.id + '.svg';
          var tags = (n.tags || []).slice(0,3).map(function(t){ return '<span class="tag">' + escHtml(t) + '</span>'; }).join('');
          return '' +
            '<div class="about-novel-row reveal" data-novel-theme="' + escHtml(n.theme || 'ember') + '">' +
              '<img src="' + escHtml(cover) + '" alt="' + escHtml(n.title) + '" class="about-novel-cover" loading="lazy" onerror="this.style.opacity=\'0.2\'"/>' +
              '<div class="about-novel-info">' +
                '<div class="about-novel-genre">' + escHtml(n.genre || '') + '</div>' +
                '<h3 class="about-novel-title">' + escHtml(n.title) + '</h3>' +
                (function(){
                  var d = n.description || '';
                  return d.split(/\n\n+/).map(function(p){
                    var t = p.trim();
                    return t ? '<p class="about-novel-desc">' + escHtml(t).replace(/\n/g,'<br>') + '</p>' : '';
                  }).filter(Boolean).join('');
                })() +
                (tags ? '<div class="novel-hero-tags" style="margin-top:12px">' + tags + '</div>' : '') +
              '</div>' +
              '<a href="novel.html?id=' + escHtml(n.id) + '" class="btn btn-ghost" style="align-self:center;white-space:nowrap">Read now ' + roseIcon('10px') + '</a>' +
            '</div>';
        }).join('');
        if (window._revealRefresh) window._revealRefresh();
      })
      .catch(function(){});
  }

  /* ------------------------------------------------------------------
     BOOT
     ------------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

/* =====================================================================
   APP RESPONSIVE/A11Y PATCH (append at END of existing app.js file,
   INSIDE the main IIFE before final `})();` if possible)
   ===================================================================== */

(function responsiveA11yPatch(){
  // Guard if app structure missing
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.getElementById('nav-links');

  function syncNavA11y(){
    if (!navToggle || !navLinks) return;
    var open = navLinks.classList.contains('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Keep aria in sync on resize + click
  if (navToggle && navLinks){
    navToggle.addEventListener('click', function(){ setTimeout(syncNavA11y, 0); });
    window.addEventListener('resize', function(){
      // close mobile menu when switching to wide layouts
      if (window.innerWidth > 680 && navLinks.classList.contains('is-open')){
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
      }
      syncNavA11y();
    }, { passive:true });
    syncNavA11y();
  }

  // Sort buttons aria-pressed sync
  function wireSortAria(){
    var sortBtns = document.querySelectorAll('.sort-btn');
    if (!sortBtns.length) return;
    sortBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        sortBtns.forEach(function(b){
          b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
        });
      });
    });
    sortBtns.forEach(function(b){
      b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
    });
  }
  wireSortAria();

  // Reader settings panel aria sync
  var rsp = document.getElementById('reader-settings-panel');
  var rsb = document.getElementById('reader-settings-btn');
  if (rsp && rsb){
    function syncReaderPanelA11y(){
      var open = rsp.getAttribute('data-open') === 'true';
      rsp.setAttribute('aria-hidden', open ? 'false' : 'true');
      rsb.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    rsb.addEventListener('click', function(){ setTimeout(syncReaderPanelA11y, 0); });
    document.addEventListener('click', function(){ setTimeout(syncReaderPanelA11y, 0); });
    syncReaderPanelA11y();
  }

  // Prevent accidental horizontal scroll from long unbroken text in dynamic content
  var chapterBody = document.getElementById('chapter-body');
  if (chapterBody){
    chapterBody.style.overflowWrap = 'break-word';
    chapterBody.style.wordBreak = 'normal';
  }
})();