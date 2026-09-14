const fs = require('fs');
let s = fs.readFileSync('prisma/schema.prisma', 'utf8');
s = s.replace('@@map("students")', 'announcementLikes AnnouncementLike[]\n\n  @@map("students")');
fs.writeFileSync('prisma/schema.prisma', s);
