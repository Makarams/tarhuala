const fs = require('fs');
const path = require('path');

// Read CSS files
const styleCSS = fs.readFileSync('./public/css/style.css', 'utf-8');
const patchCSS = fs.readFileSync('./public/css/patch.css', 'utf-8');
const fullCSS = styleCSS + '\n' + patchCSS;

// Read all HTML files
const htmlDir = './public';
const jsDir = './public/js';
let allHtmlContent = '';
let allJsContent = '';

const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

htmlFiles.forEach(file => {
  allHtmlContent += fs.readFileSync(path.join(htmlDir, file), 'utf-8') + '\n';
});

jsFiles.forEach(file => {
  allJsContent += fs.readFileSync(path.join(jsDir, file), 'utf-8') + '\n';
});

// Extract all CSS selectors/classes/ids
const cssSelectors = new Set();
const selectorPattern = /^[^{}]*(?={)/gm;
let match;

while ((match = selectorPattern.exec(fullCSS)) !== null) {
  const selector = match[0].trim();
  // Split by comma for multiple selectors
  selector.split(',').forEach(sel => {
    sel = sel.trim();
    // Extract classes
    const classes = sel.match(/\.[\w-]+/g);
    if (classes) {
      classes.forEach(cls => cssSelectors.add(cls));
    }
    // Extract IDs
    const ids = sel.match(/#[\w-]+/g);
    if (ids) {
      ids.forEach(id => cssSelectors.add(id));
    }
  });
}

// Check if each selector is used
const used = {};
const unused = {};

cssSelectors.forEach(selector => {
  const regex = new RegExp(`\\${selector}\\b`);
  const inHtml = regex.test(allHtmlContent);
  const inJs = regex.test(allJsContent);
  
  if (inHtml || inJs) {
    used[selector] = true;
  } else {
    unused[selector] = true;
  }
});

console.log('Total CSS selectors found:', cssSelectors.size);
console.log('Used selectors:', Object.keys(used).length);
console.log('Unused selectors:', Object.keys(unused).length);
console.log('\nUnused CSS:');
Object.keys(unused).sort().forEach(sel => {
  console.log(' ', sel);
});
