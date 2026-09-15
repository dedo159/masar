const fs = require('fs');
let content = fs.readFileSync('src/components/layout/navigation.tsx', 'utf8');

content = content.replace(
  "{ href: \"/readiness\", icon: TrendingUp, label: \"التدقيق المهني\" },\n    { href: \"/readiness\", icon: TrendingUp, label: \"التدقيق المهني\" },",
  "{ href: \"/readiness\", icon: TrendingUp, label: \"التدقيق المهني\" },"
);

const targetDesktop = "{ href: \"/internships\", icon: Briefcase, label: t.nav.internships },";
if(content.lastIndexOf(targetDesktop) !== content.indexOf(targetDesktop)) {
    // There are multiple, let's replace the last one (desktop)
    const lastIndex = content.lastIndexOf(targetDesktop);
    const before = content.substring(0, lastIndex);
    const after = content.substring(lastIndex + targetDesktop.length);
    content = before + targetDesktop + "\n    { href: \"/readiness\", icon: TrendingUp, label: \"التدقيق المهني\" }," + after;
}

fs.writeFileSync('src/components/layout/navigation.tsx', content, 'utf8');