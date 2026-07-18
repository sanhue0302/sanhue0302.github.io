const fs = require('fs');

const md = fs.readFileSync('../../Spec/OfficeWorker/Level.md', 'utf-8');
const levelsJs = fs.readFileSync('levels.js', 'utf-8');

// Parse MD for level stories
const lines = md.split('\n');
let stories = {};
let currentLevel = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matchLevel = line.match(/\* \*\*第 (\d+) 關：(.*?)\*\*/);
    if (matchLevel) {
        currentLevel++;
        continue;
    }
    
    const matchStory = line.match(/\* \*關卡小故事\*：(.*)/);
    if (matchStory && currentLevel > 0) {
        stories[currentLevel] = matchStory[1];
    }
    
    const matchTutorial = line.match(/\* \*🆕 (新增方塊.*?)\*/);
    if (matchTutorial && currentLevel > 0) {
        stories[currentLevel] += "\\n\\n【教學】" + matchTutorial[1];
    }
}

let updatedCode = levelsJs;

for (let id in stories) {
    const storyText = stories[id].replace(/'/g, "\\'").replace(/"/g, '\\"');
    const regex = new RegExp(`(id:\\s*${id},\\s*[\\s\\S]*?start:\\s*\\[\\s*\\{[^}]*?text:\\s*")[^"]*(".*?\\}\\s*\\])`, 'm');
    updatedCode = updatedCode.replace(regex, `$1${storyText}$2`);
}

fs.writeFileSync('levels_new.js', updatedCode);
console.log("Updated levels_new.js");
