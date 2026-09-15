const { Project, SyntaxKind, Node } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const filesToProcess = [
  "src/app/(dashboard)/page.tsx",
  "src/app/(dashboard)/profile/profile-client.tsx",
  "src/app/resume-builder/page.tsx",
  "src/components/resume/ResumeChat.tsx",
  "src/components/resume/ResumePreview.tsx",
  "src/app/company/(portal)/dashboard/page.tsx",
  "src/app/company/(portal)/internships/page.tsx",
  "src/app/university/(portal)/dashboard/page.tsx",
  "src/app/university/(portal)/at-risk/page.tsx",
  "src/app/merchant/(portal)/dashboard/page.tsx",
  "src/app/merchant/(portal)/deals/page.tsx"
];

const project = new Project();
project.addSourceFilesAtPaths(filesToProcess);

const arabicRegex = /[\u0600-\u06FF]/;
let dictionaryAr = {};

function generateKeyName(text) {
    return "text_" + Math.random().toString(36).substr(2, 4);
}

for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();
    let basename = path.basename(filePath, path.extname(filePath)).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    if (basename === 'page' || basename === 'profileclient' || basename === 'resumechat' || basename === 'resumepreview') {
        const parts = filePath.split('/');
        // e.g. src/app/company/(portal)/dashboard/page.tsx -> companydashboardpage
        let uniqueName = parts.slice(Math.max(parts.length - 4, 0)).join('');
        basename = uniqueName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }
    
    let fileTranslationsAr = {};
    let hasModifications = false;
    
    let isClient = false;
    for (const stat of sourceFile.getStatements()) {
        if (Node.isExpressionStatement(stat) && stat.getExpression().getText() === '"use client"') {
            isClient = true;
            break;
        }
    }
    
    sourceFile.forEachDescendant(node => {
        if (Node.isJsxText(node)) {
            const text = node.getText();
            if (arabicRegex.test(text)) {
                const cleanText = text.trim();
                if (cleanText.length > 0) {
                    const key = generateKeyName(cleanText);
                    fileTranslationsAr[key] = cleanText;
                    node.replaceWithText(`{t.${basename}.${key}}`);
                    hasModifications = true;
                }
            }
        } else if (Node.isStringLiteral(node)) {
            const text = node.getLiteralValue();
            if (arabicRegex.test(text)) {
                if (node.getParentIfKind(SyntaxKind.ImportDeclaration)) return;
                
                const key = generateKeyName(text);
                fileTranslationsAr[key] = text;
                
                if (node.getParentIfKind(SyntaxKind.JsxAttribute)) {
                    node.replaceWithText(`{t.${basename}.${key}}`);
                } else {
                    node.replaceWithText(`t.${basename}.${key}`);
                }
                hasModifications = true;
            }
        }
    });
    
    if (hasModifications) {
        dictionaryAr[basename] = fileTranslationsAr;
        
        let targetImport = isClient ? 'useLanguage' : 'getServerTranslations';
        let moduleSpec = isClient ? '@/components/providers/language-provider' : '@/lib/translations/server';
        
        let hasImport = false;
        sourceFile.getImportDeclarations().forEach(imp => {
            if (imp.getModuleSpecifierValue() === moduleSpec) hasImport = true;
        });
        
        if (!hasImport) {
            sourceFile.addImportDeclaration({
                namedImports: [targetImport],
                moduleSpecifier: moduleSpec
            });
        }
        
        sourceFile.getFunctions().forEach(func => {
            if (func.isExported() && func.getName() && func.getName()[0] === func.getName()[0].toUpperCase()) {
                if (isClient) {
                    func.insertStatements(0, 'const { t } = useLanguage();');
                } else {
                    func.setIsAsync(true);
                    func.insertStatements(0, 'const t = await getServerTranslations();');
                }
            }
        });
        
        sourceFile.saveSync();
        console.log("Refactored: " + filePath);
    }
}

fs.writeFileSync('extracted_11.json', JSON.stringify({ar: dictionaryAr, en: dictionaryAr}, null, 2));
console.log("Done extracting 11 files");