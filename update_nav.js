const fs = require('fs');
let content = fs.readFileSync('src/components/layout/navigation.tsx', 'utf8');

const target1 = "{ href: \"/internships\", icon: Briefcase, label: t.nav.internships },";
const replacement1 = target1 + "\n    { href: \"/readiness\", icon: TrendingUp, label: \"التدقيق المهني\" },";

const target2 = "{ href: \"/internships\", icon: Briefcase, label: t.nav.internships },";
const replacement2 = target2 + "\n    { href: \"/readiness\", icon: TrendingUp, label: \"التدقيق المهني\" },";

// Update mobile nav
content = content.replace(target1, replacement1);
// Update desktop nav
content = content.replace(target2, replacement2);

fs.writeFileSync('src/components/layout/navigation.tsx', content, 'utf8');
console.log('Navigation updated');