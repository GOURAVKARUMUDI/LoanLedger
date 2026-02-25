const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/const\s+\{([^}]+)\}\s*=\s*useStore\(\)/g, (match, p1) => {
        // p1 is what's inside the braces
        let cleaned = p1.replace(/=\s*\[\]/g, '') // remove = []
                        .replace(/=\s*\{\}/g, '') // remove = {}
                        .replace(/,\s*,/g, ',')   // clean double commas
                        .trim();
        // remove leading or trailing commas
        cleaned = cleaned.replace(/^,/, '').replace(/,$/, '').trim();
        return `const { ${cleaned} } = useStore()`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log('Fixed destructuring.');
