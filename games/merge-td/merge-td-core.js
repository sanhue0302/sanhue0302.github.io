/**
 * Merge Tower Defense - Core Logic Module
 * 獨立遊戲邏輯與狀態管理
 */

class MergeTDCore {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.coins = 150;
        this.baseHealth = 100;
        this.maxBaseHealth = 100;
        this.wave = 1;
        this.isGameOver = false;
        this.isWaveRunning = false;
        this.isPaused = false;

        // 30 秒波次倒數計時器
        this.waveCountdown = 30; // 單位: 秒
        this.countdownTimer = 0; // 毫秒累積

        // 合成區網格: 3 rows x 4 cols = 12 格
        this.mergeGridRows = 3;
        this.mergeGridCols = 4;
        this.mergeGrid = new Array(this.mergeGridRows * this.mergeGridCols).fill(null);

        // 六角型塔防地圖 (q, r 軸標系統) - 更精細的小六角型，使路線變長
        this.hexMap = this.initHexMap();

        // 敵軍波次管理
        this.enemies = [];
        this.projectiles = [];
        this.effects = [];
        this.spawnTimer = 0;
        this.enemiesToSpawn = [];

        // 角色類型定義 (5種角色 + 萬能精靈)，明確註記攻擊距離
        this.unitTypes = {
            archer: { name: '風靈弓手', emoji: '🏹', color: '#4CAF50', baseDamage: 14, baseRange: 3.5, baseRate: 1.0, type: 'single' },
            wizard: { name: '秘法大師', emoji: '🔮', color: '#9C27B0', baseDamage: 28, baseRange: 2.6, baseRate: 0.7, type: 'splash' },
            cannon: { name: '重裝火砲', emoji: '💣', color: '#FF5722', baseDamage: 50, baseRange: 3.0, baseRate: 0.4, type: 'bomb' },
            frost:  { name: '寒冰法師', emoji: '❄️', color: '#03A9F4', baseDamage: 10, baseRange: 2.8, baseRate: 0.9, type: 'slow' },
            thunder:{ name: '雷霆怒者', emoji: '⚡', color: '#FFEB3B', baseDamage: 35, baseRange: 2.3, baseRate: 0.6, type: 'chain' },
            wildcard: { name: '萬能精靈', emoji: '✨', color: '#E91E63', isWildcard: true, baseRange: 0 }
        };

        // 初始填充 4 個角色在下方合成區
        this.spawnRandomUnitsToMergeGrid(4);
    }

    initHexMap() {
        // 更豐富、綿長迂迴的 20 節點六角型敵軍路線
        const spots = [];
        const pathNodes = [
            { q: -3, r: -3 }, { q: -2, r: -3 }, { q: -1, r: -3 }, { q: 0, r: -3 }, { q: 1, r: -3 },
            { q: 1, r: -2 },  { q: 0, r: -1 },  { q: -1, r: 0 },  { q: -2, r: 0 },  { q: -3, r: 1 },
            { q: -3, r: 2 },  { q: -2, r: 2 },  { q: -1, r: 2 },  { q: 0, r: 1 },   { q: 1, r: 0 },
            { q: 2, r: 0 },   { q: 2, r: 1 },   { q: 1, r: 2 },   { q: 0, r: 3 },   { q: -1, r: 3 }
        ];

        // 高密度的防堡放置點 (16 個可配置點)
        const spotCoords = [
            { id: 's1', q: -3, r: -2 }, { id: 's2', q: -2, r: -2 }, { id: 's3', q: 0, r: -2 }, { id: 's4', q: 2, r: -3 },
            { id: 's5', q: -2, r: -1 }, { id: 's6', q: 1, r: -1 },  { id: 's7', q: 2, r: -2 }, { id: 's8', q: -3, r: 0 },
            { id: 's9', q: -1, r: 1 },  { id: 's10', q: 1, r: 1 },  { id: 's11', q: 2, r: -1 }, { id: 's12', q: -2, r: 1 },
            { id: 's13', q: -1, r: -1 }, { id: 's14', q: 0, r: 0 },  { id: 's15', q: 0, r: 2 },  { id: 's16', q: 1, r: 3 }
        ];

        spotCoords.forEach(sp => {
            spots.push({
                id: sp.id,
                q: sp.q,
                r: sp.r,
                unit: null,
                lastShootTime: 0
            });
        });

        return { pathNodes, spots };
    }

    // 智慧生成角色 (Smart Spawning)
    generateSmartUnitType() {
        const typeKeys = ['archer', 'wizard', 'cannon', 'frost', 'thunder'];
        
        // 統計盤面上奇數個的角色類型
        const counts = {};
        typeKeys.forEach(k => counts[k] = 0);

        this.mergeGrid.forEach(item => {
            if (item && item.type !== 'wildcard' && counts[item.type] !== undefined) {
                counts[item.type]++;
            }
        });

        const oddTypes = typeKeys.filter(k => counts[k] % 2 === 1);

        // 60% 機率從奇數個類型中抽，輔助合成
        if (oddTypes.length > 0 && Math.random() < 0.6) {
            return oddTypes[Math.floor(Math.random() * oddTypes.length)];
        }

        // 萬能精靈極低機率 (4%)
        if (Math.random() < 0.04) {
            return 'wildcard';
        }

        return typeKeys[Math.floor(Math.random() * typeKeys.length)];
    }

    // 下方網格隨機增加角色
    spawnRandomUnitsToMergeGrid(count = 1) {
        let spawned = 0;
        for (let i = 0; i < count; i++) {
            const emptyIndices = [];
            this.mergeGrid.forEach((val, idx) => {
                if (val === null) emptyIndices.push(idx);
            });

            if (emptyIndices.length === 0) break; // 盤面已滿

            const targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            const type = this.generateSmartUnitType();
            
            // 波次越高，有低機率直接出 Lv.2 甚至 Lv.3
            let level = 1;
            if (this.wave >= 4 && Math.random() < 0.25) {
                level = (this.wave >= 8 && Math.random() < 0.3) ? 3 : 2;
            }

            this.mergeGrid[targetIdx] = {
                id: 'unit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                type: type,
                level: level
            };
            spawned++;
        }
        return spawned;
    }

    // 買角色 (召喚)
    buyUnit() {
        const cost = 50 + (this.wave - 1) * 10;
        if (this.coins < cost) return { success: false, reason: '金幣不足' };

        const emptyIndices = this.mergeGrid.filter(v => v === null).length;
        if (emptyIndices === 0) return { success: false, reason: '合成區空間已滿！' };

        this.coins -= cost;
        // 隨機召喚 1~3 個
        const randVal = Math.random();
        let spawnNum = 1;
        if (randVal < 0.6) spawnNum = 1;
        else if (randVal < 0.9) spawnNum = 2;
        else spawnNum = 3;

        const count = this.spawnRandomUnitsToMergeGrid(spawnNum);
        return { success: true, count, cost };
    }

    // 合成邏輯 Check
    canMerge(unitA, unitB) {
        if (!unitA || !unitB) return false;
        if (unitA.level >= 5 || unitB.level >= 5) return false; // 最高 5 級

        // 萬能精靈與任意同級角色或同級萬能精靈合成
        if (unitA.type === 'wildcard' || unitB.type === 'wildcard') {
            return unitA.level === unitB.level;
        }

        return unitA.type === unitB.type && unitA.level === unitB.level;
    }

    // 執行合成
    mergeUnits(unitA, unitB) {
        let resultType = unitA.type;
        if (unitA.type === 'wildcard' && unitB.type === 'wildcard') {
            resultType = 'wildcard'; // 萬能 + 萬能 = 高一級萬能精靈！
        } else if (unitA.type === 'wildcard') {
            resultType = unitB.type;
        } else if (unitB.type === 'wildcard') {
            resultType = unitA.type;
        }

        return {
            id: 'unit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            type: resultType,
            level: unitA.level + 1
        };
    }

    // 開始新一波敵人 (支援提前召喚波次 Early Wave Bonus)
    startWave(isManual = false) {
        if (this.isGameOver) return { success: false };

        let earlyBonusGold = 0;

        // 如果是手動按下「下一波」
        if (isManual) {
            // 固定獎勵 + 根據波次增加
            earlyBonusGold = 50 + (this.wave * 10);
            this.coins += earlyBonusGold;
        }

        // 如果遊戲已經開始，且是手動召喚，就直接推進波次
        // 如果是剛開局的第一次，就先維持 wave 1
        if (this.isWaveRunning && isManual) {
            this.wave++;
        }

        this.isWaveRunning = true;
        this.waveCountdown = 30; // 重置倒數
        this.countdownTimer = 0;
        
        const count = 8 + this.wave * 3;
        const newEnemies = [];

        // 敵軍種類型態 (一般/快速/裝甲/Boss)
        const enemyClasses = [
            { type: 'scout', name: '哥布林斥候', emoji: '👺', hpMult: 0.8, speed: 0.018, reward: 10, score: 20 },
            { type: 'soldier', name: '步兵獸人', emoji: '👹', hpMult: 1.2, speed: 0.012, reward: 18, score: 35 },
            { type: 'knight', name: '重裝騎士', emoji: '🛡️', hpMult: 2.2, speed: 0.008, reward: 32, score: 60 },
            { type: 'dragon', name: '強襲巨龍', emoji: '🐉', hpMult: 5.0, speed: 0.006, reward: 120, score: 250, isBoss: true }
        ];

        for (let i = 0; i < count; i++) {
            const isBoss = (i === count - 1) && (this.wave % 3 === 0);
            let cls = enemyClasses[0];
            
            if (isBoss) {
                cls = enemyClasses[3];
            } else {
                const rand = Math.random();
                if (this.wave >= 3 && rand < 0.25) cls = enemyClasses[2]; // 重裝
                else if (rand < 0.65) cls = enemyClasses[1]; // 步兵
                else cls = enemyClasses[0]; // 斥候
            }

            const baseHp = (30 + this.wave * 30) * cls.hpMult;
            const rewardCoin = Math.round(cls.reward * (1 + (this.wave - 1) * 0.15));

            newEnemies.push({
                type: cls.type,
                name: cls.name,
                emoji: cls.emoji,
                hp: baseHp,
                maxHp: baseHp,
                speed: cls.speed,
                reward: rewardCoin,
                scoreValue: cls.score * this.wave,
                isBoss: !!cls.isBoss,
                pathIndex: 0,
                progress: 0,
                x: 0,
                y: 0,
                slowTime: 0
            });
        }

        // 將新敵人推入待生成隊列 (允許與現有敵人疊加生成)
        this.enemiesToSpawn.push(...newEnemies);

        return { success: true, earlyBonusGold, isManual };
    }

    // 遊戲每幀狀態更新 (Update Loop)
    update(deltaTime) {
        if (this.isGameOver || this.isPaused) return;

        // 0. 波次間 30 秒自動倒數
        if (!this.isWaveRunning) {
            this.countdownTimer += deltaTime;
            if (this.countdownTimer >= 1000) {
                this.countdownTimer = 0;
                this.waveCountdown--;
                if (this.waveCountdown <= 0) {
                    this.startWave(); // 30 秒時間到，自動開啟下一波！
                }
            }
        }

        // 1. 生成敵軍
        if (this.isWaveRunning && this.enemiesToSpawn.length > 0) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= 1000) { // 每秒一隻
                this.spawnTimer = 0;
                const enemy = this.enemiesToSpawn.shift();
                this.enemies.push(enemy);
            }
        }

        // 2. 移動敵軍
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            
            // 減速狀態處理
            let currentSpeed = e.speed;
            if (e.slowTime > 0) {
                e.slowTime -= deltaTime;
                currentSpeed *= 0.5;
            }

            e.progress += currentSpeed;
            if (e.progress >= 1) {
                e.progress = 0;
                e.pathIndex++;
                if (e.pathIndex >= this.hexMap.pathNodes.length - 1) {
                    // 到達基地，扣血
                    this.baseHealth -= e.isBoss ? 30 : 10;
                    this.enemies.splice(i, 1);
                    if (this.baseHealth <= 0) {
                        this.baseHealth = 0;
                        this.isGameOver = true;
                    }
                    continue;
                }
            }
        }

        // 3. 塔防發射子彈
        const now = Date.now();
        this.hexMap.spots.forEach(spot => {
            if (!spot.unit) return;
            const unitInfo = this.unitTypes[spot.unit.type];
            if (!unitInfo || unitInfo.isWildcard) return;

            const attackInterval = 1000 / (unitInfo.baseRate * (1 + (spot.unit.level - 1) * 0.25));
            if (now - spot.lastShootTime >= attackInterval) {
                // 尋找攻擊範圍內的目標
                const target = this.findTargetForSpot(spot, unitInfo.baseRange);
                if (target) {
                    spot.lastShootTime = now;
                    this.fireProjectile(spot, target, unitInfo, spot.unit.level);
                }
            }
        });

        // 4. 更新子彈
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.progress += 0.08;
            if (p.progress >= 1) {
                // 子彈擊中
                this.onProjectileHit(p);
                this.projectiles.splice(i, 1);
            }
        }

        // 5. 檢測波次結束
        if (this.isWaveRunning && this.enemiesToSpawn.length === 0 && this.enemies.length === 0) {
            this.isWaveRunning = false;
            this.wave++;
            this.coins += 50 + this.wave * 10; // 通關獎勵
            this.waveCountdown = 30; // 重置 30 秒倒數
            this.countdownTimer = 0;
            
            // 每3波獎勵一個萬能精靈
            if ((this.wave - 1) % 3 === 0) {
                this.spawnRandomUnitsToMergeGrid(1);
            }
        }
    }

    findTargetForSpot(spot, range) {
        // 簡單搜尋進度最遠的敵軍
        let bestTarget = null;
        let maxDistProgress = -1;

        this.enemies.forEach(e => {
            // 計算 spot 與 enemy 距離
            // 這裡使用 simplifed distance Check
            const dist = Math.hypot(spot.x - e.x, spot.y - e.y);
            if (dist <= range * 45) { // 像素化範圍
                const totalProg = e.pathIndex + e.progress;
                if (totalProg > maxDistProgress) {
                    maxDistProgress = totalProg;
                    bestTarget = e;
                }
            }
        });
        return bestTarget;
    }

    fireProjectile(spot, target, unitInfo, level) {
        const damage = unitInfo.baseDamage * Math.pow(1.8, level - 1);
        this.projectiles.push({
            startX: spot.x,
            startY: spot.y,
            target: target,
            type: unitInfo.type,
            color: unitInfo.color,
            damage: damage,
            progress: 0,
            level: level
        });
    }

    onProjectileHit(p) {
        if (!p.target || p.target.hp <= 0) return;

        if (p.type === 'single') {
            p.target.hp -= p.damage;
        } else if (p.type === 'splash' || p.type === 'bomb') {
            // 範圍傷害
            const radius = p.type === 'bomb' ? 80 : 50;
            this.enemies.forEach(e => {
                const dist = Math.hypot(p.target.x - e.x, p.target.y - e.y);
                if (dist <= radius) {
                    e.hp -= p.damage * (p.type === 'bomb' ? 1.2 : 0.8);
                }
            });
        } else if (p.type === 'slow') {
            p.target.hp -= p.damage;
            p.target.slowTime = 2500; // 減速2.5秒
        } else if (p.type === 'chain') {
            // 連鎖擊打
            p.target.hp -= p.damage;
            let count = 0;
            this.enemies.forEach(e => {
                if (e !== p.target && count < 2) {
                    const dist = Math.hypot(p.target.x - e.x, p.target.y - e.y);
                    if (dist < 100) {
                        e.hp -= p.damage * 0.6;
                        count++;
                    }
                }
            });
        }

        // 移除死亡敵軍
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].hp <= 0) {
                this.coins += this.enemies[i].reward;
                this.score += this.enemies[i].scoreValue;
                this.enemies.splice(i, 1);
            }
        }
    }
}

window.MergeTDCore = MergeTDCore;
