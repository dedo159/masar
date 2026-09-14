const fs = require('fs');
let s = fs.readFileSync('prisma/schema.prisma', 'utf8');

const likeModel = `
model AnnouncementLike {
  id             String       @id @default(uuid())
  studentId      String
  announcementId String
  createdAt      DateTime     @default(now())

  student        Student      @relation(fields: [studentId], references: [id])
  announcement   Announcement @relation(fields: [announcementId], references: [id], onDelete: Cascade)

  @@unique([studentId, announcementId])
  @@map("announcement_likes")
}
`;

if (!s.includes('AnnouncementLike')) {
  s += likeModel;
  s = s.replace('university   University @relation(fields: [universityId], references: [id])', 
                'university   University @relation(fields: [universityId], references: [id])\n  likes        AnnouncementLike[]');
  s = s.replace('moodleConnection MoodleConnection?', 
                'moodleConnection MoodleConnection?\n  announcementLikes AnnouncementLike[]');
  fs.writeFileSync('prisma/schema.prisma', s);
}
