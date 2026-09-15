const fs = require('fs');
let content = fs.readFileSync('src/components/resume/ResumeChat.tsx', 'utf8');

const hook = `
  // Auto-import student data if resume is empty (default state)
  useEffect(() => {
    if (store.data.basics.fullName === "Student Name") {
      fetch("/api/students/me")
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
             store.updateBasics({
                fullName: data.name || "",
                email: data.email || "",
                github: data.github || "",
                portfolio: data.portfolio || "",
                targetJobTitle: data.major || "Software Engineer"
             });
             
             let skillsList = [];
             if (Array.isArray(data.skills)) {
                 skillsList = data.skills;
             } else if (typeof data.skills === 'string') {
                 try { skillsList = JSON.parse(data.skills); } catch(e) {}
             }
             
             if (skillsList.length > 0) {
                store.updateSkills([{ category: "Technical Skills", items: skillsList }]);
             }
             
             if (data.universityId || data.major) {
                store.updateEducation([{
                   institution: data.universityId === "ju" ? "University of Jordan" : data.universityId || "University",
                   degree: "Bachelor of " + (data.major || "Computer Science"),
                   startDate: "2021",
                   endDate: "Present",
                   gpa: data.gpa ? data.gpa.toString() + " / 4.00" : ""
                }]);
             }
          }
        })
        .catch(console.error);
    }
  }, []);
`;

const insertionPoint = "  const messagesEndRef = useRef<HTMLDivElement>(null);";
content = content.replace(insertionPoint, hook + '\n' + insertionPoint);

fs.writeFileSync('src/components/resume/ResumeChat.tsx', content, 'utf8');