const fs = require('fs');
let content = fs.readFileSync('src/lib/moodle-sync.ts', 'utf8');

const oldStr = `    update: {
      studentId: normalizedStudent.academicId,
      name: normalizedStudent.fullName,
      major: finalMajor,
      avatar: normalizedStudent.avatarUrl,
      completedCredits: normalizedStudent.completedCredits,
      universityId: university.id,
    },`;

const newStr = `    update: {
      studentId: normalizedStudent.academicId,
      name: normalizedStudent.fullName,
      email: normalizedStudent.academicId + '@ammanu.edu.jo',
      major: finalMajor,
      year: normalizedStudent.academicYear,
      gpa: normalizedStudent.gpa,
      totalCredits: normalizedStudent.totalCreditsRequired,
      completedCredits: normalizedStudent.completedCredits,
      avatar: normalizedStudent.avatarUrl,
      universityId: university.id,
    },`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/lib/moodle-sync.ts', content, 'utf8');
console.log('Fixed moodle sync logic!');