const fs = require('fs');

function replaceAllInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replaceAll(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// 1. apply-button.tsx
replaceAllInFile('src/app/(dashboard)/internships/apply-button.tsx', [
    ['className="flex h-11 min-h-[44px] items-center justify-center gap-1.5 text-xs font-bold text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-4 rounded-[12px]"', 'className="flex h-10 min-h-[40px] items-center justify-center gap-1.5 text-xs font-medium text-[#0070f3] bg-[#0070f3]/10 border border-[#0070f3]/20 px-4 rounded-md"'],
    ['className="h-11 min-h-[44px] px-5 text-xs gap-2 font-bold cursor-pointer transition-all active:scale-95 fintech-gradient-teal text-white hover:fintech-glow-teal border-0 rounded-[12px]"', 'className="h-10 min-h-[40px] px-5 text-sm gap-2 font-medium cursor-pointer transition-all active:scale-95 vercel-button-primary"']
]);

// 2. internships-client.tsx
replaceAllInFile('src/app/(dashboard)/internships/internships-client.tsx', [
    ['border border-dashed border-white/10 bg-card/50', 'border border-dashed border-border bg-muted/50'],
    ['fintech-gradient-teal flex items-center justify-center mb-4 shadow-md text-white', 'bg-secondary flex items-center justify-center mb-4 shadow-sm text-foreground'],
    ['className="h-6 w-6 text-white fill-white/20"', 'className="h-6 w-6 text-foreground"'],
    ['text-white/50', 'text-muted-foreground'],
    ['text-white', 'text-foreground'],
    ['rounded-[20px] border border-white/5 bg-card p-5 flex flex-col justify-between gap-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(5,150,105,0.15)] relative overflow-hidden group', 'vercel-card p-5 flex flex-col justify-between gap-4 group'],
    ['h-12 w-12 rounded-[16px] fintech-gradient-teal flex items-center justify-center text-white', 'h-12 w-12 rounded-lg bg-[#0070f3]/10 flex items-center justify-center text-[#0070f3]'],
    ['<Building2 className="h-5 w-5 fill-white/20" strokeWidth={2} />', '<Building2 className="h-5 w-5" strokeWidth={1.5} />'],
    ['<span className="inline-flex items-center text-[10px] px-1.5 py-0.5 gap-1 font-bold rounded-md bg-[#059669]/10 text-[#059669] border border-[#059669]/20">', '<span className="inline-flex items-center text-[10px] px-2 py-0.5 gap-1 font-medium rounded bg-[#0a72ef]/10 text-[#0a72ef] border border-[#0a72ef]/20">'],
    ['<span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/70">', '<span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded border border-border bg-secondary text-secondary-foreground">'],
    ['text-[#F97316] font-bold', 'text-[#ff5b4f] font-medium'],
    ['border-t border-white/5', 'border-t border-border'],
    ['inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/5 text-white/70', 'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-secondary border-border text-secondary-foreground']
]);

// 3. deals/page.tsx
replaceAllInFile('src/app/(dashboard)/deals/page.tsx', [
    ['bg-black/20 border border-white/5 rounded-[16px]', 'bg-secondary/50 border border-border rounded-lg'],
    ['rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white font-bold', 'rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground font-medium text-muted-foreground'],
    ['rounded-[20px] border border-white/5 bg-card shadow-sm', 'vercel-card'],
    ['className="group cursor-pointer rounded-[20px] border border-white/5 bg-card hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)] hover:border-white/20 active:scale-[0.98] transition-all duration-300 relative overflow-hidden"', 'className="group cursor-pointer vercel-card relative overflow-hidden active:scale-[0.99] transition-transform"'],
    ['font-bold text-white', 'font-medium text-foreground'],
    ['text-white/50 font-medium', 'text-muted-foreground text-xs'],
    ['<span className="shrink-0 font-bold px-2 py-1 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[10px]">', '<span className="shrink-0 font-medium px-2 py-0.5 rounded bg-[#ff5b4f]/10 text-[#ff5b4f] border border-[#ff5b4f]/20 text-[10px]">'],
    ['text-white/60 line-clamp-2 font-medium', 'text-muted-foreground line-clamp-2 text-sm'],
    ['text-[10px] text-white/40 font-bold', 'text-[11px] text-muted-foreground'],
    ['className="w-full h-10 min-h-[44px] text-xs font-bold bg-white/5 border-white/5 text-white group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] group-hover:border-[#F97316]/20 transition-colors active:scale-95 rounded-xl"', 'className="w-full h-9 text-sm font-medium vercel-button-secondary transition-colors"'],
    ['className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-[20px] border border-dashed border-white/10 bg-card/50 transition-colors"', 'className="flex flex-col items-center justify-center py-16 text-center px-4 rounded-lg border border-dashed border-border bg-secondary/30"'],
    ['className="h-16 w-16 rounded-2xl fintech-gradient-orange flex items-center justify-center mb-4 shadow-md text-white"', 'className="h-14 w-14 rounded-full bg-[#ff5b4f]/10 flex items-center justify-center mb-4 text-[#ff5b4f]"'],
    ['<Tag className="h-8 w-8 fill-white/20" strokeWidth={2} />', '<Tag className="h-7 w-7" strokeWidth={1.5} />'],
    ['bg-[#151530] w-full max-w-lg rounded-[24px] shadow-2xl border border-white/10', 'bg-background w-full max-w-lg rounded-xl shadow-xl border border-border'],
    ['border-b border-white/10', 'border-b border-border'],
    ['h-12 w-12 rounded-[16px] fintech-gradient-orange flex items-center justify-center text-white shrink-0 shadow-md', 'h-12 w-12 rounded-lg bg-[#ff5b4f]/10 flex items-center justify-center text-[#ff5b4f] shrink-0 border border-[#ff5b4f]/20'],
    ['<Tag className="h-6 w-6 fill-white/20" strokeWidth={2} />', '<Tag className="h-6 w-6" strokeWidth={1.5} />'],
    ['text-lg text-white', 'text-lg text-foreground'],
    ['hover:bg-white/10 text-white/50 hover:text-white', 'hover:bg-secondary text-muted-foreground hover:text-foreground'],
    ['<span className="mb-3 text-sm px-3 py-1 font-bold rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 inline-block">', '<span className="mb-3 text-xs px-2.5 py-1 font-medium rounded-full bg-[#ff5b4f]/10 text-[#ff5b4f] border border-[#ff5b4f]/20 inline-block">'],
    ['text-2xl font-extrabold text-white', 'text-2xl font-semibold text-foreground tracking-tight'],
    ['text-white/70 leading-relaxed font-medium', 'text-muted-foreground leading-relaxed text-sm'],
    ['bg-black/20 rounded-[16px] p-5 border border-white/5 flex flex-col gap-2', 'bg-[#ff5b4f]/5 rounded-lg p-4 border border-[#ff5b4f]/20 flex flex-col gap-2'],
    ['<AlertCircle className="h-4 w-4 text-[#F97316]" />', '<AlertCircle className="h-4 w-4 text-[#ff5b4f]" />'],
    ['text-sm font-bold text-white', 'text-sm font-semibold text-foreground'],
    ['bg-white/5 rounded-xl p-4 border border-white/5', 'bg-secondary rounded-lg p-3 border border-border text-foreground font-mono'],
    ['bg-[#059669]/10 border border-[#059669]/20 text-[#059669] p-3 rounded-xl text-sm font-bold', 'bg-[#0072f5]/10 border border-[#0072f5]/20 text-[#0072f5] p-3 rounded-md text-sm font-medium'],
    ['p-5 border-t border-white/10 bg-black/20', 'p-4 border-t border-border bg-secondary/30'],
    ['className="w-full font-bold h-12 min-h-[48px] text-sm active:scale-95 transition-transform fintech-gradient-orange text-white hover:fintech-glow-orange border-0 rounded-[14px]"', 'className="w-full h-10 text-sm active:scale-[0.98] transition-transform vercel-button-primary"']
]);

// 4. resume-builder/page.tsx
replaceAllInFile('src/app/resume-builder/page.tsx', [
    ['fintech-gradient-purple text-white hover:fintech-glow-purple border-0 rounded-xl', 'vercel-button-develop'],
    ['bg-[#12122A]', 'bg-background'],
    ['bg-card border-white/5', 'bg-card border-border'],
    ['bg-black/20 border-white/5', 'bg-secondary border-border'],
    ['bg-[#0F0F23]', 'bg-muted'],
    ['md:border-white/5', 'md:border-border'],
    ['border-white/5', 'border-border']
]);

// 5. ResumeChat.tsx
replaceAllInFile('src/components/resume/ResumeChat.tsx', [
    ['fintech-gradient-purple text-white rounded-tr-sm shadow-sm', 'bg-[#000000] dark:bg-[#ffffff] text-white dark:text-black rounded-lg shadow-sm px-4 py-2'],
    ['bg-white/5 text-white rounded-tl-sm border border-white/10', 'bg-secondary text-foreground border border-border rounded-lg shadow-sm px-4 py-2'],
    ['bg-black/20 border border-white/5 rounded-md p-2 text-white/50 font-mono', 'bg-muted border border-border rounded-md p-3 text-muted-foreground font-mono text-sm'],
    ['text-[#EC4899] font-bold', 'text-[#de1d8d] font-semibold'],
    ['bg-white/5 text-white/70', 'bg-muted text-foreground'],
    ['bg-transparent border-t border-white/5 pt-4', 'bg-background border-t border-border pt-4'],
    ['className="flex-1 rounded-[16px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"', 'className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0070f3] focus:ring-1 focus:ring-[#0070f3] transition-all"'],
    ['size="icon" className="rounded-[16px] shrink-0 h-11 w-11 fintech-gradient-purple text-white border-0 hover:fintech-glow-purple"', 'size="icon" className="rounded-md shrink-0 h-10 w-10 vercel-button-primary"'],
    ['text-white/40', 'text-muted-foreground'],
    ['bg-transparent flex flex-col', 'bg-background flex flex-col'],
    ['fintech-gradient-purple flex items-center justify-center shrink-0', 'bg-[#000000] dark:bg-[#ffffff] flex items-center justify-center shrink-0 text-white dark:text-black rounded-md'],
    ['bg-white/10 flex items-center justify-center shrink-0', 'bg-secondary border border-border flex items-center justify-center shrink-0 rounded-md']
]);
