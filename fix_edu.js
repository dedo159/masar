const fs = require('fs');
let content = fs.readFileSync('src/components/resume/ResumeChat.tsx', 'utf8');

const oldEdu = `store.updateEducation([{
                   institution: data.universityId === "ju" ? "University of Jordan" : data.universityId || "University",
                   degree: "Bachelor of " + (data.major || "Computer Science"),
                   startDate: "2021",
                   endDate: "Present",
                   gpa: data.gpa ? data.gpa.toString() + " / 4.00" : ""
                }]);`;

const newEdu = `store.updateEducation([{
                   id: "edu-1",
                   institution: data.universityId === "ju" ? "University of Jordan" : data.universityId || "University",
                   degree: "Bachelor of " + (data.major || "Computer Science") + (data.gpa ? \` (GPA: \${data.gpa}/4.00)\` : ""),
                   graduationYear: "Present",
                   relevantCoursework: []
                }]);`;

content = content.replace(oldEdu, newEdu);

fs.writeFileSync('src/components/resume/ResumeChat.tsx', content, 'utf8');