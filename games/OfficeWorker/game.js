// 遊戲核心邏輯

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

class AudioManager {
    constructor() {
        this.ctx = null;
        document.body.addEventListener('pointerdown', () => {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();
        }, { once: true });
    }
    
    playAdvancedTone({ freq, type = 'sine', duration, vol = 0.1, attack = 0.05, detune = 0, filterFreq = 2000 }) {
        if (!this.ctx) return;
        
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = type;
        osc2.type = type;
        osc1.frequency.value = freq;
        osc2.frequency.value = freq;
        osc2.detune.value = detune;

        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        const now = this.ctx.currentTime;
        
        // ADSR Envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(vol, now + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }
    
    playMatch() {
        this.playAdvancedTone({ freq: 600, type: 'sine', duration: 0.3, vol: 0.15, attack: 0.02, detune: 5 });
        setTimeout(() => this.playAdvancedTone({ freq: 800, type: 'triangle', duration: 0.4, vol: 0.1, attack: 0.02, detune: -5 }), 80);
    }
    
    playDrop() {
        this.playAdvancedTone({ freq: 300, type: 'triangle', duration: 0.15, vol: 0.08, attack: 0.01, filterFreq: 1000 });
    }
    
    playCombo(comboCount) {
        const baseFreq = 500 + (comboCount * 100);
        this.playAdvancedTone({ freq: baseFreq, type: 'sine', duration: 0.4, vol: 0.2, attack: 0.03, detune: 8 });
        setTimeout(() => this.playAdvancedTone({ freq: baseFreq * 1.25, type: 'triangle', duration: 0.5, vol: 0.15, attack: 0.03, detune: -8 }), 100);
    }
    
    playDamage() {
        this.playAdvancedTone({ freq: 150, type: 'sawtooth', duration: 0.4, vol: 0.25, attack: 0.01, detune: 15, filterFreq: 800 });
        setTimeout(() => this.playAdvancedTone({ freq: 100, type: 'square', duration: 0.3, vol: 0.2, attack: 0.01, detune: -15, filterFreq: 600 }), 50);
    }
    
    playHeal() {
        this.playAdvancedTone({ freq: 400, type: 'sine', duration: 0.4, vol: 0.2, attack: 0.1, detune: 10 });
        setTimeout(() => this.playAdvancedTone({ freq: 600, type: 'sine', duration: 0.5, vol: 0.2, attack: 0.1, detune: -10 }), 150);
        setTimeout(() => this.playAdvancedTone({ freq: 800, type: 'sine', duration: 0.6, vol: 0.15, attack: 0.1, detune: 5 }), 300);
    }
}

class DialogManager {
    constructor() {
        this.overlay = document.getElementById('dialogue-overlay');
        this.avatar = document.getElementById('dialogue-avatar');
        this.name = document.getElementById('dialogue-name');
        this.text = document.getElementById('dialogue-text');
        this.dialogues = [];
        this.currentIndex = 0;
        this.onComplete = null;
        
        const clone = this.overlay.cloneNode(true);
        this.overlay.parentNode.replaceChild(clone, this.overlay);
        this.overlay = clone;
        this.avatar = document.getElementById('dialogue-avatar');
        this.name = document.getElementById('dialogue-name');
        this.text = document.getElementById('dialogue-text');

        this.overlay.addEventListener('click', () => this.next());
    }

    show(dialogues, onComplete) {
        this.dialogues = dialogues;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.overlay.classList.remove('hidden');
        this.render();
    }

    render() {
        if (this.currentIndex >= this.dialogues.length) {
            this.overlay.classList.add('hidden');
            if (this.onComplete) {
                const cb = this.onComplete;
                this.onComplete = null; 
                cb();
            }
            return;
        }
        const d = this.dialogues[this.currentIndex];
        this.avatar.innerText = d.avatar;
        this.name.innerText = d.name;
        this.text.innerHTML = d.text;
    }

    next() {
        this.currentIndex++;
        this.render();
    }
}

class GameState {
    constructor(levelData, audioManager) {
        this.currentLevel = levelData;
        this.audio = audioManager;
        // 根據關卡進度動態提升血量上限 (每關 +5 HP)
        // 若為測試關卡 (ID >= 90)，則以最後一關(85)來計算，約 520 HP
        const effectiveLevel = levelData.id >= 90 ? 85 : levelData.id;
        const maxHp = 100 + (effectiveLevel - 1) * 5;
        this.playerAtkMultiplier = 1 + (effectiveLevel - 1) * 0.25;
        
        this.playerHp = maxHp;
        this.playerMaxHp = maxHp;
        
        this.bossHp = levelData.bossHp; 
        this.bossMaxHp = levelData.bossHp;
        this.bossAtk = levelData.bossAtk;
        this.bossTimer = levelData.bossMaxTimer;
        this.bossMaxTimer = levelData.bossMaxTimer;
        
        this.bossArmorBreak = false; 
        this.dialogManager = null;
    }

    init() {
        const bossAvatarImg = document.querySelector('.boss-avatar');
        if (bossAvatarImg) {
            const seed = encodeURIComponent(this.currentLevel.bossName);
            bossAvatarImg.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`;
        }
        
        const titleDom = document.getElementById('level-title');
        if (titleDom) titleDom.innerText = this.currentLevel.title;
        
        const bossNameDom = document.getElementById('boss-name-display');
        if (bossNameDom) bossNameDom.innerText = this.currentLevel.bossName;
        
        const combatUi = document.getElementById('combat-ui');
        // Removed dynamic background to let CSS office scene show

        this.updateUI();
    }

    updateUI() {
        const bossBar = document.getElementById('boss-hp-bar');
        const bossText = document.getElementById('boss-hp-text');
        const bossTimerText = document.getElementById('boss-timer');
        
        const bossHpPercent = Math.max(0, (this.bossHp / this.bossMaxHp) * 100);
        bossBar.style.width = `${bossHpPercent}%`;
        bossText.innerText = `${Math.ceil(this.bossHp)} / ${this.bossMaxHp}`;
        bossTimerText.innerText = `${this.bossTimer}`;

        const playerBar = document.getElementById('player-hp-bar');
        const playerText = document.getElementById('player-hp-text');
        
        const playerHpPercent = Math.max(0, (this.playerHp / this.playerMaxHp) * 100);
        playerBar.style.width = `${playerHpPercent}%`;
        playerText.innerText = `${Math.ceil(this.playerHp)} / ${this.playerMaxHp}`;

        // 破甲狀態：主角頭像上方顯示標籤 + 角色發光效果
        const playerAvatar = document.querySelector('.player-avatar');
        let badge = document.getElementById('armor-break-badge');
        if (this.bossArmorBreak) {
            if (!badge) {
                badge = document.createElement('div');
                badge.id = 'armor-break-badge';
                badge.className = 'armor-break-badge';
                badge.innerHTML = '<i class="fa-solid fa-bullseye"></i> 下次攻擊 ×2';
                // 插入到 player avatar 的父容器中
                if (playerAvatar && playerAvatar.parentElement) {
                    playerAvatar.parentElement.style.position = 'relative';
                    playerAvatar.parentElement.appendChild(badge);
                }
            }
            if (playerAvatar) playerAvatar.classList.add('armor-break-active');
        } else {
            if (badge) badge.remove();
            if (playerAvatar) playerAvatar.classList.remove('armor-break-active');
        }
    }

    applyDamage(amount) {
        if (amount <= 0) return;
        if (this.bossArmorBreak) {
            amount *= 2; 
            this.bossArmorBreak = false; 
        }
        this.bossHp = Math.max(0, this.bossHp - amount);
        this.updateUI();
        
        // --- Combat Animation (Player attacks Boss) ---
        const playerAvatar = document.querySelector('.player-avatar');
        const bossAvatar = document.querySelector('.boss-avatar');
        if (playerAvatar && bossAvatar) {
            playerAvatar.classList.remove('anim-attack-right');
            bossAvatar.classList.remove('anim-damage');
            
            // Trigger reflow to restart animation
            void playerAvatar.offsetWidth;
            void bossAvatar.offsetWidth;
            
            playerAvatar.classList.add('anim-attack-right');
            bossAvatar.classList.add('anim-damage');
            
            setTimeout(() => {
                playerAvatar.classList.remove('anim-attack-right');
                bossAvatar.classList.remove('anim-damage');
            }, 300);
        }

        this.showFloatingText(`-${Math.ceil(amount)}`, '#ff4757', document.querySelector('.boss-avatar').parentElement);
        this.audio.playDamage();

        if (this.bossHp <= 0 && this.dialogManager) {
            setTimeout(() => {
                this.dialogManager.show(this.currentLevel.dialogues.win, () => {
                    const nextLevelId = this.currentLevel.id + 1;
                    const nextLevel = LEVELS.find(l => l.id === nextLevelId);
                    
                    let saveObj = JSON.parse(localStorage.getItem('office_worker_save') || '{}');
                    
                    if (nextLevel) {
                        saveObj.currentLevelId = nextLevelId;
                        localStorage.setItem('office_worker_save', JSON.stringify(saveObj));
                        startGame(nextLevel);
                    } else {
                        let pt = saveObj.playthrough || 1;
                        saveObj.playthrough = pt + 1;
                        saveObj.currentLevelId = 1;
                        alert("恭喜！您已經打倒了最終 Boss 破關了！\n接下來將進入「二周目」，解鎖全部方塊種類，挑戰真正的地獄難度！");
                        localStorage.setItem('office_worker_save', JSON.stringify(saveObj));
                        location.reload();
                    }
                });
            }, 1000);
        }
    }

    applyHeal(amount) {
        if (amount <= 0) return;
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + amount);
        this.updateUI();
        
        this.showFloatingText(`+${Math.ceil(amount)}`, '#2ed573', document.querySelector('.player-avatar'));
        this.audio.playHeal();
    }

    showFloatingText(text, color, parentDom) {
        if (!this.floatingTextMap) this.floatingTextMap = new Map();

        // 取得該區域的浮動文字佇列
        if (!this.floatingTextMap.has(parentDom)) {
            this.floatingTextMap.set(parentDom, []);
        }
        const queue = this.floatingTextMap.get(parentDom);

        // 清除已被移除的 DOM 參照
        for (let i = queue.length - 1; i >= 0; i--) {
            if (!queue[i].dom || !queue[i].dom.parentNode) queue.splice(i, 1);
        }

        // 每個區域上限 4 個：超過時移除最舊的
        while (queue.length >= 4) {
            const oldest = queue.shift();
            if (oldest.dom && oldest.dom.parentNode) {
                oldest.dom.style.transition = 'opacity 0.2s';
                oldest.dom.style.opacity = '0';
                setTimeout(() => { if (oldest.dom.parentNode) oldest.dom.remove(); }, 200);
            }
        }

        // 將該區域現有文字往上推
        queue.forEach(t => {
            if (t.dom && t.dom.parentNode) {
                t.offsetIndex++;
                t.dom.style.transform = `translate(-50%, calc(-50% - ${t.offsetIndex * 36}px))`;
            }
        });

        const floating = document.createElement('div');
        floating.innerText = text;
        floating.className = 'floating-text';
        floating.style.color = color;
        floating.style.whiteSpace = 'nowrap';

        parentDom.style.position = 'relative';
        parentDom.appendChild(floating);

        const entry = { dom: floating, offsetIndex: 0 };
        queue.push(entry);

        // 2.5 秒後自動移除
        setTimeout(() => {
            if (floating.parentNode) floating.remove();
            const idx = queue.indexOf(entry);
            if (idx !== -1) queue.splice(idx, 1);
        }, 2500);
    }

    bossTurn() {
        if (this.bossHp <= 0) return;

        this.bossTimer--;
        if (this.bossTimer <= 0) {
            this.playerHp = Math.max(0, this.playerHp - this.bossAtk);
            this.bossTimer = this.bossMaxTimer;
            
            // --- Combat Animation (Boss attacks Player) ---
            const playerAvatar = document.querySelector('.player-avatar');
            const bossAvatar = document.querySelector('.boss-avatar');
            if (playerAvatar && bossAvatar) {
                bossAvatar.classList.remove('anim-attack-left');
                playerAvatar.classList.remove('anim-damage');
                
                // Trigger reflow
                void bossAvatar.offsetWidth;
                void playerAvatar.offsetWidth;
                
                bossAvatar.classList.add('anim-attack-left');
                playerAvatar.classList.add('anim-damage');
                
                setTimeout(() => {
                    bossAvatar.classList.remove('anim-attack-left');
                    playerAvatar.classList.remove('anim-damage');
                }, 300);
            }

            document.getElementById('game-container').classList.add('shake');
            this.showFloatingText(`-${this.bossAtk}`, '#ff4757', document.querySelector('.player-avatar').parentElement);
            this.audio.playDamage();
            
            setTimeout(() => {
                document.getElementById('game-container').classList.remove('shake');
            }, 300);

            if (this.playerHp <= 0) {
                setTimeout(() => {
                    const gameOverOverlay = document.getElementById('game-over-overlay');
                    if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
                }, 500);
            }
        }
        this.updateUI();
    }
}

class MatchEngine {
    constructor(containerId, gameState, levelData, audioManager) {
        this.container = document.getElementById(containerId);
        this.gameState = gameState;
        this.levelData = levelData;
        this.audio = audioManager;
        
        this.rows = levelData.gridRows;
        this.cols = levelData.gridCols;
        this.layout = levelData.layout;
        
        let allowed = [...levelData.allowedBlocks];
        let saveObj = JSON.parse(localStorage.getItem('office_worker_save') || '{}');
        const pt = saveObj.playthrough || 1;
        // If it's playthrough 1 and we have more than 4 blocks, make it easier by removing 1 block type
        if (pt === 1 && allowed.length > 4) {
            allowed.pop();
        }
        this.allowedBlockKeys = allowed; // Store actual keys for tutorial checking
        this.allowedBlockTypes = allowed.map(key => BLOCK_TYPES[key]);
        
        
        this.grid = [];
        this.isProcessing = false;
        this.comboCounter = 0;
        this.stunThisTurn = 0; // PHONE 暈眩：同一回合（含連鎖）最多 +5
        
        this.dragStartNode = null;
        this.startX = 0;
        this.startY = 0;
        
        this.hintTimer = null;
    }

    init() {
        this.container.innerHTML = ''; 
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const isPlayable = !this.layout || this.layout[r][c] === '1';
                
                if (isPlayable) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.dataset.r = r;
                    cell.dataset.c = c;
                    
                    cell.addEventListener('pointerdown', (e) => this.onPointerDown(e, r, c));
                    this.container.appendChild(cell);

                    this.grid[r][c] = { dom: cell, type: null, propType: null, blockDom: null, isPlayable: true, bombTimer: 0 };
                } else {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell-empty';
                    this.container.appendChild(cell);
                    this.grid[r][c] = { dom: cell, type: null, propType: null, blockDom: null, isPlayable: false, bombTimer: 0 };
                }
            }
        }
        
        do {
            this.fillRandomTypesWithoutMatches();
        } while (!this.hasPossibleMoves());

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isPlayable) {
                    this.createBlockDom(r, c, this.grid[r][c].type, null);
                }
            }
        }
        
        this.resize();
        this.resetHintTimer();
    }

    fillRandomTypesWithoutMatches() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isPlayable) {
                    let type;
                    do {
                        type = this.getRandomType();
                    } while (
                        (r >= 2 && this.grid[r-1][c]?.isPlayable && this.grid[r-1][c].type === type && 
                                   this.grid[r-2][c]?.isPlayable && this.grid[r-2][c].type === type) ||
                        (c >= 2 && this.grid[r][c-1]?.isPlayable && this.grid[r][c-1].type === type && 
                                   this.grid[r][c-2]?.isPlayable && this.grid[r][c-2].type === type)
                    );
                    this.grid[r][c].type = type;
                    this.grid[r][c].propType = null;
                }
            }
        }
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const availWidth = rect.width - 20 - (this.cols - 1) * 5;
        const availHeight = rect.height - 20 - (this.rows - 1) * 5;
        
        const size = Math.max(10, Math.floor(Math.min(availWidth / this.cols, availHeight / this.rows)));

        this.container.style.gridTemplateColumns = `repeat(${this.cols}, ${size}px)`;
        this.container.style.gridTemplateRows = `repeat(${this.rows}, ${size}px)`;
    }

    createBlockDom(r, c, type, propType) {
        const block = document.createElement('div');
        block.className = 'block';
        this.updateBlockVisual(block, type, propType, this.grid[r][c].bombTimer);
        this.grid[r][c].blockDom = block;
        this.grid[r][c].dom.appendChild(block);
    }

    updateBlockVisual(blockDom, type, propType, bombTimer = 0) {
        if (!blockDom) return;
        if (propType === 'obstacle_jam') {
            blockDom.innerHTML = '<i class="fa-solid fa-print"></i>';
            blockDom.style.background = 'repeating-linear-gradient(45deg, #7f8c8d, #7f8c8d 10px, #95a5a6 10px, #95a5a6 20px)';
            blockDom.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.5)';
            blockDom.style.border = '2px solid #2c3e50';
            blockDom.style.color = '#fff';
            blockDom.style.textShadow = '0 1px 2px #000';
            blockDom.title = "卡紙方塊：無法移動，必須在相鄰位置消除方塊來破壞。";
        } else if (propType === 'color') {
            blockDom.innerHTML = '<i class="fa-solid fa-hurricane black-hole-icon"></i>';
            blockDom.style.background = 'linear-gradient(135deg, #2c3e50, #000000)';
            blockDom.style.boxShadow = 'inset 0 2px 10px rgba(155, 89, 182, 0.8), 0 5px 15px rgba(0,0,0,0.8), 0 0 20px rgba(155, 89, 182, 0.6)';
            blockDom.style.border = '2px solid #9b59b6';
            blockDom.style.color = '#fff';
        } else {
            blockDom.innerHTML = type ? type.id : '';
            blockDom.style.background = type ? type.color : 'transparent';
            if (type) {
                blockDom.style.boxShadow = 'inset 0 4px 6px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)';
                blockDom.style.border = '1px solid rgba(255,255,255,0.3)';
                blockDom.style.color = '#ffffff';
                blockDom.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
            } else {
                blockDom.style.boxShadow = 'none';
                blockDom.style.border = 'none';
            }
            if (bombTimer > 0) blockDom.innerHTML += `<div class="bomb-timer-badge">${bombTimer}</div>`;
            if (propType === 'line_h') blockDom.innerHTML += '<div class="prop-overlay"><i class="fa-solid fa-arrows-left-right"></i></div>';
            else if (propType === 'line_v') blockDom.innerHTML += '<div class="prop-overlay"><i class="fa-solid fa-arrows-up-down"></i></div>';
            else if (propType === 'cross') blockDom.innerHTML += '<div class="prop-overlay cross"><i class="fa-solid fa-certificate"></i></div>';
        }
    }

    onPointerDown(e, r, c) {
        if (this.isProcessing || !this.grid[r][c].isPlayable) return;
        if (this.grid[r][c].propType === 'obstacle_jam') return; // Cannot drag jam
        if (this.gameState && this.gameState.playerHp <= 0) return; // Cannot drag when dead
        
        this.resetHintTimer();

        const target = e.currentTarget;
        target.setPointerCapture(e.pointerId);

        this.dragStartNode = { r, c };
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const blockDom = this.grid[r][c].blockDom;
        if (blockDom) {
            blockDom.style.transition = 'none';
            blockDom.style.zIndex = '10'; 
            blockDom.style.transform = 'scale(0.9)';
        }

        let currentTargetNode = null;

        const onPointerMove = (moveEvent) => {
            if (!this.dragStartNode || this.isProcessing || !blockDom) return;
            const dx = moveEvent.clientX - this.startX;
            const dy = moveEvent.clientY - this.startY;
            
            const cellWidth = this.grid[r][c].dom.offsetWidth;
            
            // Auto release if dragged far enough
            const autoReleaseThreshold = cellWidth * 0.5;
            if (Math.abs(dx) >= autoReleaseThreshold || Math.abs(dy) >= autoReleaseThreshold) {
                onPointerUp(moveEvent);
                return;
            }
            
            const gap = 5; 
            const limit = cellWidth + gap; 
            
            const clampedDx = Math.max(-limit, Math.min(limit, dx));
            const clampedDy = Math.max(-limit, Math.min(limit, dy));

            let currentDx = 0;
            let currentDy = 0;

            if (currentTargetNode) {
                const prevNode = this.grid[currentTargetNode.r][currentTargetNode.c];
                if(prevNode && prevNode.blockDom) {
                    prevNode.blockDom.style.transform = 'translate(0px, 0px) scale(1)';
                }
                currentTargetNode = null;
            }

            let targetR = r;
            let targetC = c;

            if (Math.abs(dx) > Math.abs(dy)) {
                currentDx = clampedDx;
                if (currentDx > 10) targetC++; 
                else if (currentDx < -10) targetC--;
                
                blockDom.style.transform = `translate(${currentDx}px, 0px) scale(0.9)`;
            } else {
                currentDy = clampedDy;
                if (currentDy > 10) targetR++; 
                else if (currentDy < -10) targetR--;
                
                blockDom.style.transform = `translate(0px, ${currentDy}px) scale(0.9)`;
            }

            if ((targetR !== r || targetC !== c) && 
                targetR >= 0 && targetR < this.rows && 
                targetC >= 0 && targetC < this.cols &&
                this.grid[targetR][targetC].isPlayable && this.grid[targetR][targetC].propType !== 'obstacle_jam') {
                
                const targetBlock = this.grid[targetR][targetC];
                if (targetBlock && targetBlock.blockDom) {
                    currentTargetNode = { r: targetR, c: targetC };
                    targetBlock.blockDom.style.transition = 'none';
                    targetBlock.blockDom.style.transform = `translate(${-currentDx}px, ${-currentDy}px) scale(1)`;
                }
            }
        };

        const onPointerUp = (upEvent) => {
            target.releasePointerCapture(upEvent.pointerId);
            target.removeEventListener('pointermove', onPointerMove);
            target.removeEventListener('pointerup', onPointerUp);
            target.removeEventListener('pointercancel', onPointerCancel);

            if (!this.dragStartNode || this.isProcessing) return;
            
            const sr = this.dragStartNode.r;
            const sc = this.dragStartNode.c;
            const dx = upEvent.clientX - this.startX;
            const dy = upEvent.clientY - this.startY;
            this.dragStartNode = null;

            const cellWidth = this.grid[sr][sc].dom.offsetWidth;
            const threshold = cellWidth * 0.4; 
            
            let isSwap = false;
            let targetR = sr;
            let targetC = sc;

            if (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) targetC++; 
                    else targetC--;        
                } else {
                    if (dy > 0) targetR++; 
                    else targetR--;        
                }
                if (targetR >= 0 && targetR < this.rows && targetC >= 0 && targetC < this.cols && this.grid[targetR][targetC].isPlayable && this.grid[targetR][targetC].propType !== 'obstacle_jam') {
                    isSwap = true;
                }
            }
            
            if (isSwap) {
                if (blockDom) blockDom.style.zIndex = '';
                
                const b1 = this.grid[sr][sc];
                const b2 = this.grid[targetR][targetC];
                let isColorBombSwap = false;
                let colorBombColor = null;
                let colorBombCell = null;
                
                const p1 = b1.propType;
                const p2 = b2.propType;
                const isPropCombo = p1 && p2;
                
                if (!isPropCombo) {
                    if (b1.propType === 'color') {
                        isColorBombSwap = true;
                        colorBombColor = b2.type;
                        colorBombCell = `${targetR},${targetC}`;
                    } else if (b2.propType === 'color') {
                        isColorBombSwap = true;
                        colorBombColor = b1.type;
                        colorBombCell = `${sr},${sc}`;
                    }
                }

                this.swap(sr, sc, targetR, targetC).then(async () => {
                    if (isPropCombo) {
                        this.comboCounter = 0;
                        this.stunThisTurn = 0;
                        this.removeComoBadge();
                        await this.processPropCombo(targetR, targetC, sr, sc, p1, p2, b1.type, b2.type);
                        if (this.gameState.bossHp > 0 && this.gameState.playerHp > 0) {
                            this.tickBombs();
                            this.gameState.bossTurn();
                            this.triggerBossHellModeSkills();
                        }
                    } else {
                        const matchGroups = this.checkMatches();
                        if (isColorBombSwap || matchGroups.length > 0) {
                            this.comboCounter = 0;
                            this.stunThisTurn = 0;
                            this.removeComoBadge();
                            await this.processMatches(matchGroups, targetR, targetC, isColorBombSwap ? colorBombColor : null, isColorBombSwap ? colorBombCell : null);
                            
                            if (this.gameState.bossHp > 0 && this.gameState.playerHp > 0) {
                                this.tickBombs();
                                this.gameState.bossTurn();
                                this.triggerBossHellModeSkills();
                            }
                        } else {
                            await this.swap(sr, sc, targetR, targetC);
                        }
                    }
                });
            } else {
                if (blockDom) {
                    blockDom.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    blockDom.style.transform = 'translate(0px, 0px) scale(1)';
                    blockDom.style.zIndex = '';
                }
                if (currentTargetNode) {
                    const prevNode = this.grid[currentTargetNode.r][currentTargetNode.c];
                    if(prevNode && prevNode.blockDom) {
                        prevNode.blockDom.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        prevNode.blockDom.style.transform = 'translate(0px, 0px) scale(1)';
                    }
                }
            }
        };

        const onPointerCancel = (cancelEvent) => {
            target.releasePointerCapture(cancelEvent.pointerId);
            target.removeEventListener('pointermove', onPointerMove);
            target.removeEventListener('pointerup', onPointerUp);
            target.removeEventListener('pointercancel', onPointerCancel);

            if (blockDom) {
                blockDom.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                blockDom.style.zIndex = '';
                blockDom.style.transform = 'translate(0px, 0px) scale(1)';
            }
            if (currentTargetNode) {
                const prevNode = this.grid[currentTargetNode.r][currentTargetNode.c];
                if(prevNode && prevNode.blockDom) {
                    prevNode.blockDom.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    prevNode.blockDom.style.transform = 'translate(0px, 0px) scale(1)';
                }
            }
            this.dragStartNode = null;
        };

        target.addEventListener('pointermove', onPointerMove);
        target.addEventListener('pointerup', onPointerUp);
        target.addEventListener('pointercancel', onPointerCancel);
    }

    async swap(r1, c1, r2, c2) {
        this.isProcessing = true;
        
        const block1 = this.grid[r1][c1];
        const block2 = this.grid[r2][c2];

        const dom1 = block1.blockDom;
        const dom2 = block2.blockDom;

        const rect1 = block1.dom.getBoundingClientRect();
        const rect2 = block2.dom.getBoundingClientRect();
        const dx = rect2.left - rect1.left;
        const dy = rect2.top - rect1.top;

        if (dom1) {
            dom1.style.transition = 'transform 0.2s ease-in-out';
            dom1.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
        }
        if (dom2) {
            dom2.style.transition = 'transform 0.2s ease-in-out';
            dom2.style.transform = `translate(${-dx}px, ${-dy}px) scale(1)`;
        }

        this.audio.playDrop();
        await new Promise(resolve => setTimeout(resolve, 200));

        const tempType = block1.type;
        block1.type = block2.type;
        block2.type = tempType;
        
        const tempProp = block1.propType;
        block1.propType = block2.propType;
        block2.propType = tempProp;
        
        const tempTimer = block1.bombTimer;
        block1.bombTimer = block2.bombTimer;
        block2.bombTimer = tempTimer;

        if (dom2) block1.dom.appendChild(dom2);
        if (dom1) block2.dom.appendChild(dom1);
        
        block1.blockDom = dom2;
        block2.blockDom = dom1;

        if (dom1) {
            dom1.style.transition = 'none';
            dom1.style.transform = 'translate(0px, 0px) scale(1)';
            dom1.offsetHeight; 
        }
        if (dom2) {
            dom2.style.transition = 'none';
            dom2.style.transform = 'translate(0px, 0px) scale(1)';
            dom2.offsetHeight;
        }

        this.isProcessing = false;
    }

    checkMatches() {
        let hLines = [];
        let vLines = [];
        
        for (let r = 0; r < this.rows; r++) {
            let matchLen = 1;
            for (let c = 0; c < this.cols; c++) {
                let currentValid = this.grid[r][c]?.isPlayable && this.grid[r][c].type && this.grid[r][c].propType !== 'color' && this.grid[r][c].propType !== 'obstacle_jam';
                let nextValid = c + 1 < this.cols && this.grid[r][c+1]?.isPlayable && this.grid[r][c+1].type && this.grid[r][c+1].propType !== 'color' && this.grid[r][c+1].propType !== 'obstacle_jam';
                
                if (currentValid && nextValid && this.grid[r][c].type.id === this.grid[r][c+1].type.id) {
                    matchLen++;
                } else {
                    if (matchLen >= 3) {
                        let line = [];
                        for(let i=0; i<matchLen; i++) line.push(`${r},${c-i}`);
                        hLines.push({ type: this.grid[r][c].type, cells: line });
                    }
                    matchLen = 1;
                }
            }
        }
        
        for (let c = 0; c < this.cols; c++) {
            let matchLen = 1;
            for (let r = 0; r < this.rows; r++) {
                let currentValid = this.grid[r][c]?.isPlayable && this.grid[r][c].type && this.grid[r][c].propType !== 'color' && this.grid[r][c].propType !== 'obstacle_jam';
                let nextValid = r + 1 < this.rows && this.grid[r+1][c]?.isPlayable && this.grid[r+1][c].type && this.grid[r+1][c].propType !== 'color' && this.grid[r+1][c].propType !== 'obstacle_jam';
                
                if (currentValid && nextValid && this.grid[r][c].type.id === this.grid[r+1][c].type.id) {
                    matchLen++;
                } else {
                    if (matchLen >= 3) {
                        let line = [];
                        for(let i=0; i<matchLen; i++) line.push(`${r-i},${c}`);
                        vLines.push({ type: this.grid[r][c].type, cells: line });
                    }
                    matchLen = 1;
                }
            }
        }
        
        let groups = [];
        let allLines = [...hLines, ...vLines];
        let visited = new Set();
        
        for (let i = 0; i < allLines.length; i++) {
            if (visited.has(i)) continue;
            let group = { 
                type: allLines[i].type, 
                cells: new Set(allLines[i].cells), 
                hasH: i < hLines.length, 
                hasV: i >= hLines.length, 
                maxLen: allLines[i].cells.length 
            };
            visited.add(i);
            
            let changed = true;
            while(changed) {
                changed = false;
                for (let j = 0; j < allLines.length; j++) {
                    if (!visited.has(j) && allLines[j].type.id === group.type.id) {
                        let intersect = allLines[j].cells.some(c => group.cells.has(c));
                        if (intersect) {
                            allLines[j].cells.forEach(c => group.cells.add(c));
                            group.hasH = group.hasH || j < hLines.length;
                            group.hasV = group.hasV || j >= hLines.length;
                            group.maxLen = Math.max(group.maxLen, allLines[j].cells.length);
                            visited.add(j);
                            changed = true;
                        }
                    }
                }
            }
            groups.push(group);
        }
        
        return groups;
    }

    async processPropCombo(r1, c1, r2, c2, p1, p2, type1, type2) {
        try {
            this.isProcessing = true;
            this.comboCounter++;
            
            this.gameState.showFloatingText('道具連鎖爆發!', '#f39c12', document.getElementById('grid-container'));
            this.audio.playCombo(3);
            
            let resolved = new Set();
            let newlyAdded = new Set();
            
            // 將兩個觸發點標記為已處理
            resolved.add(`${r1},${c1}`);
            resolved.add(`${r2},${c2}`);
            
            const isLine = (p) => p === 'line_h' || p === 'line_v';
            
            // Check for newly discovered combo tutorial
            let saveObj = JSON.parse(localStorage.getItem('office_worker_save') || '{}');
            let seenProps = saveObj.seenProps || [];
            if (!seenProps.includes('combo')) {
                seenProps.push('combo');
                saveObj.seenProps = seenProps;
                localStorage.setItem('office_worker_save', JSON.stringify(saveObj));
                
                const info = PROP_TUTORIALS['combo'];
                await new Promise(resolve => {
                    this.gameState.dialogManager.show([{
                        name: "系統提示",
                        avatar: "⚠️",
                        text: `<div class='tutorial-box'><div class='tutorial-block-demo' style='background: ${info.color}; font-size: 20px;'><i class='fa-solid ${info.icon}'></i></div><div class='tutorial-desc'><strong>極密操作：${info.name}</strong><br>${info.desc}</div></div>`
                    }], resolve);
                });
            }
            
            if (isLine(p1) && isLine(p2)) {
                // 光束 + 光束 => 十字範圍 (整排 + 整列)
                this.playPropAnimation(r1, c1, 'line_h', '#f1c40f');
                this.playPropAnimation(r1, c1, 'line_v', '#f1c40f');
                for (let i = 0; i < this.cols; i++) if (this.grid[r1][i].isPlayable && this.grid[r1][i].type) newlyAdded.add(`${r1},${i}`);
                for (let i = 0; i < this.rows; i++) if (this.grid[i][c1].isPlayable && this.grid[i][c1].type) newlyAdded.add(`${i},${c1}`);
            } else if ((isLine(p1) && p2 === 'cross') || (p1 === 'cross' && isLine(p2))) {
                // 光束 + 十字 => 巨大的十字 (3排 + 3列)
                this.playPropAnimation(r1, c1, 'cross', '#e74c3c');
                for (let ir = r1 - 1; ir <= r1 + 1; ir++) {
                    for (let i = 0; i < this.cols; i++) {
                        if (ir >= 0 && ir < this.rows && this.grid[ir][i].isPlayable && this.grid[ir][i].type) newlyAdded.add(`${ir},${i}`);
                    }
                }
                for (let ic = c1 - 1; ic <= c1 + 1; ic++) {
                    for (let i = 0; i < this.rows; i++) {
                        if (ic >= 0 && ic < this.cols && this.grid[i][ic].isPlayable && this.grid[i][ic].type) newlyAdded.add(`${i},${ic}`);
                    }
                }
            } else if (p1 === 'cross' && p2 === 'cross') {
                // 十字 + 十字 => 5x5 大爆破
                this.playPropAnimation(r1, c1, 'cross', '#8e44ad');
                for (let ir = r1 - 2; ir <= r1 + 2; ir++) {
                    for (let ic = c1 - 2; ic <= c1 + 2; ic++) {
                        if (ir >= 0 && ir < this.rows && ic >= 0 && ic < this.cols && this.grid[ir][ic].isPlayable && this.grid[ir][ic].type) {
                            newlyAdded.add(`${ir},${ic}`);
                        }
                    }
                }
            } else if (p1 === 'color' && p2 === 'color') {
                // 彩色 + 彩色 => 全圖引爆
                this.playGiantBlackHole();
                for (let ir = 0; ir < this.rows; ir++) {
                    for (let ic = 0; ic < this.cols; ic++) {
                        if (this.grid[ir][ic].isPlayable && this.grid[ir][ic].type) {
                            newlyAdded.add(`${ir},${ic}`);
                        }
                    }
                }
            } else if (p1 === 'color' || p2 === 'color') {
                // 彩色 + 道具 => 將同色全部轉化為該道具並引爆
                const colorType = p1 === 'color' ? type2 : type1;
                const propToConvert = p1 === 'color' ? p2 : p1;
                this.playPropAnimation(r1, c1, 'color', null);
                
                let targetCells = [];
                for (let ir = 0; ir < this.rows; ir++) {
                    for (let ic = 0; ic < this.cols; ic++) {
                        if (this.grid[ir][ic].isPlayable && this.grid[ir][ic].type?.id === colorType.id) {
                            this.grid[ir][ic].propType = propToConvert;
                            this.updateBlockVisual(this.grid[ir][ic].blockDom, this.grid[ir][ic].type, propToConvert, this.grid[ir][ic].bombTimer);
                            targetCells.push(`${ir},${ic}`);
                            this.playBlackHoleSuck(ir, ic);
                        }
                    }
                }
                
                await new Promise(resolve => setTimeout(resolve, 300));
                targetCells.forEach(cell => newlyAdded.add(cell));
            }
            
            // 剩下的就是處理 newlyAdded，如同 processMatches 中原本的道具擴展邏輯
            let queue = new Set([...newlyAdded].filter(x => !resolved.has(x)));
            
            while(queue.size > 0) {
                let currentAdded = new Set();
                queue.forEach(cStr => {
                    if (resolved.has(cStr)) return;
                    resolved.add(cStr);
                    
                    const [r, c] = cStr.split(',').map(Number);
                    const block = this.grid[r][c];
                    if (!block || !block.type) return;
                    
                    if (block.propType) {
                        this.playPropAnimation(r, c, block.propType, block.type.color);
                    }
                    
                    if (block.propType === 'line_h') {
                        for (let i=0; i<this.cols; i++) if (this.grid[r][i].isPlayable && this.grid[r][i].type) currentAdded.add(`${r},${i}`);
                    } else if (block.propType === 'line_v') {
                        for (let i=0; i<this.rows; i++) if (this.grid[i][c].isPlayable && this.grid[i][c].type) currentAdded.add(`${i},${c}`);
                    } else if (block.propType === 'cross') {
                        for (let ir=r-1; ir<=r+1; ir++) {
                            for (let ic=c-1; ic<=c+1; ic++) {
                                if (ir>=0 && ir<this.rows && ic>=0 && ic<this.cols && this.grid[ir][ic].isPlayable && this.grid[ir][ic].type) {
                                    currentAdded.add(`${ir},${ic}`);
                                }
                            }
                        }
                    } else if (block.propType === 'color') {
                        const randomType = this.getRandomType();
                        for (let ir=0; ir<this.rows; ir++) {
                            for (let ic=0; ic<this.cols; ic++) {
                                if (this.grid[ir][ic].isPlayable && this.grid[ir][ic].type?.id === randomType.id) {
                                    currentAdded.add(`${ir},${ic}`);
                                    this.playBlackHoleSuck(ir, ic);
                                }
                            }
                        }
                    }
                });
                queue = new Set([...currentAdded].filter(x => !resolved.has(x)));
            }
            
            let totalDamage = 0;
            let totalHeal = 0;
            let teaCount = 0;
            let stunCount = 0; // PHONE 方塊計數
            let multiplier = 2.0; // 組合技保底 2 倍傷害
            
            resolved.forEach(str => {
                const [r, c] = str.split(',').map(Number);
                const block = this.grid[r][c];
                if (!block || !block.type) return;
                
                if (['attack', 'heavy', 'poison'].includes(block.type.type)) {
                    totalDamage += block.type.dmg;
                } else if (block.type.type === 'heal') {
                    teaCount++;
                } else if (block.type.type === 'stun') {
                    totalDamage += block.type.dmg;
                    stunCount++;
                } else if (block.type.type === 'armor_break') {
                    multiplier += 0.5;
                }
                
                if (block.blockDom) {
                    block.blockDom.classList.add('block-pop');
                    block.blockDom.addEventListener('animationend', () => {
                        if (block.blockDom && block.blockDom.parentNode) {
                            block.blockDom.parentNode.removeChild(block.blockDom);
                        }
                        block.blockDom = null;
                    }, { once: true });
                }
                
                this.createExplosion(block.dom.getBoundingClientRect(), block.propType === 'color' ? '#fff' : block.type.color);
                
                this.grid[r][c].type = null;
                this.grid[r][c].propType = null;
            });
            
            if (teaCount > 0) {
                if (teaCount < 3) {
                    totalHeal += teaCount * (this.gameState.bossAtk / 9);
                } else {
                    totalHeal += ((teaCount - 2) / 3) * this.gameState.bossAtk;
                }
            }
            
            totalDamage = totalDamage * this.gameState.playerAtkMultiplier;
            totalDamage = Math.floor(totalDamage * multiplier);
            totalHeal = Math.floor(totalHeal * multiplier);
            
            if (totalDamage > 0) this.gameState.applyDamage(totalDamage);
            if (totalHeal > 0) this.gameState.applyHeal(totalHeal);
            // PHONE 暈眩：3 顆 +1，每多 1 顆再 +1，同回合上限 +5
            if (stunCount >= 3) {
                let stunToAdd = Math.min(stunCount - 2, 5 - this.stunThisTurn);
                if (stunToAdd > 0) {
                    this.stunThisTurn += stunToAdd;
                    this.gameState.bossTimer += stunToAdd;
                    this.gameState.showFloatingText(`+${stunToAdd} 倒數`, '#ffa502', document.querySelector('.boss-timer'));
                    this.gameState.updateUI();
                }
            }
            
            let delayBeforeGravity = 400;
            if (p1 === 'color' || p2 === 'color') {
                delayBeforeGravity = 800;
            }
            await new Promise(resolve => setTimeout(resolve, delayBeforeGravity));
            await this.applyGravityAndRefill();
            
            const nextGroups = this.checkMatches();
            if (nextGroups.length > 0 && this.gameState.bossHp > 0) {
                await this.processMatches(nextGroups);
            } else {
                if (this.gameState.bossHp > 0 && this.gameState.playerHp > 0) {
                    if (!this.hasPossibleMoves()) {
                        await this.shuffleBoard();
                    }
                }
            }
            
        } catch (e) {
            console.error("Combo Error:", e);
        } finally {
            this.isProcessing = false;
            // Combo 結束時移除徽章
            if (this.comboCounter > 1) {
                setTimeout(() => this.removeComoBadge(), 800);
            }
        }
    }

    async processMatches(matchGroups, swapR, swapC, colorBombColor = null, colorBombCell = null) {
        try {
            this.isProcessing = true;
            // Safety timeout: auto-reset isProcessing after 15s to prevent permanent lock
            if (this._safetyTimer) clearTimeout(this._safetyTimer);
            this._safetyTimer = setTimeout(() => {
                if (this.isProcessing) {
                    console.warn('Safety: isProcessing stuck, force resetting');
                    this.isProcessing = false;
                    this.resetHintTimer();
                }
            }, 15000);
            this.comboCounter++;
            
            if (this.comboCounter > 1) {
                this.audio.playCombo(this.comboCounter);
                this.updateComboBadge(this.comboCounter);
            } else {
                this.audio.playMatch();
            }

            let multiplier = 1.0;
            if (this.comboCounter === 2) multiplier = 1.2;
            else if (this.comboCounter === 3) multiplier = 1.5;
            else if (this.comboCounter >= 4) multiplier = 2.0;

            let uniqueTypes = new Set(matchGroups.map(g => g.type.id));
            if (uniqueTypes.size >= 2) {
                multiplier *= 1.5; 
                this.gameState.showFloatingText('多色連攜 1.5x!', '#9b59b6', document.getElementById('grid-container'));
            }

            let initialDestroy = new Set();
            let cellsToUpgrade = new Map();
            
            if (colorBombColor && colorBombCell) {
                const [r, c] = colorBombCell.split(',').map(Number);
                this.playPropAnimation(r, c, 'color', null);
                initialDestroy.add(colorBombCell);
                // 清除黑洞的 propType，避免在後續連鎖迴圈中再次觸發隨機消除
                this.grid[r][c].propType = null;
                for (let r=0; r<this.rows; r++) {
                    for (let c=0; c<this.cols; c++) {
                        if (this.grid[r][c].isPlayable && this.grid[r][c].type?.id === colorBombColor.id) {
                            initialDestroy.add(`${r},${c}`);
                            this.playBlackHoleSuck(r, c);
                        }
                    }
                }
            }

            let newlyDiscoveredProps = new Set();
            matchGroups.forEach(group => {
                let centerStr;
                
                if (group.hasH && group.hasV) {
                    let bestCell = null;
                    let maxScore = 0;
                    group.cells.forEach(c1 => {
                        const [r1, c1_col] = c1.split(',').map(Number);
                        let hCount = 0; let vCount = 0;
                        group.cells.forEach(c2 => {
                            const [r2, c2_col] = c2.split(',').map(Number);
                            if (r1 === r2) hCount++;
                            if (c1_col === c2_col) vCount++;
                        });
                        if (hCount * vCount > maxScore) {
                            maxScore = hCount * vCount;
                            bestCell = c1;
                        }
                    });
                    centerStr = bestCell;
                } else if (swapR !== undefined && swapC !== undefined && group.cells.has(`${swapR},${swapC}`)) {
                    centerStr = `${swapR},${swapC}`;
                } else {
                    centerStr = Array.from(group.cells)[Math.floor(group.cells.size / 2)];
                }
                
                let [cr, cc] = centerStr.split(',').map(Number);

                let spawnProp = null;
                if (group.maxLen >= 5) {
                    spawnProp = 'color';
                } else if (group.hasH && group.hasV) {
                    spawnProp = 'cross';
                } else if (group.maxLen === 4) {
                    let isHoriz = false;
                    Array.from(group.cells).forEach(cStr => {
                        const [r, c] = cStr.split(',').map(Number);
                        if (r === cr && c !== cc) isHoriz = true;
                    });
                    spawnProp = isHoriz ? 'line_v' : 'line_h'; 
                }
                
                if (spawnProp) {
                    newlyDiscoveredProps.add(spawnProp);
                }
                
                group.cells.forEach(c => {
                    if (c === centerStr && spawnProp) {
                        cellsToUpgrade.set(c, spawnProp);
                    } else {
                        initialDestroy.add(c);
                    }
                });
            });

            let resolved = new Set();
            let queue = new Set(initialDestroy);
            
            while(queue.size > 0) {
                let newlyAdded = new Set();
                queue.forEach(cStr => {
                    if (resolved.has(cStr)) return;
                    resolved.add(cStr);
                    
                    const [r, c] = cStr.split(',').map(Number);
                    const block = this.grid[r][c];
                    if (!block || !block.type) return;
                    
                    if (block.propType) {
                        this.playPropAnimation(r, c, block.propType, block.type.color);
                    }
                    
                    if (block.propType === 'line_h') {
                        for (let i=0; i<this.cols; i++) if (this.grid[r][i].isPlayable && this.grid[r][i].type) newlyAdded.add(`${r},${i}`);
                    } else if (block.propType === 'line_v') {
                        for (let i=0; i<this.rows; i++) if (this.grid[i][c].isPlayable && this.grid[i][c].type) newlyAdded.add(`${i},${c}`);
                    } else if (block.propType === 'cross') {
                        for (let ir=r-1; ir<=r+1; ir++) {
                            for (let ic=c-1; ic<=c+1; ic++) {
                                if (ir>=0 && ir<this.rows && ic>=0 && ic<this.cols && this.grid[ir][ic].isPlayable && this.grid[ir][ic].type) {
                                    newlyAdded.add(`${ir},${ic}`);
                                }
                            }
                        }
                    } else if (block.propType === 'color') {
                        const randomType = this.getRandomType();
                        for (let ir=0; ir<this.rows; ir++) {
                            for (let ic=0; ic<this.cols; ic++) {
                                if (this.grid[ir][ic].isPlayable && this.grid[ir][ic].type?.id === randomType.id) {
                                    newlyAdded.add(`${ir},${ic}`);
                                    this.playBlackHoleSuck(ir, ic);
                                }
                            }
                        }
                    }
                });
                
                queue = new Set([...newlyAdded].filter(x => !resolved.has(x)));
            }

            cellsToUpgrade.forEach((prop, cStr) => {
                if (resolved.has(cStr)) cellsToUpgrade.delete(cStr);
            });

            let totalDamage = 0;
            let totalHeal = 0;
            let teaCount = 0;
            let stunCount = 0; // PHONE 方塊計數
            
            resolved.forEach(str => {
                const [r, c] = str.split(',').map(Number);
                const block = this.grid[r][c];
                if (!block || !block.type) return;
                
                this.spawnProjectile(r, c, block.type);
                
                if (['attack', 'heavy', 'poison'].includes(block.type.type)) {
                    totalDamage += block.type.dmg;
                } else if (block.type.type === 'heal') {
                    teaCount++;
                } else if (block.type.type === 'stun') {
                    totalDamage += block.type.dmg;
                    stunCount++;
                } else if (block.type.type === 'armor_break') {
                    this.gameState.bossArmorBreak = true;
                    this.gameState.updateUI();
                } else if (block.type.type === 'delay') {
                    totalDamage += block.type.dmg;
                    this.gameState.bossTimer++; // 延長 Boss 攻擊倒數
                    this.gameState.updateUI();
                } else if (block.type.type === 'buff') {
                    totalDamage += block.type.dmg;
                    totalHeal += 5; // 同時造成大傷害與回血
                }

                if (block.blockDom) {
                    const domToRemove = block.blockDom;
                    const rect = domToRemove.getBoundingClientRect();
                    this.createExplosion(rect, block.propType === 'color' ? '#fff' : block.type.color);
                    
                    domToRemove.style.transition = 'none'; 
                    domToRemove.classList.add('block-pop');
                    
                    setTimeout(() => {
                        if (domToRemove && domToRemove.parentNode) {
                            domToRemove.parentNode.removeChild(domToRemove);
                        }
                    }, 250);
                }
                block.type = null;
                block.propType = null;
                block.blockDom = null; 
            });

            cellsToUpgrade.forEach((prop, cStr) => {
                const [r, c] = cStr.split(',').map(Number);
                this.grid[r][c].propType = prop;
                this.updateBlockVisual(this.grid[r][c].blockDom, this.grid[r][c].type, prop, this.grid[r][c].bombTimer);
                
                if (this.grid[r][c].blockDom) {
                    this.grid[r][c].blockDom.style.transition = 'transform 0.2s';
                    this.grid[r][c].blockDom.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        if (this.grid[r][c].blockDom) this.grid[r][c].blockDom.style.transform = 'scale(1)';
                    }, 200);
                }
            });

            // Show dynamic tutorials for newly discovered props
            if (newlyDiscoveredProps.size > 0) {
                let saveObj = JSON.parse(localStorage.getItem('office_worker_save') || '{}');
                let seenProps = saveObj.seenProps || [];
                let propsToShow = [];
                
                newlyDiscoveredProps.forEach(p => {
                    if (!seenProps.includes(p)) {
                        propsToShow.push(p);
                        seenProps.push(p);
                    }
                });

                if (propsToShow.length > 0) {
                    saveObj.seenProps = seenProps;
                    localStorage.setItem('office_worker_save', JSON.stringify(saveObj));
                    
                    const dialogues = propsToShow.map(p => {
                        const info = PROP_TUTORIALS[p];
                        return {
                            name: "系統提示",
                            avatar: "⚠️",
                            text: `<div class='tutorial-box'><div class='tutorial-block-demo' style='background: ${info.color}; font-size: 20px;'><i class='fa-solid ${info.icon}'></i></div><div class='tutorial-desc'><strong>特殊合成：${info.name}</strong><br>${info.desc}</div></div>`
                        };
                    });
                    
                    await new Promise(resolve => {
                        this.gameState.dialogManager.show(dialogues, resolve);
                    });
                }
            }

            if (teaCount > 0) {
                if (teaCount < 3) {
                    totalHeal += teaCount * (this.gameState.bossAtk / 9);
                } else {
                    totalHeal += ((teaCount - 2) / 3) * this.gameState.bossAtk;
                }
            }

            totalDamage = totalDamage * this.gameState.playerAtkMultiplier;

            if (totalDamage > 0) {
                this.gameState.applyDamage(Math.floor(totalDamage * multiplier));
            }
            if (totalHeal > 0) {
                this.gameState.applyHeal(Math.floor(totalHeal * multiplier));
            }
            // PHONE 暈眩：3 顆 +1，每多 1 顆再 +1，同回合上限 +5
            if (stunCount >= 3) {
                let stunToAdd = Math.min(stunCount - 2, 5 - this.stunThisTurn);
                if (stunToAdd > 0) {
                    this.stunThisTurn += stunToAdd;
                    this.gameState.bossTimer += stunToAdd;
                    this.gameState.showFloatingText(`+${stunToAdd} 倒數`, '#ffa502', document.querySelector('.boss-timer'));
                    this.gameState.updateUI();
                }
            }

            if (this.comboCounter > 1 && totalDamage > 0) {
                this.updateComboBadge(this.comboCounter);
            }

            let delayBeforeGravity = 250;
            if (colorBombColor && colorBombCell) {
                delayBeforeGravity = 800;
            }
            await new Promise(r => setTimeout(r, delayBeforeGravity));

            await this.applyGravityAndRefill();
            
            const nextGroups = this.checkMatches();
            if (nextGroups.length > 0 && this.gameState.bossHp > 0) {
                await this.processMatches(nextGroups);
            } else {
                if (this.gameState.bossHp > 0 && this.gameState.playerHp > 0) {
                    if (!this.hasPossibleMoves()) {
                        await this.shuffleBoard();
                    }
                }
            }
        } catch (error) {
            console.error("MatchEngine Error:", error);
            alert("Oops! 發生了錯誤：\n" + error.message);
        } finally {
            this.isProcessing = false;
            if (this._safetyTimer) clearTimeout(this._safetyTimer);
            this.resetHintTimer();
            // Combo 結束時移除徽章
            if (this.comboCounter > 1) {
                setTimeout(() => this.removeComoBadge(), 800);
            }
        }
    }



    tickBombs() {
        let exploded = false;
        for(let r=0; r<this.rows; r++){
            for(let c=0; c<this.cols; c++){
                if(this.grid[r][c].isPlayable && this.grid[r][c].bombTimer > 0) {
                    this.grid[r][c].bombTimer--;
                    if(this.grid[r][c].bombTimer === 0) {
                        // Explode
                        this.gameState.playerHp = Math.max(0, this.gameState.playerHp - 15);
                        this.gameState.showFloatingText("-15 甩鍋引爆!", "#ff4757", document.querySelector('.player-avatar').parentElement);
                        document.getElementById('game-container').classList.add('shake');
                        setTimeout(() => document.getElementById('game-container').classList.remove('shake'), 300);
                        this.audio.playDamage();
                        
                        this.grid[r][c].type = null;
                        this.grid[r][c].propType = null;
                        this.grid[r][c].bombTimer = 0;
                        if(this.grid[r][c].blockDom) {
                            this.grid[r][c].blockDom.remove();
                            this.grid[r][c].blockDom = null;
                        }
                        exploded = true;
                    } else {
                        // Update visual
                        this.updateBlockVisual(this.grid[r][c].blockDom, this.grid[r][c].type, this.grid[r][c].propType, this.grid[r][c].bombTimer);
                    }
                }
            }
        }
        if(exploded) {
            this.gameState.updateUI();
            if (this.gameState.playerHp <= 0) {
                setTimeout(() => {
                    const gameOverOverlay = document.getElementById('game-over-overlay');
                    if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
                }, 500);
            }
            // Need gravity
            setTimeout(() => this.applyGravityAndRefill(), 500);
        }
    }

    triggerBossHellModeSkills() {
        let saveObj = JSON.parse(localStorage.getItem('office_worker_save') || '{}');
        if ((saveObj.playthrough || 1) <= 1) return; // Only trigger in NG+

        // Trigger randomly (e.g. 15% chance every move)
        if (Math.random() < 0.15) {
            let emptySpots = [];
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.grid[r][c].isPlayable && !this.grid[r][c].propType) {
                        emptySpots.push({r, c});
                    }
                }
            }
            if (emptySpots.length > 0) {
                // Randomly pick a skill: Paper Jam
                let spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
                this.grid[spot.r][spot.c].propType = 'obstacle_jam';
                this.updateBlockVisual(this.grid[spot.r][spot.c].blockDom, this.grid[spot.r][spot.c].type, 'obstacle_jam', this.grid[spot.r][spot.c].bombTimer);
                this.gameState.showFloatingText('Boss 惡意干擾!', '#ff4757', this.grid[spot.r][spot.c].dom);
                
                // Jiggle animation
                const dom = this.grid[spot.r][spot.c].blockDom;
                if(dom) {
                    dom.style.transform = 'scale(1.2)';
                    setTimeout(() => dom.style.transform = 'scale(1)', 200);
                }
            }
        }
    }

    async applyGravityAndRefill() {
        let dropsOccurred = false;

        for (let c = 0; c < this.cols; c++) {
            const existingBlocks = [];
            const playableCells = [];
            
            for (let r = 0; r < this.rows; r++) {
                if (this.grid[r][c].isPlayable) {
                    playableCells.push(r);
                    if (this.grid[r][c].type !== null) {
                        existingBlocks.push({
                            type: this.grid[r][c].type,
                            propType: this.grid[r][c].propType,
                            blockDom: this.grid[r][c].blockDom,
                            oldR: r
                        });
                    }
                    this.grid[r][c].type = null;
                    this.grid[r][c].propType = null;
                    this.grid[r][c].bombTimer = 0;
                    this.grid[r][c].blockDom = null;
                }
            }

            const emptyCount = playableCells.length - existingBlocks.length;
            
            for (let i = 0; i < existingBlocks.length; i++) {
                const targetR = playableCells[emptyCount + i];
                const blockObj = existingBlocks[i];
                
                const targetBlock = this.grid[targetR][c];
                targetBlock.type = blockObj.type;
                targetBlock.propType = blockObj.propType;
                targetBlock.blockDom = blockObj.blockDom;
                
                const dom = targetBlock.blockDom;
                if (dom) {
                    const oldRect = this.grid[blockObj.oldR][c].dom.getBoundingClientRect();
                    const newRect = targetBlock.dom.getBoundingClientRect();
                    
                    if (blockObj.oldR !== targetR) {
                        dropsOccurred = true;
                        targetBlock.dom.appendChild(dom);
                        
                        const dy = oldRect.top - newRect.top; 
                        dom.style.transition = 'none';
                        dom.style.transform = `translate(0px, ${dy}px)`;
                        dom.offsetHeight; 
                        
                        dom.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        dom.style.transform = 'translate(0px, 0px)';
                    } else {
                        targetBlock.dom.appendChild(dom);
                    }
                }
            }
            
            for (let i = 0; i < emptyCount; i++) {
                dropsOccurred = true;
                const targetR = playableCells[i];
                
                const type = this.getRandomType();
                this.grid[targetR][c].type = type;
                this.grid[targetR][c].propType = null;
                this.createBlockDom(targetR, c, type, null);
                
                const newDom = this.grid[targetR][c].blockDom;
                if (newDom) {
                    const rect = this.grid[targetR][c].dom.getBoundingClientRect();
                    newDom.style.transition = 'none';
                    newDom.style.transform = `translateY(-${rect.height * emptyCount + 100}px)`;
                    newDom.offsetHeight; 
                    
                    newDom.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    newDom.style.transform = 'translateY(0px)';
                }
            }
        }
        
        if (dropsOccurred) {
            this.audio.playDrop();
            await new Promise(r => setTimeout(r, 400));
        }
    }

    hasPossibleMoves() {
        return this.getPossibleMove() !== null;
    }

    getPossibleMove() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.grid[r][c].isPlayable || !this.grid[r][c].type) continue;
                
                // Color bomb is always movable if there's a playable block adjacent
                if (this.grid[r][c].propType === 'color') {
                    if (c+1 < this.cols && this.grid[r][c+1].isPlayable) return {r1:r, c1:c, r2:r, c2:c+1};
                    if (r+1 < this.rows && this.grid[r+1][c].isPlayable) return {r1:r, c1:c, r2:r+1, c2:c};
                }
                
                if (c + 1 < this.cols && this.grid[r][c+1].isPlayable && this.grid[r][c+1].type) {
                    this.simulateSwap(r, c, r, c+1);
                    const matches = this.checkMatches();
                    this.simulateSwap(r, c, r, c+1); 
                    if (matches.length > 0) return {r1:r, c1:c, r2:r, c2:c+1};
                }
                
                if (r + 1 < this.rows && this.grid[r+1][c].isPlayable && this.grid[r+1][c].type) {
                    this.simulateSwap(r, c, r+1, c);
                    const matches = this.checkMatches();
                    this.simulateSwap(r, c, r+1, c); 
                    if (matches.length > 0) return {r1:r, c1:c, r2:r+1, c2:c};
                }
            }
        }
        return null;
    }

    resetHintTimer() {
        if (this.hintTimer) clearTimeout(this.hintTimer);
        this.clearHints();
        this.hintTimer = setTimeout(() => this.showHint(), 5000); // 5 seconds
    }

    clearHints() {
        if (!this.grid || this.grid.length === 0) return;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r] && this.grid[r][c] && this.grid[r][c].blockDom) {
                    this.grid[r][c].blockDom.classList.remove('hint-active');
                }
            }
        }
    }

    updateComboBadge(count) {
        let badge = document.getElementById('combo-badge');
        const bossAvatar = document.querySelector('.boss-avatar');
        if (!bossAvatar) return;

        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'combo-badge';
            badge.className = 'combo-badge';
            bossAvatar.parentElement.style.position = 'relative';
            bossAvatar.parentElement.appendChild(badge);
        }

        badge.innerHTML = `<span class="combo-count">${count}</span> COMBO!`;

        // 每次更新時播放彈跳動畫
        badge.style.animation = 'none';
        void badge.offsetWidth;
        badge.style.animation = '';

        // Boss 頭像加上受壓效果
        bossAvatar.classList.add('combo-pressure');
    }

    removeComoBadge() {
        const badge = document.getElementById('combo-badge');
        if (badge) {
            badge.style.transition = 'opacity 0.4s, transform 0.4s';
            badge.style.opacity = '0';
            badge.style.transform = 'scale(1.3) rotate(5deg)';
            setTimeout(() => { if (badge.parentNode) badge.remove(); }, 400);
        }
        const bossAvatar = document.querySelector('.boss-avatar');
        if (bossAvatar) bossAvatar.classList.remove('combo-pressure');
    }

    showHint() {
        if (this.isProcessing) {
            this.resetHintTimer();
            return;
        }
        const move = this.getPossibleMove();
        if (move) {
            const {r1, c1, r2, c2} = move;
            if (this.grid[r1][c1].blockDom) this.grid[r1][c1].blockDom.classList.add('hint-active');
            if (this.grid[r2][c2].blockDom) this.grid[r2][c2].blockDom.classList.add('hint-active');
        }
    }

    simulateSwap(r1, c1, r2, c2) {
        const tempType = this.grid[r1][c1].type;
        this.grid[r1][c1].type = this.grid[r2][c2].type;
        this.grid[r2][c2].type = tempType;
        
        const tempProp = this.grid[r1][c1].propType;
        this.grid[r1][c1].propType = this.grid[r2][c2].propType;
        this.grid[r2][c2].propType = tempProp;
    }

    async shuffleBoard() {
        this.isProcessing = true;
        this.gameState.showFloatingText('盤面無解，洗牌！', '#3498db', document.getElementById('grid-container'));
        
        await new Promise(res => setTimeout(res, 1000));
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isPlayable && this.grid[r][c].blockDom) {
                    this.grid[r][c].blockDom.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    this.grid[r][c].blockDom.style.transform = 'scale(0)';
                }
            }
        }
        
        await new Promise(res => setTimeout(res, 350));
        
        let existingBlocks = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isPlayable && this.grid[r][c].type) {
                    existingBlocks.push({ type: this.grid[r][c].type, propType: this.grid[r][c].propType });
                }
            }
        }

        let attempts = 0;
        let validShuffleFound = false;

        while (attempts < 100) {
            attempts++;
            for (let i = existingBlocks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [existingBlocks[i], existingBlocks[j]] = [existingBlocks[j], existingBlocks[i]];
            }
            
            let idx = 0;
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.grid[r][c].isPlayable && this.grid[r][c].type) {
                        this.grid[r][c].type = existingBlocks[idx].type;
                        this.grid[r][c].propType = existingBlocks[idx].propType;
                        idx++;
                    }
                }
            }

            if (this.checkMatches().length === 0 && this.hasPossibleMoves()) {
                validShuffleFound = true;
                break;
            }
        }

        if (!validShuffleFound) {
            let fillAttempts = 0;
            do {
                this.fillRandomTypesWithoutMatches();
                fillAttempts++;
                if (fillAttempts > 200) {
                    console.warn('shuffleBoard: 無法產生有效盤面，強制繼續');
                    break;
                }
            } while (!this.hasPossibleMoves());
        }
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isPlayable && this.grid[r][c].blockDom) {
                    const blockObj = this.grid[r][c];
                    this.updateBlockVisual(blockObj.blockDom, blockObj.type, blockObj.propType, blockObj.bombTimer);
                    blockObj.blockDom.style.transform = 'scale(1)';
                }
            }
        }
        
        await new Promise(res => setTimeout(res, 350));
        this.isProcessing = false;
    }

    spawnProjectile(r, c, type) {
        if (!type) return;
        const cellDom = this.grid[r][c].dom;
        if (!cellDom) return;
        
        const rect = cellDom.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        projectile.innerHTML = type.id; 
        projectile.style.background = type.color;
        
        let targetSelector = '.boss-avatar';
        // 如果是回血道具，飛向玩家
        if (type.type === 'heal') targetSelector = '.player-avatar';
        // 如果是延遲，可以飛向倒數計時器
        if (type.type === 'delay') targetSelector = '.boss-timer';
        
        const targetDom = document.querySelector(targetSelector);
        if (!targetDom) return;

        const targetRect = targetDom.getBoundingClientRect();
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;

        projectile.style.left = `${startX}px`;
        projectile.style.top = `${startY}px`;

        document.body.appendChild(projectile);

        // trigger reflow
        void projectile.offsetWidth;

        projectile.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.6)`;
        projectile.style.opacity = '0';

        setTimeout(() => {
            if (projectile.parentNode) projectile.parentNode.removeChild(projectile);
        }, 500);
    }

    createExplosion(rect, color) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '12px';
            particle.style.height = '12px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '100';
            
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            particle.style.left = `${cx - 6}px`;
            particle.style.top = `${cy - 6}px`;
            
            document.body.appendChild(particle);
            
            particle.offsetHeight; 
            
            const tx = (Math.random() - 0.5) * 80;
            const ty = (Math.random() - 0.5) * 80;
            
            particle.style.transition = 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            particle.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
            particle.style.opacity = '0';
            
            setTimeout(() => {
                if (particle.parentNode) particle.parentNode.removeChild(particle);
            }, 350);
        }
    }

    playPropAnimation(r, c, propType, color) {
        const cellDom = this.grid[r][c].dom;
        const rect = cellDom.getBoundingClientRect();
        
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const animLayer = document.createElement('div');
        animLayer.style.position = 'absolute';
        animLayer.style.pointerEvents = 'none';
        animLayer.style.zIndex = '2147483647'; 
        
        if (propType === 'line_h') {
            animLayer.className = 'prop-line-h';
            animLayer.style.width = '100vw';
            animLayer.style.height = `${rect.height * 1.2}px`;
            animLayer.style.left = '0px';
            animLayer.style.top = `${cy - (rect.height * 1.2) / 2}px`;
            animLayer.style.backgroundColor = color || '#f1c40f';
            animLayer.style.boxShadow = `0 0 30px ${color || '#f1c40f'}, inset 0 0 15px #fff`;
            document.body.appendChild(animLayer);
            setTimeout(() => { if (animLayer.parentNode) animLayer.parentNode.removeChild(animLayer) }, 500);
            
        } else if (propType === 'line_v') {
            animLayer.className = 'prop-line-v';
            animLayer.style.height = '100vh';
            animLayer.style.width = `${rect.width * 1.2}px`;
            animLayer.style.top = '0px';
            animLayer.style.left = `${cx - (rect.width * 1.2) / 2}px`;
            animLayer.style.backgroundColor = color || '#f1c40f';
            animLayer.style.boxShadow = `0 0 30px ${color || '#f1c40f'}, inset 0 0 15px #fff`;
            document.body.appendChild(animLayer);
            setTimeout(() => { if (animLayer.parentNode) animLayer.parentNode.removeChild(animLayer) }, 500);
            
        } else if (propType === 'cross') {
            animLayer.className = 'prop-cross';
            animLayer.style.width = `${rect.width * 4}px`;
            animLayer.style.height = `${rect.height * 4}px`;
            animLayer.style.left = `${cx - rect.width * 2}px`;
            animLayer.style.top = `${cy - rect.height * 2}px`;
            animLayer.style.border = `10px solid ${color || '#e74c3c'}`;
            animLayer.style.backgroundColor = 'rgba(255,255,255,0.6)';
            animLayer.style.borderRadius = '40px';
            animLayer.style.boxShadow = `0 0 40px ${color || '#e74c3c'}, inset 0 0 20px ${color || '#e74c3c'}`;
            document.body.appendChild(animLayer);
            setTimeout(() => { if (animLayer.parentNode) animLayer.parentNode.removeChild(animLayer) }, 600);
            
        } else if (propType === 'color') {
            // 不再使用全畫面反白
        }
    }

    playBlackHoleSuck(r, c) {
        if (!this.grid[r] || !this.grid[r][c] || !this.grid[r][c].dom) return;
        const cellDom = this.grid[r][c].dom;
        const rect = cellDom.getBoundingClientRect();
        
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = `${rect.left + rect.width / 2 - 13}px`; 
        container.style.top = `${rect.top + rect.height / 2 - 13}px`;
        container.style.zIndex = '0'; 
        container.style.transition = 'transform 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
        container.style.pointerEvents = 'none';
        
        const hole = document.createElement('div');
        hole.className = 'black-hole-icon';
        hole.innerHTML = '🌀';
        
        container.appendChild(hole);
        document.body.appendChild(container);
        
        void container.offsetWidth;
        container.style.transform = 'scale(1.2)'; // 稍微放大一點點增加吸入感
        
        setTimeout(() => {
            container.style.transform = 'scale(0)';
        }, 300);
        
        setTimeout(() => {
            if (container.parentNode) container.parentNode.removeChild(container);
        }, 800);
    }

    playGiantBlackHole() {
        const rect = this.container.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = `${rect.left + rect.width / 2 - size / 2}px`; 
        container.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
        container.style.width = `${size}px`;
        container.style.height = `${size}px`;
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '2147483647';
        container.style.transition = 'transform 1s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
        container.style.pointerEvents = 'none';
        
        const hole = document.createElement('div');
        hole.className = 'black-hole-icon';
        hole.innerHTML = '🌀';
        hole.style.fontSize = `${size * 0.8}px`;
        
        container.appendChild(hole);
        document.body.appendChild(container);
        
        void container.offsetWidth;
        
        container.style.transform = 'scale(0)';
        
        setTimeout(() => {
            if (container.parentNode) container.parentNode.removeChild(container);
        }, 1000);
    }

    spawnTestProps() {
        const props = ['line_h', 'line_v', 'cross', 'color'];
        // 為了方便測試，將四種道具直接生成在盤面中間
        const positions = [
            [Math.floor(this.rows/2), Math.floor(this.cols/2) - 2],
            [Math.floor(this.rows/2), Math.floor(this.cols/2) - 1],
            [Math.floor(this.rows/2), Math.floor(this.cols/2)],
            [Math.floor(this.rows/2), Math.floor(this.cols/2) + 1]
        ];
        
        for (let i = 0; i < props.length; i++) {
            const pos = positions[i];
            if (pos && this.grid[pos[0]] && this.grid[pos[0]][pos[1]]) {
                const r = pos[0];
                const c = pos[1];
                this.grid[r][c].propType = props[i];
                this.updateBlockVisual(this.grid[r][c].blockDom, this.grid[r][c].type, props[i], this.grid[r][c].bombTimer);
            }
        }
    }

    destroy() {
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
    }

    getRandomType() {
        if (!this.spawnPool) {
            this.spawnPool = [];
            this.allowedBlockTypes.forEach(type => {
                if (type.id === '🧋') {
                    this.spawnPool.push(type); 
                } else {
                    this.spawnPool.push(type);
                    this.spawnPool.push(type); // 非珍奶的機率是 2 倍，等於珍奶出現比例減半
                }
            });
        }
        return this.spawnPool[Math.floor(Math.random() * this.spawnPool.length)];
    }
}

const audioManager = new AudioManager();
const dialogManager = new DialogManager();
let currentEngine = null;

// Tutorial definitions for each block type (beyond the starting MAIL & PPT)
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

function buildTutorialHtml(key) {
    const t = BLOCK_TUTORIALS[key];
    if (!t) return '';
    return `<div class='tutorial-box'><div class='tutorial-block-demo' style='background: ${t.color};'><i class='fa-solid ${t.icon}'></i></div><div class='tutorial-desc'><strong>新方塊解鎖：${t.name}</strong><br>${t.desc}</div></div>`;
}

function startGame(levelData) {
    // Compute actual allowed blocks (same logic as MatchEngine constructor)
    let actualBlocks = [...levelData.allowedBlocks];
    let saveObj = JSON.parse(localStorage.getItem('office_worker_save') || '{}');
    const pt = saveObj.playthrough || 1;
    if (pt === 1 && actualBlocks.length > 4) {
        actualBlocks.pop();
    }

    // Check which blocks are new (not yet seen by this player)
    const seenTutorials = saveObj.seenTutorials || ['MAIL', 'PPT'];
    const newBlocks = actualBlocks.filter(k => !seenTutorials.includes(k));

    // Build dialogue list: original dialogues + dynamic tutorials
    let dialogues = [...levelData.dialogues.start];
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
        localStorage.setItem('office_worker_save', JSON.stringify(saveObj));
    }

    dialogManager.show(dialogues, () => {
        if (currentEngine) {
            window.removeEventListener('resize', currentEngine.resizeHandler);
            if (typeof currentEngine.destroy === 'function') {
                currentEngine.destroy();
            }
        }

        const gameState = new GameState(levelData, audioManager);
        gameState.dialogManager = dialogManager;
        gameState.init();
        
        currentEngine = new MatchEngine('grid-container', gameState, levelData, audioManager);
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
        const saveRaw = localStorage.getItem('office_worker_save');
        if (saveRaw) saveObj = JSON.parse(saveRaw);
    } catch (e) {
        console.error("讀取存檔失敗", e);
    }
    
    const introSeen = saveObj.introSeen === true;
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.has('test');
    
    const introComic = document.getElementById('intro-comic');
    const appContainer = document.getElementById('game-container');
    
    if (!introSeen && introComic && !isTestMode) {
        // game-container and intro-comic visibility is handled by index.html script initially
        let currentPanel = 1;
        const nextBtn = document.getElementById('next-comic-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const prev = document.getElementById(`panel-${currentPanel}`);
                if (prev) prev.classList.add('hidden');
                
                currentPanel++;
                
                if (currentPanel > 4) {
                    // Save to JSON
                    saveObj.introSeen = true;
                    localStorage.setItem('office_worker_save', JSON.stringify(saveObj));
                    
                    introComic.style.opacity = '0';
                    setTimeout(() => {
                        introComic.classList.add('hidden');
                        introComic.classList.add('initial-hidden');
                        if (appContainer) appContainer.classList.remove('initial-hidden');
                        initGame(saveObj);
                    }, 1000);
                } else {
                    const next = document.getElementById(`panel-${currentPanel}`);
                    if (next) next.classList.remove('hidden');
                    
                    if (currentPanel === 4) {
                        nextBtn.innerHTML = '開始反擊！ <i class="fa-solid fa-fire"></i>';
                    }
                }
            });
        } else {
            initGame(saveObj);
        }
    } else {
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
                const saveRaw = localStorage.getItem('office_worker_save');
                if (saveRaw) saveObj = JSON.parse(saveRaw);
            } catch (e) {}
            
            initGame(saveObj);
        });
    }
});
