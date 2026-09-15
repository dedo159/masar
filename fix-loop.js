const fs = require('fs');
const file = 'src/components/resume/ResumeChat.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('}, [messages, store, addToolResult]);', '}, [messages, addToolResult]);');
c = c.replace(/store\.updateBasics/g, 'useResumeStore.getState().updateBasics');
c = c.replace(/store\.updateSummary/g, 'useResumeStore.getState().updateSummary');
c = c.replace(/store\.updateSkills/g, 'useResumeStore.getState().updateSkills');
c = c.replace(/store\.addOrUpdateProject/g, 'useResumeStore.getState().addOrUpdateProject');
c = c.replace(/store\.deleteProject/g, 'useResumeStore.getState().deleteProject');
c = c.replace(/store\.updateBulletPoint/g, 'useResumeStore.getState().updateBulletPoint');
c = c.replace(/store\.updateEducation/g, 'useResumeStore.getState().updateEducation');
c = c.replace(/store\.updateCertifications/g, 'useResumeStore.getState().updateCertifications');
c = c.replace(/store\.updateDesign/g, 'useResumeStore.getState().updateDesign');

fs.writeFileSync(file, c);
console.log('Fixed infinite loop!');
