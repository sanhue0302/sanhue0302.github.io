const gameBoard = document.getElementById('game-board');
const resetBtn = document.getElementById('reset-btn');
const levelSpan = document.getElementById('level');
const victoryModal = document.getElementById('victory-modal');
const nextLevelBtn = document.getElementById('next-level-btn');

let currentLevel = 1;
let branches = [];
let selectedBranchIndex = null;
let completedBranchIndices = new Set();
let BIRDS_PER_BRANCH = 4;

let inventory = { addBranch: 1, undo: 1, hint: 1 };
let itemUsedThisLevel = { addBranch: false, undo: false, hint: false };
let moveHistory = [];
let bestTimes = {};
let timerInterval = null;
let secondsElapsed = 0;
let hasStartedTimer = false;
const timerSpan = document.getElementById('timer');

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('birdSort_saveData'));
    if (savedData) {
        currentLevel = savedData.currentLevel || 1;
        inventory = savedData.inventory || { addBranch: 1, undo: 1, hint: 1 };
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
    if (timerSpan) timerSpan.textContent = `⏱️ ${m}:${s}`;
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
    badgeAddBranch.textContent = inventory.addBranch;
    btnAddBranch.disabled = inventory.addBranch === 0;

    badgeUndo.textContent = inventory.undo;
    btnUndo.disabled = inventory.undo === 0 || moveHistory.length === 0;

    badgeHint.textContent = inventory.hint;
    btnHint.disabled = inventory.hint === 0;
    
    saveData();
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

function renderBoard() {
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
            
            branchDiv.appendChild(birdDiv);
        });

        branchDiv.addEventListener('click', () => handleBranchClick(index));
        
        if (index % 2 === 0) {
            leftBranchesContainer.appendChild(branchDiv);
        } else {
            rightBranchesContainer.appendChild(branchDiv);
        }
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
            
            // Deep copy branches for history
            moveHistory.push(JSON.parse(JSON.stringify(branches)));
            renderItems(); // enable undo button
            
            // Move birds
            for (let i = 0; i < moveCount; i++) {
                const birdToMove = sourceBranch.pop();
                targetBranch.push(birdToMove);
            }
            selectedBranchIndex = null;
            
            const isCompleted = targetBranch.length === BIRDS_PER_BRANCH && targetBranch.every(c => c === targetBranch[0]);
            
            renderBoard();
            
            if (isCompleted) {
                const targetBranchDOM = document.querySelector(`.branch[data-index="${index}"]`);
                if (targetBranchDOM) {
                    targetBranchDOM.classList.add('just-completed');
                }
                completedBranchIndices.add(index);
            }
            
            checkVictory();
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
    if (inventory.addBranch > 0) {
        inventory.addBranch--;
        itemUsedThisLevel.addBranch = true;
        branches.push([]);
        renderBoard();
        renderItems();
    }
});

btnUndo.addEventListener('click', () => {
    if (inventory.undo > 0 && moveHistory.length > 0) {
        inventory.undo--;
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
    if (inventory.hint > 0) {
        let possibleMoves = [];
        for (let i = 0; i < branches.length; i++) {
            const src = branches[i];
            if (src.length === 0) continue;
            if (src.length === BIRDS_PER_BRANCH && src.every(c => c === src[0])) continue;
            
            const topColor = src[src.length - 1];
            const isOnlyOneColor = src.every(c => c === topColor);

            for (let j = 0; j < branches.length; j++) {
                if (i === j) continue;
                const dst = branches[j];
                if (dst.length === BIRDS_PER_BRANCH) continue;
                
                if (dst.length === 0) {
                    if (!isOnlyOneColor) {
                        possibleMoves.push({ src: i, dst: j, weight: 1 });
                    }
                } else {
                    if (dst[dst.length - 1] === topColor) {
                        possibleMoves.push({ src: i, dst: j, weight: 2 });
                    }
                }
            }
        }
        
        if (possibleMoves.length > 0) {
            inventory.hint--;
            itemUsedThisLevel.hint = true;
            renderItems();
            
            possibleMoves.sort((a, b) => b.weight - a.weight);
            const hintMove = possibleMoves[0];
            
            const srcDiv = document.querySelector(`.branch[data-index="${hintMove.src}"]`);
            const dstDiv = document.querySelector(`.branch[data-index="${hintMove.dst}"]`);
            
            if (srcDiv) srcDiv.classList.add('hint-highlight');
            if (dstDiv) dstDiv.classList.add('hint-highlight');
            
            setTimeout(() => {
                if (srcDiv) srcDiv.classList.remove('hint-highlight');
                if (dstDiv) dstDiv.classList.remove('hint-highlight');
            }, 2000);
        } else {
            alert("目前沒有可以移動的步驟！");
        }
    }
});

// Start game
loadData();
initGame();
