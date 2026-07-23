/**
 * Merge Tower Defense - Render & UI Module
 * Canvas 繪製、拖放 (Drag & Drop) 及 UI 互動
 */

class MergeTDRender {
    constructor(canvas, core, leaderboard = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 新增：專門用來畫拖曳物件的 Canvas (確保位於最上層)
        this.dragCanvas = document.getElementById('drag-canvas');
        if (this.dragCanvas) {
            this.dragCtx = this.dragCanvas.getContext('2d');
        }

        this.core = core;
        this.leaderboard = leaderboard;

        // 拖拽狀態
        this.dragState = null; // { source: 'grid'|'spot', index|spotId, unit, x, y }
        this.selectedSpotId = null; // 當前選中的防堡點 (顯示攻擊範圍)

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
        if (this.dragCanvas) {
            this.dragCanvas.width = this.width;
            this.dragCanvas.height = this.height;
        }
    }

    recalculateLayout() {
        // 將畫面高度分為上下兩區：上方約 65% 給地圖，下方 35% 給合成區
        const topRatio = 0.65;
        
        // 地圖中心點與六角形大小
        const availMapWidth = this.width - 16;
        const availMapHeight = (this.height * topRatio) - 16;

        // X bounds: q from -3 to 2 -> x from -4.5 to 3. Span = 7.5 + 2 = 9.5
        // Y bounds: y from -7.79 to 6.06. Squash = 0.65.
        // Squashed Y span = (13.85 + 1.732) * 0.65 = 10.12
        const radiusByW = availMapWidth / 9.5;
        const radiusByH = availMapHeight / 10.5;

        this.hexRadius = Math.max(10, Math.min(radiusByW, radiusByH));
        
        // 置中偏移計算 (考慮 Y 軸壓縮)
        this.mapCenterX = this.width / 2;
        this.mapCenterY = (availMapHeight / 2) - (-0.56 * this.hexRadius);
        // 計算下方合成區 (Bottom Grid) 佈局 (4欄 x 3列)
        const gridAreaHeight = this.height * (1 - topRatio);
        const gridAreaTop = this.height * topRatio;
        const sideButtonWidth = 80; // 左/右邊各保留 80px 給按鈕
        const availGridWidth = this.width - sideButtonWidth * 2;
        const cols = 4;
        const rows = 3;
        const gap = 4;
        
        // 改為 0度 (正向透視) 可以讓格子達到最大化，因為沒有傾斜浪費的橫向空間
        const angle = 0 * Math.PI / 180;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const squash = 0.65; // Y 軸壓縮比例
        
        // 動態計算旋轉後的投影邊界 (以 1 單位 cellSize 計算)，確保格子撐到最大
        const projW = cols * Math.abs(cosA) + rows * Math.abs(sinA);
        const projH = (cols * Math.abs(sinA) + rows * Math.abs(cosA)) * squash;
        
        const cellW = (availGridWidth - gap * 3) / projW;
        const cellH = (gridAreaHeight - gap * 2) / projH;
        this.cellSize = Math.min(cellW, cellH) * 0.92; // 取最小限制，保留一點邊距
        
        const halfS = this.cellSize / 2;
        
        const gridCenterX = this.width / 2;
        // 將合成區貼齊畫面最下方 (保留 30px 給 3D 厚度與邊距)
        const bottomPadding = 30; 
        const gridCenterY = this.height - bottomPadding - (projH * this.cellSize) / 2;

        const getScreenPos = (x, y) => ({
            x: x * cosA - y * sinA,
            y: (x * sinA + y * cosA) * squash
        });

        this.gridCells = [];
        for (let i = 0; i < 12; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            // 基礎偏移 (中心點 1.5, 1)
            const cCol = col - (cols - 1) / 2;
            const cRow = row - (rows - 1) / 2;
            
            const gridX = cCol * (this.cellSize + gap);
            const gridY = cRow * (this.cellSize + gap);
            
            const center = getScreenPos(gridX, gridY);
            const cx = gridCenterX + center.x;
            const cy = gridCenterY + center.y;
            
            // 計算四個角落 (左上, 右上, 右下, 左下)
            const corners = [
                getScreenPos(-halfS, -halfS),
                getScreenPos(halfS, -halfS),
                getScreenPos(halfS, halfS),
                getScreenPos(-halfS, halfS)
            ].map(p => ({ x: cx + p.x, y: cy + p.y }));
            
            this.gridCells.push({
                index: i,
                cx: cx,
                cy: cy,
                corners: corners
            });
        }

        // 更新刪除/黑洞區 (sellBin) 邊界 (點擊或拖放至 DOM 中的 #btn-delete 按鈕)
        const btnDeleteEl = document.getElementById('btn-delete');
        if (btnDeleteEl) {
            const rect = btnDeleteEl.getBoundingClientRect();
            const containerRect = this.canvas.getBoundingClientRect();
            this.sellBin = {
                x: rect.left - containerRect.left,
                y: rect.top - containerRect.top,
                w: rect.width,
                h: rect.height
            };
        } else {
            this.sellBin = {
                x: this.width / 2,
                y: this.height + 10,
                w: 100,
                h: 50
            };
        }

        // 更新六角形 Spots 像素座標
        this.core.hexMap.spots.forEach(sp => {
            const pos = this.hexToPixel(sp.q, sp.r);
            sp.x = pos.x;
            sp.y = pos.y;
        });

        // 更新 Path 節點像素座標
        this.pathPixels = this.core.hexMap.pathNodes.map(pn => this.hexToPixel(pn.q, pn.r));
    }

    // 平頂六角形 (Flat-topped hex) 座標轉換 (含 45度角視角壓縮)
    hexToPixel(q, r) {
        const isoSquash = 0.65;
        const x = this.hexRadius * (3/2 * q);
        const y = this.hexRadius * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r) * isoSquash;
        return {
            x: this.mapCenterX + x,
            y: this.mapCenterY + y
        };
    }

    isPointInPolygon(x, y, corners) {
        let inside = false;
        for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
            const xi = corners[i].x, yi = corners[i].y;
            const xj = corners[j].x, yj = corners[j].y;
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
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
            const res = this.core.startWave(true);
            if (res && res.isManual && res.earlyBonusGold > 0) {
                this.showToast(`🔥 波次突擊！獲得 +${res.earlyBonusGold}💰 金幣獎勵`);
            }
        });

        // 暫停/繼續按鈕切換
        const btnPause = document.getElementById('btn-pause');
        if (btnPause) {
            btnPause.addEventListener('click', () => {
                this.togglePause();
            });
        }

        const btnResume = document.getElementById('btn-resume');
        if (btnResume) {
            btnResume.addEventListener('click', () => {
                this.togglePause(false);
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
        const getClientPos = (e) => {
            if (e.touches && e.touches.length > 0) {
                return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
            }
            if (e.changedTouches && e.changedTouches.length > 0) {
                return { clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY };
            }
            return { clientX: e.clientX, clientY: e.clientY };
        };

        const toCanvasPos = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };



        const onDown = (e) => {
            const { clientX, clientY } = getClientPos(e);
            const pos = toCanvasPos(clientX, clientY);
            this.handlePointerDown(pos.x, pos.y, clientX, clientY);
            if (this.dragState) {
                this.dragState.clientX = clientX;
                this.dragState.clientY = clientY;
            }
        };

        const onMove = (e) => {
            if (this.dragState) {
                const { clientX, clientY } = getClientPos(e);
                const pos = toCanvasPos(clientX, clientY);
                this.dragState.x = pos.x;
                this.dragState.y = pos.y;
                this.dragState.clientX = clientX;
                this.dragState.clientY = clientY;

                // 檢查是否移至刪除區上方
                const btnDeleteEl = document.getElementById('btn-delete');
                if (btnDeleteEl) {
                    const btnRect = btnDeleteEl.getBoundingClientRect();
                    if (clientX >= btnRect.left && clientX <= btnRect.right &&
                        clientY >= btnRect.top && clientY <= btnRect.bottom) {
                        btnDeleteEl.classList.add('drag-hover');
                    } else {
                        btnDeleteEl.classList.remove('drag-hover');
                    }
                }
            }
        };

        const onUp = (e) => {
            if (this.dragState) {
                // 用最後的 clientX/clientY 更新一次位置
                const { clientX, clientY } = getClientPos(e);
                const pos = toCanvasPos(clientX, clientY);
                this.dragState.x = pos.x;
                this.dragState.y = pos.y;
                this.dragState.clientX = clientX;
                this.dragState.clientY = clientY;
                this.handlePointerUp();
            }
        };

        this.canvas.addEventListener('mousedown', onDown);
        // 綁定 move 到 window，這樣拖出 canvas 也能追蹤
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        this.canvas.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onUp);
    }
    togglePause(forcePause) {
        const btnPause = document.getElementById('btn-pause');
        if (forcePause !== undefined) {
            this.core.isPaused = forcePause;
        } else {
            this.core.isPaused = !this.core.isPaused;
        }
        if (btnPause) {
            btnPause.innerText = this.core.isPaused ? '▶️' : '⏸️';
        }
        
        const overlay = document.getElementById('pause-overlay');
        if (overlay) {
            if (this.core.isPaused) {
                overlay.classList.add('visible');
            } else {
                overlay.classList.remove('visible');
            }
        }
    }

    handlePointerDown(x, y, clientX, clientY) {
        if (this.core.isGameOver) return;

        let tappedSpot = false;

        // 檢查點擊六角防堡點
        this.core.hexMap.spots.forEach(sp => {
            const dist = Math.hypot(x - sp.x, (y - sp.y) / 0.65); // 還原 Y 軸壓縮比例來算距離
            if (dist <= this.hexRadius * 1.2 && sp.unit) {
                this.dragState = {
                    source: 'spot',
                    spotId: sp.id,
                    unit: sp.unit,
                    x: x,
                    y: y
                };
                // 點擊有角色的防堡點 → 選中它（顯示攻擊範圍）
                this.selectedSpotId = sp.id;
                tappedSpot = true;
            }
        });

        // 檢查點擊下方合成區網格
        if (!tappedSpot && this.gridCells) {
            this.gridCells.forEach(cell => {
                if (this.isPointInPolygon(x, y, cell.corners)) {
                    
                    const unit = this.core.mergeGrid[cell.index];
                    if (unit) {
                        this.dragState = {
                            source: 'grid',
                            index: cell.index,
                            unit: unit,
                            x: x,
                            y: y,
                            clientX: clientX,
                            clientY: clientY
                        };
                        tappedSpot = true;
                    }
                }
            });
        }

        // 點擊空白處 → 取消選中
        if (!tappedSpot) {
            this.selectedSpotId = null;
        }
    }

    handlePointerUp() {
        if (!this.dragState) return;

        const { x, y, source, index, spotId, unit, clientX, clientY } = this.dragState;
        const btnDeleteEl = document.getElementById('btn-delete');

        // 移除拖拽懸浮亮燈效果
        if (btnDeleteEl) btnDeleteEl.classList.remove('drag-hover');

        // 檢查是否拖至刪除/黑洞回收區 (使用 viewport 座標)
        if (btnDeleteEl) {
            const btnRect = btnDeleteEl.getBoundingClientRect();
            if (clientX >= btnRect.left && clientX <= btnRect.right &&
                clientY >= btnRect.top && clientY <= btnRect.bottom) {
                
                const refund = 15 * unit.level;
                this.core.coins += refund;
                if (source === 'grid') this.core.mergeGrid[index] = null;
                if (source === 'spot') {
                    const sp = this.core.hexMap.spots.find(s => s.id === spotId);
                    if (sp) sp.unit = null;
                }
                this.showToast(`🕳️ 黑洞吞噬角色！(回收 +${refund}💰)`);
                this.dragState = null;
                window.dispatchEvent(new CustomEvent('grid-updated'));
                return;
            }
        }

        // 放至上方六角防堡點
        let placed = false;
        this.core.hexMap.spots.forEach(sp => {
            const dist = Math.hypot(x - sp.x, (y - sp.y) / 0.65);
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

        // 如果沒有放在地圖上，檢查是否放在下方合成區
        if (!placed && this.gridCells) {
            this.gridCells.forEach(cell => {
                if (this.isPointInPolygon(x, y, cell.corners)) {
                    
                    const targetIndex = cell.index;
                    const targetUnit = this.core.mergeGrid[targetIndex];
                    
                    if (source === 'grid' && targetIndex === index) {
                        // 放在原位
                        placed = true;
                    } else if (!targetUnit) {
                        // 空格 -> 移動
                        this.core.mergeGrid[targetIndex] = unit;
                        if (source === 'grid') this.core.mergeGrid[index] = null;
                        if (source === 'spot') {
                            const prevSp = this.core.hexMap.spots.find(s => s.id === spotId);
                            if (prevSp) prevSp.unit = null;
                        }
                        placed = true;
                    } else if (this.core.canMerge(unit, targetUnit)) {
                        // 合成
                        const mergedUnit = this.core.mergeUnits(unit, targetUnit);
                        this.core.mergeGrid[targetIndex] = mergedUnit;
                        if (source === 'grid') this.core.mergeGrid[index] = null;
                        if (source === 'spot') {
                            const prevSp = this.core.hexMap.spots.find(s => s.id === spotId);
                            if (prevSp) prevSp.unit = null;
                        }
                        this.showToast(`🎉 升級至 Lv.${mergedUnit.level}!`);
                        placed = true;
                    } else {
                        // 交換 (Swap)
                        if (source === 'grid') {
                            this.core.mergeGrid[index] = targetUnit;
                            this.core.mergeGrid[targetIndex] = unit;
                        } else if (source === 'spot') {
                            const prevSp = this.core.hexMap.spots.find(s => s.id === spotId);
                            if (prevSp) prevSp.unit = targetUnit;
                            this.core.mergeGrid[targetIndex] = unit;
                        }
                        placed = true;
                    }
                }
            });
        }

        // 觸發自定義事件通知 (由於網格與地圖都由 renderCore 負責，這裡可呼叫強制重繪或觸發事件)
        if (placed) {
            window.dispatchEvent(new CustomEvent('grid-updated'));
        }

        this.dragState = null;
        this.drawTopSection(); // 強制重繪清除 Hover
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

        // 3. 敵軍與子彈動畫
        this.drawEnemies();
        this.drawProjectiles();

        // 清空 Drag Canvas
        if (this.dragCtx) {
            this.dragCtx.clearRect(0, 0, this.width, this.height);
        }

        // 4. 拖拽當前被選取的角色與攻擊射程光圈 (Range Circle)
        if (this.dragState) {
            const unit = this.dragState.unit;
            const unitInfo = this.core.unitTypes[unit.type];
            
            // 如果不是萬能精靈，繪製動態攻擊射程圈 (Range Circle) - 畫在底層 Canvas
            if (unitInfo && !unitInfo.isWildcard) {
                const rangePx = unitInfo.baseRange * 45;

                // 找到最近的 hex spot，在該位置顯示射程圈
                let nearestSpot = null;
                let nearestDist = Infinity;
                this.core.hexMap.spots.forEach(sp => {
                    const dist = Math.hypot(this.dragState.x - sp.x, this.dragState.y - sp.y);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        nearestSpot = sp;
                    }
                });

                if (nearestSpot && nearestDist <= this.hexRadius * 2.5) {
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.arc(nearestSpot.x, nearestSpot.y, rangePx, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(76, 175, 80, 0.15)';
                    this.ctx.fill();
                    this.ctx.strokeStyle = unitInfo.color || '#4CAF50';
                    this.ctx.lineWidth = 2;
                    this.ctx.setLineDash([6, 6]);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }

            // 在 canvas 內時才繪製拖拽預覽圓
            // 將角色畫在上層的 dragCanvas 中，確保不會被 HTML 按鈕遮擋
            if (this.dragState.x >= 0 && this.dragState.y >= 0 &&
                this.dragState.x <= this.width && this.dragState.y <= this.height) {
                
                const targetCtx = this.dragCtx ? this.dragCtx : this.ctx;
                
                this.drawUnitCard(
                    unit,
                    this.dragState.x,
                    this.dragState.y,
                    this.hexRadius * 0.75,
                    true,
                    targetCtx
                );
            }
        }

        // 4b. 已放置角色的攻擊射程圈 (點擊角色時顯示)
        this.core.hexMap.spots.forEach(sp => {
            if (sp.unit && this.selectedSpotId === sp.id) {
                const info = this.core.unitTypes[sp.unit.type];
                if (info && !info.isWildcard) {
                    const rangePx = info.baseRange * 45;
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.arc(sp.x, sp.y, rangePx, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
                    this.ctx.fill();
                    this.ctx.strokeStyle = info.color || '#4CAF50';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.setLineDash([4, 4]);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        });

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
            btnWave.disabled = false;
            if (this.core.isWaveRunning) {
                btnWave.innerText = `🔥 突擊(+${50 + this.core.wave * 10}💰)`;
            } else {
                btnWave.innerText = `▶️ 開始(${50 + this.core.wave * 10}💰)`;
            }
        }
    }

    drawTopSection() {
        // 地圖頂部漸層背景
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#1a1c29');
        grad.addColorStop(1, '#2a2d42');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 1. 敵軍路線下方繪製六角型網格背景 (Path Hexagons - 道路材質)
        this.pathPixels.forEach(pt => {
            this.drawHexagon(pt.x, pt.y, this.hexRadius, '#251F33', '#8E24AA', 2, 'road');
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

            // 傳送門 (起點) - 立體魔法陣底座
            this.ctx.save();
            this.ctx.translate(startPt.x, startPt.y);
            this.ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
            this.ctx.shadowColor = '#4CAF50';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 25, 25 * 0.65, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#4CAF50';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.shadowBlur = 0; // 關閉文字陰影以免過亮
            this.ctx.font = 'bold 24px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText('🌀', 0, -5);
            this.ctx.font = 'bold 11px Inter';
            this.ctx.fillText('敵軍門口', 0, -30);
            this.ctx.restore();

            // 主堡大門 (終點) - 立體發光底座
            this.ctx.save();
            this.ctx.translate(endPt.x, endPt.y);
            this.ctx.fillStyle = 'rgba(255, 82, 82, 0.3)';
            this.ctx.shadowColor = '#FF5252';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 30, 30 * 0.65, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = '#FF5252';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = '#FF5252';
            this.ctx.shadowBlur = 0;
            this.ctx.font = 'bold 26px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText('🏰', 0, -5);
            this.ctx.font = 'bold 12px Inter';
            this.ctx.fillText('主堡大門', 0, -35);
            this.ctx.restore();
        }

        // 找出當前拖曳懸停的防堡點 (Hover 效果)
        let hoveredSpotId = null;
        if (this.dragState && this.dragState.x >= 0 && this.dragState.y >= 0) {
            let nearestDist = Infinity;
            this.core.hexMap.spots.forEach(sp => {
                const dist = Math.hypot(this.dragState.x - sp.x, (this.dragState.y - sp.y) / 0.65);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    if (dist <= this.hexRadius * 1.2) {
                        hoveredSpotId = sp.id;
                    }
                }
            });
        }

        // 4. 繪製六角防堡點 (Spots - 草地材質)
        this.core.hexMap.spots.forEach(sp => {
            const isHovered = (sp.id === hoveredSpotId);
            const fillColor = isHovered ? '#5C805C' : '#3A4B38'; // 懸停時變亮
            const strokeColor = isHovered ? '#81C784' : '#5C805C';

            this.drawHexagon(sp.x, sp.y, this.hexRadius, fillColor, strokeColor, isHovered ? 3 : 2, 'grass');
            if (sp.unit && (!this.dragState || this.dragState.spotId !== sp.id)) {
                this.drawUnitCard(sp.unit, sp.x, sp.y, this.hexRadius * 0.65);
            }
        });

        // 5. 繪製下方合成區
        this.drawBottomGrid();
    }

    drawBottomGrid() {
        if (!this.gridCells) return;

        // 背景版面
        const topRatio = 0.65;
        const gridAreaTop = this.height * topRatio;
        this.ctx.fillStyle = 'rgba(18, 19, 28, 0.95)';
        this.ctx.fillRect(0, gridAreaTop, this.width, this.height - gridAreaTop);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, gridAreaTop);
        this.ctx.lineTo(this.width, gridAreaTop);
        this.ctx.stroke();

        // 繪製每個合成格
        this.gridCells.forEach(cell => {
            const blockThickness = 12;
            const corners = cell.corners;
            
            // 側面厚度 (右上到右下)
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.moveTo(corners[1].x, corners[1].y);
            this.ctx.lineTo(corners[2].x, corners[2].y);
            this.ctx.lineTo(corners[2].x, corners[2].y + blockThickness);
            this.ctx.lineTo(corners[1].x, corners[1].y + blockThickness);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 左下側面 (暗面, 右下到左下)
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.beginPath();
            this.ctx.moveTo(corners[2].x, corners[2].y);
            this.ctx.lineTo(corners[3].x, corners[3].y);
            this.ctx.lineTo(corners[3].x, corners[3].y + blockThickness);
            this.ctx.lineTo(corners[2].x, corners[2].y + blockThickness);
            this.ctx.closePath();
            this.ctx.fill();

            // 頂面面板 (菱形)
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.lineWidth = 1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(corners[0].x, corners[0].y);
            this.ctx.lineTo(corners[1].x, corners[1].y);
            this.ctx.lineTo(corners[2].x, corners[2].y);
            this.ctx.lineTo(corners[3].x, corners[3].y);
            this.ctx.closePath();
            
            this.ctx.fill();
            this.ctx.stroke();

            // 判斷 Hover (當從其他地方拖曳過來時)
            if (this.dragState && this.dragState.x >= 0 && this.dragState.y >= 0) {
                if (this.isPointInPolygon(this.dragState.x, this.dragState.y, corners)) {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    this.ctx.fill(); // 直接沿用剛剛的 path
                }
            }

            // 繪製單位
            const unit = this.core.mergeGrid[cell.index];
            if (unit) {
                // 如果該單位正在被拖曳，則只畫半透明的佔位符或不畫
                if (this.dragState && this.dragState.source === 'grid' && this.dragState.index === cell.index) {
                    this.ctx.globalAlpha = 0.3;
                    this.drawUnitCard(unit, cell.cx, cell.cy, this.cellSize * 0.4);
                    this.ctx.globalAlpha = 1.0;
                } else {
                    this.drawUnitCard(unit, cell.cx, cell.cy, this.cellSize * 0.4);
                }
            }
        });
    }

    drawHexagon(x, y, radius, fillColor, strokeColor, lineWidth = 2, texture = null) {
        const isoSquash = 0.65; // 視角壓縮比例

        // 建立六角形路徑的輔助函數 (加上 y 軸壓縮)
        const hexPath = (cx, cy, r) => {
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx = cx + r * Math.cos(angle);
                const hy = cy + r * Math.sin(angle) * isoSquash;
                if (i === 0) this.ctx.moveTo(hx, hy);
                else this.ctx.lineTo(hx, hy);
            }
            this.ctx.closePath();
        };

        this.ctx.save();

        // 1. 底部厚度與陰影 (立體側邊)
        hexPath(x, y + 4, radius);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.fill();
        hexPath(x, y + 2, radius);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        this.ctx.fill();

        // 2. 主要填色
        hexPath(x, y, radius);
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();

        // 2b. 材質渲染 (草地或道路)
        this.ctx.save();
        this.ctx.clip(); // 限制材質只畫在六角形內
        if (texture === 'grass') {
            this.ctx.fillStyle = 'rgba(120, 200, 100, 0.15)';
            for (let i = 0; i < 8; i++) {
                const tx = x + (Math.random() - 0.5) * radius * 1.5;
                const ty = y + (Math.random() - 0.5) * radius * 1.5 * isoSquash;
                this.ctx.fillRect(tx, ty, 3, 2);
            }
        } else if (texture === 'road') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            for (let i = 0; i < 6; i++) {
                const tx = x + (Math.random() - 0.5) * radius * 1.2;
                const ty = y + (Math.random() - 0.5) * radius * 1.2 * isoSquash;
                this.ctx.beginPath();
                this.ctx.arc(tx, ty, Math.random() * 2 + 1, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        this.ctx.restore();

        // 3. 斜向高光漸層 (左上亮，右下暗)
        hexPath(x, y, radius);
        const gradOffset = radius * 0.8;
        const innerGrad = this.ctx.createLinearGradient(x - gradOffset, y - gradOffset * isoSquash, x + gradOffset, y + gradOffset * isoSquash);
        innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        innerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
        this.ctx.fillStyle = innerGrad;
        this.ctx.fill();

        // 4. 邊框
        hexPath(x, y, radius);
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();

        // 5. 左上角亮邊 (模擬光源從左上方來)
        this.ctx.beginPath();
        for (let i = 3; i <= 6; i++) {
            const idx = i % 6;
            const angle = (Math.PI / 3) * idx;
            const hx = x + (radius - 1) * Math.cos(angle);
            const hy = y + (radius - 1) * Math.sin(angle) * isoSquash;
            if (i === 3) this.ctx.moveTo(hx, hy);
            else this.ctx.lineTo(hx, hy);
        }
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        this.ctx.restore();
    }

    // drawBottomSection removed

    drawUnitCard(unit, x, y, size, isDragging = false, targetCtx = null) {
        if (!unit) return;
        const ctx = targetCtx || this.ctx;
        const info = this.core.unitTypes[unit.type];
        if (!info) return;

        ctx.save();
        ctx.translate(x, y);
        
        // 拖曳時加高浮起並產生較大陰影
        const dragLift = isDragging ? size * 0.3 : 0;
        const baseThickness = size * 0.3;
        const squash = 0.65; // 等角透視壓縮比例
        const rx = size * 0.85;
        const ry = size * 0.85 * squash;
        
        ctx.translate(0, -dragLift);

        if (isDragging) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetY = dragLift;
        }

        // 1. 繪製圓柱體側面 (3D 厚度)
        ctx.fillStyle = info.color;
        ctx.beginPath();
        // 下半圓弧
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI, false);
        // 連接至頂部
        ctx.lineTo(-rx, -baseThickness);
        // 頂部上半圓弧 (反向)
        ctx.ellipse(0, -baseThickness, rx, ry, 0, Math.PI, 0, true);
        ctx.closePath();
        ctx.fill();

        // 側面暗部漸層 (立體感)
        const sideGrad = ctx.createLinearGradient(0, -baseThickness, 0, ry);
        sideGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
        sideGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = sideGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 重置陰影以免影響後續繪製
        ctx.shadowColor = 'transparent';

        // 2. 繪製圓柱體頂部面板
        ctx.fillStyle = info.color;
        ctx.beginPath();
        ctx.ellipse(0, -baseThickness, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 頂部內陰影/高光漸層
        const innerGrad = ctx.createRadialGradient(0, -baseThickness - ry * 0.4, 0, 0, -baseThickness, rx);
        innerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        innerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = innerGrad;
        ctx.fill();

        // 頂部邊框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3. 繪製角色 (Emoji 站立於棋座上)
        ctx.fillStyle = '#FFF';
        ctx.font = `${size * 0.8}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // Emoji 底部對齊到圓柱體頂部中心
        ctx.fillText(info.emoji, 0, -baseThickness + size * 0.15);

        // 4. 等級標牌 (懸浮在前面)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.roundRect(-size * 0.5, -baseThickness + size * 0.3, size, size * 0.35, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFF';
        ctx.font = `bold ${size * 0.3}px Inter`;
        ctx.textBaseline = 'middle';
        ctx.fillText(`Lv.${unit.level}`, 0, -baseThickness + size * 0.48);

        ctx.restore();
    }

    drawEnemies() {
        this.core.enemies.forEach(e => {
            const size = e.isBoss ? 20 : 14;
            const rx = size;
            const ry = size * 0.65;
            const thickness = size * 0.8;

            this.ctx.save();
            this.ctx.translate(e.x, e.y);

            const color = e.isBoss ? '#D32F2F' : '#7B1FA2';
            this.ctx.fillStyle = color;
            
            // 繪製圓柱體側面
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI, false);
            this.ctx.lineTo(-rx, -thickness);
            this.ctx.ellipse(0, -thickness, rx, ry, 0, Math.PI, 0, true);
            this.ctx.closePath();
            this.ctx.fill();

            // 側面暗部
            const sideGrad = this.ctx.createLinearGradient(0, -thickness, 0, ry);
            sideGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
            sideGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
            this.ctx.fillStyle = sideGrad;
            this.ctx.fill();
            
            // 繪製圓柱體頂部
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(0, -thickness, rx, ry, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // Emoji
            this.ctx.font = e.isBoss ? '20px Inter' : '14px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillStyle = '#FFF';
            this.ctx.fillText(e.emoji || '👹', 0, -thickness + size * 0.2);

            this.ctx.restore();

            // 血條 (浮在上方)
            const hpRatio = e.hp / e.maxHp;
            const barW = e.isBoss ? 28 : 20;
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            this.ctx.fillRect(e.x - barW/2, e.y - thickness - 12, barW, 4);
            this.ctx.fillStyle = hpRatio > 0.4 ? '#00E676' : '#FF1744';
            this.ctx.fillRect(e.x - barW/2, e.y - thickness - 12, barW * hpRatio, 4);
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
