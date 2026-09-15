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

// 1. Page Header (PageHeader)
replaceFile('src/components/layout/page-header.tsx', [
  {
    search: 'className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm"',
    replace: 'className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md transition-colors duration-300"'
  },
  {
    search: 'className="h-8 px-2.5 text-xs font-medium gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"',
    replace: 'className="h-11 md:h-9 px-3 text-xs font-medium gap-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95"'
  },
  {
    search: 'className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-medium border border-border mr-1 ml-1"',
    replace: 'className="flex items-center justify-center h-10 w-10 md:h-9 md:w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-sm transition-all active:scale-95 text-xs font-medium border border-border mx-1"'
  }
]);

// 2. Latest Announcement
replaceFile('src/components/dashboard/latest-announcement.tsx', [
  {
    search: 'className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-3 px-4 flex items-center justify-between transition-colors"',
    replace: 'className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-sm active:scale-[0.98] min-h-[44px]"'
  }
]);

// 3. Quick Stats
replaceFile('src/components/dashboard/quick-stats-client.tsx', [
  {
    search: '"transition-all duration-200 ease-out shadow-xs",',
    replace: '"transition-all duration-200 ease-out shadow-sm", // Enhanced baseline shadow'
  },
  {
    search: '"hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/25",',
    replace: '"hover:-translate-y-1 hover:shadow-md hover:border-primary/20 active:scale-[0.98]",'
  },
  {
    search: 'className="text-xs text-muted-foreground mt-1 truncate"',
    replace: 'className="text-sm font-medium text-muted-foreground mt-1.5 truncate"'
  }
]);

// 4. Today Schedule
replaceFile('src/components/dashboard/today-schedule-client.tsx', [
  {
    search: 'className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center"',
    replace: 'className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-border bg-muted/30 text-center transition-colors"'
  },
  {
    search: 'className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mb-2 text-foreground"',
    replace: 'className="h-12 w-12 rounded-full bg-secondary/80 flex items-center justify-center mb-3 text-muted-foreground shadow-sm"'
  },
  {
    search: 'className="text-sm font-medium text-foreground"',
    replace: 'className="text-base font-medium text-foreground"'
  },
  {
    search: 'hover:border-foreground/20 hover:bg-secondary/40"',
    replace: 'hover:border-primary/20 hover:bg-secondary/40 active:scale-[0.98] hover:shadow-sm"'
  }
]);

// 5. Urgent Deadlines
replaceFile('src/components/dashboard/urgent-deadlines-client.tsx', [
  {
    search: 'className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-border bg-card/60 text-center"',
    replace: 'className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-border bg-muted/30 text-center transition-colors"'
  },
  {
    search: 'className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2"',
    replace: 'className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-sm"'
  },
  {
    search: 'className="text-sm font-medium text-foreground"',
    replace: 'className="text-base font-medium text-foreground"'
  },
  {
    search: '"hover:border-foreground/20 hover:bg-secondary/40 hover:-translate-y-0.5 shadow-xs",',
    replace: '"hover:border-primary/20 hover:bg-secondary/40 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] shadow-xs",'
  }
]);

console.log("Home Page UI Polish Done.");
