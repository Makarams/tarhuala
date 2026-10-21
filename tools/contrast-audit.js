#!/usr/bin/env node
/**
 * CONTRAST AUDIT · WCAG 2.2 AA checker for the Tarhuala palette.
 *
 * Parses the real CSS custom properties from public/css/style.css for BOTH
 * themes (:root = dark, [data-theme="light"] = light), resolves var() refs,
 * and checks every meaningful foreground/background pairing:
 *
 *   - body / secondary / label text on each surface     >= 4.5 (normal text)
 *   - each accent used as small-label text on the base   >= 4.5
 *   - acc-on (fill text) on each accent + hover variant  >= 4.5
 *   - accents / rules as UI indicators vs the base       >= 3.0 (graphical)
 *
 * Exit code is non-zero if any REQUIRED (text) check fails, so it can gate CI.
 * Run: node tools/contrast-audit.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const CSS = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'style.css'), 'utf8');

// ---- extract a {} block that starts at a given selector ------------------
function block(selector) {
  const i = CSS.indexOf(selector);
  if (i < 0) return '';
  const open = CSS.indexOf('{', i);
  const close = CSS.indexOf('}', open);
  return CSS.slice(open + 1, close);
}
function vars(blockText) {
  const map = {};
  const re = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6}|var\(\s*(--[\w-]+)\s*\))/g;
  let m;
  while ((m = re.exec(blockText))) map[m[1]] = m[3] ? `var(${m[3]})` : m[2];
  return map;
}
function resolve(map) {
  const out = Object.assign({}, map);
  for (let pass = 0; pass < 8; pass++) {
    for (const k of Object.keys(out)) {
      const v = out[k];
      const ref = /^var\(\s*(--[\w-]+)\s*\)$/.exec(v || '');
      if (ref && out[ref[1]]) out[k] = out[ref[1]];
    }
  }
  return out;
}

const darkRaw = vars(block(':root'));
const lightRaw = Object.assign({}, darkRaw, vars(block('[data-theme="light"]')));
const DARK = resolve(darkRaw);
const LIGHT = resolve(lightRaw);

// ---- colour math ----------------------------------------------------------
function hex(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function ratio(a, b) {
  const la = lum(hex(a)), lb = lum(hex(b));
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

const ACCENTS = ['ember', 'jade', 'gold', 'indigo', 'ivory', 'cyan'];
let failures = 0;
const RED = s => `\x1b[31m${s}\x1b[0m`, GRN = s => `\x1b[32m${s}\x1b[0m`, DIM = s => `\x1b[2m${s}\x1b[0m`;

function check(T, label, fg, bg, min) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  const required = min >= 4.5;
  if (!ok && required) failures++;
  const tag = ok ? GRN('PASS') : (required ? RED('FAIL') : DIM('low '));
  console.log(`  ${tag}  ${r.toFixed(2).padStart(5)}:1  (need ${min})  ${label}`);
}

for (const [name, V] of [['DARK', DARK], ['LIGHT', LIGHT]]) {
  console.log(`\n=== ${name} THEME ===`);
  console.log(' text on surfaces (normal text, need 4.5):');
  for (const t of ['--text', '--text-2', '--text-3'])
    for (const s of ['--bg', '--bg-2', '--bg-3'])
      check(V, `${t} on ${s}`, V[t], V[s], 4.5);

  console.log(' accents as small-label text on base bg (need 4.5):');
  for (const a of ACCENTS) check(V, `--${a} on --bg`, V[`--${a}`], V['--bg'], 4.5);

  console.log(' fill text (--acc-on) on accent + hover variant (need 4.5):');
  for (const a of ACCENTS) {
    check(V, `--acc-on on --${a}`, V['--acc-on'], V[`--${a}`], 4.5);
    check(V, `--acc-on on --${a}-2 (hover)`, V['--acc-on'], V[`--${a}-2`], 4.5);
  }

  console.log(' graphical / UI indicators vs base (need 3.0):');
  check(V, '--rule on --bg', V['--rule'], V['--bg'], 3.0);
  check(V, '--line-2 on --bg', V['--line-2'], V['--bg'], 3.0);
  for (const a of ACCENTS) check(V, `--${a} border vs --bg`, V[`--${a}`], V['--bg'], 3.0);
}

console.log(`\n${failures ? RED(`✗ ${failures} required (text) check(s) FAILED`) : GRN('✓ all required text checks pass AA')}`);
process.exit(failures ? 1 : 0);
