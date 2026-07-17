class JuiceGame extends MergeGameCore {
    setupRenderer() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.objectFit = 'contain';
        this.canvas.style.position = 'relative';
        this.canvas.style.zIndex = '1';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.render = { canvas: this.canvas };
        
        this.customRenderLoop = this.customRenderLoop.bind(this);
        requestAnimationFrame(this.customRenderLoop);
    }

    customRenderLoop() {
        if (!this.engine) return;
        
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Room Background
        ctx.fillStyle = '#A1887F';
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 2;
        for(let i = 350; i < this.gameHeight; i += 30) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(this.gameWidth, i); ctx.stroke();
        }
        
        // Wall
        const wallBottom = 350; 
        ctx.fillStyle = '#FFF8E1';
        ctx.fillRect(0, 0, this.gameWidth, wallBottom);

        ctx.fillStyle = 'rgba(255, 213, 79, 0.15)';
        for(let i = 0; i < this.gameWidth; i += 40) {
            ctx.fillRect(i, 0, 20, wallBottom);
        }

        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, wallBottom - 15, this.gameWidth, 15);
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(0, wallBottom - 15, this.gameWidth, 4);

        // Picture Frame
        const frameX = 50;
        const frameY = 40;
        const frameW = 90;
        const frameH = 120;
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(frameX + 5, frameY + 5, frameW, frameH);
        
        ctx.fillStyle = '#795548';
        ctx.fillRect(frameX, frameY, frameW, frameH);
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(frameX + 8, frameY + 8, frameW - 16, frameH - 16);
        
        ctx.fillStyle = '#E0F7FA';
        ctx.fillRect(frameX + 12, frameY + 12, frameW - 24, frameH - 24);
        
        ctx.fillStyle = '#FFCA28';
        ctx.beginPath();
        ctx.arc(frameX + 35, frameY + 35, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#81C784';
        ctx.beginPath();
        ctx.arc(frameX + 60, frameY + 105, 35, Math.PI, 0);
        ctx.fill();
        
        // Window
        const winX = 270;
        const winY = 30;
        const winW = 120;
        const winH = 140;
        
        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = '#90CAF9';
        ctx.fillRect(winX + 8, winY + 8, winW - 16, winH - 16);
        
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(winX + 30, winY + 35, 12, 0, Math.PI * 2);
        ctx.arc(winX + 45, winY + 35, 16, 0, Math.PI * 2);
        ctx.arc(winX + 60, winY + 40, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(winX + winW/2 - 4, winY + 8, 8, winH - 16);
        ctx.fillRect(winX + 8, winY + winH/2 - 4, winW - 16, 8);
        
        // Table
        const topY = 220; 
        const bottomY = this.gameHeight - 50; 
        const topWidth = this.gameWidth * 0.8; 
        const bottomWidth = this.gameWidth * 0.95;
        
        const topLeftX = this.gameWidth / 2 - topWidth / 2;
        const topRightX = this.gameWidth / 2 + topWidth / 2;
        const bottomLeftX = this.gameWidth / 2 - bottomWidth / 2;
        const bottomRightX = this.gameWidth / 2 + bottomWidth / 2;

        ctx.fillStyle = '#D7CCC8';
        ctx.beginPath();
        ctx.moveTo(bottomLeftX, bottomY);
        ctx.lineTo(topLeftX, topY);
        ctx.lineTo(topRightX, topY);
        ctx.lineTo(bottomRightX, bottomY);
        ctx.fill();

        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.moveTo(bottomLeftX, bottomY);
        ctx.lineTo(bottomRightX, bottomY);
        ctx.lineTo(bottomRightX, bottomY + 30);
        ctx.lineTo(bottomLeftX, bottomY + 30);
        ctx.fill();
        
        ctx.fillStyle = '#A1887F';
        ctx.beginPath();
        ctx.moveTo(bottomLeftX, bottomY);
        ctx.lineTo(topLeftX, topY);
        ctx.lineTo(topLeftX - 15, topY);
        ctx.lineTo(bottomLeftX - 25, bottomY);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(bottomRightX, bottomY);
        ctx.lineTo(topRightX, topY);
        ctx.lineTo(topRightX + 15, topY);
        ctx.lineTo(bottomRightX + 25, bottomY);
        ctx.fill();
        
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(bottomLeftX + 15, bottomY + 30, 20, this.gameHeight - bottomY);
        ctx.fillRect(bottomRightX - 35, bottomY + 30, 20, this.gameHeight - bottomY);

        // Danger Line
        const dangerY = this.config.theme.invertGravity ? this.gameHeight - 100 : 100;
        const dPy = 220 + (dangerY / this.gameHeight) * (this.gameHeight - 270);
        const dScale = 0.8 + (dangerY / this.gameHeight) * 0.15;
        const dWidth = this.gameWidth * dScale;
        ctx.beginPath();
        ctx.moveTo(this.gameWidth/2 - dWidth/2, dPy);
        ctx.lineTo(this.gameWidth/2 + dWidth/2, dPy);
        ctx.strokeStyle = this.config.theme.dangerLineColor || 'red';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.setLineDash([]);

        const bodies = Matter.Composite.allBodies(this.engine.world);
        const sortedBodies = bodies.filter(b => b.label === 'mergeItem').sort((a, b) => a.position.y - b.position.y);
        
        for (let body of sortedBodies) {
            this.draw3DItem(ctx, body);
        }

        this.drawNextPreview();

        requestAnimationFrame(this.customRenderLoop);
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
            
            this.drawCup(ctx, cx, cy, drawRadius, itemDef.color, itemIndex + 1, false);
        }
    }

    draw3DItem(ctx, body) {
        const physY = body.position.y;
        const visualContactY = 220 + (physY / this.gameHeight) * (this.gameHeight - 270); 
        const posScale = 0.8 + (physY / this.gameHeight) * 0.15; 
        const sizeScale = 0.95 + (physY / this.gameHeight) * 0.05;

        const px = this.gameWidth / 2 + (body.position.x - this.gameWidth / 2) * posScale;
        const pRadius = body.circleRadius * sizeScale;
        const pHeight = pRadius * 1.05;
        const py = visualContactY - pHeight;

        this.drawCup(ctx, px, py, pRadius, body.render.fillStyle, body.itemIndex + 1, true);
    }

    drawCup(ctx, px, py, pRadius, color, textLabel, drawShadow = true) {
        ctx.save();
        ctx.translate(px, py);
        
        const pHeight = pRadius * 1.05; 
        const ellipseRatio = 0.25; 
        
        if (drawShadow) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(0, pHeight * 0.8, pRadius * 0.8, pRadius * ellipseRatio, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 0.7; 
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-pRadius * 0.7, pHeight);
        ctx.lineTo(pRadius * 0.7, pHeight);
        ctx.lineTo(pRadius, -pHeight);
        ctx.lineTo(-pRadius, -pHeight);
        ctx.fill();
        ctx.globalAlpha = 1.0; 
        
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, -pHeight, pRadius, pRadius * ellipseRatio, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, pRadius * 0.1);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(-pRadius * 0.5, pHeight * 0.9);
        ctx.lineTo(-pRadius * 0.1, pHeight * 0.9);
        ctx.lineTo(-pRadius * 0.4, -pHeight * 0.9);
        ctx.lineTo(-pRadius * 0.8, -pHeight * 0.9);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.font = `bold ${Math.max(10, pRadius)}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textLabel, 0, 0);

        ctx.restore();
    }
}
