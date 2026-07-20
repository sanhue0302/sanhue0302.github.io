class DialogManager {
    constructor() {
        this.overlay = document.getElementById('dialogue-overlay');
        this.domAction = document.getElementById('display-action');
        this.domText = document.getElementById('display-text');
        this.domBox = document.getElementById('dialogue-box');
        this.domNarration = document.getElementById('narration-overlay');
        this.domStand = document.getElementById('active-stand-painting');
        this.domCgCanvas = document.getElementById('cg-canvas');
        this.domCgLayer = document.querySelector('.cg-layer');
        this.domCharName = document.getElementById('char-name');
        this.domCharAvatar = document.getElementById('char-avatar');

        this.dialogues = [];
        this.currentIndex = 0;
        this.onComplete = null;
        
        // Clone to remove old event listeners if any
        const clone = this.overlay.cloneNode(true);
        this.overlay.parentNode.replaceChild(clone, this.overlay);
        this.overlay = clone;

        // Re-fetch elements after clone
        this.domAction = document.getElementById('display-action');
        this.domText = document.getElementById('display-text');
        this.domBox = document.getElementById('dialogue-box');
        this.domNarration = document.getElementById('narration-overlay');
        this.domStand = document.getElementById('active-stand-painting');
        this.domCgCanvas = document.getElementById('cg-canvas');
        this.domCgLayer = document.querySelector('.cg-layer');
        this.domCharName = document.getElementById('char-name');
        this.domCharAvatar = document.getElementById('char-avatar');

        this.overlay.addEventListener('click', () => this.next());
    }

    show(dialogues, onComplete) {
        this.dialogues = dialogues;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.overlay.classList.remove('hidden');
        
        // Reset states
        this.domStand.style.display = 'none';
        this.domCgLayer.style.display = 'none';
        this.domStand.src = '';
        this.domCgCanvas.src = '';
        
        this.render();
    }

    triggerScreenShake() {
        this.overlay.classList.remove('effect-shake');
        void this.overlay.offsetWidth; // trigger reflow
        this.overlay.classList.add('effect-shake');
        setTimeout(() => this.overlay.classList.remove('effect-shake'), 500);
    }

    triggerFullScreenFlashRed() {
        this.overlay.classList.remove('effect-flash-red');
        void this.overlay.offsetWidth; // trigger reflow
        this.overlay.classList.add('effect-flash-red');
        setTimeout(() => this.overlay.classList.remove('effect-flash-red'), 500);
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
        
        const node = this.dialogues[this.currentIndex];
        this.advanceStory(node);
    }

    advanceStory(node) {
        // --- 步驟 1: 清理與觸發特效 (Effects Layer) ---
        this.domBox.classList.remove('blushing-effect');
        if (node.effect === "heartbeat_fast") {
            this.domBox.classList.add('blushing-effect');
        } else if (node.effect === "screen_shake") {
            this.triggerScreenShake();
        } else if (node.effect === "flash_red") {
            this.triggerFullScreenFlashRed();
        }

        // --- 步驟 2: 控制滿版福利 CG (CG Layer) ---
        if (node.cgImage) {
            this.domCgCanvas.src = `assets/cg/${node.cgImage}`;
            this.domCgLayer.style.display = 'block';
        } else {
            this.domCgLayer.style.display = 'none';
        }

        // --- 步驟 3: 判斷是否進入「純旁白模式」 ---
        if (node.name === "旁白") {
            this.domBox.style.display = 'none';
            this.domStand.style.display = 'none';
            this.domNarration.style.display = 'block';
            this.domNarration.innerHTML = node.action || node.text || '';
            
            // Re-trigger animation
            this.domNarration.classList.remove('narration-animate');
            void this.domNarration.offsetWidth; // trigger reflow
            this.domNarration.classList.add('narration-animate');
            
            return;
        }

        // --- 步驟 4: 常規角色/獨白對話模式處理 ---
        this.domNarration.style.display = 'none';
        this.domBox.style.display = 'block';

        // 4.1 控制「常規說話」與「獨立內心獨白」的 UI 樣式切換
        if (node.isThought === true) {
            this.domBox.classList.add('is-thought-node');
        } else {
            this.domBox.classList.remove('is-thought-node');
        }

        // 4.2 渲染角色名字與小頭像
        this.domCharName.innerText = node.name || '';
        if (node.avatar) {
            // 判斷是否為圖片路徑 (有副檔名或是網址)
            if (node.avatar.includes('.') || node.avatar.startsWith('http')) {
                this.domCharAvatar.innerHTML = `<img src="${node.avatar}" alt="avatar">`;
            } else {
                this.domCharAvatar.innerHTML = `<div class="emoji-avatar">${node.avatar}</div>`;
            }
            this.domCharAvatar.style.display = 'flex';
        } else {
            this.domCharAvatar.innerHTML = '';
            this.domCharAvatar.style.display = 'none';
        }

        // 4.3 渲染物理肢體動作
        if (node.action && node.action.trim() !== "") {
            this.domAction.style.display = 'block';
            this.domAction.innerHTML = `＊${node.action}＊`;
        } else {
            this.domAction.style.display = 'none';
            this.domAction.innerHTML = '';
        }

        // 4.4 渲染台詞文字
        if (node.text && node.text.trim() !== "") {
            this.domText.style.display = 'block';
            this.domText.innerHTML = node.text;
        } else {
            this.domText.style.display = 'none';
            this.domText.innerHTML = '';
        }

        // --- 步驟 5: 處理物理大立繪 (Stand Painting) ---
        if (!node.cgImage && node.standPainting) {
            this.domStand.src = `assets/sprites/${node.standPainting}`;
            this.domStand.style.display = 'block';
        } else if (node.cgImage) {
            this.domStand.style.display = 'none';
        }
        // 如果沒有提供 standPainting，立繪狀態保持不變 (防閃爍)
    }

    next() {
        this.currentIndex++;
        this.render();
    }
}

