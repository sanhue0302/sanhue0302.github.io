class GameState {
    constructor(levelData, audioManager) {
        this.currentLevel = levelData;
        this.audio = audioManager;
        // 根據關卡進度動態提升血量上限 (每關 +5 HP)
        // 若為測試關卡 (ID >= 96)，則以最後一關(95)來計算，約 570 HP
        const effectiveLevel = levelData.isTest ? (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.maxLevel ? GAME_CONFIG.maxLevel : 95) : levelData.id;
        const maxHp = 100 + (effectiveLevel - 1) * 5;
        this.playerAtkMultiplier = 1 + (effectiveLevel - 1) * 0.25;
        
        this.playerHp = maxHp;
        this.playerMaxHp = maxHp;
        
        let saveObj = {};
        try {
            saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
        } catch (e) {}
        const pt = saveObj.playthrough || 1;
        const scaling = GAME_CONFIG.enableNGPlus ? GAME_CONFIG.difficultyScaling : 0;
        const difficultyMultiplier = 1 + (pt - 1) * scaling; 
        
        this.bossHp = Math.ceil(levelData.bossHp * difficultyMultiplier); 
        this.bossMaxHp = this.bossHp;
        this.bossAtk = Math.ceil(levelData.bossAtk * difficultyMultiplier);
        this.bossTimer = levelData.bossMaxTimer;
        this.bossMaxTimer = levelData.bossMaxTimer;
        
        this.bossArmorBreak = false; 
        this.dialogManager = null;

        // 初始化部屬系統
        this.subordinates = [];
        if (typeof SUBORDINATES_CONFIG !== 'undefined') {
            this.subordinates = SUBORDINATES_CONFIG.filter(sub => effectiveLevel >= sub.unlockLevel).map(sub => ({ ...sub }));
        }
    }

    init() {
        const chapter = GAME_CONFIG.getChapterByLevel ? GAME_CONFIG.getChapterByLevel(this.currentLevel.id) : 1;

        const playerAvatarImg = document.querySelector('.player-avatar');
        if (playerAvatarImg) {
            let playerSeed = GAME_CONFIG.getPlayerAvatarSeed ? GAME_CONFIG.getPlayerAvatarSeed(chapter) : "Rookie";
            
            // 使用 notionists 風格
            playerAvatarImg.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${playerSeed}&backgroundColor=transparent`;
        }

        const bossAvatarImg = document.querySelector('.boss-avatar');
        if (bossAvatarImg) {
            const seed = encodeURIComponent(this.currentLevel.bossName);
            bossAvatarImg.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`;
        }
        
        const titleDom = document.getElementById('level-title');
        if (titleDom) {
            let saveObj = {};
            try {
                saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
            } catch (e) {}
            const pt = saveObj.playthrough || 1;
            if (pt >= 2) {
                titleDom.innerText = `[${pt}周目] ${this.currentLevel.title}`;
            } else {
                titleDom.innerText = this.currentLevel.title;
            }
        }
        
        const bossNameDom = document.getElementById('boss-name-display');
        if (bossNameDom) bossNameDom.innerText = this.currentLevel.bossName;
        
        const combatUi = document.getElementById('combat-ui');
        if (combatUi && GAME_CONFIG.getBackgroundUrl) {
            combatUi.style.backgroundImage = GAME_CONFIG.getBackgroundUrl(chapter);
        }

        const subUi = document.getElementById('subordinates-ui');
        if (this.subordinates.length > 0) {
            if (subUi) subUi.classList.remove('hidden');
            this.updateSubordinatesUI();
        } else {
            if (subUi) subUi.classList.add('hidden');
        }

        this.updateUI();
    }

    updateSubordinatesUI() {
        this.subordinates.forEach(sub => {
            const wrapDom = document.getElementById(`sub-${sub.id}-wrap`);
            const cdDom = document.getElementById(`sub-${sub.id}-cd`);
            const readyDom = document.getElementById(`sub-${sub.id}-ready`);

            if (wrapDom) {
                const percentage = Math.min(100, (sub.charge / sub.maxCharge) * 100);
                wrapDom.style.setProperty('--progress', `${percentage}%`);
                if (sub.ready) {
                    wrapDom.classList.add('ready');
                    readyDom.classList.remove('hidden');
                } else {
                    wrapDom.classList.remove('ready');
                    readyDom.classList.add('hidden');
                }
            }
            if (cdDom) {
                if (sub.locked > 0) {
                    cdDom.classList.remove('hidden');
                    cdDom.innerHTML = `<i class="fa-solid fa-lock"></i>`;
                } else {
                    cdDom.classList.add('hidden');
                }
            }
        });
    }

    chargeSubordinates(blockTypeObj) {
        if (this.subordinates.length === 0) return;
        let updated = false;
        this.subordinates.forEach(sub => {
            if (sub.locked > 0) return;
            if (BLOCK_TYPES[sub.color] === blockTypeObj && !sub.ready) {
                sub.charge += 1;
                if (sub.charge >= sub.maxCharge) {
                    sub.charge = sub.maxCharge;
                    sub.ready = true;
                    this.showFloatingText('技能就緒!', '#f1c40f', document.getElementById(`sub-${sub.id}-wrap`));
                    this.audio.playHeal(); // reuse sound
                }
                updated = true;
            }
        });
        if (updated) this.updateSubordinatesUI();
    }

    useSubordinateSkill(id) {
        if (this.bossHp <= 0 || this.playerHp <= 0) return;
        const sub = this.subordinates.find(s => s.id === id);
        if (!sub || !sub.ready || sub.locked > 0) return;

        // Reset
        sub.ready = false;
        sub.charge = 0;
        this.updateSubordinatesUI();

        // Effect
        if (sub.effect) {
            sub.effect(this, sub);
        }
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
                    const handleNextLevel = () => {
                        const nextLevelId = this.currentLevel.id + 1;
                        const nextLevel = LEVELS.find(l => l.id === nextLevelId);
                        
                        let saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
                        
                        if (nextLevel && !nextLevel.isTest) {
                            saveObj.currentLevelId = nextLevelId;
                            localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(saveObj));
                            startGame(nextLevel);
                        } else {
                            if (GAME_CONFIG.enableNGPlus) {
                                // Show custom awakening overlay reusing the promotion UI
                                const overlay = document.getElementById('promotion-overlay');
                                const titleDom = document.getElementById('promotion-title');
                                const badgeDom = document.getElementById('promotion-badge');
                                const storyDom = document.getElementById('promotion-story');
                                const nextBtn = document.getElementById('promotion-next-btn');

                                let pt = saveObj.playthrough || 1;
                                const config = PLAYTHROUGH_TEXTS.getAwakeningText(pt + 1);
                                titleDom.innerText = config.title;
                                badgeDom.innerText = config.badge;
                                storyDom.innerHTML = '';
                                nextBtn.innerHTML = config.btnText;
                                nextBtn.classList.add('hidden');
                                
                                overlay.classList.remove('hidden');

                                const storyText = config.story;
                                
                                let charIndex = 0;
                                const typeWriter = setInterval(() => {
                                    if (charIndex < storyText.length) {
                                        const char = storyText.charAt(charIndex);
                                        if (char === '\n') {
                                            storyDom.innerHTML += '<br>';
                                        } else {
                                            storyDom.innerHTML += char;
                                        }
                                        charIndex++;
                                    } else {
                                        clearInterval(typeWriter);
                                        nextBtn.classList.remove('hidden');
                                    }
                                }, 30);

                                nextBtn.onclick = () => {
                                    clearInterval(typeWriter);
                                    overlay.classList.add('hidden');
                                    
                                    let pt = saveObj.playthrough || 1;
                                    saveObj.playthrough = pt + 1;
                                    saveObj.currentLevelId = 1;
                                    localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(saveObj));
                                    location.reload();
                                };
                            } else {
                                // Game Clear scenario
                                const overlay = document.getElementById('promotion-overlay');
                                const titleDom = document.getElementById('promotion-title');
                                const badgeDom = document.getElementById('promotion-badge');
                                const storyDom = document.getElementById('promotion-story');
                                const nextBtn = document.getElementById('promotion-next-btn');

                                const config = PLAYTHROUGH_TEXTS.gameClearEnding;
                                titleDom.innerText = config.title;
                                badgeDom.innerText = config.badge;
                                storyDom.innerHTML = '';
                                nextBtn.innerHTML = config.btnText;
                                nextBtn.classList.add('hidden');
                                
                                overlay.classList.remove('hidden');

                                const storyText = config.story;
                                
                                let charIndex = 0;
                                const typeWriter = setInterval(() => {
                                    if (charIndex < storyText.length) {
                                        const char = storyText.charAt(charIndex);
                                        if (char === '\n') {
                                            storyDom.innerHTML += '<br>';
                                        } else {
                                            storyDom.innerHTML += char;
                                        }
                                        charIndex++;
                                    } else {
                                        clearInterval(typeWriter);
                                        nextBtn.classList.remove('hidden');
                                    }
                                }, 30);

                                nextBtn.onclick = () => {
                                    clearInterval(typeWriter);
                                    overlay.classList.add('hidden');
                                    location.reload();
                                };
                            }
                        }
                    };

                    if (this.currentLevel.systemPostWin) {
                        const overlay = document.getElementById('promotion-overlay');
                        const titleDom = document.getElementById('promotion-title');
                        const badgeDom = document.getElementById('promotion-badge');
                        const storyDom = document.getElementById('promotion-story');
                        const nextBtn = document.getElementById('promotion-next-btn');

                        titleDom.innerText = this.currentLevel.systemPostWin.title;
                        badgeDom.innerText = this.currentLevel.systemPostWin.badge;
                        storyDom.innerText = '';
                        nextBtn.classList.add('hidden');
                        
                        overlay.classList.remove('hidden');

                        const storyText = this.currentLevel.systemPostWin.story;
                        let charIndex = 0;
                        const typeWriter = setInterval(() => {
                            if (charIndex < storyText.length) {
                                storyDom.innerText += storyText.charAt(charIndex);
                                charIndex++;
                            } else {
                                clearInterval(typeWriter);
                                nextBtn.classList.remove('hidden');
                            }
                        }, 50);

                        nextBtn.onclick = () => {
                            clearInterval(typeWriter);
                            overlay.classList.add('hidden');
                            handleNextLevel();
                        };
                    } else {
                        handleNextLevel();
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

        // Reduce lock cooldown for subordinates
        let updatedSub = false;
        this.subordinates.forEach(sub => {
            if (sub.locked > 0) {
                sub.locked--;
                updatedSub = true;
            }
        });
        if (updatedSub) this.updateSubordinatesUI();

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

            // Boss 技能: 隨機鎖定部屬技能 (針對帶有特定 Boss 的關卡，簡單以機率或關卡判定)
            const lockProb = this.currentLevel.lockSubordinateProbability || 0.25;
            if (this.subordinates.length > 0 && Math.random() < lockProb) {
                this.lockRandomSubordinate();
            }

            if (this.playerHp <= 0) {
                setTimeout(() => {
                    const gameOverOverlay = document.getElementById('game-over-overlay');
                    if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
                }, 500);
            }
        }
        this.updateUI();
    }

    lockRandomSubordinate() {
        if (this.subordinates.length === 0) return;
        const available = this.subordinates.filter(s => s.locked === 0);
        if (available.length > 0) {
            const target = available[Math.floor(Math.random() * available.length)];
            target.locked = 3; 
            target.ready = false;
            target.charge = 0;
            this.showFloatingText('技能封鎖!', '#8e44ad', document.getElementById(`sub-${target.id}`));
            this.updateSubordinatesUI();
        }
    }
}

