const fs = require('fs');
const path = require('path');

function replaceAllInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.replaceAll(search, replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const replacements = [
                ['bg-[#12122A]', 'bg-background'],
                ['bg-black/20', 'bg-secondary/50'],
                ['bg-black/40', 'bg-secondary'],
                ['bg-[#151530]', 'bg-card'],
                ['bg-card/50', 'bg-secondary/30'],
                ['bg-white/5', 'bg-secondary'],
                ['bg-white/10', 'bg-muted'],
                ['border-white/5', 'border-border'],
                ['border-white/10', 'border-border'],
                ['border-white/20', 'border-border/50'],
                ['text-white/30', 'text-muted-foreground/40'],
                ['text-white/40', 'text-muted-foreground/60'],
                ['text-white/50', 'text-muted-foreground'],
                ['text-white/60', 'text-muted-foreground/80'],
                ['text-white/70', 'text-muted-foreground/90'],
                ['text-white', 'text-foreground'],
                ['bg-[#7C3AED]', 'bg-[#171717] dark:bg-white'],
                ['text-[#7C3AED]', 'text-foreground font-medium'],
                ['fintech-gradient-purple', 'bg-[#171717] dark:bg-white text-white dark:text-black'],
                ['fintech-gradient-teal', 'vercel-button-primary'],
                ['fintech-gradient-orange', 'bg-[#ff5b4f] text-white'],
                ['hover:fintech-glow-purple', 'hover:bg-[#383838] dark:hover:bg-[#e0e0e0]'],
                ['hover:fintech-glow-teal', 'hover:bg-[#383838]'],
                ['hover:fintech-glow-orange', 'hover:bg-[#e04337]'],
                ['shadow-[0_8px_30px_rgba(124,58,237,0.1)]', 'shadow-sm'],
                ['shadow-[0_8px_30px_rgba(5,150,105,0.15)]', 'shadow-md'],
                ['shadow-[0_8px_30px_rgba(249,115,22,0.15)]', 'shadow-md'],
                ['text-[#F97316]', 'text-[#ff5b4f]'],
                ['bg-[#F97316]/10', 'bg-[#ff5b4f]/10'],
                ['border-[#F97316]/20', 'border-[#ff5b4f]/20'],
                ['text-[#059669]', 'text-[#0a72ef]'],
                ['bg-[#059669]/10', 'bg-[#0a72ef]/10'],
                ['border-[#059669]/20', 'border-[#0a72ef]/20']
            ];
            
            // Special regex to catch classNames with rounded-[20px], bg-card etc. and convert to vercel-card
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            for (const [search, replace] of replacements) {
                content = content.replaceAll(search, replace);
            }
            
            // Specific fixes
            content = content.replace(/rounded-\[20px\] border border-border bg-card p-5/g, 'vercel-card p-5');
            content = content.replace(/rounded-\[16px\]/g, 'rounded-lg');
            content = content.replace(/rounded-\[24px\]/g, 'rounded-xl');
            content = content.replace(/rounded-\[12px\]/g, 'rounded-md');
            content = content.replace(/rounded-\[20px\]/g, 'rounded-lg');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}
processDir('./src/app');
processDir('./src/components');