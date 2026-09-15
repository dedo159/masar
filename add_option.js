const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', 'utf8');

const newOption = `<option value="Software Engineer">مهندس برمجيات (Software Engineer)</option>
                    <option value="Frontend Developer">مطور واجهات أمامية (Frontend Developer)</option>`;

content = content.replace('<option value="Frontend Developer">مطور واجهات أمامية (Frontend Developer)</option>', newOption);

fs.writeFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', content, 'utf8');