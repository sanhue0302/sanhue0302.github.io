/**
 * =====================================================================================
 * LeaderboardSystem - 通用單機與全網線上排行榜 SDK (GitHub Pages 開箱即用)
 * =====================================================================================
 * 
 * 核心特色：
 * 1. 雙模式支援：單機本地高分 (localStorage) + 全網線上排行榜 (Firebase Realtime Database)
 * 2. 斷線防護：連不上網路或沒設定 Firebase 時，自動離線降級顯示警示卡片，本地排行不受影響。
 * 3. 安全防護：內建 Checksum 防修改驗證與伺服器層級資料型別校驗。
 * 4. 極簡調用：只需一行 `leaderboard.show({ score, onRestart })` 即可顯示排行榜。
 * 
 * -------------------------------------------------------------------------------------
 * 📖 使用方式 (Usage Guide)
 * -------------------------------------------------------------------------------------
 * 
 * 1. 於 HTML 中引入樣式與腳本：
 *    <link rel="stylesheet" href="../../assets/css/leaderboard-system.css">
 *    <script src="../../assets/js/leaderboard-system.js"></script>
 * 
 * 2. 初始化套件：
 *    const leaderboard = new LeaderboardSystem({
 *        gameId: 'suika',           // [必填] 遊戲唯一識別碼 (避免不同遊戲分數混淆)
 *        gameName: '合成大西瓜',     // [選填] 遊戲名稱
 *        title: '🍉 瓜農榮譽榜',     // [選填] 彈窗標題
 *        scoreUnit: '分',           // [選填] 分數單位 (預設: '分')
 *        theme: 'light',            // [選填] 風格: 'light' | 'dark' | 'glass'
 *        maxEntries: 10,            // [選填] 顯示前幾名 (預設: 10)
 *        firebaseConfig: null       // [選填] 傳入 Firebase 設定物件即開啟全球連線模式
 *    });
 * 
 * 3. 遊戲結束 (Game Over) 時呼叫顯示彈窗：
 *    leaderboard.show({
 *        score: 1250,                                      // 本次獲得分數
 *        extra: { level: 5, mode: '標準', avatar: '🍉' },   // 擴充中繼資料 (選填)
 *        onRestart: () => { restartGame(); }               // 點擊「再玩一次」的回呼函式
 *    });
 * 
 * -------------------------------------------------------------------------------------
 * 🔥 Firebase 全球線上排行榜設定步驟 (Firebase Setup Guide)
 * -------------------------------------------------------------------------------------
 * 
 * 若要開啟全網玩家線上競爭功能，請照以下 4 個步驟設定：
 * 
 * 【步驟一：建立 Firebase 專案】
 * 1. 前往 Firebase Console (https://console.firebase.google.com/) 並登入 Google 帳號。
 * 2. 點擊「新增專案」，輸入專案名稱（例如：`my-github-games`）。
 * 
 * 【步驟二：建立 Realtime Database 資料庫】
 * 1. 進入專案後，在左側選單點擊 [Build (建立)] -> [Realtime Database]。
 * 2. 點擊「建立資料庫」，位置可選擇 `asia-southeast1` 或 `us-central1`。
 * 3. 安全性規則初始可先選擇「以測試模式啟動 (Test Mode)」。
 * 
 * 【步驟三：設定資料庫安全防護規則 (Security Rules)】
 * 進入 Realtime Database 的 [Rules (規則)] 分頁，將內容替換為以下 JSON 規則：
 * ---------------------------------------------------------------------------------
 * {
 *   "rules": {
 *     "leaderboards": {
 *       ".read": true,
 *       "$gameId": {
 *         ".indexOn": ["score"],
 *         "$entry": {
 *           // 1. 防刪除/改寫他人紀錄：只允許新增紀錄，不允許覆寫舊資料
 *           ".write": "!data.exists()",
 *           // 2. 欄位結構驗證：必須包含 name, score, timestamp 欄位
 *           ".validate": "newData.hasChildren(['name', 'score', 'timestamp']) 
 *                         && newData.child('score').isNumber() 
 *                         && newData.child('score').val() >= 0
 *                         && newData.child('score').val() <= 10000000
 *                         && newData.child('name').isString() 
 *                         && newData.child('name').val().length > 0
 *                         && newData.child('name').val().length <= 12"
 *         }
 *       }
 *     }
 *   }
 * }
 * ---------------------------------------------------------------------------------
 * 
 * 【步驟四：取得 API 金鑰並引入 CDN】
 * 1. 點擊左上角齒輪 ⚙️ [專案設定] -> 在「您的應用程式」區塊點選Web `</>` 圖示註冊 App。
 * 2. 複製 `firebaseConfig` 物件，並在頁面中額外引入 Firebase CDN 腳本：
 * 
 *    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
 *    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
 *    
 *    <script>
 *      const firebaseConfig = {
 *        apiKey: "AIzaSy...",
 *        authDomain: "my-games.firebaseapp.com",
 *        databaseURL: "https://my-games-default-rtdb.firebaseio.com",
 *        projectId: "my-games",
 *        storageBucket: "my-games.appspot.com",
 *        messagingSenderId: "123456789",
 *        appId: "1:123456789:web:abcdef"
 *      };
 *      
 *      // 初始化 LeaderboardSystem 帶入 firebaseConfig
 *      const leaderboard = new LeaderboardSystem({
 *        gameId: 'suika',
 *        firebaseConfig: firebaseConfig
 *      });
 *    </script>
 * =====================================================================================
 */
class LeaderboardSystem {
    /**
     * @param {Object} options - 初始化選項參數
     * @param {string} options.gameId - [必填] 遊戲識別碼 (如: 'suika')
     * @param {string} [options.gameName='小遊戲'] - 遊戲顯示名稱
     * @param {string} [options.title='🏆 英雄排行榜'] - 排行榜彈窗標題
     * @param {string} [options.scoreUnit='分'] - 分數單位
     * @param {string} [options.theme='light'] - 主題風格 ('light' | 'dark' | 'glass')
     * @param {number} [options.maxEntries=10] - 最多顯示筆數
     * @param {Object|null} [options.firebaseConfig=null] - Firebase 設定物件
     * @param {Function|null} [options.renderItem=null] - 自訂列表渲染函數 (entry, index) => string
     */
    constructor(options = {}) {
        this.options = Object.assign({
            gameId: 'default_game',
            gameName: '小遊戲',
            title: '🏆 英雄排行榜',
            scoreUnit: '分',
            theme: 'light', // 'light' | 'dark' | 'glass'
            maxEntries: 10,
            firebaseConfig: null,
            renderItem: null
        }, options);

        this.storageKeyLocal = `lbs_${this.options.gameId}_local`;
        this.storageKeyName = `lbs_player_name`;
        this.secretSalt = `lbs_salt_${this.options.gameId}_2026`;

        this.activeTab = 'global'; // 'global' | 'local'
        this.isOnline = navigator.onLine;
        this.firebaseApp = null;
        this.firebaseDb = null;
        this.isFirebaseReady = false;
        this.currentScore = null;
        this.currentExtra = null;
        this.onRestartCallback = null;

        this.initFirebase();
        this.initDOM();
        this.bindNetworkEvents();
    }

    /* -----------------------------------------------------------------
     * Initialization & Security Verification
     * ----------------------------------------------------------------- */
    initFirebase() {
        if (!this.options.firebaseConfig) {
            console.log('[LeaderboardSystem] 尚未設定 Firebase，預設開啟極速本地排行模式。');
            return;
        }

        try {
            if (typeof firebase !== 'undefined') {
                // Prevent duplicate initialization
                const existingApps = firebase.apps || [];
                const appName = `app_${this.options.gameId}`;
                let app = existingApps.find(a => a.name === appName);
                
                if (!app) {
                    app = firebase.initializeApp(this.options.firebaseConfig, appName);
                }
                
                this.firebaseApp = app;
                this.firebaseDb = firebase.database(app);
                this.isFirebaseReady = true;
            } else {
                console.warn('[LeaderboardSystem] 未偵測到 Firebase SDK 腳本。');
            }
        } catch (e) {
            console.warn('[LeaderboardSystem] Firebase 初始化過程異常:', e);
            this.isFirebaseReady = false;
        }
    }

    bindNetworkEvents() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            if (this.modal && this.modal.classList.contains('lbs-active') && this.activeTab === 'global') {
                this.loadLeaderboard();
            }
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
            if (this.modal && this.modal.classList.contains('lbs-active') && this.activeTab === 'global') {
                this.renderOfflineNotice();
            }
        });
    }

    // Simple Hash Checksum for local data tamper detection
    calculateChecksum(name, score, timestamp) {
        let str = `${name}_${score}_${timestamp}_${this.secretSalt}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    /* -----------------------------------------------------------------
     * DOM Creation & Management
     * ----------------------------------------------------------------- */
    initDOM() {
        if (document.getElementById(`lbs-overlay-${this.options.gameId}`)) {
            this.overlay = document.getElementById(`lbs-overlay-${this.options.gameId}`);
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = `lbs-overlay-${this.options.gameId}`;
        overlay.className = 'lbs-overlay';
        
        const savedName = localStorage.getItem(this.storageKeyName) || '';

        overlay.innerHTML = `
            <div class="lbs-modal lbs-theme-${this.options.theme}">
                <div class="lbs-header">
                    <div class="lbs-title-box">
                        <h3 class="lbs-title">${this.escapeHTML(this.options.title)}</h3>
                    </div>
                    <button class="lbs-close-btn" title="關閉">&times;</button>
                </div>

                <div class="lbs-tabs">
                    <button class="lbs-tab ${this.activeTab === 'global' ? 'lbs-active' : ''}" data-tab="global">
                        🌐 全球排行
                    </button>
                    <button class="lbs-tab ${this.activeTab === 'local' ? 'lbs-active' : ''}" data-tab="local">
                        📱 本地高分
                    </button>
                </div>

                <div id="lbs-score-banner-${this.options.gameId}" class="lbs-score-banner" style="display: none;">
                    <div class="lbs-score-banner-label">本次得分</div>
                    <div class="lbs-score-banner-val"><span id="lbs-current-score-val">0</span> ${this.options.scoreUnit}</div>
                </div>

                <div id="lbs-submit-box-${this.options.gameId}" class="lbs-submit-box" style="display: none;">
                    <input type="text" class="lbs-input-name" placeholder="輸入玩家暱稱 (最多12字)" maxlength="12" value="${this.escapeHTML(savedName)}">
                    <button class="lbs-btn-submit">送出紀錄</button>
                </div>

                <div class="lbs-content">
                    <ul class="lbs-list"></ul>
                </div>

                <div class="lbs-footer">
                    <button class="lbs-btn-restart">
                        <span>🔄</span> 再玩一次
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.modal = overlay;

        // Bind events
        overlay.querySelector('.lbs-close-btn').addEventListener('click', () => this.hide());
        
        overlay.querySelectorAll('.lbs-tab').forEach(tabBtn => {
            tabBtn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        overlay.querySelector('.lbs-btn-submit').addEventListener('click', () => {
            this.handleScoreSubmit();
        });

        overlay.querySelector('.lbs-btn-restart').addEventListener('click', () => {
            this.hide();
            if (typeof this.onRestartCallback === 'function') {
                this.onRestartCallback();
            }
        });
    }

    /* -----------------------------------------------------------------
     * Public API Methods
     * ----------------------------------------------------------------- */
    show(params = {}) {
        const { score, extra = null, onRestart = null } = params;
        this.currentScore = (typeof score === 'number') ? score : null;
        this.currentExtra = extra;
        this.onRestartCallback = onRestart;

        const scoreBanner = this.overlay.querySelector(`#lbs-score-banner-${this.options.gameId}`);
        const submitBox = this.overlay.querySelector(`#lbs-submit-box-${this.options.gameId}`);

        if (this.currentScore !== null) {
            scoreBanner.style.display = 'flex';
            scoreBanner.querySelector('#lbs-current-score-val').innerText = this.currentScore.toLocaleString();
            submitBox.style.display = 'flex';
            submitBox.querySelector('.lbs-btn-submit').disabled = false;
            submitBox.querySelector('.lbs-btn-submit').innerText = '送出紀錄';
        } else {
            scoreBanner.style.display = 'none';
            submitBox.style.display = 'none';
        }

        // Prefill saved player name
        const savedName = localStorage.getItem(this.storageKeyName) || '';
        const nameInput = submitBox.querySelector('.lbs-input-name');
        if (nameInput) nameInput.value = savedName;

        this.overlay.classList.add('lbs-active');
        this.loadLeaderboard();
    }

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('lbs-active');
        }
    }

    switchTab(tabName) {
        if (this.activeTab === tabName) return;
        this.activeTab = tabName;

        this.overlay.querySelectorAll('.lbs-tab').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('lbs-active');
            } else {
                btn.classList.remove('lbs-active');
            }
        });

        this.loadLeaderboard();
    }

    /* -----------------------------------------------------------------
     * Data Submission & Retrieval Logic
     * ----------------------------------------------------------------- */
    handleScoreSubmit() {
        const submitBox = this.overlay.querySelector(`#lbs-submit-box-${this.options.gameId}`);
        const nameInput = submitBox.querySelector('.lbs-input-name');
        const submitBtn = submitBox.querySelector('.lbs-btn-submit');

        const playerName = nameInput.value.trim();
        if (!playerName) {
            alert('請輸入玩家暱稱！');
            nameInput.focus();
            return;
        }

        // Save nickname for next time
        localStorage.setItem(this.storageKeyName, playerName);
        submitBtn.disabled = true;
        submitBtn.innerText = '處理中...';

        this.saveScore(playerName, this.currentScore, this.currentExtra)
            .then(() => {
                submitBtn.innerText = '已送出 ✓';
                this.loadLeaderboard();
            })
            .catch(err => {
                console.error('[LeaderboardSystem] 分數上傳錯誤:', err);
                alert('分數上傳失敗，將為您儲存至本地高分紀錄。');
                submitBtn.disabled = false;
                submitBtn.innerText = '重試';
            });
    }

    saveScore(name, score, extra = null) {
        const timestamp = Date.now();
        const entry = {
            name: name.substring(0, 12),
            score: parseInt(score, 10),
            timestamp: timestamp,
            extra: extra,
            checksum: this.calculateChecksum(name, score, timestamp)
        };

        // 1. Always save to Local
        this.saveLocalScore(entry);

        // 2. Try saving to Firebase if configured & online
        if (this.isOnline && this.isFirebaseReady) {
            const dbRef = this.firebaseDb.ref(`leaderboards/${this.options.gameId}`);
            return dbRef.push({
                name: entry.name,
                score: entry.score,
                timestamp: entry.timestamp,
                extra: entry.extra || null
            });
        }

        return Promise.resolve();
    }

    saveLocalScore(entry) {
        let list = this.getLocalScores();
        list.push(entry);
        // Sort high to low
        list.sort((a, b) => b.score - a.score);
        // Keep top N entries
        list = list.slice(0, this.options.maxEntries * 2);
        
        try {
            localStorage.setItem(this.storageKeyLocal, JSON.stringify(list));
        } catch (e) {
            console.warn('[LeaderboardSystem] LocalStorage 儲存失敗:', e);
        }
    }

    getLocalScores() {
        try {
            const raw = localStorage.getItem(this.storageKeyLocal);
            if (!raw) return [];
            const list = JSON.parse(raw);
            if (!Array.isArray(list)) return [];

            // Filter out tampered entries
            return list.filter(item => {
                if (typeof item.score !== 'number' || !item.name) return false;
                // If checksum exists, verify it
                if (item.checksum) {
                    const expectedChecksum = this.calculateChecksum(item.name, item.score, item.timestamp);
                    if (item.checksum !== expectedChecksum) {
                        console.warn('[LeaderboardSystem] 偵測到本地高分遭篡改，忽略此紀錄:', item);
                        return false;
                    }
                }
                return true;
            });
        } catch (e) {
            return [];
        }
    }

    loadLeaderboard() {
        const listContainer = this.overlay.querySelector('.lbs-content');
        listContainer.innerHTML = `<div style="text-align: center; color: var(--lbs-text-muted); padding: 30px;">載入中...</div>`;

        if (this.activeTab === 'local') {
            const localScores = this.getLocalScores();
            this.renderList(localScores);
        } else {
            // Global Mode
            if (!this.isOnline || !this.isFirebaseReady) {
                this.renderOfflineNotice();
                return;
            }

            const dbRef = this.firebaseDb.ref(`leaderboards/${this.options.gameId}`).orderByChild('score').limitToLast(this.options.maxEntries);
            
            // Set 5 second timeout to handle slow / blocked connections
            let hasLoaded = false;
            const timeoutTimer = setTimeout(() => {
                if (!hasLoaded) {
                    this.renderOfflineNotice();
                }
            }, 5000);

            dbRef.once('value').then(snapshot => {
                hasLoaded = true;
                clearTimeout(timeoutTimer);
                const scores = [];
                snapshot.forEach(child => {
                    scores.push(child.val());
                });
                // Firebase limitToLast returns ascending order, reverse to descending
                scores.reverse();
                this.renderList(scores);
            }).catch(err => {
                hasLoaded = true;
                clearTimeout(timeoutTimer);
                console.warn('[LeaderboardSystem] 全球排行連線失敗:', err);
                this.renderOfflineNotice();
            });
        }
    }

    /* -----------------------------------------------------------------
     * Rendering Helper Functions
     * ----------------------------------------------------------------- */
    renderList(entries) {
        const listContainer = this.overlay.querySelector('.lbs-content');
        if (!entries || entries.length === 0) {
            listContainer.innerHTML = `
                <div class="lbs-offline-card">
                    <div class="lbs-offline-icon">🏅</div>
                    <div class="lbs-offline-title">暫無紀錄</div>
                    <div class="lbs-offline-desc">成為第一個留下傳奇得分的玩家吧！</div>
                </div>
            `;
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'lbs-list';

        entries.forEach((item, index) => {
            const rank = index + 1;
            let rankClass = '';
            let rankDisplay = `#${rank}`;

            if (rank === 1) { rankClass = 'lbs-rank-1'; rankDisplay = '🥇'; }
            else if (rank === 2) { rankClass = 'lbs-rank-2'; rankDisplay = '🥈'; }
            else if (rank === 3) { rankClass = 'lbs-rank-3'; rankDisplay = '🥉'; }

            let metaHtml = '';
            if (item.extra) {
                if (item.extra.level) metaHtml += `<span class="lbs-badge">Lv.${this.escapeHTML(item.extra.level)}</span>`;
                if (item.extra.mode) metaHtml += `<span class="lbs-badge">${this.escapeHTML(item.extra.mode)}</span>`;
            }
            const dateStr = item.timestamp ? this.formatTimeAgo(item.timestamp) : '';

            let itemHtml = '';
            if (typeof this.options.renderItem === 'function') {
                itemHtml = this.options.renderItem(item, index);
            } else {
                const avatar = (item.extra && item.extra.avatar) ? `${item.extra.avatar} ` : '';
                itemHtml = `
                    <li class="lbs-item">
                        <div class="lbs-item-left">
                            <div class="lbs-rank ${rankClass}">${rankDisplay}</div>
                            <div class="lbs-player-info">
                                <div class="lbs-player-name">${avatar}${this.escapeHTML(item.name)}</div>
                                <div class="lbs-player-meta">
                                    ${metaHtml}
                                    <span>${dateStr}</span>
                                </div>
                            </div>
                        </div>
                        <div class="lbs-score-val">${item.score.toLocaleString()} ${this.options.scoreUnit}</div>
                    </li>
                `;
            }
            ul.insertAdjacentHTML('beforeend', itemHtml);
        });

        listContainer.innerHTML = '';
        listContainer.appendChild(ul);
    }

    renderOfflineNotice() {
        const listContainer = this.overlay.querySelector('.lbs-content');
        listContainer.innerHTML = `
            <div class="lbs-offline-card">
                <div class="lbs-offline-icon">📡</div>
                <div class="lbs-offline-title">目前無法使用網路排行榜</div>
                <div class="lbs-offline-desc">網路未連線或線上服務暫時無法使用。您可以切換至「本地高分」查看本機歷史紀錄！</div>
            </div>
        `;
    }

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diffMs = now - timestamp;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHour = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return '剛才';
        if (diffMin < 60) return `${diffMin}分鐘前`;
        if (diffHour < 24) return `${diffHour}小時前`;
        if (diffDay < 7) return `${diffDay}天前`;
        const d = new Date(timestamp);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    }
}

// Global Export
if (typeof window !== 'undefined') {
    window.LeaderboardSystem = LeaderboardSystem;
}
