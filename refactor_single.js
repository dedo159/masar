const { Project, SyntaxKind, Node } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project();
project.addSourceFilesAtPaths("src/app/(dashboard)/readiness/readiness-client.tsx");

const arabicRegex = /[\u0600-\u06FF]/;
let dictionaryAr = {};
let dictionaryEn = {};

function generateSafeKey(text) {
    return "key_" + Math.random().toString(36).substr(2, 6);
}

for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();
    const basename = path.basename(filePath, path.extname(filePath)).replace(/[^a-zA-Z0-9]/g, '');
    
    let fileTranslationsAr = {};
    let fileTranslationsEn = {};
    
    let hasModifications = false;
    
    // Check if it's a client component
    let isClient = false;
    for (const stat of sourceFile.getStatements()) {
        if (Node.isExpressionStatement(stat) && stat.getExpression().getText() === '"use client"') {
            isClient = true;
            break;
        }
    }
    
    // We will only handle string literals and JSX text for now
    sourceFile.forEachDescendant(node => {
        if (Node.isJsxText(node)) {
            const text = node.getText();
            if (arabicRegex.test(text)) {
                const cleanText = text.trim();
                if (cleanText.length > 0) {
                    const key = generateSafeKey(cleanText);
                    fileTranslationsAr[key] = cleanText;
                    fileTranslationsEn[key] = cleanText; // Placeholder
                    node.replaceWithText(`{t.${basename}.${key}}`);
                    hasModifications = true;
                }
            }
        } else if (Node.isStringLiteral(node)) {
            const text = node.getLiteralValue();
            if (arabicRegex.test(text)) {
                // Ignore imports
                if (node.getParentIfKind(SyntaxKind.ImportDeclaration)) return;
                
                const key = generateSafeKey(text);
                fileTranslationsAr[key] = text;
                fileTranslationsEn[key] = text; // Placeholder
                
                // If in JSX Attribute, replace with JSX Expression
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
        dictionaryEn[basename] = fileTranslationsEn;
        
        // Add hook
        if (isClient) {
            // Add import
            let hasImport = false;
            sourceFile.getImportDeclarations().forEach(imp => {
                if (imp.getModuleSpecifierValue().includes('language-provider')) hasImport = true;
            });
            if (!hasImport) {
                sourceFile.addImportDeclaration({
                    namedImports: ['useLanguage'],
                    moduleSpecifier: '@/components/providers/language-provider'
                });
            }
            
            // Add hook to functions
            sourceFile.getFunctions().forEach(func => {
                if (func.isExported() && func.getName() && func.getName()[0] === func.getName()[0].toUpperCase()) {
                    func.insertStatements(0, 'const { t } = useLanguage();');
                }
            });
        }
        
        sourceFile.saveSync();
    }
}

fs.writeFileSync('extracted_translations.json', JSON.stringify({ar: dictionaryAr, en: dictionaryEn}, null, 2));
console.log("Refactored readiness-client.tsx");