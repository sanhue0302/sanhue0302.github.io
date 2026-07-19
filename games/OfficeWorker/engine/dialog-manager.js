class DialogManager {
    constructor() {
        this.overlay = document.getElementById('dialogue-overlay');
        this.avatar = document.getElementById('dialogue-avatar');
        this.name = document.getElementById('dialogue-name');
        this.text = document.getElementById('dialogue-text');
        this.dialogues = [];
        this.currentIndex = 0;
        this.onComplete = null;
        
        const clone = this.overlay.cloneNode(true);
        this.overlay.parentNode.replaceChild(clone, this.overlay);
        this.overlay = clone;
        this.avatar = document.getElementById('dialogue-avatar');
        this.name = document.getElementById('dialogue-name');
        this.text = document.getElementById('dialogue-text');

        this.overlay.addEventListener('click', () => this.next());
    }

    show(dialogues, onComplete) {
        this.dialogues = dialogues;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.overlay.classList.remove('hidden');
        this.render();
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
        const d = this.dialogues[this.currentIndex];
        this.avatar.innerText = d.avatar;
        this.name.innerText = d.name;
        this.text.innerHTML = d.text;
    }

    next() {
        this.currentIndex++;
        this.render();
    }
}

