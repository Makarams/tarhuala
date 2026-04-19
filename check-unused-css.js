const fs = require('fs');
const path = require('path');

// Read CSS files
const styleCSS = fs.readFileSync('./public/css/style.css', 'utf-8');
const patchCSS = fs.readFileSync('./public/css/patch.css', 'utf-8');
const fullCSS = styleCSS + '\n' + patchCSS;

// Read all HTML and JS files
let allContent = '';
const publicDir = './public';
const jsDir = './public/js';

// Read HTML files
fs.readdirSync(publicDir).filter(f => f.endsWith('.html')).forEach(file => {
  allContent += fs.readFileSync(path.join(publicDir, file), 'utf-8') + '\n';
});

// Read JS files
fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).forEach(file => {
  allContent += fs.readFileSync(path.join(jsDir, file), 'utf-8') + '\n';
});

// Extract all CSS selectors
const cssRules = {};
const regex = /^\s*([^{}@\n]+)\s*\{/gm;
let match;

while ((match = regex.exec(fullCSS)) !== null) {
  const selector = match[1].trim();
  
  // Skip pseudo-elements, at-rules, etc.
  if (selector.startsWith('@') || selector === '*' || selector === ':root' || selector === 'html' || selector === 'body') {
    continue;
  }
  
  // Store the selector
  if (!cssRules[selector]) {
    cssRules[selector] = { used: false, count: 0 };
  }
  cssRules[selector].count++;
}

// Check usage of each selector
const unused = [];
const used = [];

Object.keys(cssRules).forEach(selector => {
  // Convert CSS selector to search patterns
  const searchPatterns = [];
  
  // Split by comma for multiple selectors
  selector.split(',').forEach(sel => {
    sel = sel.trim();
    
    // Extract classes and IDs
    const classMatches = sel.match(/\.[\w-]+/g) || [];
    const idMatches = sel.match(/#[\w-]+/g) || [];
    
    classMatches.forEach(cls => {
      searchPatterns.push(cls);
    });
    
    idMatches.forEach(id => {
      searchPatterns.push(id);
    });
  });
  
  // Check if any pattern is found in content
  let found = false;
  for (const pattern of searchPatterns) {
    const regex = new RegExp(`\\${pattern}\\b`);
    if (regex.test(allContent)) {
      found = true;
      break;
    }
  }
  
  if (found || searchPatterns.length === 0) {
    used.push({ selector, count: cssRules[selector].count });
  } else {
    unused.push({ selector, count: cssRules[selector].count });
  }
});

// Output results
console.log('\n=== CSS ANALYSIS REPORT ===\n');
console.log(`Total CSS selectors: ${Object.keys(cssRules).length}`);
console.log(`Used selectors: ${used.length}`);
console.log(`Unused selectors: ${unused.length}`);

if (unused.length > 0) {
  console.log('\n--- UNUSED CSS SELECTORS ---\n');
  unused.sort((a, b) => a.selector.localeCompare(b.selector)).forEach(item => {
    console.log(`${item.selector}`);
  });
}

console.log('\n=== END REPORT ===');
