const GAME_CONFIG = {
    title: "社畜退散！腦內暴走大作戰",
    saveKey: "office_worker_save",
    enableNGPlus: true,
    difficultyScaling: 0.5, // 每周目提升 50%
    initialBlocks: ['MAIL', 'PPT'],
    getChapterByLevel: (levelId) => {
        if (levelId >= 76) return 6;
        if (levelId >= 56) return 5;
        if (levelId >= 36) return 4;
        if (levelId >= 21) return 3;
        if (levelId >= 9) return 2;
        return 1;
    },
    gameOverTitle: "精神崩潰！",
    gameOverText: "你被擊敗了... 社畜的悲歌還未結束。",
    getPlayerAvatarSeed: (chapter) => {
        if (chapter === 6) return "CEO_Player";
        if (chapter === 5) return "Director";
        if (chapter === 4) return "Manager";
        if (chapter === 3) return "TeamLead";
        if (chapter === 2) return "TiredWorker";
        return "Rookie";
    },
    getBackgroundUrl: (chapter) => {
        return `url('theme/assets/bg_ch${chapter}.svg')`;
    }
};

const BLOCK_TYPES = {
    MAIL:  { id: '<i class="fa-solid fa-envelope"></i>', color: 'linear-gradient(135deg, #ff7675, #d63031)', type: 'attack', dmg: 10 },        // 紅色 (Red)
    PPT:   { id: '<i class="fa-solid fa-chart-pie"></i>', color: 'linear-gradient(135deg, #74b9ff, #0984e3)', type: 'heavy', dmg: 15 },         // 藍色 (Blue)
    KPI:   { id: '<i class="fa-solid fa-bullseye"></i>', color: 'linear-gradient(135deg, #55efc4, #00b894)', type: 'armor_break', dmg: 0 },     // 綠色 (Green)
    FILE:  { id: '<i class="fa-solid fa-folder-open"></i>', color: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', type: 'poison', dmg: 10 },      // 紫色 (Purple)
    PHONE: { id: '<i class="fa-solid fa-phone"></i>', color: 'linear-gradient(135deg, #fab1a0, #e17055)', type: 'stun', dmg: 15 },            // 橘色 (Orange)
    TEA:   { id: '<i class="fa-solid fa-mug-hot"></i>', color: 'linear-gradient(135deg, #fd79a8, #e84393)', type: 'heal', heal: 5 },            // 粉紅 (Pink)
    CLOCK: { id: '<i class="fa-solid fa-clock"></i>', color: 'linear-gradient(135deg, #81ecec, #00cec9)', type: 'delay', dmg: 5 },            // 青色 (Teal)
    MONEY: { id: '<i class="fa-solid fa-sack-dollar"></i>', color: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)', type: 'buff', dmg: 20 }       // 金黃 (Gold)
};

const BLOCK_TUTORIALS = {
    TEA:   { name: '續命咖啡', color: 'linear-gradient(135deg, #fd79a8, #e84393)', icon: 'fa-mug-hot',       desc: '消除它不僅能造成傷害，還能為您回復 5 點血量！' },
    PHONE: { name: '催命電話', color: 'linear-gradient(135deg, #fab1a0, #e17055)', icon: 'fa-phone',         desc: '消除它能造成傷害，並有機率打斷敵人的動作！' },
    KPI:   { name: '績效考核', color: 'linear-gradient(135deg, #55efc4, #00b894)', icon: 'fa-bullseye',      desc: '基礎傷害為 0，但會讓下一次攻擊傷害翻倍（×2）！' },
    FILE:  { name: '黑歷史檔案', color: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', icon: 'fa-folder-open',   desc: '挖出黑歷史！造成大量的直接傷害！' },
    CLOCK: { name: '摸魚時鐘', color: 'linear-gradient(135deg, #81ecec, #00cec9)', icon: 'fa-clock',         desc: '造成傷害並強制拖延 Boss 的出手時間！' },
    MONEY: { name: '年終獎金', color: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)', icon: 'fa-sack-dollar',   desc: '發錢啦！給予極高的爆發傷害與大幅回血！' }
};

const PROP_TUTORIALS = {
    'line_h': { name: '橫向貫穿光束', color: '#f1c40f', icon: 'fa-arrows-left-right', desc: '將它與任意方塊交換，會瞬間清除整列方塊！' },
    'line_v': { name: '縱向貫穿光束', color: '#f1c40f', icon: 'fa-arrows-up-down', desc: '將它與任意方塊交換，會瞬間清除整行方塊！' },
    'cross':  { name: '十字爆破', color: '#e74c3c', icon: 'fa-arrows-to-circle', desc: '將它與任意方塊交換，會引發周圍十字範圍的爆炸！' },
    'color':  { name: '黑洞', color: '#9b59b6', icon: 'fa-circle-notch spinBlackHole', desc: '將它與任意方塊交換，會將畫面上所有同種方塊吸入黑洞中摧毀！' },
    'combo':  { name: '道具連鎖', color: '#f39c12', icon: 'fa-bolt', desc: '將兩個特殊道具互相交換，會引發超大範圍的毀滅性連鎖反應！' }
};

const SUBORDINATES_CONFIG = [
    { 
        unlockLevel: 21, 
        id: 1, 
        name: "Z世代新人", 
        seed: "ZGen", 
        color: 'MAIL', 
        charge: 20, 
        maxCharge: 40, 
        ready: false, 
        locked: 0, 
        desc: "強力打擊",
        effect: (game, sub) => {
            game.showFloatingText('新人爆發!', '#e74c3c', document.getElementById(`sub-${sub.id}`));
            const dmg = 30 * game.playerAtkMultiplier;
            game.applyDamage(dmg);
        }
    },
    { 
        unlockLevel: 21, 
        id: 2, 
        name: "資深組員", 
        seed: "Senior", 
        color: 'TEA', 
        charge: 20, 
        maxCharge: 40, 
        ready: false, 
        locked: 0, 
        desc: "緊急救援",
        effect: (game, sub) => {
            game.showFloatingText('老鳥救援!', '#2ed573', document.getElementById(`sub-${sub.id}`));
            game.applyHeal(30);
            game.bossTimer += 2;
            game.updateUI();
        }
    }
];

const PLAYTHROUGH_TEXTS = {
  getAwakeningText(nextPlaythrough) {
    const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];
    const ptStr = chineseNumbers[nextPlaythrough] || nextPlaythrough;
    const diffPercent = Math.round((1 + (nextPlaythrough - 1) * GAME_CONFIG.difficultyScaling) * 100);
    
    if (nextPlaythrough === 2) {
      return {
        title: "⏰ 嗶嗶嗶嗶！",
        badge: "二周目：現實世界的考驗",
        story: "一陣刺耳的鬧鐘聲響起，你從辦公桌前驚醒！\n「剛才的副總、總經理、甚至是董事長...難道只是一場夢？！」\n你揉了揉發紅的雙眼，發現桌上擺著一張便利貼：『明天是入職第一天，記得填寫新人資料』。\n\n【現實世界的考驗】\n你將帶著全部解鎖的方塊種類重回第一關，但現實中的怪物血量與攻擊力將面臨真正的考驗（基礎屬性 1.5 倍）！你能否將夢境化為現實？",
        btnText: "面對現實 <i class='fa-solid fa-arrow-right'></i>"
      };
    } else {
      return {
        title: "⏰ 嗶嗶嗶嗶！",
        badge: `${ptStr}周目：無盡的加班地獄`,
        story: `你再次從辦公桌前驚醒！這場無休無止的加班循環似乎永無止境...\n你揉了揉滿是血絲的雙眼，看見桌上依然是那張便利貼。雖然你早已熟悉了所有職場套路，但現實的摧殘將只會更加殘酷！\n\n【第 ${ptStr} 周目的考驗】\n怪物血量與攻擊力已提升至原本的 ${diffPercent}%！你能否挑戰極限，在無盡的加班地獄中生存下來？`,
        btnText: `繼續加班 <i class='fa-solid fa-arrow-right'></i>`
      };
    }
  },
  ngPlusLevel1Dialogues: [
    {
      name: "主角",
      avatar: "🧑‍💻",
      text: "（整個人猛地一震，狂喘粗氣）呼……呼……哈……我、我剛剛不是才在一棟極致奢華的頂樓辦公室，接受董事長的禪讓嗎……？"
    },
    {
      name: "主角",
      avatar: "🧑‍💻",
      text: "等等，我的紅木辦公桌呢？我的秘書呢？這裡為什麼只有一張發黃的木桌，和……和這疊泛黃的『新進人員履歷表』？"
    },
    {
      name: "人事阿姨",
      avatar: "👩‍💼",
      text: "喂！發什麼呆啊！快把這疊表格填一填！字寫端正點，別耽誤我團購水餃的時間！"
    },
    {
      name: "主角",
      avatar: "🧑‍💻",
      text: "（晴天霹靂，手微微發抖）難道……剛剛當上 CEO、打敗董事長的那一切，都只是我在填履歷前太累，趴在桌上做的一場夢？！"
    },
    {
      name: "主角",
      avatar: "🧑‍💻",
      text: "（眼神逐漸變得無比犀利）不……即便是夢，那種站在巔峰的感覺也是真的。既然夢能成真一次，那在現實中，我也要再次登頂！現實的考驗，現在才要開始！"
    }
  ],
  gameClearEnding: {
      title: "🎉 遊戲通關！",
      badge: "最高榮譽",
      story: "你已經擊敗了最後的敵人，站在了這個世界的頂端。\n這段旅程已經結束，而你獲得了真正的自由！\n\n感謝您的遊玩！",
      btnText: "回到首頁 <i class='fa-solid fa-home'></i>"
  }
};
