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

replaceFile('src/app/(dashboard)/settings/page.tsx', [
  // Card Shadow
  {
    search: /className="rounded-2xl border border-border bg-card overflow-hidden(.*?)shadow-xs"/g,
    replace: 'className="rounded-2xl border border-border bg-card overflow-hidden$1shadow-sm transition-all"'
  },
  // SettingRow interactive transitions
  {
    search: 'hover:bg-secondary/50 transition-colors text-start',
    replace: 'hover:bg-secondary/50 active:bg-secondary/80 transition-all duration-200 text-start'
  },
  // Edit Profile link
  {
    search: 'className="flex items-center justify-between p-4 min-h-[64px] hover:bg-secondary/40 transition-colors"',
    replace: 'className="flex items-center justify-between p-4 min-h-[64px] hover:bg-secondary/40 active:bg-secondary/80 transition-all duration-200"'
  },
  // Moodle Sync Button
  {
    search: 'className="min-h-[44px] px-4 gap-2 text-xs font-semibold cursor-pointer"',
    replace: 'className="min-h-[44px] px-4 gap-2 text-xs font-semibold cursor-pointer active:scale-95 transition-transform"'
  },
  // Theme Buttons
  {
    search: 'className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border \ntransition-all cursor-pointer ${',
    replace: 'className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[56px] rounded-xl border \ntransition-all duration-200 active:scale-95 hover:border-primary/30 cursor-pointer ${'
  },
  // Calendar Integrations (36px to 44px)
  {
    search: 'className="min-h-[36px] text-xs px-3"',
    replace: 'className="min-h-[44px] text-xs px-3 active:scale-95 transition-transform"'
  },
  {
    search: 'className="min-h-[36px] text-xs px-4"',
    replace: 'className="min-h-[44px] text-xs px-4 active:scale-95 transition-transform"'
  }
]);

console.log("Settings UI Polish Done.");
