const fs = require('fs');
let c = fs.readFileSync('src/components/dashboard/latest-announcement.tsx', 'utf8');
c = c.replace(/\{announcement\.isPinned \? '.*?' : '.*?'\}/, '{announcement.isPinned ? "\u0625\u0639\u0644\u0627\u0646 \u0645\u0647\u0645" : "\u0625\u0639\u0644\u0627\u0646 \u062C\u062F\u064A\u062F"}');
fs.writeFileSync('src/components/dashboard/latest-announcement.tsx', c);
