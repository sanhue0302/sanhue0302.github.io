/**
 * Monogatari Visual Novel Core Engine (v2.x API Compatible)
 * Lightweight, robust, zero external dependencies.
 */

(function (global) {
  'use strict';

  class MonogatariEngine {
    constructor() {
      this._characters = {};
      this._script = {};
      this._storage = {};
      this._currentLabel = 'Start';
      this._currentIndex = 0;
      this._history = [];
      
      // Control flags & Settings
      this.isTyping = false;
      this.typeTimer = null;
      this.isAuto = false;
      this.isSkip = false;
      this.autoTimer = null;

      this.textSpeed = 25; // ms per char
      this.autoSpeed = 2000; // ms per step
      this.bgmVolume = 0.8;
      this.sfxVolume = 1.0;

      // Event listeners
      this._onEndCallback = null;
      this._onCharacterChangeCallback = null;
    }

    // Save Game State to Slot
    saveGame(slotId = 1) {
      try {
        const saves = this.getSaves();
        const currentLine = this._history.length > 0 ? this._history[this._history.length - 1].text : '存檔點';
        saves[`slot_${slotId}`] = {
          slotId: slotId,
          storyId: this._storage.current_story || 'story_sakura',
          label: this._currentLabel,
          index: this._currentIndex,
          storage: JSON.parse(JSON.stringify(this._storage)),
          previewText: currentLine,
          bgImage: this.bgLayer ? this.bgLayer.style.backgroundImage : '',
          date: new Date().toLocaleString()
        };
        localStorage.setItem('monogatari_save_slots', JSON.stringify(saves));
        return true;
      } catch (e) {
        console.error('Save failed', e);
        return false;
      }
    }

    // Load Game State from Slot
    loadGame(slotId = 1) {
      try {
        const saves = this.getSaves();
        const saveData = saves[`slot_${slotId}`];
        if (!saveData) return false;

        this._currentLabel = saveData.label;
        this._currentIndex = saveData.index;
        this._storage = saveData.storage;

        if (this.bgLayer && saveData.bgImage) {
          this.bgLayer.style.backgroundImage = saveData.bgImage;
        }

        this.renderCurrentStep();
        return true;
      } catch (e) {
        console.error('Load failed', e);
        return false;
      }
    }

    // Get All Save Slots
    getSaves() {
      try {
        const raw = localStorage.getItem('monogatari_save_slots');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {};
    }

    // API: Register Characters
    characters(obj) {
      if (obj) {
        Object.assign(this._characters, obj);
      }
      return this._characters;
    }

    // API: Register Script Labels
    script(obj) {
      if (obj) {
        Object.assign(this._script, obj);
      }
      return this._script;
    }

    // API: Storage State Management
    storage(obj) {
      if (obj) {
        Object.assign(this._storage, obj);
      }
      return this._storage;
    }

    // API: Reset engine state
    reset() {
      this._characters = {};
      this._script = {};
      this._currentLabel = 'Start';
      this._currentIndex = 0;
      this._history = [];
      this.isTyping = false;
      this.isAuto = false;
      this.isSkip = false;
      clearTimeout(this.typeTimer);
      clearTimeout(this.autoTimer);

      // Clean up DOM layers from previous story
      if (this.bgLayer) {
        this.bgLayer.style.backgroundImage = 'none';
      }
      if (this.charContainer) {
        this.charContainer.innerHTML = '';
      }
      if (this.dialogueText) {
        this.dialogueText.textContent = '';
      }
      if (this.speakerBadge) {
        this.speakerBadge.textContent = '';
        this.speakerBadge.classList.add('hidden');
      }
      if (this.choiceContainer) {
        this.choiceContainer.innerHTML = '';
        this.choiceContainer.classList.remove('active');
      }
    }

    // API: Initialize UI
    init(selector) {
      this.container = document.querySelector(selector || '#monogatari');
      if (!this.container) return;

      this.bgLayer = document.querySelector('#scene-background');
      this.charContainer = document.querySelector('#character-container');
      this.speakerBadge = document.querySelector('#speaker-badge');
      this.dialogueText = document.querySelector('#dialogue-text');
      this.textbox = document.querySelector('#textbox');
      this.choiceContainer = document.querySelector('#choice-container');
      this.quickMenu = document.querySelector('#quick-menu');

      this._bindEvents();
    }

    _bindEvents() {
      if (this.textbox) {
        this.textbox.addEventListener('click', (e) => {
          if (e.target.closest('#quick-menu')) return;
          this.next();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          this.next();
        }
      });
    }

    // Start Playing Current Script
    run(label = 'Start') {
      this._currentLabel = label;
      this._currentIndex = 0;
      this.renderCurrentStep();
    }

    // Advance to Next Step
    next() {
      if (this.isTyping) {
        // Instant finish typewriter
        this.finishTypewriter();
        return;
      }

      if (this.choiceContainer && this.choiceContainer.classList.contains('active')) {
        return; // Waiting for choice selection
      }

      const currentFlow = this._script[this._currentLabel];
      if (!currentFlow) return;

      this._currentIndex++;
      if (this._currentIndex >= currentFlow.length) {
        // End of label flow
        return;
      }

      this.renderCurrentStep();
    }

    // Render step logic
    renderCurrentStep() {
      clearTimeout(this.autoTimer);

      const flow = this._script[this._currentLabel];
      if (!flow || this._currentIndex >= flow.length) return;

      const step = flow[this._currentIndex];

      if (typeof step === 'string') {
        this.parseCommandString(step);
      } else if (typeof step === 'function') {
        const result = step(this._storage);
        if (typeof result === 'string' && result.startsWith('jump ')) {
          const targetLabel = result.replace('jump ', '').trim();
          this.jump(targetLabel);
          return;
        }
        // Auto advance after function execution
        this.next();
      } else if (typeof step === 'object') {
        if (step.Choice) {
          this.renderChoice(step.Choice);
        } else if (step.Input) {
          this.renderInputPrompt(step.Input);
        }
      }
    }

    // Parse string command syntax
    parseCommandString(cmdStr) {
      const trimmed = cmdStr.trim();

      // Command: show scene <src> [with <anim>]
      if (trimmed.startsWith('show scene ')) {
        const scenePath = trimmed.replace('show scene ', '').split(' with ')[0].trim();
        if (this.bgLayer) {
          this.bgLayer.style.backgroundImage = `url('${scenePath}')`;
        }
        this.next();
        return;
      }

      // Command: play music <name> loop
      if (trimmed.startsWith('play music ')) {
        console.log(`[Audio] Playing music: ${trimmed}`);
        this.next();
        return;
      }

      // Command: show character <name> <expression> [at <pos>] [with <anim>] [animated <micro>]
      if (trimmed.startsWith('show character ')) {
        this.parseShowCharacter(trimmed);
        this.next();
        return;
      }

      // Command: hide character <name>
      if (trimmed.startsWith('hide character ')) {
        const charId = trimmed.replace('hide character ', '').trim();
        const existing = this.charContainer ? this.charContainer.querySelector(`[data-character="${charId}"]`) : null;
        if (existing) existing.remove();
        this.next();
        return;
      }

      // Command: jump <label>
      if (trimmed.startsWith('jump ')) {
        const label = trimmed.replace('jump ', '').trim();
        this.jump(label);
        return;
      }

      // Command: end
      if (trimmed === 'end') {
        this.onStoryEnd();
        return;
      }

      // Dialogue line: "sakura 好久不見！" or "故事內文..."
      this.renderDialogueLine(trimmed);
    }

    // Show Character Parser
    parseShowCharacter(cmdStr) {
      // Example: 'show character sakura smile at center with fadeIn animated character-idle'
      const parts = cmdStr.split(' ');
      const charId = parts[2];
      const expr = parts[3] || 'normal';

      let pos = 'center';
      if (cmdStr.includes(' at ')) {
        pos = cmdStr.split(' at ')[1].split(' ')[0];
      }

      let microAnim = '';
      if (cmdStr.includes(' animated ')) {
        microAnim = cmdStr.split(' animated ')[1].split(' ')[0];
      }

      const charDef = this._characters[charId];
      if (!charDef) return;

      const spriteSrc = charDef.sprites[expr] || charDef.sprites['normal'];

      let charImg = this.charContainer ? this.charContainer.querySelector(`[data-character="${charId}"]`) : null;
      if (!charImg) {
        charImg = document.createElement('img');
        charImg.dataset.character = charId;
        charImg.className = `character-sprite ${pos} animated-pop-in`;
        if (this.charContainer) this.charContainer.appendChild(charImg);
      } else {
        charImg.className = `character-sprite ${pos}`;
      }

      charImg.src = spriteSrc;

      if (microAnim) {
        charImg.classList.add(`animated-${microAnim.replace('character-', '')}`);
      }

      if (this._onCharacterChangeCallback) {
        this._onCharacterChangeCallback(charId, expr, microAnim);
      }
    }

    // Interactive In-Game Script Input Prompt Modal
    renderInputPrompt(inputDef) {
      const modal = document.querySelector('#input-modal');
      const promptText = document.querySelector('#input-prompt-text');
      const inputField = document.querySelector('#input-prompt-field');
      const warningText = document.querySelector('#input-prompt-warning');
      const btnSubmit = document.querySelector('#btn-input-submit');
      const btnSkip = document.querySelector('#btn-input-skip');

      if (!modal || !inputField) {
        if (inputDef.Storage) {
          this._storage[inputDef.Storage] = inputDef.Default || this._storage[inputDef.Storage] || '';
        }
        this.next();
        return;
      }

      if (promptText) promptText.textContent = this.formatText(inputDef.Text || '請輸入內容：');
      inputField.value = inputDef.Default || (inputDef.Storage ? this._storage[inputDef.Storage] : '') || '';
      if (warningText) warningText.classList.add('hidden');

      modal.classList.remove('hidden');

      const cleanup = () => {
        modal.classList.add('hidden');
        if (btnSubmit) btnSubmit.removeEventListener('click', handleSubmit);
        if (btnSkip) btnSkip.removeEventListener('click', handleSkip);
        if (inputField) inputField.removeEventListener('keydown', handleKey);
      };

      const handleSubmit = () => {
        const val = inputField.value.trim();
        if (inputDef.Validation && !inputDef.Validation(val)) {
          if (warningText) {
            warningText.textContent = inputDef.Warning || '請輸入有效的內容！';
            warningText.classList.remove('hidden');
          }
          return;
        }
        const finalVal = val || inputDef.Default || (inputDef.Storage ? this._storage[inputDef.Storage] : '') || '';
        if (inputDef.Storage) {
          this._storage[inputDef.Storage] = finalVal;
        }
        cleanup();
        this.next();
      };

      const handleSkip = () => {
        const defaultVal = inputDef.Default || (inputDef.Storage ? this._storage[inputDef.Storage] : '') || '';
        if (inputDef.Storage) {
          this._storage[inputDef.Storage] = defaultVal;
        }
        cleanup();
        this.next();
      };

      const handleKey = (e) => {
        if (e.key === 'Enter') handleSubmit();
      };

      btnSubmit?.addEventListener('click', handleSubmit);
      btnSkip?.addEventListener('click', handleSkip);
      inputField?.addEventListener('keydown', handleKey);
      inputField.focus();
    }

    // Text Formatting Helper (Dynamic Storage Variable Placeholders)
    formatText(text) {
      if (!text) return '';
      return text.replace(/\{\{(?:storage\.)?([a-zA-Z0-9_\.]+)\}\}/g, (match, key) => {
        if (this._storage && this._storage[key] !== undefined) {
          return this._storage[key];
        }
        if (key === 'name' || key === 'player.name') return this._storage.player_name || this._storage.player_fullname || '陽太';
        if (key === 'nickname' || key === 'player.nickname') return this._storage.player_nickname || '阿陽';
        return match;
      });
    }

    // Render Dialogue Line
    renderDialogueLine(line) {
      let speakerName = '';
      let textContent = line;
      let speakerColor = '#ffffff';

      // Check if line starts with character ID
      const spaceIdx = line.indexOf(' ');
      if (spaceIdx > 0) {
        const potentialId = line.substring(0, spaceIdx);
        if (this._characters[potentialId]) {
          const charDef = this._characters[potentialId];
          speakerName = charDef.name;
          speakerColor = charDef.color || '#ff4081';
          textContent = line.substring(spaceIdx + 1);
        }
      }

      // Replace placeholders
      textContent = this.formatText(textContent);

      // Update Speaker Badge
      if (this.speakerBadge) {
        if (speakerName) {
          this.speakerBadge.textContent = this.formatText(speakerName);
          this.speakerBadge.style.background = speakerColor;
          this.speakerBadge.classList.remove('narrator', 'hidden');
        } else {
          this.speakerBadge.textContent = '旁白';
          this.speakerBadge.classList.add('narrator');
          this.speakerBadge.classList.remove('hidden');
        }
      }

      // Record to History
      this._history.push({ speaker: speakerName || '旁白', text: textContent });

      // Start Typewriter
      this.startTypewriter(textContent);
    }

    // Typewriter Effect
    startTypewriter(text) {
      this.isTyping = true;
      this.fullText = text;
      let charIdx = 0;
      if (this.dialogueText) this.dialogueText.textContent = '';

      const speed = this.isSkip ? 5 : this.textSpeed;

      const type = () => {
        if (charIdx < text.length) {
          if (this.dialogueText) this.dialogueText.textContent += text.charAt(charIdx);
          charIdx++;
          this.typeTimer = setTimeout(type, speed);
        } else {
          this.finishTypewriter();
        }
      };

      type();
    }

    finishTypewriter() {
      clearTimeout(this.typeTimer);
      this.isTyping = false;
      if (this.dialogueText) this.dialogueText.textContent = this.fullText;

      // Handle Skip or Auto
      if (this.isSkip) {
        this.typeTimer = setTimeout(() => this.next(), 80);
      } else if (this.isAuto) {
        this.autoTimer = setTimeout(() => this.next(), this.autoSpeed);
      }
    }

    // Render Choice Menu
    renderChoice(choiceObj) {
      if (!this.choiceContainer) return;

      this.choiceContainer.innerHTML = '';
      this.choiceContainer.classList.add('active');

      Object.keys(choiceObj).forEach((optKey) => {
        const opt = choiceObj[optKey];
        const btn = document.createElement('div');
        btn.className = 'choice-button';
        btn.textContent = this.formatText(opt.Text);
        btn.addEventListener('click', () => {
          this.choiceContainer.classList.remove('active');
          if (opt.Do && opt.Do.startsWith('jump ')) {
            const targetLabel = opt.Do.replace('jump ', '').trim();
            this.jump(targetLabel);
          } else {
            this.next();
          }
        });
        this.choiceContainer.appendChild(btn);
      });
    }

    // Jump to label
    jump(label) {
      if (this._script[label]) {
        this._currentLabel = label;
        this._currentIndex = 0;
        this.renderCurrentStep();
      } else {
        console.error(`Script label "${label}" not found!`);
      }
    }

    // On Story End Trigger
    onStoryEnd() {
      if (this._onEndCallback) {
        this._onEndCallback(this._storage);
      }
    }

    // Toggle Auto Mode
    toggleAuto() {
      this.isAuto = !this.isAuto;
      if (this.isAuto && !this.isTyping) {
        this.next();
      }
      return this.isAuto;
    }

    // Toggle Skip Mode
    toggleSkip() {
      this.isSkip = !this.isSkip;
      if (this.isSkip && !this.isTyping) {
        this.next();
      }
      return this.isSkip;
    }

    // Get History Log
    getHistory() {
      return this._history;
    }

    setOnEndCallback(fn) {
      this._onEndCallback = fn;
    }

    setOnCharacterChangeCallback(fn) {
      this._onCharacterChangeCallback = fn;
    }
  }

  // Global Engine Instance
  global.monogatari = new MonogatariEngine();

})(window);
