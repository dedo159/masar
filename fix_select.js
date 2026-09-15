const fs = require('fs');
let content = fs.readFileSync('src/components/profile/profile-editor.tsx', 'utf8');

const newInput = `<select
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex flex-1 h-11 min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>اختر مهارة تقنية...</option>
            {AVAILABLE_SKILLS.filter(s => !skills.includes(s)).map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>`;

content = content.replace(/<Input value=\{newSkill\}[\s\S]*?className="flex-1 min-h-\[44px\]"\n\s*\/>/, newInput);

fs.writeFileSync('src/components/profile/profile-editor.tsx', content, 'utf8');