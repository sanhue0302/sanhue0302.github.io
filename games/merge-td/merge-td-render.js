/**
 * Merge Tower Defense - Render & UI Module
 * Canvas 繪製、拖放 (Drag & Drop) 及 UI 互動
 */

class MergeTDRender {
    constructor(canvas, core, leaderboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.core = core;
        this.leaderboard = leaderboard;

        // 拖拽狀態
        this.dragState = null; // { source: 'grid'|'spot', index|spotId, unit, x, y }

        this.initCanvasSize();
        this.bindEvents();

        // 靜態佈局區域計算
        this.recalculateLayout();

        this.lastFrameTime = performance.now();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initCanvasSize() {
        const container = this.canvas.parentElement;
        this.width = container.clientWidth || 450;
        this.height = container.clientHeight || 750;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    recalculateLayout() {
        // 畫面 split 兩段: 上方 55% (TD 地圖), 下方 45% (4x4 合成區)
        this.topSectionHeight = this.height * 0.55;
        this.bottomSectionHeight = this.height * 0.45;

        // 縮小六角形大小 (10.5)，使地圖更精緻且容納長路線
        this.hexRadius = Math.min(this.width, this.topSectionHeight) / 10.5;
        this.mapCenterX = this.width / 2;
        this.mapCenterY = this.topSectionHeight / 2 + 15;

        // 下方網格 (4x4) 佈局 (16 格)
        this.gridMargin = 12;
        this.gridAreaY = this.topSectionHeight + 40;
        this.gridAreaWidth = this.width - this.gridMargin * 2;
        this.cellWidth = (this.gridAreaWidth - 15) / 4;
        this.cellHeight = (this.bottomSectionHeight - 110) / 4;

        // 回收賣出區 (Recycle / Sell Bin)
        this.sellBin = {
            x: this.width - 70,
            y: this.topSectionHeight + 5,
            w: 55,
            h: 30
        };

        // 更新六角形 Spots 像素座標
        this.core.hexMap.spots.forEach(sp => {
            const pos = this.hexToPixel(sp.q, sp.r);
            sp.x = pos.x;
            sp.y = pos.y;
        });

        // 更新 Path 節點像素座標
        this.pathPixels = this.core.hexMap.pathNodes.map(pn => this.hexToPixel(pn.q, pn.r));
    }

    // 平頂六角形 (Flat-topped hex) 座標轉換
    hexToPixel(q, r) {
        const x = this.hexRadius * (3/2 * q);
        const y = this.hexRadius * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
        return {
            x: this.mapCenterX + x,
            y: this.mapCenterY + y
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.initCanvasSize();
            this.recalculateLayout();
        });

        // 綁定按鈕
        document.getElementById('btn-summon').addEventListener('click', () => {
            const res = this.core.buyUnit();
            if (!res.success) {
                this.showToast(res.reason);
            }
        });

        document.getElementById('btn-start-wave').addEventListener('click', () => {
            const res = this.core.startWave();
            if (res && res.isEarlyCall && res.earlyBonusGold > 0) {
                this.showToast(`🔥 提前刷怪！獲得 +${res.earlyBonusGold}💰 金幣獎勵`);
            }
        });

        // 暫停/繼續按鈕切換
        const btnPause = document.getElementById('btn-pause');
        if (btnPause) {
            btnPause.addEventListener('click', () => {
                this.togglePause();
            });
        }

        // 進入背景/切換分頁自動暫停 (Page Visibility API)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.core.isPaused && !this.core.isGameOver) {
                this.togglePause(true);
            }
        });

        window.addEventListener('blur', () => {
            if (!this.core.isPaused && !this.core.isGameOver) {
                this.togglePause(true);
            }
        });

        // 觸控 & 滑鼠拖拉處理
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const onDown = (e) => {
            const pos = getPos(e);
            this.handlePointerDown(pos.x, pos.y);
        };

        const onMove = (e) => {
            if (this.dragState) {
                const pos = getPos(e);
                this.dragState.x = pos.x;
                this.dragState.y = pos.y;
            }
        };

        const onUp = (e) => {
            if (this.dragState) {
                this.handlePointerUp();
            }
        };

        this.canvas.addEventListener('mousedown', onDown);
        this.canvas.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        this.canvas.addEventListener('touchstart', onDown, { passive: true });
        this.canvas.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onUp);
    }

    handlePointerDown(x, y) {
        if (this.core.isGameOver) return;

        // 1. 檢查點擊下方網格 (4x4)
        if (y > this.topSectionHeight + 35) {
            const col = Math.floor((x - this.gridMargin) / (this.cellWidth + 5));
            const row = Math.floor((y - this.gridAreaY) / (this.cellHeight + 5));
            if (col >= 0 && col < 4 && row >= 0 && row < 4) {
                const idx = row * 4 + col;
                const unit = this.core.mergeGrid[idx];
                if (unit) {
                    this.dragState = {
                        source: 'grid',
                        index: idx,
                        unit: unit,
                        x: x,
                        y: y
                    };
                }
            }
        } else {
            // 2. 檢查點擊上方六角防堡點
            this.core.hexMap.spots.forEach(sp => {
                const dist = Math.hypot(x - sp.x, y - sp.y);
                if (dist <= this.hexRadius * 1.2 && sp.unit) {
                    this.dragState = {
                        source: 'spot',
                        spotId: sp.id,
                        unit: sp.unit,
                        x: x,
                        y: y
                    };
                }
            });
        }
    }

    handlePointerUp() {
        if (!this.dragState) return;

        const { x, y, source, index, spotId, unit } = this.dragState;

        // 檢查是否拖至賣出回收區
        if (x >= this.sellBin.x && x <= this.sellBin.x + this.sellBin.w &&
            y >= this.sellBin.y && y <= this.sellBin.y + this.sellBin.h) {
            
            const refund = 15 * unit.level;
            this.core.coins += refund;
            if (source === 'grid') this.core.mergeGrid[index] = null;
            if (source === 'spot') {
                const sp = this.core.hexMap.spots.find(s => s.id === spotId);
                if (sp) sp.unit = null;
            }
            this.showToast(`已回收 +${refund} 金幣`);
            this.dragState = null;
            return;
        }

        // 放回/拖放目標判定 (4x4 網格)
        if (y > this.topSectionHeight + 35) {
            // 放至下方網格
            const col = Math.floor((x - this.gridMargin) / (this.cellWidth + 5));
            const row = Math.floor((y - this.gridAreaY) / (this.cellHeight + 5));
            if (col >= 0 && col < 4 && row >= 0 && row < 4) {
                const targetIdx = row * 4 + col;
                const targetUnit = this.core.mergeGrid[targetIdx];

                if (targetUnit === null) {
                    // 空位移動
                    this.core.mergeGrid[targetIdx] = unit;
                    if (source === 'grid') this.core.mergeGrid[index] = null;
                    if (source === 'spot') {
                        const sp = this.core.hexMap.spots.find(s => s.id === spotId);
                        if (sp) sp.unit = null;
                    }
                } else if (this.core.canMerge(unit, targetUnit)) {
                    // 合成升級
                    if (source === 'grid' && index === targetIdx) {
                        // 原位點擊不做處置
                    } else {
                        const mergedUnit = this.core.mergeUnits(unit, targetUnit);
                        this.core.mergeGrid[targetIdx] = mergedUnit;
                        if (source === 'grid') this.core.mergeGrid[index] = null;
                        if (source === 'spot') {
                            const sp = this.core.hexMap.spots.find(s => s.id === spotId);
                            if (sp) sp.unit = null;
                        }
                        this.showToast(`🎉 升級至 Lv.${mergedUnit.level}!`);
                    }
                } else {
                    // 互換位置 (如果是網格間)
                    if (source === 'grid' && index !== targetIdx) {
                        this.core.mergeGrid[targetIdx] = unit;
                        this.core.mergeGrid[index] = targetUnit;
                    }
                }
            }
        } else {
            // 放至上方六角防堡點
            let placed = false;
            this.core.hexMap.spots.forEach(sp => {
                const dist = Math.hypot(x - sp.x, y - sp.y);
                if (dist <= this.hexRadius * 1.2) {
                    if (!sp.unit) {
                        sp.unit = unit;
                        if (source === 'grid') this.core.mergeGrid[index] = null;
                        if (source === 'spot') {
                            const prevSp = this.core.hexMap.spots.find(s => s.id === spotId);
                            if (prevSp) prevSp.unit = null;
                        }
                        placed = true;
                    }
                }
            });
        }

        this.dragState = null;
    }

    showToast(msg) {
        const toast = document.getElementById('game-toast');
        if (toast) {
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1500);
        }
    }

    animate(timestamp) {
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // 核心計算更新
        this.core.update(deltaTime);

        // 計算敵軍當前實際 x, y 畫面座標
        this.updateEnemyPositions();

        // 繪製畫面
        this.render();

        // 遊戲結束判定
        if (this.core.isGameOver && !this.hasShownLeaderboard) {
            this.hasShownLeaderboard = true;
            setTimeout(() => {
                this.leaderboard.show({
                    score: this.core.score,
                    extra: { wave: this.core.wave },
                    onRestart: () => {
                        this.hasShownLeaderboard = false;
                        this.core.reset();
                    }
                });
            }, 500);
        }

        requestAnimationFrame(this.animate);
    }

    updateEnemyPositions() {
        this.core.enemies.forEach(e => {
            const startNode = this.pathPixels[e.pathIndex];
            const endNode = this.pathPixels[e.pathIndex + 1];
            if (startNode && endNode) {
                e.x = startNode.x + (endNode.x - startNode.x) * e.progress;
                e.y = startNode.y + (endNode.y - startNode.y) * e.progress;
            }
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 1. 上半部 背景與 TD 地圖
        this.drawTopSection();

        // 2. 下半部 背景與網格
        this.drawBottomSection();

        // 3. 敵軍與子彈動畫
        this.drawEnemies();
        this.drawProjectiles();

        // 4. 拖拽當前被選取的角色與攻擊射程光圈 (Range Circle)
        if (this.dragState) {
            const unit = this.dragState.unit;
            const unitInfo = this.core.unitTypes[unit.type];
            
            // 如果不是萬能精靈，繪製動態攻擊射程圈 (Range Circle)
            if (unitInfo && !unitInfo.isWildcard) {
                const rangePx = unitInfo.baseRange * 45;
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(this.dragState.x, this.dragState.y, rangePx, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(76, 175, 80, 0.15)';
                this.ctx.fill();
                this.ctx.strokeStyle = unitInfo.color || '#4CAF50';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([6, 6]);
                this.ctx.stroke();
                this.ctx.restore();
            }

            this.drawUnitCard(
                unit,
                this.dragState.x - this.cellWidth / 2,
                this.dragState.y - this.cellHeight / 2,
                this.cellWidth,
                this.cellHeight,
                true
            );
        }

        // 5. 若處於暫停狀態，繪製全螢幕半透明暫停遮罩層
        if (this.core.isPaused) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.fillStyle = '#FFF';
            this.ctx.font = 'bold 26px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⏸️ 遊戲暫停中', this.width / 2, this.height / 2 - 10);
            
            this.ctx.font = '14px Inter';
            this.ctx.fillStyle = '#B0BEC5';
            this.ctx.fillText('點擊右上角 ▶️ 繼續遊戲', this.width / 2, this.height / 2 + 25);
            this.ctx.restore();
        }

        // 6. 更新頂部 UI 文字
        this.updateUIOverlay();
    }

    updateUIOverlay() {
        document.getElementById('val-score').innerText = this.core.score;
        document.getElementById('val-coins').innerText = this.core.coins;
        document.getElementById('val-wave').innerText = this.core.wave;

        const hpBar = document.getElementById('hp-bar-inner');
        if (hpBar) {
            const pct = (this.core.baseHealth / this.core.maxBaseHealth) * 100;
            hpBar.style.width = pct + '%';
        }

        const summonCost = 50 + (this.core.wave - 1) * 10;
        document.getElementById('summon-cost').innerText = summonCost;

        const btnWave = document.getElementById('btn-start-wave');
        if (btnWave) {
            btnWave.disabled = false; // 允許隨時提前刷怪！
            if (this.core.isWaveRunning) {
                btnWave.innerText = `🔥 提前刷怪 (+${this.core.waveCountdown * 2 + 10}💰)`;
            } else {
                btnWave.innerText = `▶️ 開始下一波 (${this.core.waveCountdown}s)`;
            }
        }
    }

    drawTopSection() {
        // 地圖頂部漸層背景
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.topSectionHeight);
        grad.addColorStop(0, '#1a1c29');
        grad.addColorStop(1, '#2a2d42');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.topSectionHeight);

        // 1. 敵軍路線下方繪製六角型網格背景 (Path Hexagons)
        this.pathPixels.forEach(pt => {
            this.drawHexagon(pt.x, pt.y, this.hexRadius, '#251F33', '#8E24AA', 2);
        });

        // 2. 繪製敵軍路線導引虛線
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([8, 8]);
        this.ctx.strokeStyle = '#FF5252';
        this.pathPixels.forEach((pt, idx) => {
            if (idx === 0) this.ctx.moveTo(pt.x, pt.y);
            else this.ctx.lineTo(pt.x, pt.y);
        });
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 3. 繪製傳送門 (起點) 與主堡大門 (終點) 視覺示意
        if (this.pathPixels.length > 0) {
            const startPt = this.pathPixels[0];
            const endPt = this.pathPixels[this.pathPixels.length - 1];

            // 傳送門 (起點)
            this.ctx.save();
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.shadowColor = '#4CAF50';
            this.ctx.shadowBlur = 10;
            this.ctx.font = 'bold 20px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🌀', startPt.x, startPt.y - 22);
            this.ctx.font = 'bold 10px Inter';
            this.ctx.fillText('敵軍門口', startPt.x, startPt.y - 38);
            this.ctx.restore();

            // 主堡大門 (終點)
            this.ctx.save();
            this.ctx.fillStyle = '#FF5252';
            this.ctx.shadowColor = '#FF5252';
            this.ctx.shadowBlur = 12;
            this.ctx.font = 'bold 22px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🏰', endPt.x, endPt.y + 22);
            this.ctx.font = 'bold 11px Inter';
            this.ctx.fillText('主堡大門', endPt.x, endPt.y + 38);
            this.ctx.restore();
        }

        // 4. 繪製六角防堡點 (Spots)
        this.core.hexMap.spots.forEach(sp => {
            this.drawHexagon(sp.x, sp.y, this.hexRadius, '#3A3F58', '#5C6280', 2);
            if (sp.unit && (!this.dragState || this.dragState.spotId !== sp.id)) {
                this.drawUnitCard(sp.unit, sp.x - 20, sp.y - 20, 40, 40);
            }
        });
    }

    drawHexagon(x, y, radius, fillColor, strokeColor, lineWidth = 2) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = x + radius * Math.cos(angle);
            const hy = y + radius * Math.sin(angle);
            if (i === 0) this.ctx.moveTo(hx, hy);
            else this.ctx.lineTo(hx, hy);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }

    drawBottomSection() {
        // 下方合成區背景
        this.ctx.fillStyle = '#12131C';
        this.ctx.fillRect(0, this.topSectionHeight, this.width, this.bottomSectionHeight);

        // 分隔線
        this.ctx.fillStyle = '#FFB74D';
        this.ctx.fillRect(0, this.topSectionHeight, this.width, 3);

        // 下方區塊標題
        this.ctx.fillStyle = '#B0BEC5';
        this.ctx.font = 'bold 13px Inter';
        this.ctx.fillText('🧩 角色合成區 (拖拉至上方佈陣)', 15, this.topSectionHeight + 25);

        // 回收賣出區
        this.ctx.fillStyle = '#D32F2F';
        this.ctx.beginPath();
        this.ctx.roundRect(this.sellBin.x, this.sellBin.y, this.sellBin.w, this.sellBin.h, 8);
        this.ctx.fill();
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 11px Inter';
        this.ctx.fillText('🗑️ 回收', this.sellBin.x + 8, this.sellBin.y + 22);

        // 繪製 4x4 網格
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const idx = row * 4 + col;
                const x = this.gridMargin + col * (this.cellWidth + 5);
                const y = this.gridAreaY + row * (this.cellHeight + 5);

                // 網格底框
                this.ctx.fillStyle = '#1E2130';
                this.ctx.strokeStyle = '#2E344D';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, this.cellWidth, this.cellHeight, 10);
                this.ctx.fill();
                this.ctx.stroke();

                // 繪製角色卡
                const unit = this.core.mergeGrid[idx];
                if (unit && (!this.dragState || this.dragState.index !== idx)) {
                    this.drawUnitCard(unit, x + 4, y + 4, this.cellWidth - 8, this.cellHeight - 8);
                }
            }
        }
    }

    drawUnitCard(unit, x, y, w, h, isDragging = false) {
        const info = this.core.unitTypes[unit.type];
        if (!info) return;

        this.ctx.save();
        if (isDragging) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 12;
            this.ctx.globalAlpha = 0.9;
        }

        // 卡片底色
        this.ctx.fillStyle = info.color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, 8);
        this.ctx.fill();

        // 邊框
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        // Emoji 圖示
        this.ctx.font = `${Math.min(w, h) * 0.45}px Inter`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(info.emoji, x + w / 2, y + h / 2 - 2);

        // 星級/等級標記 (包含萬能精靈也顯示 Lv.1~5)
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 10px Inter';
        this.ctx.fillText(`Lv.${unit.level}`, x + w / 2, y + h - 8);

        this.ctx.restore();
    }

    drawEnemies() {
        this.core.enemies.forEach(e => {
            // 繪製敵軍 Emoji / 圖示
            this.ctx.font = e.isBoss ? '22px Inter' : '16px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(e.emoji || '👹', e.x, e.y);

            // 血條
            const hpRatio = e.hp / e.maxHp;
            const barW = e.isBoss ? 28 : 20;
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(e.x - barW/2, e.y - (e.isBoss ? 20 : 16), barW, 4);
            this.ctx.fillStyle = hpRatio > 0.4 ? '#00E676' : '#FF1744';
            this.ctx.fillRect(e.x - barW/2, e.y - (e.isBoss ? 20 : 16), barW * hpRatio, 4);
        });
    }

    drawProjectiles() {
        this.core.projectiles.forEach(p => {
            if (!p.target) return;
            const currX = p.startX + (p.target.x - p.startX) * p.progress;
            const currY = p.startY + (p.target.y - p.startY) * p.progress;

            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(currX, currY, 4 + p.level, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    updateUIOverlay() {
        document.getElementById('val-score').innerText = this.core.score;
        document.getElementById('val-coins').innerText = this.core.coins;
        document.getElementById('val-wave').innerText = this.core.wave;

        const hpBar = document.getElementById('hp-bar-inner');
        if (hpBar) {
            const pct = (this.core.baseHealth / this.core.maxBaseHealth) * 100;
            hpBar.style.width = pct + '%';
        }

        const summonCost = 50 + (this.core.wave - 1) * 10;
        document.getElementById('summon-cost').innerText = summonCost;

        const btnWave = document.getElementById('btn-start-wave');
        if (btnWave) {
            btnWave.disabled = this.core.isWaveRunning;
            btnWave.innerText = this.core.isWaveRunning ? '⚔️ 戰鬥進行中...' : '▶️ 開始下一波';
        }
    }
}

window.MergeTDRender = MergeTDRender;
