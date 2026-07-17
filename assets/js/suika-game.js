class SuikaGame extends MergeGameCore {
    constructor(containerId, config) {
        super(containerId, config);
        this.currentLevel = 0;
        this.setupLevelUI();
        this.updateLevelUI();
    }

    setupLevelUI() {
        if (!this.config.levels) return;
        const uiLayer = this.container.querySelector('#ui-layer');
        
        const levelBox = document.createElement('div');
        levelBox.id = 'mg-level-box';
        levelBox.style.cssText = 'position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.9); padding: 5px 15px; border-radius: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; z-index: 10; pointer-events: auto; transition: all 0.3s;';
        
        levelBox.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <span id="mg-level-text" style="font-size: 11px; font-weight: bold; color: #888; text-transform: uppercase; letter-spacing: 1px;">Lv.1</span>
            </div>
            <div id="mg-target-icon" style="width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; font-family: 'Apple Color Emoji', sans-serif; box-shadow: inset 0 0 5px rgba(0,0,0,0.1);"></div>
        `;
        
        uiLayer.appendChild(levelBox);
        
        const levelCompleteOverlay = document.createElement('div');
        levelCompleteOverlay.id = 'mg-level-complete';
        levelCompleteOverlay.style.cssText = 'position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0; background: rgba(255, 255, 255, 0.95); padding: 20px 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; z-index: 30; pointer-events: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);';
        levelCompleteOverlay.innerHTML = `
            <h2 style="margin: 0 0 10px 0; color: #F42E35; font-size: 28px;">Level Cleared!</h2>
            <div id="mg-level-complete-icon" style="font-size: 48px;">🌟</div>
        `;
        this.container.appendChild(levelCompleteOverlay);
    }

    updateLevelUI() {
        if (!this.config.levels) return;
        
        const levelBox = document.getElementById('mg-level-box');
        if (!levelBox) return;

        const levelConfig = this.config.levels[this.currentLevel];
        if (!levelConfig) {
            document.getElementById('mg-level-text').innerText = 'MAX';
            document.getElementById('mg-target-icon').innerText = '👑';
            document.getElementById('mg-target-icon').style.background = 'gold';
            return;
        }

        const targetDef = this.config.items[levelConfig.targetItemIndex];
        document.getElementById('mg-level-text').innerText = `Lv.${this.currentLevel + 1}`;
        
        const targetIcon = document.getElementById('mg-target-icon');
        targetIcon.innerText = targetDef.emoji;
        targetIcon.style.background = targetDef.color;
        
        // Add a tiny bump animation
        levelBox.style.transform = 'translateX(-50%) scale(1.1)';
        setTimeout(() => {
            levelBox.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
    }

    onItemMerged(newIndex) {
        if (!this.config.levels || this.currentLevel >= this.config.levels.length) return;
        
        const levelConfig = this.config.levels[this.currentLevel];
        if (newIndex === levelConfig.targetItemIndex) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        this.currentLevel++;
        
        const popup = document.getElementById('mg-level-complete');
        if (popup) {
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
            
            setTimeout(() => {
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
                this.updateLevelUI();
            }, 1500);
        }
    }

    onGameReset() {
        this.currentLevel = 0;
        this.updateLevelUI();
    }

    setupRenderer() {
        this.render = Matter.Render.create({
            element: this.container,
            engine: this.engine,
            options: {
                width: this.gameWidth,
                height: this.gameHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        this.render.canvas.style.display = 'block';
        this.render.canvas.style.width = '100%';
        this.render.canvas.style.height = '100%';
        this.render.canvas.style.objectFit = 'contain';
        this.render.canvas.style.objectPosition = 'bottom center';
        Matter.Render.run(this.render);

        Matter.Events.on(this.render, 'afterRender', () => {
            const ctx = this.render.context;
            this.drawNextPreview();
            
            const bodies = Matter.Composite.allBodies(this.engine.world);
            for (let body of bodies) {
                if (body.label === 'mergeItem') {
                    const itemDef = this.config.items[body.itemIndex];
                    this.drawFruitHighlight(ctx, body.position.x, body.position.y, body.circleRadius, body.angle, itemDef ? itemDef.emoji : null);
                }
            }
        });
    }

    drawNextPreview() {
        if (!this.nextItemsQueue || this.nextItemsQueue.length === 0) return;
        
        const canvas = this.container.querySelector('#mg-next-preview-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const previewWidth = canvas.width;
        const previewHeight = canvas.height;
        
        ctx.clearRect(0, 0, previewWidth, previewHeight);
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('Next', previewWidth / 2, 12);
        
        for (let i = 0; i < this.nextItemsQueue.length; i++) {
            const itemIndex = this.nextItemsQueue[i];
            const itemDef = this.config.items[itemIndex];
            const drawRadius = 16; 
            const cx = previewWidth / 2;
            const cy = 30 + i * 45;
            
            ctx.beginPath();
            ctx.arc(cx, cy, drawRadius, 0, 2 * Math.PI);
            ctx.fillStyle = itemDef.color;
            ctx.fill();
            this.drawFruitHighlight(ctx, cx, cy, drawRadius, 0, itemDef.emoji);
        }
    }

    drawFruitHighlight(ctx, x, y, radius, angle = 0, emoji = null) {
        ctx.save();
        ctx.translate(x, y);

        if (emoji) {
            ctx.save();
            ctx.rotate(angle);
            
            ctx.font = `${radius * 1.1}px 'Apple Color Emoji', 'Inter', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.shadowColor = "rgba(0,0,0,0.2)";
            ctx.shadowBlur = Math.max(2, radius * 0.1);
            
            ctx.fillText(emoji, 0, radius * 0.1); 
            ctx.restore();
        }

        const innerGradient = ctx.createRadialGradient(
            radius * -0.2, radius * -0.2, radius * 0.1,
            0, 0, radius
        );
        innerGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        innerGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        innerGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = innerGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(radius * -0.25, radius * -0.4, radius * 0.3, radius * 0.15, Math.PI / -8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();

        ctx.restore();
    }
}
