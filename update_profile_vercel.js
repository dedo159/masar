const fs = require('fs');
function replaceAllInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replaceAll(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceAllInFile('src/app/(dashboard)/profile/profile-client.tsx', [
    ['bg-[#12122A]', 'bg-background'],
    ['bg-black/20 border border-white/5', 'bg-secondary/50 border border-border'],
    ['bg-white/5', 'bg-secondary'],
    ['bg-white/10', 'bg-muted'],
    ['border-white/5', 'border-border'],
    ['text-white/50', 'text-muted-foreground'],
    ['text-white', 'text-foreground'],
    ['bg-[#7C3AED]', 'bg-primary'],
    ['text-[#7C3AED]', 'text-primary'],
    ['bg-[#151530]', 'bg-card'],
    ['shadow-[0_8px_30px_rgba(124,58,237,0.1)]', 'shadow-sm'],
    ['fintech-gradient-purple', 'bg-[#171717] dark:bg-white']
]);

replaceAllInFile('src/components/profile/profile-editor.tsx', [
    ['bg-white/5 border-white/5 text-white placeholder:text-white/30', 'bg-background border-border text-foreground placeholder:text-muted-foreground']
]);

replaceAllInFile('src/components/profile/certificates-section.tsx', [
    ['bg-white/5 border-white/5 text-white placeholder:text-white/30', 'bg-background border-border text-foreground placeholder:text-muted-foreground'],
    ['bg-white/5', 'bg-secondary'],
    ['bg-white/5/30', 'bg-secondary/30'],
    ['bg-white/5/80', 'bg-secondary/80'],
    ['border-white/5/50', 'border-border/50'],
    ['border-white/5', 'border-border'],
    ['text-white/50', 'text-muted-foreground'],
    ['text-white/30', 'text-muted-foreground/50'],
    ['text-white', 'text-foreground'],
    ['bg-[#7C3AED]', 'bg-primary'],
    ['text-[#7C3AED]', 'text-primary'],
    ['hover:border-primary/20 hover:shadow-sm', 'hover:border-border hover:shadow-sm vercel-card']
]);