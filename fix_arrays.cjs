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

    content = content.replace(/loans\.filter/g, '(loans || []).filter');
    content = content.replace(/offers\.filter/g, '(offers || []).filter');
    content = content.replace(/payments\.filter/g, '(payments || []).filter');
    content = content.replace(/users\.filter/g, '(users || []).filter');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log('Fixed undefined arrays.');
