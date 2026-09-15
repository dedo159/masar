const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', 'utf8');

// 1. Remove description from PageHeader
content = content.replace(
  '<PageHeader \n        title="التدقيق المهني الذكي" \n        description="قيم جاهزيتك الفعلية لسوق العمل واكتشف الفجوات المهارية بدقة، مدعوماً بالذكاء الاصطناعي."\n      />',
  '<PageHeader title="التدقيق المهني الذكي" />\n      <p className="text-[#666666] text-sm mt-2">قيم جاهزيتك الفعلية لسوق العمل واكتشف الفجوات المهارية بدقة، مدعوماً بالذكاء الاصطناعي.</p>'
);

// 2. Import TrendingUp from lucide-react
content = content.replace(
  'import { Sparkles, Briefcase, Code, GitBranch, ShieldCheck, AlertTriangle, ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";',
  'import { Sparkles, Briefcase, Code, GitBranch, ShieldCheck, AlertTriangle, ArrowUpRight, Loader2, CheckCircle2, TrendingUp } from "lucide-react";'
);

fs.writeFileSync('src/app/(dashboard)/readiness/readiness-client.tsx', content, 'utf8');