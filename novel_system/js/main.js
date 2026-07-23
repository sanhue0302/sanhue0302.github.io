/**
 * Main Application & Lobby Controller
 * Handles story selector lobby, dynamic DLC story loading, global memory profile, and gallery UI.
 */

(function (global) {
  'use strict';

  // Available Stories Registry & Local Fallbacks (for file:// protocol support)
  const STORY_PACKAGES = ['story_sakura', 'story_rin', 'story_three_pigs', 'story_hoshino', 'story_office'];

  const DEFAULT_MANIFESTS = {
    story_sakura: {
      id: 'story_sakura',
      title: '櫻花下的再會',
      author: '劇本組',
      cover: 'assets/stories/story_sakura/assets/cover.jpg',
      description: '轉學後的第一天，在熟悉的校門口遇到了童年玩伴櫻...',
      endingsCount: 3,
      themeClass: 'theme-sakura',
      themeCss: 'assets/stories/story_sakura/theme.css',
      supportsPlayerName: true
    },
    story_rin: {
      id: 'story_rin',
      title: '月夜下的約定',
      author: '劇本組',
      cover: 'assets/stories/story_rin/assets/cover.jpg',
      description: '高冷學生會長凜的秘密特訓與隱藏心意...',
      endingsCount: 3,
      themeClass: 'theme-rin',
      themeCss: 'assets/stories/story_rin/theme.css'
    },
    story_three_pigs: {
      id: 'story_three_pigs',
      title: '三隻小豬與大野狼',
      author: '經典童話組',
      cover: 'assets/stories/story_three_pigs/assets/cover.jpg',
      description: '經典童話的新演繹！選擇建材與戰術對策，幫助小豬抵抗大野狼的襲擊。',
      endingsCount: 3,
      themeClass: 'theme-pigs',
      themeCss: 'assets/stories/story_three_pigs/theme.css'
    },
    story_hoshino: {
      id: 'story_hoshino',
      title: '星野同級生 ～她的全部都屬於我～',
      author: '同級生團隊',
      cover: 'assets/stories/story_hoshino/assets/cover.jpg',
      description: '國民偶像星野燈在台前閃耀動人，私底下卻隱藏著不可告人的焦慮與祕密...',
      endingsCount: 5,
      themeClass: 'theme-hoshino',
      themeCss: 'assets/stories/story_hoshino/theme.css',
      supportsPlayerName: true
    },
    story_office: {
      id: 'story_office',
      title: '職場重啟 ～逆襲黑絲經理與冰山總裁～',
      author: '職場逆襲團隊',
      cover: 'assets/stories/story_office/assets/cover.jpg',
      description: '重生回到入職第一天！面對刁難的黑絲經理與高冷冰山總裁，看你如何用機智與手段登上帝國權力王座...',
      endingsCount: 3,
      themeClass: 'theme-office',
      themeCss: 'assets/stories/story_office/theme.css',
      supportsPlayerName: true
    }
  };

  class AppController {
    constructor() {
      this.currentStoryId = null;
      this.storiesMetadata = {};
      this.globalProfile = this.loadGlobalProfile();
    }

    init() {
      // Initialize Monogatari & Live2D Manager
      if (global.monogatari) {
        global.monogatari.init('#monogatari');
        global.monogatari.setOnEndCallback((storage) => this.onStoryCompleted(storage));
      }

      if (global.live2dManager) {
        global.live2dManager.init();
      }

      this.bindUIEvents();
      this.loadAllStoryManifests();
    }

    // Storage: Load Global Profile
    loadGlobalProfile() {
      try {
        const raw = localStorage.getItem('game_global_profile');
        if (raw) {
          const profile = JSON.parse(raw);
          if (!profile.playerName) profile.playerName = '陽太';
          if (!profile.playerNickname) profile.playerNickname = '阿陽';
          return profile;
        }
      } catch (e) {
        console.error('Failed to load global profile', e);
      }
      return {
        unlockedCGs: [],
        endingsCleared: {}, // { story_sakura: ['Ending_Good'] }
        playerName: '陽太',
        playerNickname: '阿陽'
      };
    }

    // Storage: Save Global Profile
    saveGlobalProfile() {
      try {
        localStorage.setItem('game_global_profile', JSON.stringify(this.globalProfile));
      } catch (e) {
        console.error('Failed to save global profile', e);
      }
    }

    // Unlock Memory Hook
    unlockGlobalMemory(memoryId) {
      if (!this.globalProfile.unlockedCGs.includes(memoryId)) {
        this.globalProfile.unlockedCGs.push(memoryId);
        this.saveGlobalProfile();
        this.playChimeSound();
        console.log(`[Global Memory] Unlocked CG: ${memoryId}`);
      }
    }

    // Register Ending Clear Hook
    registerEndingCleared(storyId, endingLabel) {
      if (!this.globalProfile.endingsCleared[storyId]) {
        this.globalProfile.endingsCleared[storyId] = [];
      }
      if (!this.globalProfile.endingsCleared[storyId].includes(endingLabel)) {
        this.globalProfile.endingsCleared[storyId].push(endingLabel);
        this.saveGlobalProfile();
      }
    }

    // Load Manifests for Lobby Rendering (with file:// protocol fallback)
    async loadAllStoryManifests() {
      const grid = document.querySelector('#story-grid');
      if (!grid) return;
      grid.innerHTML = '';

      for (const storyId of STORY_PACKAGES) {
        let manifest = null;
        try {
          const res = await fetch(`assets/stories/${storyId}/manifest.json`);
          if (res.ok) {
            manifest = await res.json();
          }
        } catch (e) {
          console.warn(`Fetch manifest failed for ${storyId}, using local fallback:`, e);
        }

        if (!manifest) {
          manifest = DEFAULT_MANIFESTS[storyId];
        }

        if (manifest) {
          this.storiesMetadata[storyId] = manifest;
          this.renderStoryCard(manifest, grid);
        }
      }
    }

    // Render Story Card in Lobby
    renderStoryCard(manifest, container) {
      const clearedList = this.globalProfile.endingsCleared[manifest.id] || [];
      const clearedCount = clearedList.length;
      const totalEndings = manifest.endingsCount || 3;

      const card = document.createElement('div');
      card.className = 'story-card';
      card.innerHTML = `
        <img src="${manifest.cover}" class="card-cover" alt="${manifest.title}" />
        <div class="card-body">
          <h2 class="card-title">${manifest.title}</h2>
          <div class="card-author">劇本作者：${manifest.author}</div>
          <p class="card-desc">${manifest.description}</p>
          <div class="card-footer">
            <span class="progress-badge">已解鎖 ${clearedCount}/${totalEndings} 結局</span>
            <button class="play-btn">進入故事</button>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.playClickSound();
        this.loadStoryPackage(manifest.id);
      });

      container.appendChild(card);
    }

    // Dynamic Story Package Loader
    async loadStoryPackage(storyId) {
      console.log(`[StoryLoader] Loading story package: ${storyId}`);
      this.currentStoryId = storyId;

      const manifest = this.storiesMetadata[storyId] || DEFAULT_MANIFESTS[storyId];

      // Remove previous dynamic story script & theme CSS
      document.querySelector('#dynamic-story-script')?.remove();
      document.querySelector('#dynamic-story-theme')?.remove();

      // Inject Story Specific Theme CSS if present
      if (manifest && manifest.themeCss) {
        const themeLink = document.createElement('link');
        themeLink.id = 'dynamic-story-theme';
        themeLink.rel = 'stylesheet';
        themeLink.href = `${manifest.themeCss}?t=${Date.now()}`;
        document.head.appendChild(themeLink);
      }

      // Apply theme CSS class to #monogatari container
      const monogatariEl = document.querySelector('#monogatari');
      if (monogatariEl) {
        monogatariEl.className = manifest && manifest.themeClass ? manifest.themeClass : `theme-${storyId}`;
      }

      // Reset Monogatari engine
      global.monogatari.reset();
      global.monogatari.storage({
        current_story: storyId,
        favorability: 0,
        flags: {},
        player_name: this.globalProfile.playerName || '陽太',
        player_nickname: this.globalProfile.playerNickname || '阿陽'
      });

      // Load script dynamically
      const scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-story-script';
      scriptTag.src = `assets/stories/${storyId}/script.js?t=${Date.now()}`;
      
      scriptTag.onload = () => {
        console.log(`[StoryLoader] Script loaded for ${storyId}`);
        // Hide lobby and start game
        const lobbyScreen = document.querySelector('#lobby-screen');
        if (lobbyScreen) {
          lobbyScreen.classList.add('fade-out');
          setTimeout(() => lobbyScreen.classList.add('hidden'), 600);
        }
        global.monogatari.run('Start');
      };

      document.body.appendChild(scriptTag);
    }

    // Return to Lobby Screen
    returnToLobby() {
      this.playClickSound();
      global.monogatari.reset();
      const lobbyScreen = document.querySelector('#lobby-screen');
      if (lobbyScreen) {
        lobbyScreen.classList.remove('hidden');
        setTimeout(() => lobbyScreen.classList.remove('fade-out'), 50);
      }
      this.loadAllStoryManifests(); // Refresh progress badges
    }

    // Story Completed Callback (Custom In-game UI Settlement Modal)
    onStoryCompleted(storage) {
      console.log('[StoryLoader] Story completed!', storage);
      setTimeout(() => {
        const modal = document.querySelector('#ending-modal');
        if (modal) {
          this.playChimeSound();
          modal.classList.remove('hidden');
        } else {
          this.returnToLobby();
        }
      }, 400);
    }

    // Memory Gallery Modal
    openGallery() {
      this.playClickSound();
      const modal = document.querySelector('#gallery-modal');
      const grid = document.querySelector('#gallery-grid');
      if (!modal || !grid) return;

      grid.innerHTML = '';

      // Define CG entries
      const cgEntries = [
        { id: 'sakura_true_end', title: '櫻 - 櫻花下的告白', src: 'assets/stories/story_sakura/assets/cg_sakura_sunset.jpg' },
        { id: 'rin_true_end', title: '凜 - 星空下的解心', src: 'assets/stories/story_rin/assets/cg_rin_starry.jpg' },
        { id: 'cg_three_pigs_good', title: '三隻小豬 - 大獲全勝！', src: 'assets/stories/story_three_pigs/assets/cg_ending_good.jpg' },
        { id: 'cg_hoshino_secret', title: '星野同級生 - 她的全部都屬於我', src: 'assets/stories/story_hoshino/assets/cg_hoshino_secret.jpg' }
      ];

      cgEntries.forEach(cg => {
        const isUnlocked = this.globalProfile.unlockedCGs.includes(cg.id);
        const item = document.createElement('div');
        item.className = `gallery-item ${isUnlocked ? '' : 'locked'}`;
        item.innerHTML = `<img src="${cg.src}" alt="${cg.title}" />`;

        if (isUnlocked) {
          item.addEventListener('click', () => this.openLightbox(cg.src));
        }

        grid.appendChild(item);
      });

      modal.classList.remove('hidden');
    }

    closeGallery() {
      this.playClickSound();
      const modal = document.querySelector('#gallery-modal');
      if (modal) modal.classList.add('hidden');
    }

    openLightbox(imgSrc) {
      const lightbox = document.createElement('div');
      lightbox.id = 'cg-lightbox';
      lightbox.innerHTML = `<img src="${imgSrc}" />`;
      lightbox.addEventListener('click', () => lightbox.remove());
      document.body.appendChild(lightbox);
    }

    // Save / Load Slot Modal
    openSaveLoadModal(mode = 'save') {
      this.playClickSound();
      const modal = document.querySelector('#save-load-modal');
      const title = document.querySelector('#save-load-title');
      const grid = document.querySelector('#save-slots-grid');
      if (!modal || !grid) return;

      title.textContent = mode === 'save' ? '💾 遊戲進度存檔' : '📂 讀取遊戲進度';
      grid.innerHTML = '';

      const saves = global.monogatari.getSaves();

      for (let i = 1; i <= 6; i++) {
        const slotData = saves[`slot_${i}`];
        const card = document.createElement('div');
        card.className = 'save-slot-card';

        if (slotData) {
          card.innerHTML = `
            <div class="slot-header">
              <span>紀錄檔 0${i}</span>
              <span class="slot-date">${slotData.date}</span>
            </div>
            <div class="slot-preview">${slotData.previewText}</div>
            <div class="slot-actions">
              <button class="slot-btn btn-save-slot">覆蓋存檔</button>
              <button class="slot-btn btn-load-slot">讀取這檔</button>
            </div>
          `;

          card.querySelector('.btn-save-slot').addEventListener('click', () => {
            this.playClickSound();
            global.monogatari.saveGame(i);
            this.openSaveLoadModal(mode);
          });

          card.querySelector('.btn-load-slot').addEventListener('click', () => {
            this.playClickSound();
            modal.classList.add('hidden');
            const lobbyScreen = document.querySelector('#lobby-screen');
            if (lobbyScreen) lobbyScreen.classList.add('hidden', 'fade-out');
            global.monogatari.loadGame(i);
          });
        } else {
          card.innerHTML = `
            <div class="slot-header">
              <span>紀錄檔 0${i}</span>
              <span class="slot-date">空白欄位</span>
            </div>
            <div class="slot-preview">尚無紀錄數據</div>
            <div class="slot-actions">
              <button class="slot-btn btn-save-slot">寫入存檔</button>
            </div>
          `;

          card.querySelector('.btn-save-slot').addEventListener('click', () => {
            this.playClickSound();
            global.monogatari.saveGame(i);
            this.openSaveLoadModal(mode);
          });
        }

        grid.appendChild(card);
      }

      modal.classList.remove('hidden');
    }

    openSettingsModal() {
      this.playClickSound();
      const modal = document.querySelector('#settings-modal');
      if (!modal) return;

      const nameGroup = document.querySelector('#setting-player-name-group');
      const manifest = this.currentStoryId ? (this.storiesMetadata[this.currentStoryId] || DEFAULT_MANIFESTS[this.currentStoryId]) : null;

      if (nameGroup) {
        if (manifest && manifest.supportsPlayerName) {
          nameGroup.classList.remove('hidden');
        } else {
          nameGroup.classList.add('hidden');
        }
      }

      const nameInput = document.querySelector('#setting-player-name');
      const nicknameInput = document.querySelector('#setting-player-nickname');
      if (nameInput) nameInput.value = this.globalProfile.playerName || '陽太';
      if (nicknameInput) nicknameInput.value = this.globalProfile.playerNickname || '阿陽';

      modal.classList.remove('hidden');
    }

    // Bind UI Listeners
    bindUIEvents() {
      document.querySelector('#btn-gallery-open')?.addEventListener('click', () => this.openGallery());
      document.querySelector('#btn-gallery-close')?.addEventListener('click', () => this.closeGallery());
      document.querySelector('#btn-back-lobby')?.addEventListener('click', () => this.returnToLobby());
      document.querySelector('#btn-ending-confirm')?.addEventListener('click', () => {
        this.playClickSound();
        document.querySelector('#ending-modal')?.classList.add('hidden');
        this.returnToLobby();
      });
      document.querySelector('#btn-save')?.addEventListener('click', () => this.openSaveLoadModal('save'));
      document.querySelector('#btn-load')?.addEventListener('click', () => this.openSaveLoadModal('load'));
      document.querySelector('#btn-settings')?.addEventListener('click', () => this.openSettingsModal());
      document.querySelector('#btn-saveload-close')?.addEventListener('click', () => {
        document.querySelector('#save-load-modal')?.classList.add('hidden');
      });
      document.querySelector('#btn-settings-close')?.addEventListener('click', () => {
        document.querySelector('#settings-modal')?.classList.add('hidden');
      });
      document.querySelector('#btn-auto')?.addEventListener('click', (e) => {
        const active = global.monogatari.toggleAuto();
        e.target.classList.toggle('active', active);
      });
      document.querySelector('#btn-skip')?.addEventListener('click', (e) => {
        const active = global.monogatari.toggleSkip();
        e.target.classList.toggle('active', active);
      });
      document.querySelector('#btn-history')?.addEventListener('click', () => this.openHistoryLog());
      document.querySelector('#btn-history-close')?.addEventListener('click', () => {
        document.querySelector('#history-modal')?.classList.add('hidden');
      });

      // Settings sliders
      const textSpeedInput = document.querySelector('#setting-text-speed');
      const textSpeedLabel = document.querySelector('#label-text-speed');
      textSpeedInput?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        global.monogatari.textSpeed = val;
        if (textSpeedLabel) textSpeedLabel.textContent = `${val}ms / 字`;
      });

      const autoSpeedInput = document.querySelector('#setting-auto-speed');
      const autoSpeedLabel = document.querySelector('#label-auto-speed');
      autoSpeedInput?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        global.monogatari.autoSpeed = val;
        if (autoSpeedLabel) autoSpeedLabel.textContent = `${(val / 1000).toFixed(1)} 秒`;
      });

      // Protagonist name inputs
      const nameInput = document.querySelector('#setting-player-name');
      nameInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim() || '陽太';
        this.globalProfile.playerName = val;
        this.saveGlobalProfile();
        global.monogatari.storage({ player_name: val });
      });

      const nicknameInput = document.querySelector('#setting-player-nickname');
      nicknameInput?.addEventListener('input', (e) => {
        const val = e.target.value.trim() || '阿陽';
        this.globalProfile.playerNickname = val;
        this.saveGlobalProfile();
        global.monogatari.storage({ player_nickname: val });
      });
    }

    openHistoryLog() {
      this.playClickSound();
      const modal = document.querySelector('#history-modal');
      const content = document.querySelector('#history-content');
      if (!modal || !content) return;

      content.innerHTML = '';
      const history = global.monogatari.getHistory();

      history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-entry';
        div.innerHTML = `
          <div class="history-speaker">${entry.speaker}</div>
          <div class="history-text">${entry.text}</div>
        `;
        content.appendChild(div);
      });

      modal.classList.remove('hidden');
    }

    // Audio Synthesizer (Web Audio API)
    playClickSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {}
    }

    playChimeSound() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
        });
      } catch (e) {}
    }
  }

  // Global App Access
  global.app = new AppController();
  global.unlockGlobalMemory = (memoryId) => global.app.unlockGlobalMemory(memoryId);

  document.addEventListener('DOMContentLoaded', () => {
    global.app.init();
  });

})(window);
