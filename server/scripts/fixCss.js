const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../client/src/app/compare/page.js');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Links / Text
  ['text-white/50 hover:text-white', 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'],
  ['text-white/50', 'text-slate-500 dark:text-white/50'],
  ['text-white/40', 'text-slate-500 dark:text-white/40'],
  ['text-white/35', 'text-slate-500 dark:text-white/35'],
  ['text-white/30', 'text-slate-500 dark:text-white/30'],
  ['text-white/20', 'text-slate-400 dark:text-white/20'],
  ['text-white', 'text-slate-900 dark:text-white'],
  ['text-slate-300', 'text-slate-700 dark:text-slate-300'],
  
  // Backgrounds / Borders
  ['bg-white/5 hover:bg-white/10', 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'],
  ['bg-white/5', 'bg-slate-100 dark:bg-white/5'],
  ['border-white/5', 'border-slate-200 dark:border-white/5'],
  ['border-white/10', 'border-slate-200 dark:border-white/10'],
  ['border-white/15', 'border-slate-300 dark:border-white/15'],
  
  // Inputs
  ['bg-black/40', 'bg-white dark:bg-black/40'],
  ['bg-black/35', 'bg-slate-100 dark:bg-black/35'],
  ['bg-black/30', 'bg-white dark:bg-black/30'],
  ['bg-black/25', 'bg-slate-50 dark:bg-black/25'],
  
  // Specific tweaks
  ['dark:dark:', 'dark:'], // prevent double dark
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

// Fix glass-card issue in light mode if not handled globally
// Actually `glass-card` should adapt itself, but we can make sure it looks fine.

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed CSS classes for light mode in compare/page.js');
