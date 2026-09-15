const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
  const absolutePath = path.resolve(filePath);
  let content = fs.readFileSync(absolutePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
}

const filePath = 'src/app/(dashboard)/courses/[id]/course-detail-client.tsx';

replaceFile(filePath, [
  // 1. Empty State Card
  {
    search: 'className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50 text-center"',
    replace: 'className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-border bg-muted/30 text-center transition-colors"'
  },
  {
    search: 'className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center mb-3"',
    replace: 'className="h-14 w-14 rounded-full bg-secondary/80 flex items-center justify-center mb-4 shadow-sm text-muted-foreground"'
  },
  {
    search: 'className="text-sm font-semibold text-foreground"',
    replace: 'className="text-base font-semibold text-foreground"'
  },
  // 2. Main Course Info Card
  {
    search: 'className="rounded-2xl border border-border bg-card overflow-hidden"',
    replace: 'className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all"'
  },
  // 3. Schedule Cards
  {
    search: 'className="flex items-center gap-3.5 p-3 rounded-xl bg-secondary/30 border border-border/50"',
    replace: 'className="flex items-center gap-3.5 p-3.5 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-border transition-colors min-h-[56px]"'
  },
  // 4. Assignment Cards
  {
    search: 'className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-border bg-card p-4"',
    replace: 'className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm hover:border-primary/20 transition-all duration-200 group"'
  },
  // 5. Files
  {
    search: 'className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 min-h-[56px] hover:bg-secondary/40 hover:border-foreground/20 transition-all duration-150 group"',
    replace: 'className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 min-h-[56px] hover:bg-secondary/40 hover:border-primary/20 hover:shadow-sm active:scale-[0.98] transition-all duration-200 group"'
  },
  // 6. Grades Card
  {
    search: 'className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs"',
    replace: 'className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm"'
  },
  {
    search: 'className="flex items-center justify-between pt-3"',
    replace: 'className="flex items-center justify-between pt-3 hover:bg-secondary/20 p-2 -mx-2 rounded-lg transition-colors"'
  },
  // Fix tabs to have nice touch targets
  {
    search: 'className="h-9 px-4 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"',
    replace: 'className="h-10 px-4 text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 active:scale-[0.98]"'
  },
  {
    search: 'className="flex gap-2 mb-6"',
    replace: 'className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"' // ensures tabs don't squish too much
  }
]);

console.log("Course Detail UI Polish Done.");
