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

    // 1. Rename loggedInUser -> currentUser
    content = content.replace(/loggedInUser/g, 'currentUser');

    // 2. Rename loanOffers -> offers
    content = content.replace(/loanOffers/g, 'offers');

    // 3. Fix the destructuring from useStore
    // We want to remove loanRequests and activeLoans from the destructuring 
    // and instead declare them after useStore() using loans.

    // Find lines like: const { users, loanRequests, activeLoans } = useStore();
    const storeLineRegex = /const\s+\{([^}]+)\}\s*=\s*useStore\(\)\s*\|\|\s*\{\};|const\s+\{([^}]+)\}\s*=\s*useStore\(\);/g;

    content = content.replace(storeLineRegex, (match, p1, p2) => {
        let inside = p1 || p2;
        let needsLoanRequests = inside.includes('loanRequests');
        let needsActiveLoans = inside.includes('activeLoans');

        // Ensure 'loans' is destructured if we need those
        if ((needsLoanRequests || needsActiveLoans) && !inside.includes('loans')) {
            inside += ', loans';
        }

        // Clean up the destructured vars
        inside = inside.replace(/loanRequests/g, '')
            .replace(/activeLoans/g, '')
            .replace(/,\s*,/g, ',')
            .replace(/\{\s*,/g, '{')
            .replace(/,\s*\}/g, '}');

        let newLine = `const { ${inside.trim()} } = useStore();\n`;

        if (needsLoanRequests) {
            newLine += `    const loanRequests = (loans || []).filter(l => l.status !== 'approved' && l.status !== 'active' && l.status !== 'closed');\n`;
        }
        if (needsActiveLoans) {
            newLine += `    const activeLoans = (loans || []).filter(l => l.status === 'approved' || l.status === 'active' || l.status === 'closed');\n`;
        }

        return newLine;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log('Update complete.');
