const fs = require('fs');

let code = fs.readFileSync('levels.js', 'utf-8');

// 1. Remove all old wrong tutorials
code = code.replace(/\\n\\n【教學】[^"]+/g, '');

// 2. Define the true tutorials
const tutorials = {
    3: "\\n\\n【教學】出現了新的「回血方塊 (TEA)」☕！消除它不僅能造成傷害，還能為您回復血量！",
    5: "\\n\\n【教學】出現了新的「暈眩方塊 (PHONE)」📞！",
    8: "\\n\\n【教學】出現了新的「破甲方塊 (KPI)」🎯！",
    9: "\\n\\n【教學】出現了新的「中毒方塊 (FILE)」📁！能對 Boss 造成持續性的干擾與毒素傷害！",
    21: "\\n\\n【教學】出現了新的「延遲方塊 (CLOCK)」⏰！消除它會飛向 Boss 計時器，強行拖延 Boss 的出手時間！",
    36: "\\n\\n【教學】出現了新的「獎金方塊 (MONEY)」💰！消除它會噴發大量金幣，給予極高的爆發傷害與效果！"
};

for (const id in tutorials) {
    const textToAppend = tutorials[id];
    // Find the exact line: id: X, ... text: "..."
    const regex = new RegExp(`(id:\\s*${id},\\s*[\\s\\S]*?start:\\s*\\[\\s*\\{[^}]*?text:\\s*"[^"]*)(".*?\\}\\s*\\])`, 'm');
    code = code.replace(regex, `$1${textToAppend}$2`);
}

fs.writeFileSync('levels_fixed.js', code);
console.log('Fixed levels.js');
