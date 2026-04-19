const fs = require('fs');
const path = require('path');

// Read CSS files
const styleCss = fs.readFileSync('./public/css/style.css', 'utf8');
const patchCss = fs.readFileSync('./public/css/patch.css', 'utf8');
const allCss = styleCss + '\n' + patchCss;

// Read all HTML files
const htmlFiles = [
  './public/index.html',
  './public/about.html',
  './public/chapters.html',
  './public/chapter.html',
  './public/novels.html',
  './public/novel.html',
  './public/analytics.html'
];

let allHtml = '';
htmlFiles.forEach(file => {
  try {
    allHtml += fs.readFileSync(file, 'utf8') + '\n';
  } catch (e) {
    console.warn(`Warning: Could not read ${file}`);
  }
});

// Read all JS files
const jsFiles = [
  './public/js/app.js',
  './public/js/theme.js',
  './public/js/reader.js',
  './public/js/router.js',
  './public/js/chapters_data.js'
];

let allJs = '';
jsFiles.forEach(file => {
  try {
    allJs += fs.readFileSync(file, 'utf8') + '\n';
  } catch (e) {
    console.warn(`Warning: Could not read ${file}`);
  }
});

// Extract CSS selectors
const classRegex = /\.([a-zA-Z0-9\-_]+)/g;
const idRegex = /#([a-zA-Z0-9\-_]+)/g;

// Get unique selectors from CSS
const cssClasses = new Set();
const cssIds = new Set();

let match;
const cssContent = allCss;

// Extract class selectors
while ((match = classRegex.exec(cssContent)) !== null) {
  cssClasses.add(match[1]);
}

// Extract ID selectors
while ((match = idRegex.exec(cssContent)) !== null) {
  cssIds.add(match[1]);
}

// Check usage in HTML and JS
const htmlContent = allHtml + '\n' + allJs;

const unusedClasses = [];
const unusedIds = [];

cssClasses.forEach(cls => {
  // Create patterns to search for the class
  const patterns = [
    new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"`, 'g'),
    new RegExp(`class='[^']*\\b${cls}\\b[^']*'`, 'g'),
    new RegExp(`\\.${cls}\\b`, 'g'),  // For JS dynamic class application
    new RegExp(`querySelector\\(['"]\\.${cls}`, 'g'),
    new RegExp(`\.${cls}[\s,{>+~:]`, 'g'), // CSS selectors
  ];
  
  let found = false;
  for (let p of patterns) {
    if (p.test(htmlContent)) {
      found = true;
      break;
    }
  }
  
  if (!found) {
    unusedClasses.push(cls);
  }
});

cssIds.forEach(id => {
  const patterns = [
    new RegExp(`id="[^"]*\\b${id}\\b[^"]*"`, 'g'),
    new RegExp(`id='[^']*\\b${id}\\b[^']*'`, 'g'),
    new RegExp(`#${id}\\b`, 'g'),
    new RegExp(`getElementById\\(['"](\\w*${id}\\w*)['"]\)`, 'g'),
    new RegExp(`querySelector\\(['"](#${id})`, 'g'),
    new RegExp(`#${id}[\s,{>+~:]`, 'g'), // CSS selectors
  ];
  
  let found = false;
  for (let p of patterns) {
    if (p.test(htmlContent)) {
      found = true;
      break;
    }
  }
  
  if (!found) {
    unusedIds.push(id);
  }
});

// Report
console.log('=== CSS SELECTOR ANALYSIS ===\n');
console.log(`Total CSS classes defined: ${cssClasses.size}`);
console.log(`Total CSS IDs defined: ${cssIds.size}`);
console.log(`\nUnused classes (${unusedClasses.length}):`);
unusedClasses.sort().forEach(cls => console.log(`  - .${cls}`));
console.log(`\nUnused IDs (${unusedIds.length}):`);
unusedIds.sort().forEach(id => console.log(`  - #${id}`));

// Save detailed report
const report = {
  totalClasses: cssClasses.size,
  totalIds: cssIds.size,
  unusedClasses: unusedClasses.sort(),
  unusedIds: unusedIds.sort(),
  timestamp: new Date().toISOString()
};

fs.writeFileSync('./css-analysis-report.json', JSON.stringify(report, null, 2));
console.log('\nDetailed report saved to css-analysis-report.json');
