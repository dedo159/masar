const fs = require('fs');
let editor = fs.readFileSync('src/components/profile/profile-editor.tsx', 'utf8');
editor = editor.replace(
    'variant="secondary"\n              onClick={handleAddSkill}\n              className="gap-1 min-h-[44px] px-4"',
    'variant="outline" onClick={handleAddSkill} className="gap-1 min-h-[44px] px-4 bg-white/5 border-white/5 text-white hover:bg-white/10 hover:text-white"'
);
fs.writeFileSync('src/components/profile/profile-editor.tsx', editor, 'utf8');