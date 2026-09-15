const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replaceAll(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. apply-button.tsx
replaceInFile('src/app/(dashboard)/internships/apply-button.tsx', [
    ['className="flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 rounded-lg"', 'className="flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs font-bold text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-4 rounded-[12px]"'],
    ['className="h-11 min-h-[44px] px-5 text-xs gap-2 font-semibold cursor-pointer transition-all active:scale-95"', 'className="h-11 min-h-[44px] px-5 text-xs gap-2 font-bold cursor-pointer transition-all active:scale-95 fintech-gradient-teal text-white hover:fintech-glow-teal border-0 rounded-[12px]"']
]);

// 2. internships-client.tsx
replaceInFile('src/app/(dashboard)/internships/internships-client.tsx', [
    ['border border-dashed border-border bg-muted/30', 'border border-dashed border-white/10 bg-card/50'],
    ['bg-secondary/80 flex items-center justify-center mb-4 shadow-sm text-muted-foreground', 'fintech-gradient-teal flex items-center justify-center mb-4 shadow-md text-white'],
    ['className="h-6 w-6 text-muted-foreground"', 'className="h-6 w-6 text-white fill-white/20"'],
    ['text-foreground', 'text-white'],
    ['text-muted-foreground', 'text-white/50'],
    ['rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:border-primary/20', 'rounded-[20px] border border-white/5 bg-card p-5 flex flex-col justify-between gap-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(5,150,105,0.15)] relative overflow-hidden group'],
    ['h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary', 'h-12 w-12 rounded-[16px] fintech-gradient-teal flex items-center justify-center text-white'],
    ['<Building2 className="h-5 w-5" />', '<Building2 className="h-5 w-5 fill-white/20" strokeWidth={2} />'],
    ['<Badge variant="default" className="text-[10px] px-1.5 py-0 gap-0.5 font-bold">', '<span className="inline-flex items-center text-[10px] px-1.5 py-0.5 gap-1 font-bold rounded-md bg-[#059669]/10 text-[#059669] border border-[#059669]/20">'],
    ['</Badge>', '</span>'],
    ['<Badge variant={typeVariant[internship.type] || "secondary"} className="flex-shrink-0 text-xs">', '<span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/70">'],
    ['text-amber-600 dark:text-amber-400 font-medium', 'text-[#F97316] font-bold'],
    ['border-t border-border', 'border-t border-white/5'],
    ['inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground', 'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/5 text-white/70']
]);

// 3. deals/page.tsx
replaceInFile('src/app/(dashboard)/deals/page.tsx', [
    ['className="w-full flex overflow-x-auto justify-start no-scrollbar mb-4 h-auto py-2 px-1"', 'className="w-full flex overflow-x-auto justify-start no-scrollbar mb-4 h-auto py-2 px-1 bg-black/20 border border-white/5 rounded-[16px]"'],
    ['className="text-xs sm:text-sm whitespace-nowrap px-4 py-2"', 'className="text-xs sm:text-sm whitespace-nowrap px-4 py-2 rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white font-bold"'],
    ['className="border-border shadow-sm"', 'className="rounded-[20px] border border-white/5 bg-card shadow-sm"'],
    ['className="group cursor-pointer border-border shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/20 active:scale-[0.98] transition-all duration-200"', 'className="group cursor-pointer rounded-[20px] border border-white/5 bg-card hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] hover:border-white/20 active:scale-[0.98] transition-all duration-300 relative overflow-hidden"'],
    ['<CardTitle className="text-base font-semibold line-clamp-1">', '<CardTitle className="text-base font-bold text-white line-clamp-1">'],
    ['<CardDescription className="flex items-center gap-1 mt-1 text-xs">', '<CardDescription className="flex items-center gap-1 mt-1 text-xs text-white/50 font-medium">'],
    ['<Badge variant="warning" className="shrink-0 font-bold px-2 py-1">', '<span className="shrink-0 font-bold px-2 py-1 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[10px]">'],
    ['<h4 className="font-medium text-sm mb-1">', '<h4 className="font-bold text-sm mb-1 text-white">'],
    ['<p className="text-xs text-muted-foreground line-clamp-2">', '<p className="text-xs text-white/60 line-clamp-2 font-medium">'],
    ['text-[10px] text-muted-foreground', 'text-[10px] text-white/40 font-bold'],
    ['variant="outline" \n                          className="w-full h-10 min-h-[44px] text-xs font-medium group-hover:bg-primary/5 group-hover:text-primary transition-colors active:scale-95"', 'variant="outline" \n                          className="w-full h-10 min-h-[44px] text-xs font-bold bg-white/5 border-white/5 text-white group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] group-hover:border-[#F97316]/20 transition-colors active:scale-95 rounded-xl"'],
    ['className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-xl border border-dashed border-border bg-muted/30 transition-colors"', 'className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-[20px] border border-dashed border-white/10 bg-card/50 transition-colors"'],
    ['className="h-16 w-16 rounded-full bg-secondary/80 flex items-center justify-center mb-4 shadow-sm text-muted-foreground"', 'className="h-16 w-16 rounded-2xl fintech-gradient-orange flex items-center justify-center mb-4 shadow-md text-white"'],
    ['<Tag className="h-8 w-8 text-muted-foreground" />', '<Tag className="h-8 w-8 fill-white/20" strokeWidth={2} />'],
    ['<h3 className="text-lg font-medium mb-1">', '<h3 className="text-lg font-bold text-white mb-1">'],
    ['<p className="text-sm text-muted-foreground max-w-sm">', '<p className="text-sm text-white/50 max-w-sm font-medium">'],
    ['className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"', 'className="bg-[#151530] w-full max-w-lg rounded-[24px] shadow-2xl border border-white/10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 relative"'],
    ['border-b border-border', 'border-b border-white/10 z-10 relative'],
    ['className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0"', 'className="h-12 w-12 rounded-[16px] fintech-gradient-orange flex items-center justify-center text-white shrink-0 shadow-md"'],
    ['<Tag className="h-5 w-5" />', '<Tag className="h-6 w-6 fill-white/20" strokeWidth={2} />'],
    ['<h2 className="font-semibold text-base">', '<h2 className="font-bold text-lg text-white">'],
    ['<span className="text-xs text-muted-foreground">', '<span className="text-xs text-white/50 font-medium">'],
    ['hover:bg-secondary text-muted-foreground', 'hover:bg-white/10 text-white/50 hover:text-white'],
    ['className="p-5 overflow-y-auto flex-1 space-y-5"', 'className="p-6 overflow-y-auto flex-1 space-y-5 relative z-10"'],
    ['<Badge variant="warning" className="mb-3 text-sm px-3 py-1 font-bold">', '<span className="mb-3 text-sm px-3 py-1 font-bold rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 inline-block">'],
    ['<h3 className="text-xl font-bold leading-tight mb-2">', '<h3 className="text-2xl font-extrabold text-white leading-tight mb-2">'],
    ['<p className="text-sm text-muted-foreground leading-relaxed">', '<p className="text-sm text-white/70 leading-relaxed font-medium">'],
    ['className="bg-secondary/50 rounded-xl p-4 border border-border flex flex-col gap-2"', 'className="bg-black/20 rounded-[16px] p-5 border border-white/5 flex flex-col gap-2"'],
    ['<AlertCircle className="h-4 w-4 text-primary" />', '<AlertCircle className="h-4 w-4 text-[#F97316]" />'],
    ['<h4 className="flex items-center gap-2 text-sm font-semibold">', '<h4 className="flex items-center gap-2 text-sm font-bold text-white">'],
    ['<p className="text-xs text-muted-foreground leading-relaxed">', '<p className="text-xs text-white/50 leading-relaxed font-medium">'],
    ['className="flex items-center justify-between text-xs text-muted-foreground bg-background rounded-lg p-3 border border-border"', 'className="flex items-center justify-between text-xs text-white/50 font-bold bg-white/5 rounded-xl p-4 border border-white/5"'],
    ['className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl text-sm font-medium text-center transition-all duration-300"', 'className="bg-[#059669]/10 border border-[#059669]/20 text-[#059669] p-3 rounded-xl text-sm font-bold text-center transition-all duration-300"'],
    ['className="p-4 border-t border-border bg-muted/30"', 'className="p-5 border-t border-white/10 bg-black/20 relative z-10"'],
    ['className="w-full font-bold h-11 min-h-[44px] text-sm active:scale-95 transition-transform" \n                onClick', 'className="w-full font-bold h-12 min-h-[48px] text-sm active:scale-95 transition-transform fintech-gradient-orange text-white hover:fintech-glow-orange border-0 rounded-[14px]" \n                onClick']
]);

// 4. resume-builder/page.tsx
replaceInFile('src/app/resume-builder/page.tsx', [
    ['bg-blue-600 hover:bg-blue-700 text-white', 'fintech-gradient-purple text-white hover:fintech-glow-purple border-0 rounded-xl'],
    ['bg-background', 'bg-[#12122A]'],
    ['bg-card', 'bg-card border-white/5'],
    ['bg-muted/20', 'bg-black/20 border-white/5'],
    ['bg-gray-100', 'bg-[#0F0F23]'],
    ['md:border-r', 'md:border-r md:border-white/5'],
    ['border-b', 'border-b border-white/5']
]);

// 5. ResumeChat.tsx
replaceInFile('src/components/resume/ResumeChat.tsx', [
    ['bg-primary text-primary-foreground rounded-tr-sm', 'fintech-gradient-purple text-white rounded-tr-sm shadow-sm'],
    ['bg-secondary/50 text-foreground rounded-tl-sm border', 'bg-white/5 text-white rounded-tl-sm border border-white/10'],
    ['bg-background/50 border rounded p-2 text-muted-foreground font-mono', 'bg-black/20 border border-white/5 rounded-md p-2 text-white/50 font-mono'],
    ['text-primary font-semibold', 'text-[#EC4899] font-bold'],
    ['bg-muted text-foreground', 'bg-white/5 text-white/70'],
    ['bg-background border-t', 'bg-transparent border-t border-white/5 pt-4'],
    ['className="flex-1 rounded-full border bg-muted/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"', 'className="flex-1 rounded-[16px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"'],
    ['size="icon" className="rounded-full shrink-0"', 'size="icon" className="rounded-[16px] shrink-0 h-11 w-11 fintech-gradient-purple text-white border-0 hover:fintech-glow-purple"'],
    ['text-muted-foreground', 'text-white/40'],
    ['bg-background flex flex-col', 'bg-transparent flex flex-col'],
    ['bg-primary flex items-center justify-center shrink-0', 'fintech-gradient-purple flex items-center justify-center shrink-0'],
    ['bg-muted flex items-center justify-center shrink-0', 'bg-white/10 flex items-center justify-center shrink-0']
]);