const fs = require('fs');

function replaceAllInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replaceAll(search, replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceAllInFile('src/app/(dashboard)/profile/profile-client.tsx', [
    ['bg-secondary/20', 'bg-black/20 border border-white/5'],
    ['bg-secondary/50', 'bg-white/5'],
    ['bg-secondary', 'bg-white/10'],
    ['border-border', 'border-white/5'],
    ['text-muted-foreground', 'text-white/50'],
    ['text-foreground', 'text-white'],
    ['bg-primary', 'bg-[#7C3AED]'],
    ['text-primary', 'text-[#7C3AED]'],
    ['bg-card', 'bg-[#151530]'],
    ['shadow-sm', 'shadow-[0_8px_30px_rgba(124,58,237,0.1)]']
]);

replaceAllInFile('src/components/profile/profile-editor.tsx', [
    ['bg-secondary', 'bg-white/5'],
    ['border-border', 'border-white/5'],
    ['text-muted-foreground', 'text-white/50'],
    ['text-foreground', 'text-white'],
    ['bg-primary', 'bg-[#7C3AED]'],
    ['text-primary', 'text-[#7C3AED]'],
    ['<Input', '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30"']
]);

replaceAllInFile('src/components/profile/certificates-section.tsx', [
    ['bg-secondary', 'bg-white/5'],
    ['border-border', 'border-white/5'],
    ['text-muted-foreground', 'text-white/50'],
    ['text-foreground', 'text-white'],
    ['bg-primary', 'bg-[#7C3AED]'],
    ['text-primary', 'text-[#7C3AED]'],
    ['<Input \n                required', '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30" \n                required'],
    ['<Input \n                value={formData.issuer}', '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30" \n                value={formData.issuer}'],
    ['className="file:me-3', 'className="bg-white/5 border-white/5 text-white placeholder:text-white/30 file:me-3']
]);

let editorContent = fs.readFileSync('src/components/profile/profile-editor.tsx', 'utf8');
editorContent = editorContent.replace('className="gap-1 min-h-[44px] px-4 bg-white/5 border-white/5 text-white hover:bg-white/10 hover:text-white"\n            onClick={handleAddSkill}\n            className="gap-1 min-h-[44px] px-4"', 'className="gap-1 min-h-[44px] px-4 bg-white/5 border-white/5 text-white hover:bg-white/10 hover:text-white" onClick={handleAddSkill}');
fs.writeFileSync('src/components/profile/profile-editor.tsx', editorContent, 'utf8');

let pageContent = fs.readFileSync('src/app/(dashboard)/profile/page.tsx', 'utf8');
pageContent = pageContent.replace('skillsList={skillsList}\n      initials={initials}', 'enrolledCourses={student.enrollments.map(e => e.course)}');
fs.writeFileSync('src/app/(dashboard)/profile/page.tsx', pageContent, 'utf8');
