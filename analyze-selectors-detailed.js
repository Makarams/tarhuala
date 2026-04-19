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

const allContent = allHtmlContent + '\n' + allJsContent;

// Extract all CSS rules with their selectors
const rules = [];
const rulePattern = /([^{}]+)\s*{([^}]+)}/g;
let match;

while ((match = rulePattern.exec(fullCSS)) !== null) {
  const selectors = match[1];
  const declarations = match[2];
  
  // Split selectors by comma (handle multiple selectors in one rule)
  selectors.split(',').forEach(selector => {
    const trimmedSelector = selector.trim();
    if (trimmedSelector && !trimmedSelector.includes('@')) {
      // Extract classes and IDs
      const classes = [];
      const ids = [];
      
      const classMatches = trimmedSelector.match(/\.[\w-]+/g) || [];
      const idMatches = trimmedSelector.match(/#[\w-]+/g) || [];
      
      classMatches.forEach(c => classes.push(c.substring(1)));
      idMatches.forEach(id => ids.push(id.substring(1)));
      
      rules.push({
        selector: trimmedSelector,
        declarations: declarations.trim(),
        classes,
        ids,
        line: fullCSS.substring(0, fullCSS.indexOf(match[0])).split('\n').length
      });
    }
  });
}

// Check usage in HTML and JS
const used = {};
const unused = [];
const allSelectors = new Set();

rules.forEach(rule => {
  rule.classes.forEach(cls => allSelectors.add('.' + cls));
  rule.ids.forEach(id => allSelectors.add('#' + id));
});

rules.forEach(rule => {
  let foundInContent = false;
  
  // Check if any class/ID from this rule is used
  rule.classes.forEach(cls => {
    // More sophisticated patterns for class checking
    const patterns = [
      new RegExp(`class=['"][^'"]*\\b${cls}\\b[^'"]*['"]`),
      new RegExp(`class=['"]([^'"]*\\s)?${cls}(\\s[^'"]*)?['"]`),
      new RegExp(`classList\\.add\\(['"]${cls}['"]\\)`),
      new RegExp(`classList\\.remove\\(['"]${cls}['"]\\)`),
      new RegExp(`\.${cls}\\b`),
      new RegExp(`querySelector\\(['"\\.${cls}`)
    ];
    
    patterns.forEach(p => {
      if (p.test(allContent)) {
        foundInContent = true;
      }
    });
  });
  
  rule.ids.forEach(id => {
    const patterns = [
      new RegExp(`id=['"][^'"]*\\b${id}\\b[^'"]*['"]`),
      new RegExp(`id=['"]${id}['"]`),
      new RegExp(`getElementById\\(['"]${id}['"]\\)`),
      new RegExp(`#${id}\\b`),
      new RegExp(`querySelector\\(['"]#${id}`)
    ];
    
    patterns.forEach(p => {
      if (p.test(allContent)) {
        foundInContent = true;
      }
    });
  });
  
  if (foundInContent) {
    used[rule.selector] = rule;
  } else {
    unused.push(rule);
  }
});

// Additional check for special cases (animations, keyframes, media queries with used content)
const keepsRules = [];
const definitelyUnused = [];

unused.forEach(rule => {
  const trimmedDec = rule.declarations.trim();
  
  // Keep animation definitions and keyframes
  if (trimmedDec.includes('animation:') || rule.selector.includes('@keyframes')) {
    keepsRules.push({ ...rule, reason: 'Animation definition' });
  }
  // Keep media queries with structural importance
  else if (rule.selector.includes('@media')) {
    keepsRules.push({ ...rule, reason: 'Media query' });
  }
  else {
    definitelyUnused.push(rule);
  }
});

// Generate report
console.log('='.repeat(70));
console.log('CSS SELECTOR ANALYSIS REPORT');
console.log('='.repeat(70));
console.log(`\nTotal CSS Selectors: ${allSelectors.size}`);
console.log(`Used Selectors: ${Object.keys(used).length}`);
console.log(`Unused Selectors: ${unused.length}`);
console.log(`  - Definitely Unused: ${definitelyUnused.length}`);
console.log(`  - Keep (Animations/Media Queries): ${keepsRules.length}`);

console.log('\n' + '='.repeat(70));
console.log('SELECTORS TO REVIEW FOR REMOVAL');
console.log('='.repeat(70));

definitelyUnused.forEach((rule, idx) => {
  console.log(`\n[${idx + 1}] ${rule.selector}`);
  console.log(`    Declarations: ${rule.declarations.substring(0, 80)}${rule.declarations.length > 80 ? '...' : ''}`);
});

console.log('\n' + '='.repeat(70));
console.log('SELECTOR DETAILS FOR REMOVAL');
console.log('='.repeat(70));

const report = {
  summary: {
    totalSelectors: allSelectors.size,
    usedCount: Object.keys(used).length,
    unusedCount: unused.length,
    definitelyUnusedCount: definitelyUnused.length,
    keepCount: keepsRules.length
  },
  used: Object.keys(used).sort(),
  definitelyUnused: definitelyUnused.map(r => ({
    selector: r.selector,
    declarations: r.declarations.trim()
  })).sort((a, b) => a.selector.localeCompare(b.selector)),
  keepRules: keepsRules.map(r => ({
    selector: r.selector,
    reason: r.reason,
    declarations: r.declarations.substring(0, 100)
  }))
};

fs.writeFileSync('./css-unused-analysis.json', JSON.stringify(report, null, 2));
console.log('\nDetailed report saved to css-unused-analysis.json');

// Print the unused rules in a format suitable for CSS removal
console.log('\n' + '='.repeat(70));
console.log('UNUSED CSS RULES (Ready to Remove)');
console.log('='.repeat(70));

definitelyUnused.forEach(rule => {
  if (rule.classes.length > 0 || rule.ids.length > 0) {
    console.log(`\n/* Remove: ${rule.selector} */`);
    console.log(`/* ${rule.declarations.replace(/\n/g, ' ').substring(0, 100)}... */`);
  }
});
