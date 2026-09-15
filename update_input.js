const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', 'utf8');

const oldInput = `<Input 
                  value={targetRole} 
                  onChange={(e) => setTargetRole(e.target.value)} 
                  placeholder="مثال: Junior Backend Developer"
                  className="bg-[#fafafa]"
                />`;

const newInput = `<select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="flex h-11 min-h-[44px] w-full rounded-lg border border-input bg-[#fafafa] px-3.5 py-2 text-sm text-foreground ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Frontend Developer">مطور واجهات أمامية (Frontend Developer)</option>
                  <option value="Backend Developer">مطور أنظمة خلفية (Backend Developer)</option>
                  <option value="Full Stack Developer">مطور ويب شامل (Full Stack Developer)</option>
                  <option value="Mobile App Developer">مطور تطبيقات هواتف (Mobile App Developer)</option>
                  <option value="UI/UX Designer">مصمم واجهات وتجربة المستخدم (UI/UX Designer)</option>
                  <option value="Data Analyst">محلل بيانات (Data Analyst)</option>
                  <option value="Data Scientist">عالم بيانات (Data Scientist)</option>
                  <option value="DevOps Engineer">مهندس عمليات تطوير (DevOps Engineer)</option>
                  <option value="Cybersecurity Analyst">محلل أمن سيبراني (Cybersecurity Analyst)</option>
                  <option value="AI/Machine Learning Engineer">مهندس ذكاء اصطناعي (AI/ML Engineer)</option>
                  <option value="Systems Analyst">محلل نظم (Systems Analyst)</option>
                  <option value="Cloud Architect">مهندس حوسبة سحابية (Cloud Architect)</option>
                </select>`;

content = content.replace(oldInput, newInput);

// also let's change the default state of targetRole from "Junior Frontend Developer" to "Frontend Developer"
content = content.replace(
  'const [targetRole, setTargetRole] = useState("Junior Frontend Developer");',
  'const [targetRole, setTargetRole] = useState("Frontend Developer");'
);

fs.writeFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', content, 'utf8');