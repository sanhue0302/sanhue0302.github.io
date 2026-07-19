let currentEngine = null;
const audioManager = new AudioManager();
const dialogManager = new DialogManager();

function buildTutorialHtml(key) {
    if (typeof BLOCK_TUTORIALS === 'undefined' || !BLOCK_TUTORIALS[key]) return '';
    const t = BLOCK_TUTORIALS[key];
    return `<div class='tutorial-box'><div class='tutorial-block-demo' style='background: ${t.color};'><i class='fa-solid ${t.icon}'></i></div><div class='tutorial-desc'><strong>新方塊解鎖：${t.name}</strong><br>${t.desc}</div></div>`;
}

function startGame(levelData) {
    // Compute actual allowed blocks (same logic as MatchEngine constructor)
    let actualBlocks = [...levelData.allowedBlocks];
    let saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
    const pt = saveObj.playthrough || 1;
    if (pt === 1 && actualBlocks.length > 4) {
        actualBlocks.pop();
    }

    // Check which blocks are new (not yet seen by this player)
    const seenTutorials = saveObj.seenTutorials || (GAME_CONFIG.initialBlocks || []);
    const newBlocks = actualBlocks.filter(k => !seenTutorials.includes(k));

    // Build dialogue list: original dialogues + dynamic tutorials
    let dialogues = [...levelData.dialogues.start];
    if (pt >= 2 && levelData.id === 1 && typeof PLAYTHROUGH_TEXTS !== 'undefined' && PLAYTHROUGH_TEXTS.ngPlusLevel1Dialogues) {
        dialogues = [...PLAYTHROUGH_TEXTS.ngPlusLevel1Dialogues];
    }
    if (newBlocks.length > 0) {
        // Append tutorial HTML to the last dialogue entry's text
        const tutorialHtml = newBlocks.map(k => buildTutorialHtml(k)).join('');
        dialogues = dialogues.map((d, i) => {
            if (i === dialogues.length - 1) {
                return { ...d, text: d.text + tutorialHtml };
            }
            return d;
        });

        // Mark these blocks as seen
        saveObj.seenTutorials = [...seenTutorials, ...newBlocks];
        localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(saveObj));
    }

    if (currentEngine) {
        window.removeEventListener('resize', currentEngine.resizeHandler);
        if (typeof currentEngine.destroy === 'function') {
            currentEngine.destroy();
        }
    }

    const gameState = new GameState(levelData, audioManager);
    gameState.dialogManager = dialogManager;
    gameState.init(); // This sets up the background and avatars instantly

    dialogManager.show(dialogues, () => {
        currentEngine = new MatchEngine('grid-container', gameState, levelData, audioManager);
        window.currentGameEngine = currentEngine; // Expose for UI hooks
        
        currentEngine.resizeHandler = () => currentEngine.resize();
        window.addEventListener('resize', currentEngine.resizeHandler);
        currentEngine.init();
        if (levelData.isTest) {
            currentEngine.spawnTestProps();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let saveObj = {};
    try {
        const saveRaw = localStorage.getItem(GAME_CONFIG.saveKey);
        if (saveRaw) saveObj = JSON.parse(saveRaw);
    } catch (e) {
        console.error("讀取存檔失敗", e);
    }
    
    const introSeen = saveObj.introSeen === true;
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.has('test');
    
    const appContainer = document.getElementById('game-container');
    
    if (!introSeen && typeof IntroManager !== 'undefined' && typeof INTRO_SCRIPT !== 'undefined' && INTRO_SCRIPT && INTRO_SCRIPT.length > 0 && !isTestMode) {
        IntroManager.play(INTRO_SCRIPT, () => {
            saveObj.introSeen = true;
            localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(saveObj));
            if (appContainer) appContainer.classList.remove('initial-hidden');
            initGame(saveObj);
        });
    } else {
        if (appContainer) appContainer.classList.remove('initial-hidden');
        initGame(saveObj);
    }

    function initGame(saveData) {
        const urlParams = new URLSearchParams(window.location.search);
        const testLevelParam = urlParams.get('test');
        if (testLevelParam) {
            const testId = parseInt(testLevelParam);
            const testLevel = LEVELS.find(l => l.id === testId);
            if (testLevel) {
                startGame(testLevel);
                return;
            }
        }
        
        let startLevel = LEVELS[0];
        if (saveData && saveData.currentLevelId) {
            const savedLevel = LEVELS.find(l => l.id === saveData.currentLevelId && !l.isTest);
            if (savedLevel) {
                startLevel = savedLevel;
            }
        }
        startGame(startLevel);
    }
    
    // Restart logic
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            const gameOverOverlay = document.getElementById('game-over-overlay');
            if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
            
            let saveObj = {};
            try {
                const saveRaw = localStorage.getItem(GAME_CONFIG.saveKey);
                if (saveRaw) saveObj = JSON.parse(saveRaw);
            } catch (e) {}
            
            initGame(saveObj);
        });
    }
});
