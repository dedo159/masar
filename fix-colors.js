const fs = require('fs');
const file = 'src/app/(dashboard)/readiness/readiness-client.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/text-\[\#666666\]\/30/g, 'text-muted-foreground/30');
c = c.replace(/text-\[\#666666\]/g, 'text-muted-foreground');
c = c.replace(/text-\[\#171717\]/g, 'text-foreground');
c = c.replace(/bg-\[\#fafafa\]\/50/g, 'bg-muted/20');
c = c.replace(/bg-\[\#fafafa\]/g, 'bg-background'); // bg-background is best for inputs
c = c.replace(/bg-white/g, 'bg-card');
c = c.replace(/bg-emerald-50/g, 'bg-emerald-500/10');
c = c.replace(/text-emerald-700/g, 'text-emerald-600 dark:text-emerald-400');
c = c.replace(/border-emerald-200/g, 'border-emerald-500/20 hover:bg-emerald-500/20');
c = c.replace(/hover:bg-emerald-100/g, '');
c = c.replace(/bg-blue-50\/50/g, 'bg-blue-500/5');
c = c.replace(/bg-blue-50/g, 'bg-blue-500/10');
c = c.replace(/border-blue-100/g, 'border-blue-500/20');

// Fix select styling text-foreground is already there, but we ensure bg-background instead of bg-[#fafafa]
fs.writeFileSync(file, c);
console.log('Colors replaced successfully!');
