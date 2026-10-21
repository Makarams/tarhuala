#!/usr/bin/env node
/**
 * Regenerate public/images/og-cover.png from og-cover.svg.
 * Run after editing the OG card: node tools/rasterize-og.js
 * (Kept out of the main build because the card contains text, whose rendering
 * depends on fonts installed on the build machine — so the PNG is committed.)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const IMG = path.join(__dirname, '..', 'public', 'images');
const svg = fs.readFileSync(path.join(IMG, 'og-cover.svg'));
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: true } }).render();
fs.writeFileSync(path.join(IMG, 'og-cover.png'), png.asPng());
console.log('og-cover.png ->', png.width + 'x' + png.height);
