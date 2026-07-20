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
        let saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
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
            let saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
            let seenProps = saveObj.seenProps || [];
            if (!seenProps.includes('combo') && typeof PROP_TUTORIALS !== 'undefined' && PROP_TUTORIALS['combo']) {
                seenProps.push('combo');
                saveObj.seenProps = seenProps;
                localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(saveObj));
                
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
                this.gameState.chargeSubordinates(block.type);
                
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
                let saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
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
                    localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify(saveObj));
                    
                    const dialogues = [];
                    propsToShow.forEach(p => {
                        if (typeof PROP_TUTORIALS !== 'undefined' && PROP_TUTORIALS[p]) {
                            const info = PROP_TUTORIALS[p];
                            dialogues.push({
                                name: "系統提示",
                                avatar: "⚠️",
                                text: `<div class='tutorial-box'><div class='tutorial-block-demo' style='background: ${info.color}; font-size: 20px;'><i class='fa-solid ${info.icon}'></i></div><div class='tutorial-desc'><strong>特殊合成：${info.name}</strong><br>${info.desc}</div></div>`
                            });
                        }
                    });
                    
                    if (dialogues.length > 0) {
                        await new Promise(resolve => {
                            this.gameState.dialogManager.show(dialogues, resolve);
                        });
                    }
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
        let saveObj = JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || '{}');
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
                if (this.grid[r][c].propType === 'obstacle_jam') continue; // 無法移動卡紙方塊
                
                // Color bomb is always movable if there's a playable block adjacent and it's not a paper jam
                if (this.grid[r][c].propType === 'color') {
                    if (c+1 < this.cols && this.grid[r][c+1].isPlayable && this.grid[r][c+1].propType !== 'obstacle_jam') return {r1:r, c1:c, r2:r, c2:c+1};
                    if (r+1 < this.rows && this.grid[r+1][c].isPlayable && this.grid[r+1][c].propType !== 'obstacle_jam') return {r1:r, c1:c, r2:r+1, c2:c};
                }
                
                if (c + 1 < this.cols && this.grid[r][c+1].isPlayable && this.grid[r][c+1].type && this.grid[r][c+1].propType !== 'obstacle_jam') {
                    this.simulateSwap(r, c, r, c+1);
                    const matches = this.checkMatches();
                    this.simulateSwap(r, c, r, c+1); 
                    if (matches.length > 0) return {r1:r, c1:c, r2:r, c2:c+1};
                }
                
                if (r + 1 < this.rows && this.grid[r+1][c].isPlayable && this.grid[r+1][c].type && this.grid[r+1][c].propType !== 'obstacle_jam') {
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
