/**
 * Live2D & Micro-Expression Controller
 * Manages sprite micro-animations (breathing, shock shake, blush glow overlay, pop-in)
 */

(function (global) {
  'use strict';

  class Live2DManager {
    constructor() {
      this.blushOverlay = null;
    }

    init() {
      // Create or bind blush overlay
      this.blushOverlay = document.querySelector('#blush-glow-effect');
      if (!this.blushOverlay) {
        this.blushOverlay = document.createElement('div');
        this.blushOverlay.id = 'blush-glow-effect';
        this.blushOverlay.className = 'blush-glow-effect';
        document.body.appendChild(this.blushOverlay);
      }

      // Register hook with Monogatari
      if (global.monogatari) {
        global.monogatari.setOnCharacterChangeCallback((charId, expr, microAnim) => {
          this.handleExpressionChange(charId, expr, microAnim);
        });
      }
    }

    handleExpressionChange(charId, expr, microAnim) {
      const charSprite = document.querySelector(`[data-character="${charId}"]`);
      if (!charSprite) return;

      // Handle expression specific FX
      if (expr === 'blush') {
        this.showBlushFX(true);
      } else {
        this.showBlushFX(false);
      }

      if (expr === 'shock' || expr === 'surprised') {
        charSprite.classList.add('animated-shake');
        setTimeout(() => charSprite.classList.remove('animated-shake'), 500);
      }

      // Default ambient breathing
      if (!microAnim || microAnim === 'idle' || microAnim === 'character-idle') {
        charSprite.classList.add('animated-breathing');
      }
    }

    showBlushFX(enable) {
      if (!this.blushOverlay) return;
      if (enable) {
        this.blushOverlay.classList.add('active');
      } else {
        this.blushOverlay.classList.remove('active');
      }
    }
  }

  global.live2dManager = new Live2DManager();

})(window);
