const fs = require('fs');
let content = fs.readFileSync('src/components/profile/profile-editor.tsx', 'utf8');

// The first Input is at line 118, with className="flex-1 min-h-[44px]"
content = content.replace(
    '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30"\n            value={newSkill}\n            onChange={(e) => setNewSkill(e.target.value)}\n            onKeyDown={(e) => {\n              if (e.key === "Enter") {\n                e.preventDefault();\n                handleAddSkill();\n              }\n            }}\n            placeholder={t.profile.skillPlaceholder}\n            className="flex-1 min-h-[44px]"\n          />',
    '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30 flex-1 min-h-[44px]"\n            value={newSkill}\n            onChange={(e) => setNewSkill(e.target.value)}\n            onKeyDown={(e) => {\n              if (e.key === "Enter") {\n                e.preventDefault();\n                handleAddSkill();\n              }\n            }}\n            placeholder={t.profile.skillPlaceholder}\n          />'
);

// The second Input is at line 148, with className="min-h-[44px]"
content = content.replace(
    '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30"\n              value={github}\n              onChange={(e) => setGithub(e.target.value)}\n              placeholder="github.com/username"\n              className="min-h-[44px]"\n              dir="ltr"\n            />',
    '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30 min-h-[44px]"\n              value={github}\n              onChange={(e) => setGithub(e.target.value)}\n              placeholder="github.com/username"\n              dir="ltr"\n            />'
);

// The third Input is at line 162, with className="min-h-[44px]"
content = content.replace(
    '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30"\n              value={portfolio}\n              onChange={(e) => setPortfolio(e.target.value)}\n              placeholder="https://myportfolio.dev"\n              className="min-h-[44px]"\n              dir="ltr"\n            />',
    '<Input className="bg-white/5 border-white/5 text-white placeholder:text-white/30 min-h-[44px]"\n              value={portfolio}\n              onChange={(e) => setPortfolio(e.target.value)}\n              placeholder="https://myportfolio.dev"\n              dir="ltr"\n            />'
);

fs.writeFileSync('src/components/profile/profile-editor.tsx', content, 'utf8');