class SuikaGame extends MergeGameCore {
    constructor(containerId, config) {
        super(containerId, config);
        this.currentLevel = 0;
        this.currentLevelProgress = 0;
        this.previewOffset = 0;
        this.setupLevelUI();
        this.buildLevelUI();
    }
    
    onNextItemSpawned(itemDef, itemIndex, callback) {
        this.previewOffset = 40;
        
        const canvasRect = this.render.canvas.getBoundingClientRect();
        const scaleX = canvasRect.width / this.gameWidth;
        const scaleY = canvasRect.height / this.gameHeight;
        
        const startX = canvasRect.left + (this.gameWidth - 70) * scaleX;
        const startY = canvasRect.top + 85 * scaleY;
        
        const endX = canvasRect.left + (this.gameWidth / 2) * scaleX;
        const endY = canvasRect.top + 80 * scaleY;
        
        const animDiv = document.createElement('div');
        animDiv.className = 'mg-anim-div';
        animDiv.innerText = itemDef.emoji;
        
        animDiv.style.cssText = `
            position: fixed; 
            font-size: ${itemDef.radius * scaleX * 1.8}px; 
            pointer-events: none; 
            z-index: 1000; 
            font-family: 'Apple Color Emoji', sans-serif; 
            text-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(animDiv);
        
        const animation = animDiv.animate([
            { left: `${startX}px`, top: `${startY}px`, transform: `translate(-50%, -50%) scale(0.3) rotate(-45deg)`, easing: 'ease-out' },
            { left: `${(startX + endX) / 2}px`, top: `${startY - 60 * scaleY}px`, transform: `translate(-50%, -50%) scale(1.1) rotate(15deg)`, easing: 'ease-in' },
            { left: `${endX}px`, top: `${endY}px`, transform: `translate(-50%, -50%) scale(1) rotate(0deg)` }
        ], {
            duration: 350,
            fill: 'forwards'
        });
        
        animation.onfinish = () => {
            animDiv.remove();
            callback();
        };
    }

    setupLevelUI() {
        if (!this.config.levels) return;
        const uiLayer = this.container.querySelector('#ui-layer');
        
        // Shrink score box to save space
        const scoreBox = uiLayer.querySelector('.score-box');
        if (scoreBox) {
            scoreBox.style.padding = '5px 12px';
            scoreBox.style.fontSize = '18px';
        }

        const levelBox = document.createElement('div');
        levelBox.id = 'mg-level-box';
        levelBox.style.cssText = 'position: absolute; top: 12px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.95); padding: 5px 15px; border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 10; pointer-events: auto; transition: all 0.3s; min-width: 80px;';
        
        levelBox.innerHTML = `
            <span id="mg-level-text" style="font-size: 12px; font-weight: 800; color: #F42E35; letter-spacing: 1px;">LV.1</span>
            <div id="mg-target-icons" style="display: flex; gap: 5px; align-items: center;"></div>
        `;
        
        uiLayer.appendChild(levelBox);

        // Move Next Preview to right wall as an L-shaped glass pipe
        const previewCanvas = uiLayer.querySelector('#mg-next-preview-canvas');
        if (previewCanvas) {
            const wrapper = previewCanvas.parentElement;
            wrapper.removeChild(previewCanvas);
            
            // Remove the empty white background wrapper left behind
            if (wrapper && wrapper.tagName === 'DIV') {
                wrapper.style.display = 'none';
            }
            
            this.container.appendChild(previewCanvas);
            previewCanvas.style.cssText = `
                position: absolute;
                top: 60px;
                right: 0px;
                width: 90px;
                height: 50px;
                z-index: 5;
                pointer-events: none;
            `;
            previewCanvas.width = 90;
            previewCanvas.height = 50;
        }
        
        const levelCompleteOverlay = document.createElement('div');
        levelCompleteOverlay.id = 'mg-level-complete';
        levelCompleteOverlay.style.cssText = 'position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) scale(0.5); opacity: 0; background: rgba(255, 255, 255, 0.95); padding: 20px 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; z-index: 30; pointer-events: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);';
        levelCompleteOverlay.innerHTML = `
            <h2 style="margin: 0 0 10px 0; color: #F42E35; font-size: 28px;">Level Cleared!</h2>
            <div id="mg-level-complete-icon" style="font-size: 48px;">🌟</div>
        `;
        this.container.appendChild(levelCompleteOverlay);
    }

    buildLevelUI() {
        const targetIconsContainer = document.getElementById('mg-target-icons');
        if (!targetIconsContainer) return;
        targetIconsContainer.innerHTML = '';
        
        const levelConfig = this.config.levels[this.currentLevel];
        if (!levelConfig) {
            document.getElementById('mg-level-text').innerText = 'MAX';
            targetIconsContainer.innerHTML = `<div style="font-size: 22px;">👑</div>`;
            return;
        }
        
        const targetDef = this.config.items[levelConfig.targetItemIndex];
        const targetCount = Math.min(levelConfig.targetCount || 1, 3);
        document.getElementById('mg-level-text').innerText = `Lv.${this.currentLevel + 1}`;

        for (let i = 0; i < targetCount; i++) {
            const icon = document.createElement('div');
            icon.className = 'mg-target-icon-item';
            icon.style.cssText = `width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; font-family: 'Apple Color Emoji', sans-serif; box-shadow: inset 0 0 5px rgba(0,0,0,0.1); background: ${targetDef.color}; transition: all 0.3s;`;
            icon.innerText = targetDef.emoji;
            targetIconsContainer.appendChild(icon);
        }
        this.updateLevelUI();
    }

    updateLevelUI() {
        if (!this.config.levels) return;
        
        const levelBox = document.getElementById('mg-level-box');
        if (!levelBox) return;

        const progress = this.currentLevelProgress || 0;
        const icons = document.querySelectorAll('.mg-target-icon-item');
        
        icons.forEach((icon, index) => {
            if (index < progress) {
                // Gray out
                icon.style.filter = 'grayscale(100%) opacity(0.3)';
                icon.style.transform = 'scale(0.8)';
            } else {
                icon.style.filter = 'none';
                icon.style.transform = 'scale(1)';
            }
        });
        
        levelBox.style.transform = 'translateX(-50%) scale(1.1)';
        setTimeout(() => {
            levelBox.style.transform = 'translateX(-50%) scale(1)';
        }, 200);
    }

    generateRandomItem() {
        if (this.config.levels && this.config.obstacles) {
            const levelConfig = this.config.levels[this.currentLevel];
            if (levelConfig && levelConfig.obstacleProb && Math.random() < levelConfig.obstacleProb) {
                const obstacleIndex = Math.floor(Math.random() * this.config.obstacles.length);
                return { type: 'obstacle', index: obstacleIndex };
            }
        }
        return super.generateRandomItem();
    }

    onItemMerged(newIndex, newBody) {
        if (!this.config.levels || this.currentLevel >= this.config.levels.length) return;
        
        const levelConfig = this.config.levels[this.currentLevel];
        if (newIndex === levelConfig.targetItemIndex) {
            
            const icons = document.querySelectorAll('.mg-target-icon-item');
            const targetIconElement = icons[this.currentLevelProgress];
            
            // Remove from physics world
            Matter.Composite.remove(this.engine.world, newBody);
            
            // Play flying animation
            const targetDef = this.config.items[newIndex];
            if (targetIconElement) {
                this.playCollectAnimation(newBody.position.x, newBody.position.y, targetDef, targetIconElement);
            }
            
            this.currentLevelProgress++;
            const targetCount = levelConfig.targetCount || 1;
            
            setTimeout(() => {
                if (this.currentLevelProgress >= targetCount) {
                    this.levelComplete();
                } else {
                    this.updateLevelUI();
                }
            }, 600);
        }
    }

    playCollectAnimation(startX, startY, targetDef, targetIconElement) {
        const animDiv = document.createElement('div');
        animDiv.innerText = targetDef.emoji;
        
        const canvasRect = this.render.canvas.getBoundingClientRect();
        const scaleX = canvasRect.width / this.gameWidth;
        const scaleY = canvasRect.height / this.gameHeight;
        
        const screenX = canvasRect.left + startX * scaleX;
        const screenY = canvasRect.top + startY * scaleY;
        
        const endRect = targetIconElement.getBoundingClientRect();
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;
        
        animDiv.style.cssText = `position: fixed; left: ${screenX}px; top: ${screenY}px; transform: translate(-50%, -50%); font-size: ${targetDef.radius * scaleX * 1.5}px; pointer-events: none; z-index: 1000; transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); font-family: 'Apple Color Emoji', sans-serif; text-shadow: 0 4px 10px rgba(0,0,0,0.2);`;
        document.body.appendChild(animDiv);
        
        animDiv.getBoundingClientRect(); // force reflow
        
        animDiv.style.left = `${endX}px`;
        animDiv.style.top = `${endY}px`;
        animDiv.style.fontSize = '22px';
        animDiv.style.opacity = '0.5';
        
        setTimeout(() => {
            animDiv.remove();
        }, 600);
    }
    
    levelComplete() {
        this.currentLevel++;
        this.currentLevelProgress = 0;
        this.isTransitioning = true;
        
        if (this.currentBody) {
            Matter.Composite.remove(this.engine.world, this.currentBody);
            this.currentBody = null;
        }

        const bodies = Matter.Composite.allBodies(this.engine.world);
        const itemsToClear = bodies.filter(b => b.label === 'mergeItem' || b.label === 'obstacle');
        itemsToClear.forEach(body => {
            body.isShrinking = true;
            body.isMerging = true;
        });
        
        const popup = document.getElementById('mg-level-complete');
        if (popup) {
            popup.innerHTML = `
                <h2 style="margin: 0 0 5px 0; color: #F42E35; font-size: 32px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Level Cleared!</h2>
                <div style="font-size: 16px; color: #666; margin-bottom: 10px; font-weight: bold;">Board Cleared</div>
                <div id="mg-level-complete-icon" style="font-size: 54px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🌟</div>
            `;
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
            
            this.levelTransitionTimeout = setTimeout(() => {
                this.levelTransitionTimeout = null;
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
                
                itemsToClear.forEach(body => {
                    Matter.Composite.remove(this.engine.world, body);
                });
                
                this.buildLevelUI();
                this.isTransitioning = false;
                this.spawnNextItem();
            }, 2500);
        }
    }

    onGameReset() {
        if (this.levelTransitionTimeout) {
            clearTimeout(this.levelTransitionTimeout);
            this.levelTransitionTimeout = null;
        }
        
        const popup = document.getElementById('mg-level-complete');
        if (popup) {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
        
        this.currentLevel = 0;
        this.currentLevelProgress = 0;
        this.previewOffset = 0;
        
        document.querySelectorAll('.mg-anim-div').forEach(el => el.remove());
        
        this.buildLevelUI();
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
                } else if (body.label === 'obstacle') {
                    const itemDef = this.config.obstacles[body.itemIndex];
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
        
        ctx.save();
        
        // Draw horizontal glass tube
        ctx.beginPath();
        ctx.moveTo(90, 4);
        ctx.lineTo(20, 4);
        ctx.arcTo(4, 4, 4, 25, 16);
        ctx.arcTo(4, 46, 20, 46, 16);
        ctx.lineTo(90, 46);
        ctx.closePath();
        
        // Glass gradient fill
        const grad = ctx.createLinearGradient(0, 4, 0, 46);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
        grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
        ctx.fillStyle = grad;
        ctx.fill();
        
        // Glass outer reflection
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
        ctx.restore();
        
        if (this.previewOffset > 0) {
            this.previewOffset -= 1.5;
            if (this.previewOffset < 0) this.previewOffset = 0;
        }
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(90, 4);
        ctx.lineTo(20, 4);
        ctx.arcTo(4, 4, 4, 25, 16);
        ctx.arcTo(4, 46, 20, 46, 16);
        ctx.lineTo(90, 46);
        ctx.closePath();
        ctx.clip();
        
        for (let i = 0; i < this.nextItemsQueue.length; i++) {
            const nextItem = this.nextItemsQueue[i];
            let itemDef;
            if (nextItem.type === 'obstacle') {
                itemDef = this.config.obstacles[nextItem.index];
            } else {
                itemDef = this.config.items[nextItem.index];
            }
            const drawRadius = 16; 
            
            let D = i * 40 + this.previewOffset;
            let cx = 30 + D;
            let cy = 25;
            
            ctx.beginPath();
            ctx.arc(cx, cy, drawRadius, 0, 2 * Math.PI);
            ctx.fillStyle = itemDef.color;
            ctx.fill();
            this.drawFruitHighlight(ctx, cx, cy, drawRadius, 0, itemDef.emoji);
        }
        ctx.restore(); // remove clip

        // Front glare overlay
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(15, 12);
        ctx.lineTo(80, 12);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
        
        // Pipe opening inner shadow
        ctx.beginPath();
        ctx.ellipse(10, 25, 6, 18, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
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
