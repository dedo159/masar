const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', 'utf8');

content = content.replace(
  'if (!res.ok) throw new Error("فشل في جلب التقييم");',
  'if (!res.ok) { const errorData = await res.json().catch(() => ({})); throw new Error(errorData.error || `فشل في جلب التقييم: HTTP ${res.status}`); }'
);

content = content.replace(
  'alert("حدث خطأ أثناء الاتصال بالمدقق الآلي.");',
  'alert(`حدث خطأ أثناء الاتصال بالمدقق الآلي: ${error.message}`);'
);

fs.writeFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', content, 'utf8');