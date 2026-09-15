const { Project, SyntaxKind, Node } = require('ts-morph');
const fs = require('fs');

const project = new Project();
project.addSourceFilesAtPaths("src/**/*.tsx");
project.addSourceFilesAtPaths("src/**/*.ts");

const arabicRegex = /[\u0600-\u06FF]/;
let totalMatches = 0;
let filesToModify = [];

for (const sourceFile of project.getSourceFiles()) {
    let hasArabic = false;
    
    // We only care about string literals, jsx text, template literals
    sourceFile.forEachDescendant(node => {
        if (Node.isStringLiteral(node) || Node.isJsxText(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
            const text = node.getText();
            if (arabicRegex.test(text)) {
                hasArabic = true;
                totalMatches++;
            }
        }
    });
    
    if (hasArabic) {
        filesToModify.push(sourceFile.getFilePath());
    }
}

console.log(`Found ${totalMatches} Arabic strings across ${filesToModify.length} files.`);
fs.writeFileSync('arabic_files.json', JSON.stringify(filesToModify, null, 2));