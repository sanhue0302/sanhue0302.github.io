class AudioManager {
    constructor() {
        this.ctx = null;
        document.body.addEventListener('pointerdown', () => {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();
        }, { once: true });
    }
    
    playAdvancedTone({ freq, type = 'sine', duration, vol = 0.1, attack = 0.05, detune = 0, filterFreq = 2000 }) {
        if (!this.ctx) return;
        
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = type;
        osc2.type = type;
        osc1.frequency.value = freq;
        osc2.frequency.value = freq;
        osc2.detune.value = detune;

        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        const now = this.ctx.currentTime;
        
        // ADSR Envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(vol, now + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }
    
    playMatch() {
        this.playAdvancedTone({ freq: 600, type: 'sine', duration: 0.3, vol: 0.15, attack: 0.02, detune: 5 });
        setTimeout(() => this.playAdvancedTone({ freq: 800, type: 'triangle', duration: 0.4, vol: 0.1, attack: 0.02, detune: -5 }), 80);
    }
    
    playDrop() {
        this.playAdvancedTone({ freq: 300, type: 'triangle', duration: 0.15, vol: 0.08, attack: 0.01, filterFreq: 1000 });
    }
    
    playCombo(comboCount) {
        const baseFreq = 500 + (comboCount * 100);
        this.playAdvancedTone({ freq: baseFreq, type: 'sine', duration: 0.4, vol: 0.2, attack: 0.03, detune: 8 });
        setTimeout(() => this.playAdvancedTone({ freq: baseFreq * 1.25, type: 'triangle', duration: 0.5, vol: 0.15, attack: 0.03, detune: -8 }), 100);
    }
    
    playDamage() {
        this.playAdvancedTone({ freq: 150, type: 'sawtooth', duration: 0.4, vol: 0.25, attack: 0.01, detune: 15, filterFreq: 800 });
        setTimeout(() => this.playAdvancedTone({ freq: 100, type: 'square', duration: 0.3, vol: 0.2, attack: 0.01, detune: -15, filterFreq: 600 }), 50);
    }
    
    playHeal() {
        this.playAdvancedTone({ freq: 400, type: 'sine', duration: 0.4, vol: 0.2, attack: 0.1, detune: 10 });
        setTimeout(() => this.playAdvancedTone({ freq: 600, type: 'sine', duration: 0.5, vol: 0.2, attack: 0.1, detune: -10 }), 150);
        setTimeout(() => this.playAdvancedTone({ freq: 800, type: 'sine', duration: 0.6, vol: 0.15, attack: 0.1, detune: 5 }), 300);
    }
}

