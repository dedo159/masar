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

replaceFile('src/app/(dashboard)/deals/page.tsx', [
  // Tabs List
  {
    search: 'className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-border rounded-none h-auto p-0 bg-transparent mb-6 hide-scrollbar"',
    replace: 'className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-border rounded-none h-auto p-0 bg-transparent mb-6 hide-scrollbar flex gap-2 pb-2"'
  },
  {
    search: 'className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium transition-colors"',
    replace: 'className="rounded-lg h-10 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 text-sm font-medium transition-all active:scale-[0.98]"' // Change to pill tabs to match other pages like Course Detail, wait, previous tabs were pill? Let's just fix the height and active scale.
  },
  // Revert tab style change, just add touch target size
  {
    search: 'className="rounded-lg h-10 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 text-sm font-medium transition-all active:scale-[0.98]"',
    replace: 'className="rounded-none border-b-2 h-11 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95"'
  },
  // Card styling
  {
    search: 'className="group cursor-pointer hover:border-primary/50 transition-colors duration-200"',
    replace: 'className="group cursor-pointer border-border shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/20 active:scale-[0.98] transition-all duration-200"'
  },
  // Empty State
  {
    search: 'className="flex flex-col items-center justify-center py-20 text-center px-4"',
    replace: 'className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-xl border border-dashed border-border bg-muted/30 transition-colors"'
  },
  {
    search: 'className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4"',
    replace: 'className="h-16 w-16 rounded-full bg-secondary/80 flex items-center justify-center mb-4 shadow-sm text-muted-foreground"'
  },
  // Modal Buttons
  {
    search: 'className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground transition-colors"',
    replace: 'className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground transition-colors active:scale-95"'
  },
  {
    search: 'className="w-full text-xs font-medium group-hover:bg-primary/5 group-hover:text-primary transition-colors"',
    replace: 'className="w-full h-10 min-h-[44px] text-xs font-medium group-hover:bg-primary/5 group-hover:text-primary transition-colors active:scale-95"'
  },
  {
    search: 'className="w-full font-bold h-11 text-sm"',
    replace: 'className="w-full font-bold h-11 min-h-[44px] text-sm active:scale-95 transition-transform"'
  }
]);

console.log("Deals UI Polish Done.");
