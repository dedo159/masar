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

// 1. Internships Client
replaceFile('src/app/(dashboard)/internships/internships-client.tsx', [
  {
    search: 'className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center"',
    replace: 'className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/30 text-center transition-colors"'
  },
  {
    search: 'className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3 text-foreground"',
    replace: 'className="h-14 w-14 rounded-full bg-secondary/80 flex items-center justify-center mb-4 shadow-sm text-muted-foreground"'
  },
  {
    search: 'className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20"',
    replace: 'className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary/20"'
  },
  {
    search: 'className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0 font-bold text-sm"',
    replace: 'className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary flex-shrink-0 font-bold text-sm shadow-sm"'
  },
  {
    search: 'className="inline-flex items-center justify-center gap-1.5 h-11 min-h-[44px] px-4 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition-colors w-full sm:w-auto mt-2 sm:mt-0"',
    replace: 'className="inline-flex items-center justify-center gap-1.5 h-11 min-h-[44px] px-4 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition-all active:scale-[0.98] shadow-sm w-full sm:w-auto mt-2 sm:mt-0"'
  }
]);

// 2. Apply Button
replaceFile('src/app/(dashboard)/internships/apply-button.tsx', [
  {
    search: 'className="h-11 min-h-[44px] px-5 text-xs gap-2 font-semibold cursor-pointer"',
    replace: 'className="h-11 min-h-[44px] px-5 text-xs gap-2 font-semibold cursor-pointer transition-all active:scale-95"'
  }
]);

console.log("Internships UI Polish Done.");
