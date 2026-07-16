const gameBoard = document.getElementById('game-board');
const resetBtn = document.getElementById('reset-btn');
const levelSpan = document.getElementById('level');
const victoryModal = document.getElementById('victory-modal');
const nextLevelBtn = document.getElementById('next-level-btn');
const noSolutionModal = document.getElementById('no-solution-modal');
const restartLevelBtn = document.getElementById('restart-level-btn');

const INFINITE_ITEMS = false; // 暫時改為無限次數
const CHECK_NO_SOLUTION = false; // 是否開啟「每步自動檢查無解」的功能

let currentLevel = 1;
let branches = [];
let selectedBranchIndex = null;
let completedBranchIndices = new Set();
let BIRDS_PER_BRANCH = 4;

let inventory = { addBranch: 3, undo: 3, hint: 3 };
let itemUsedThisLevel = { addBranch: false, undo: false, hint: false };
let moveHistory = [];
let bestTimes = {};
let timerInterval = null;
let secondsElapsed = 0;
let hasStartedTimer = false;
const timerSpan = document.getElementById('timer-val');

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('birdSort_saveData'));
    if (savedData) {
        currentLevel = savedData.currentLevel || 1;
        inventory = savedData.inventory || { addBranch: 3, undo: 3, hint: 3 };
    }
    const savedTimes = JSON.parse(localStorage.getItem('birdSort_bestTimes'));
    if (savedTimes) {
        bestTimes = savedTimes;
    }
}

function saveData() {
    localStorage.setItem('birdSort_saveData', JSON.stringify({
        currentLevel,
        inventory
    }));
    localStorage.setItem('birdSort_bestTimes', JSON.stringify(bestTimes));
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function checkStartTimer() {
    if (!hasStartedTimer) {
        startTimer();
        hasStartedTimer = true;
    }
}

function updateTimerDisplay() {
    const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const s = (secondsElapsed % 60).toString().padStart(2, '0');
    if (timerSpan) timerSpan.textContent = `${m}:${s}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

const btnAddBranch = document.getElementById('btn-add-branch');
const btnUndo = document.getElementById('btn-undo');
const btnHint = document.getElementById('btn-hint');
const badgeAddBranch = document.getElementById('badge-add-branch');
const badgeUndo = document.getElementById('badge-undo');
const badgeHint = document.getElementById('badge-hint');

function renderItems() {
    const isBranchLimitReached = branches.length >= 10;

    if (INFINITE_ITEMS) {
        badgeAddBranch.textContent = '∞';
        btnAddBranch.disabled = isBranchLimitReached;

        badgeUndo.textContent = '∞';
        btnUndo.disabled = moveHistory.length === 0;

        badgeHint.textContent = '∞';
        btnHint.disabled = false;
    } else {
        badgeAddBranch.textContent = inventory.addBranch;
        btnAddBranch.disabled = inventory.addBranch === 0 || isBranchLimitReached;

        badgeUndo.textContent = inventory.undo;
        btnUndo.disabled = inventory.undo === 0 || moveHistory.length === 0;

        badgeHint.textContent = inventory.hint;
        btnHint.disabled = inventory.hint === 0;
    }
    
    saveData();
}

// --- 關卡求解器 (Backtracking Solver) ---
function isSolved(state) {
    for (let branch of state) {
        if (branch.length > 0) {
            if (branch.length !== BIRDS_PER_BRANCH) return false;
            const first = branch[0];
            if (!branch.every(c => c === first)) return false;
        }
    }
    return true;
}

function getValidMoves(state) {
    let moves = [];
    for (let i = 0; i < state.length; i++) {
        const src = state[i];
        if (src.length === 0) continue;
        
        // 已完成的樹枝不需要再移出
        if (src.length === BIRDS_PER_BRANCH && src.every(c => c === src[0])) continue;
        
        const topColor = src[src.length - 1];
        
        // 計算最上面有幾隻相同顏色的鳥
        let sameColorCount = 0;
        for (let k = src.length - 1; k >= 0; k--) {
            if (src[k] === topColor) sameColorCount++;
            else break;
        }
        
        const isOnlyOneColor = src.every(c => c === topColor);

        for (let j = 0; j < state.length; j++) {
            if (i === j) continue;
            const dst = state[j];
            if (dst.length === BIRDS_PER_BRANCH) continue;
            
            if (dst.length === 0) {
                // 剪枝優化：如果整根樹枝只有同一種顏色的鳥，移到空樹枝並不會改變實質狀態，應予過濾
                if (!isOnlyOneColor) {
                    moves.push({ src: i, dst: j, count: sameColorCount });
                }
            } else {
                if (dst[dst.length - 1] === topColor) {
                    const availableSpace = BIRDS_PER_BRANCH - dst.length;
                    const count = Math.min(sameColorCount, availableSpace);
                    if (count > 0) {
                        moves.push({ src: i, dst: j, count: count });
                    }
                }
            }
        }
    }
    return moves;
}

function applyMove(state, src, dst, count) {
    const nextState = state.map(b => [...b]);
    for (let i = 0; i < count; i++) {
        const bird = nextState[src].pop();
        nextState[dst].push(bird);
    }
    return nextState;
}

function solveGame(startState) {
    let visited = new Set();
    let solutionPath = null;
    
    function dfs(state, path) {
        if (isSolved(state)) {
            solutionPath = path;
            return true;
        }
        
        // 樹枝排序歸一化，降低對稱狀態的搜尋空間
        const stateKey = state.map(b => b.join(',')).sort().join('|');
        if (visited.has(stateKey)) return false;
        visited.add(stateKey);
        
        // 限制搜尋節點數避免無窮深搜或過長卡頓
        if (visited.size > 3000) return false;
        
        const moves = getValidMoves(state);
        
        // 優先搜尋不移至空樹枝的步數，以加速找到解答
        moves.sort((a, b) => {
            const aToEmpty = state[a.dst].length === 0 ? 1 : 0;
            const bToEmpty = state[b.dst].length === 0 ? 1 : 0;
            return aToEmpty - bToEmpty;
        });

        for (let move of moves) {
            const nextState = applyMove(state, move.src, move.dst, move.count);
            if (dfs(nextState, [...path, move])) {
                return true;
            }
        }
        return false;
    }
    
    dfs(startState, []);
    return solutionPath;
}

const levelsConfig = [
    { numBranches: 4, numColors: 3, birdsPerBranch: 4 },
    { numBranches: 5, numColors: 4, birdsPerBranch: 4 },
    { numBranches: 6, numColors: 5, birdsPerBranch: 5 },
    { numBranches: 7, numColors: 6, birdsPerBranch: 5 },
    { numBranches: 7, numColors: 6, birdsPerBranch: 6 },
    { numBranches: 8, numColors: 7, birdsPerBranch: 6 }
];

function initGame() {
    victoryModal.classList.add('hidden');
    noSolutionModal.classList.add('hidden');
    selectedBranchIndex = null;
    completedBranchIndices.clear();
    moveHistory = [];
    itemUsedThisLevel = { addBranch: false, undo: false, hint: false };

    const configIndex = Math.min(currentLevel - 1, levelsConfig.length - 1);
    const config = levelsConfig[configIndex];
    
    BIRDS_PER_BRANCH = config.birdsPerBranch;

    levelSpan.textContent = currentLevel;

    // Generate birds
    let allBirds = [];
    for (let c = 0; c < config.numColors; c++) {
        for (let i = 0; i < BIRDS_PER_BRANCH; i++) {
            allBirds.push(c);
        }
    }

    let isValidLayout = false;
    
    while (!isValidLayout) {
        // Shuffle birds
        for (let i = allBirds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allBirds[i], allBirds[j]] = [allBirds[j], allBirds[i]];
        }

        // Distribute birds to branches
        let birdIndex = 0;
        branches = [];
        for (let i = 0; i < config.numBranches; i++) {
            let branchBirds = [];
            // Fill the branch completely until we run out of birds
            while (branchBirds.length < BIRDS_PER_BRANCH && birdIndex < allBirds.length) {
                branchBirds.push(allBirds[birdIndex]);
                birdIndex++;
            }
            branches.push(branchBirds);
        }
        
        // Validate layout: no branch should be completely sorted
        isValidLayout = true;
        for (let branch of branches) {
            if (branch.length === BIRDS_PER_BRANCH && branch.every(c => c === branch[0])) {
                isValidLayout = false;
                break;
            }
        }
        
        // 確保隨機生成的棋盤佈局是有解的
        if (isValidLayout) {
            const path = solveGame(branches);
            if (!path) {
                isValidLayout = false;
            }
        }
    }
    renderBoard();
    renderItems();
    
    stopTimer();
    secondsElapsed = 0;
    hasStartedTimer = false;
    updateTimerDisplay();
    
    saveData();
}

const leftBranchesContainer = document.getElementById('left-branches');
const rightBranchesContainer = document.getElementById('right-branches');

function renderBoard(hiddenBirds = null) {
    leftBranchesContainer.innerHTML = '';
    rightBranchesContainer.innerHTML = '';

    branches.forEach((branch, index) => {
        const branchDiv = document.createElement('div');
        branchDiv.className = 'branch';
        if (completedBranchIndices.has(index)) {
            branchDiv.classList.add('completed');
        }
        branchDiv.dataset.index = index;

        let sameColorCount = 0;
        if (selectedBranchIndex === index && branch.length > 0) {
            const topBird = branch[branch.length - 1];
            for (let i = branch.length - 1; i >= 0; i--) {
                if (branch[i] === topBird) sameColorCount++;
                else break;
            }
        }

        branch.forEach((birdColor, birdIndex) => {
            const birdDiv = document.createElement('div');
            birdDiv.className = `bird color-${birdColor}`;
            
            if (selectedBranchIndex === index && birdIndex >= branch.length - sameColorCount) {
                birdDiv.classList.add('selected-bird');
            }

            // Check if this bird should be hidden (landing animation in progress)
            if (hiddenBirds && hiddenBirds.branchIndex === index && birdIndex >= hiddenBirds.startIndex) {
                birdDiv.style.visibility = 'hidden';
            }
            
            branchDiv.appendChild(birdDiv);
        });

        // 渲染空位，確保每根樹枝的鳥/空位總數固定，避免鳥的大小隨數量變化而改變
        const emptySlotsCount = BIRDS_PER_BRANCH - branch.length;
        for (let i = 0; i < emptySlotsCount; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'bird empty-slot';
            branchDiv.appendChild(emptyDiv);
        }

        branchDiv.addEventListener('click', () => handleBranchClick(index));
        
        if (index % 2 === 0) {
            leftBranchesContainer.appendChild(branchDiv);
        } else {
            rightBranchesContainer.appendChild(branchDiv);
        }
    });
}

function performMoveWithAnimation(srcIndex, dstIndex, moveCount, callback) {
    const srcDiv = document.querySelector(`.branch[data-index="${srcIndex}"]`);
    if (!srcDiv) {
        if (callback) callback();
        return;
    }

    // 1. 取得即將移動的小鳥 DOM 元素與它們初始的螢幕位置
    const sourceBranch = branches[srcIndex];
    const startIndex = sourceBranch.length - moveCount;
    const movingBirdsInfo = [];
    for (let i = 0; i < moveCount; i++) {
        const el = srcDiv.children[startIndex + i];
        if (el) {
            movingBirdsInfo.push({
                rect: el.getBoundingClientRect(),
                color: sourceBranch[startIndex + i]
            });
        }
    }

    // 2. 進行數據狀態的更新與歷史備份
    moveHistory.push(JSON.parse(JSON.stringify(branches)));
    renderItems(); // 更新上一步按鈕狀態
    
    const targetBranch = branches[dstIndex];
    for (let i = 0; i < moveCount; i++) {
        const birdToMove = sourceBranch.pop();
        targetBranch.push(birdToMove);
    }
    
    // 清除選擇狀態
    selectedBranchIndex = null;

    // 3. 重新渲染更新後的棋盤，並在動畫結束前隱藏目標位置的新小鳥
    const targetStartIndex = targetBranch.length - moveCount;
    renderBoard({
        branchIndex: dstIndex,
        startIndex: targetStartIndex
    });

    // 4. 計算並匹配目標位置的 bounding box (必須在 renderBoard 之後重新 query 新的 branch 節點)
    const dstDiv = document.querySelector(`.branch[data-index="${dstIndex}"]`);
    if (!dstDiv) {
        if (callback) callback();
        return;
    }

    for (let i = 0; i < moveCount; i++) {
        const targetEl = dstDiv.children[targetStartIndex + i];
        // 倒序匹配源小鳥與目標位置（最上面的鳥先飛，降落在最下面）
        const info = movingBirdsInfo[moveCount - 1 - i];
        if (targetEl && info) {
            info.targetRect = targetEl.getBoundingClientRect();
            info.targetEl = targetEl;
        }
    }

    // 5. 創建 Flying Clones 並執行跟隨飛行與降落動畫
    const animPromises = [];

    movingBirdsInfo.forEach((info, index) => {
        // index 0 是最下面的動態鳥，index moveCount-1 是最上面的鳥。
        // 最上面的鳥先飛 (delay = 0)，其餘順序延遲飛出。
        const flyOrder = moveCount - 1 - index;
        const delayMs = flyOrder * 150; // 每隻鳥延遲 150ms 飛出，形成一隻隻跟隨的效果

        const clone = document.createElement('div');
        clone.className = `bird color-${info.color} flying-clone`;
        clone.style.position = 'fixed';
        clone.style.left = `${info.targetRect.left}px`;
        clone.style.top = `${info.targetRect.top}px`;
        clone.style.width = `${info.targetRect.width}px`;
        clone.style.height = `${info.targetRect.height}px`;
        clone.style.margin = '0';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.transition = 'none'; // 先關閉 transition 確保初始位置正確

        const dx = info.rect.left - info.targetRect.left;
        const dy = info.rect.top - info.targetRect.top;

        // 起飛姿態：平移至起點、略微放大並有飛行的傾斜角
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(1.15) rotate(${dx < 0 ? 15 : -15}deg)`;
        document.body.appendChild(clone);

        const p = new Promise(resolve => {
            setTimeout(() => {
                // 飛行過程過渡
                clone.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                // 降落姿態：回復正常大小和無旋轉
                clone.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';

                const onTransitionEnd = (e) => {
                    if (e.propertyName === 'transform') {
                        clone.removeEventListener('transitionend', onTransitionEnd);
                        clone.remove();
                        
                        // 顯示真實的鳥，並附加 landing 彈跳效果
                        if (info.targetEl) {
                            info.targetEl.style.visibility = 'visible';
                            info.targetEl.classList.add('landed');
                            setTimeout(() => {
                                if (info.targetEl) {
                                    info.targetEl.classList.remove('landed');
                                }
                            }, 350);
                        }
                        resolve();
                    }
                };
                clone.addEventListener('transitionend', onTransitionEnd);

                // 安全保底清除
                setTimeout(() => {
                    if (clone.parentNode) {
                        clone.remove();
                        if (info.targetEl) {
                            info.targetEl.style.visibility = 'visible';
                        }
                        resolve();
                    }
                }, 600);
            }, delayMs);
        });
        animPromises.push(p);
    });

    // 6. 所有飛行動畫結束後，處理樹枝完成與回調
    Promise.all(animPromises).then(() => {
        const isCompleted = targetBranch.length === BIRDS_PER_BRANCH && targetBranch.every(c => c === targetBranch[0]);
        if (isCompleted) {
            const targetBranchDOM = document.querySelector(`.branch[data-index="${dstIndex}"]`);
            if (targetBranchDOM) {
                targetBranchDOM.classList.add('just-completed');
            }
            completedBranchIndices.add(dstIndex);
        }
        if (callback) callback();
    });
}

function handleBranchClick(index) {
    checkStartTimer();
    
    if (selectedBranchIndex === null) {
        // Select a branch if it has birds
        if (branches[index].length > 0) {
            selectedBranchIndex = index;
            renderBoard();
        }
    } else {
        if (selectedBranchIndex === index) {
            // Deselect
            selectedBranchIndex = null;
            renderBoard();
            return;
        }

        const sourceBranch = branches[selectedBranchIndex];
        const targetBranch = branches[index];

        if (sourceBranch.length === 0) {
            selectedBranchIndex = null;
            renderBoard();
            return;
        }

        const topBird = sourceBranch[sourceBranch.length - 1];

        // Check how many birds of the same color are on top
        let sameColorCount = 0;
        for (let i = sourceBranch.length - 1; i >= 0; i--) {
            if (sourceBranch[i] === topBird) {
                sameColorCount++;
            } else {
                break;
            }
        }

        const availableSpace = BIRDS_PER_BRANCH - targetBranch.length;
        const moveCount = Math.min(sameColorCount, availableSpace);

        // Check if move is valid
        if (moveCount > 0 && (targetBranch.length === 0 || targetBranch[targetBranch.length - 1] === topBird)) {
            performMoveWithAnimation(selectedBranchIndex, index, moveCount, () => {
                checkVictory();
            });
        } else {
            // Invalid move, change selection or deselect
            if (branches[index].length > 0) {
                selectedBranchIndex = index;
            } else {
                selectedBranchIndex = null;
            }
            renderBoard();
        }
    }
}

function checkVictory() {
    let isVictory = true;
    for (let branch of branches) {
        if (branch.length > 0) {
            if (branch.length !== BIRDS_PER_BRANCH) {
                isVictory = false;
                break;
            }
            // Check if all birds in branch are same color
            const firstColor = branch[0];
            if (!branch.every(color => color === firstColor)) {
                isVictory = false;
                break;
            }
        }
    }

    if (isVictory) {
        stopTimer();
        if (!bestTimes[currentLevel] || secondsElapsed < bestTimes[currentLevel]) {
            bestTimes[currentLevel] = secondsElapsed;
        }
        saveData();
        
        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        const bm = Math.floor(bestTimes[currentLevel] / 60).toString().padStart(2, '0');
        const bs = (bestTimes[currentLevel] % 60).toString().padStart(2, '0');
        
        const victoryTimeEl = document.getElementById('victory-time');
        if (victoryTimeEl) {
            victoryTimeEl.innerHTML = `花費時間: ${m}:${s}<br><small style="color: #ffde59;">最佳紀錄: ${bm}:${bs}</small>`;
        }

        setTimeout(() => {
            victoryModal.classList.remove('hidden');
        }, 300);
    } else {
        // 當前未通關，檢查棋盤是否已無解
        if (CHECK_NO_SOLUTION) {
            const path = solveGame(branches);
            if (!path || path.length === 0) {
                setTimeout(() => {
                    noSolutionModal.classList.remove('hidden');
                }, 600); // 延遲 600ms 等最後一隻飛行的鳥降落動畫跑完
            }
        }
    }
}

resetBtn.addEventListener('click', initGame);

nextLevelBtn.addEventListener('click', () => {
    if (!itemUsedThisLevel.addBranch) inventory.addBranch = Math.min(3, inventory.addBranch + 1);
    if (!itemUsedThisLevel.undo) inventory.undo = Math.min(3, inventory.undo + 1);
    if (!itemUsedThisLevel.hint) inventory.hint = Math.min(3, inventory.hint + 1);
    
    currentLevel++;
    initGame();
});

// Item actions
btnAddBranch.addEventListener('click', () => {
    checkStartTimer();
    if (branches.length >= 10) {
        alert("最多只能有 10 枝樹枝！");
        return;
    }
    if (INFINITE_ITEMS || inventory.addBranch > 0) {
        if (!INFINITE_ITEMS) {
            inventory.addBranch--;
        }
        itemUsedThisLevel.addBranch = true;
        branches.push([]);
        renderBoard();
        renderItems();
    }
});

btnUndo.addEventListener('click', () => {
    if ((INFINITE_ITEMS || inventory.undo > 0) && moveHistory.length > 0) {
        if (!INFINITE_ITEMS) {
            inventory.undo--;
        }
        itemUsedThisLevel.undo = true;
        branches = moveHistory.pop();
        selectedBranchIndex = null;
        
        // Fix completed set if we undo a completion
        completedBranchIndices.clear();
        branches.forEach((branch, idx) => {
            if (branch.length === BIRDS_PER_BRANCH && branch.every(c => c === branch[0])) {
                completedBranchIndices.add(idx);
            }
        });
        
        renderBoard();
        renderItems();
    }
});

btnHint.addEventListener('click', () => {
    checkStartTimer();
    if (INFINITE_ITEMS || inventory.hint > 0) {
        // 使用解題器尋找從當前狀態到獲勝的步驟路徑
        const path = solveGame(branches);
        
        if (path && path.length > 0) {
            if (!INFINITE_ITEMS) {
                inventory.hint--;
            }
            itemUsedThisLevel.hint = true;
            renderItems();
            
            const hintMove = path[0];
            
            const srcDiv = document.querySelector(`.branch[data-index="${hintMove.src}"]`);
            const dstDiv = document.querySelector(`.branch[data-index="${hintMove.dst}"]`);
            
            if (srcDiv) srcDiv.classList.add('hint-highlight');
            if (dstDiv) dstDiv.classList.add('hint-highlight');
            
            setTimeout(() => {
                if (srcDiv) srcDiv.classList.remove('hint-highlight');
                if (dstDiv) dstDiv.classList.remove('hint-highlight');
                
                performMoveWithAnimation(hintMove.src, hintMove.dst, hintMove.count, () => {
                    checkVictory();
                });
            }, 800);
        } else {
            noSolutionModal.classList.remove('hidden');
        }
    }
});

restartLevelBtn.addEventListener('click', initGame);

// Start game
loadData();
initGame();
