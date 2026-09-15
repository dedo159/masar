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

// 1. Profile Client
replaceFile('src/app/(dashboard)/profile/profile-client.tsx', [
  {
    search: 'className="rounded-2xl border border-border bg-card p-6 shadow-xs"',
    replace: 'className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all"'
  },
  {
    search: 'className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs"',
    replace: 'className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-all duration-200"'
  },
  {
    search: 'className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden mt-6"',
    replace: 'className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden mt-6 shadow-sm"'
  },
  {
    search: 'className="flex items-center justify-between p-4 min-h-[56px] hover:bg-secondary/50 transition-colors"',
    replace: 'className="flex items-center justify-between p-4 min-h-[56px] hover:bg-secondary/50 active:bg-secondary/80 transition-all duration-200"'
  },
  {
    search: 'className="flex items-center justify-between p-4 min-h-[56px] hover:bg-destructive/10 transition-colors \ngroup"',
    replace: 'className="flex items-center justify-between p-4 min-h-[56px] hover:bg-destructive/10 active:bg-destructive/20 transition-all duration-200 group"'
  }
]);

// 2. Certificates Section
replaceFile('src/components/profile/certificates-section.tsx', [
  {
    search: 'className="rounded-xl border border-border bg-card p-5 shadow-xs mt-6"',
    replace: 'className="rounded-xl border border-border bg-card p-5 shadow-sm mt-6"'
  },
  {
    search: 'className="text-center py-8 text-muted-foreground bg-secondary/10 rounded-lg border border-dashed"',
    replace: 'className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-border bg-muted/30 text-center transition-colors"'
  },
  {
    search: '<Award className="h-10 w-10 mx-auto mb-3 opacity-20" />',
    replace: '<div className="h-14 w-14 rounded-full bg-secondary/80 flex items-center justify-center mb-4 shadow-sm text-muted-foreground"><Award className="h-6 w-6" strokeWidth={1.5} /></div>'
  },
  {
    search: 'className="flex p-3 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors group"',
    replace: 'className="flex p-3 rounded-xl border border-border bg-background hover:border-primary/20 hover:shadow-sm active:scale-[0.98] transition-all duration-200 group min-h-[56px]"'
  }
]);

console.log("Profile UI Polish Done.");
