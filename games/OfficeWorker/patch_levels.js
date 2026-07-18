const fs = require('fs');
const levelsCode = fs.readFileSync('levels.js', 'utf-8');
const stories = JSON.parse(fs.readFileSync('stories.json', 'utf-8'));

let updatedCode = levelsCode;

// Regex to find start dialogue text
for (let id in stories) {
    const storyText = stories[id].replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    // We want to replace the `text: "..."` inside the start array for the specific level id.
    // Let's use a regex that matches `id: X,` and looks ahead for `start: [ { ..., text: "..." } ]`
    
    const regex = new RegExp(`(id:\\s*${id},\\s*[\\s\\S]*?start:\\s*\\[\\s*\\{[^}]*?text:\\s*")[^"]*(".*?\\}\\s*\\])`, 'm');
    
    updatedCode = updatedCode.replace(regex, `$1${storyText}$2`);
}

fs.writeFileSync('levels_new.js', updatedCode);
console.log("Updated levels_new.js");
