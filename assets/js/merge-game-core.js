class MergeGame {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        
        this.engine = null;
        this.render = null;
        this.runner = null;
        
        this.score = 0;
        this.isGameOver = false;
        this.currentBody = null;
        this.dropReady = true;
        this.gameOverTimer = null;
        this.nextItemsQueue = [];

        this.gameWidth = 450;
        this.gameHeight = 700;

        if (typeof Matter === 'undefined') {
            console.error('Matter.js is required but not loaded.');
            return;
        }

        this.initDOM();
        this.initPhysics();
    }

    initDOM() {
        this.container.innerHTML = `
            <div id="ui-layer" style="position: absolute; top: 0; left: 0; width: 100%; padding: 10px 20px; box-sizing: border-box; display: flex; justify-content: space-between; z-index: 10; pointer-events: none;">
                <div class="score-box" style="background: rgba(255, 255, 255, 0.8); padding: 5px 15px; border-radius: 20px; font-size: 24px; font-weight: bold; color: #333; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    Score: <span id="mg-score">0</span>
                </div>
            </div>
            <div id="game-over" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; flex-direction: column; justify-content: center; align-items: center; color: white; z-index: 20; pointer-events: auto;">
                <h1 style="font-size: 48px; margin: 0 0 20px 0; color: ${this.config.theme.background};">Game Over!</h1>
                <p style="font-size: 24px; margin: 0 0 30px 0;">Final Score: <span id="mg-final-score">0</span></p>
                <button id="mg-restart-btn" style="padding: 15px 40px; font-size: 20px; font-weight: bold; background: #F42E35; color: white; border: none; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">Play Again</button>
            </div>
        `;

        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.maxWidth = '450px';
        this.container.style.height = '100%';
        this.container.style.maxHeight = '800px';
        this.container.style.backgroundColor = this.config.theme.background;
        this.container.style.boxShadow = '0 0 20px rgba(0,0,0,0.1)';
        this.container.style.overflow = 'hidden';
        this.container.style.touchAction = 'none';

        const restartBtn = this.container.querySelector('#mg-restart-btn');
        restartBtn.addEventListener('click', () => this.resetGame());
    }

    initPhysics() {
        const { Engine, Render, Runner, Events } = Matter;

        this.engine = Engine.create({
            positionIterations: 20, // Increased for stiffer body collisions
            velocityIterations: 20  // Increased to prevent overlap and tunneling
        });
        
        if (!this.config.theme.pseudo3D) {
            this.render = Render.create({
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
            Render.run(this.render);

            Events.on(this.render, 'afterRender', () => {
                const ctx = this.render.context;
                this.drawNextPreview(ctx);
                
                // Add glossy highlights to all 2D items
                const bodies = Matter.Composite.allBodies(this.engine.world);
                for (let body of bodies) {
                    if (body.label === 'mergeItem') {
                        this.drawFruitHighlight(ctx, body.position.x, body.position.y, body.circleRadius);
                    }
                }
            });
        } else {
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

        this.setupWorld();
        this.engine.world.gravity.y = this.config.theme.invertGravity ? -1 : 1;

        Events.on(this.engine, 'collisionStart', this.handleCollision.bind(this));
        Events.on(this.engine, 'beforeUpdate', this.checkGameOver.bind(this));

        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        this.setupInput();
        this.spawnNextItem();
    }

    customRenderLoop() {
        if (!this.engine) return;
        
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        
        // Draw Room Background (Floor)
        ctx.fillStyle = '#A1887F'; // 木地板顏色
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
        
        // 畫一些簡單的地板線條增加透視感
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 2;
        for(let i = 350; i < this.gameHeight; i += 30) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(this.gameWidth, i); ctx.stroke();
        }
        
        // Wall
        const wallBottom = 350; 
        ctx.fillStyle = '#FFF8E1'; // Warm wallpaper base
        ctx.fillRect(0, 0, this.gameWidth, wallBottom);

        // Wallpaper stripes
        ctx.fillStyle = 'rgba(255, 213, 79, 0.15)';
        for(let i = 0; i < this.gameWidth; i += 40) {
            ctx.fillRect(i, 0, 20, wallBottom);
        }

        // Baseboard (踢腳板)
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, wallBottom - 15, this.gameWidth, 15);
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(0, wallBottom - 15, this.gameWidth, 4);

        // Picture Frame on the left wall
        const frameX = 50;
        const frameY = 40;
        const frameW = 90;
        const frameH = 120;
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; // Shadow
        ctx.fillRect(frameX + 5, frameY + 5, frameW, frameH);
        
        ctx.fillStyle = '#795548'; // Outer wood
        ctx.fillRect(frameX, frameY, frameW, frameH);
        ctx.fillStyle = '#3E2723'; // Inner bevel
        ctx.fillRect(frameX + 8, frameY + 8, frameW - 16, frameH - 16);
        
        ctx.fillStyle = '#E0F7FA'; // Canvas
        ctx.fillRect(frameX + 12, frameY + 12, frameW - 24, frameH - 24);
        
        ctx.fillStyle = '#FFCA28'; // Sun
        ctx.beginPath();
        ctx.arc(frameX + 35, frameY + 35, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#81C784'; // Hill
        ctx.beginPath();
        ctx.arc(frameX + 60, frameY + 105, 35, Math.PI, 0);
        ctx.fill();
        
        // Window on the right wall
        const winX = 270;
        const winY = 30;
        const winW = 120;
        const winH = 140;
        
        ctx.fillStyle = '#FAFAFA'; // Window frame
        ctx.fillRect(winX, winY, winW, winH);
        ctx.fillStyle = '#90CAF9'; // Sky outside
        ctx.fillRect(winX + 8, winY + 8, winW - 16, winH - 16);
        
        // Clouds
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(winX + 30, winY + 35, 12, 0, Math.PI * 2);
        ctx.arc(winX + 45, winY + 35, 16, 0, Math.PI * 2);
        ctx.arc(winX + 60, winY + 40, 12, 0, Math.PI * 2);
        ctx.fill();

        // Window panes
        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(winX + winW/2 - 4, winY + 8, 8, winH - 16);
        ctx.fillRect(winX + 8, winY + winH/2 - 4, winW - 16, 8);
        
        // Draw Table Background
        if (this.config.theme.pseudo3D) {
            const topY = 220; // 佔畫面比例調整為 2/3 以上
            const bottomY = this.gameHeight - 50; 
            const topWidth = this.gameWidth * 0.8; // 大幅加寬遠端，減少透視收束，讓桌子看起來「短而寬」
            const bottomWidth = this.gameWidth * 0.95;
            
            const topLeftX = this.gameWidth / 2 - topWidth / 2;
            const topRightX = this.gameWidth / 2 + topWidth / 2;
            const bottomLeftX = this.gameWidth / 2 - bottomWidth / 2;
            const bottomRightX = this.gameWidth / 2 + bottomWidth / 2;

            // Table Surface
            ctx.fillStyle = '#D7CCC8'; // Light wood
            ctx.beginPath();
            ctx.moveTo(bottomLeftX, bottomY);
            ctx.lineTo(topLeftX, topY);
            ctx.lineTo(topRightX, topY);
            ctx.lineTo(bottomRightX, bottomY);
            ctx.fill();

            // Table Front Edge (Thickness)
            ctx.fillStyle = '#8D6E63'; // Darker wood edge
            ctx.beginPath();
            ctx.moveTo(bottomLeftX, bottomY);
            ctx.lineTo(bottomRightX, bottomY);
            ctx.lineTo(bottomRightX, bottomY + 30);
            ctx.lineTo(bottomLeftX, bottomY + 30);
            ctx.fill();
            
            // Table Left Bumper
            ctx.fillStyle = '#A1887F';
            ctx.beginPath();
            ctx.moveTo(bottomLeftX, bottomY);
            ctx.lineTo(topLeftX, topY);
            ctx.lineTo(topLeftX - 15, topY);
            ctx.lineTo(bottomLeftX - 25, bottomY);
            ctx.fill();
            
            // Table Right Bumper
            ctx.beginPath();
            ctx.moveTo(bottomRightX, bottomY);
            ctx.lineTo(topRightX, topY);
            ctx.lineTo(topRightX + 15, topY);
            ctx.lineTo(bottomRightX + 25, bottomY);
            ctx.fill();
            
            // Table Front Legs (畫出桌腳，明確表示這是一張懸空的桌子)
            ctx.fillStyle = '#3E2723'; // 深色桌腳
            // 左前腳
            ctx.fillRect(bottomLeftX + 15, bottomY + 30, 20, this.gameHeight - bottomY);
            // 右前腳
            ctx.fillRect(bottomRightX - 35, bottomY + 30, 20, this.gameHeight - bottomY);
        }

        // Draw Danger Line in 3D
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
        // Sort ascending Y (top objects drawn first so bottom/near objects overlap them)
        const sortedBodies = bodies.filter(b => b.label === 'mergeItem').sort((a, b) => a.position.y - b.position.y);
        
        for (let body of sortedBodies) {
            this.draw3DItem(ctx, body);
        }

        // Draw Next Items Preview
        this.drawNextPreview(ctx);

        requestAnimationFrame(this.customRenderLoop);
    }

    drawNextPreview(ctx) {
        if (!this.nextItemsQueue || this.nextItemsQueue.length === 0) return;

        const previewWidth = 80;
        const previewHeight = 110;
        const px = this.gameWidth - previewWidth - 10;
        const py = 10;
        
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(px, py, previewWidth, previewHeight, 15);
            ctx.fill();
        } else {
            ctx.fillRect(px, py, previewWidth, previewHeight);
        }
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('Next', px + previewWidth / 2, py + 22);
        
        for (let i = 0; i < this.nextItemsQueue.length; i++) {
            const itemIndex = this.nextItemsQueue[i];
            const itemDef = this.config.items[itemIndex];
            const drawRadius = 18; 
            const cx = px + previewWidth / 2;
            const cy = py + 45 + i * 45;
            
            if (this.config.theme.pseudo3D) {
                this.drawCup(ctx, cx, cy, drawRadius, itemDef.color, itemIndex + 1, false);
            } else {
                ctx.beginPath();
                ctx.arc(cx, cy, drawRadius, 0, 2 * Math.PI);
                ctx.fillStyle = itemDef.color;
                ctx.fill();
                this.drawFruitHighlight(ctx, cx, cy, drawRadius);
            }
        }
        ctx.restore();
    }

    drawFruitHighlight(ctx, x, y, radius) {
        ctx.save();
        ctx.translate(x, y);

        // Inner shadow for volume
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

        // Top glossy highlight
        ctx.beginPath();
        ctx.ellipse(radius * -0.25, radius * -0.4, radius * 0.3, radius * 0.15, Math.PI / -8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();

        ctx.restore();
    }

    draw3DItem(ctx, body) {
        // Perspective Math
        const physY = body.position.y;
        // 這個 Y 座標代表的是物體「接觸桌面」的位置
        const visualContactY = 220 + (physY / this.gameHeight) * (this.gameHeight - 270); 
        
        // posScale goes from 0.8 (top) to 0.95 (bottom) 減少透視感
        const posScale = 0.8 + (physY / this.gameHeight) * 0.15; 
        
        // sizeScale keeps cups large (只縮小到 95%)
        const sizeScale = 0.95 + (physY / this.gameHeight) * 0.05;

        const px = this.gameWidth / 2 + (body.position.x - this.gameWidth / 2) * posScale;
        const pRadius = body.circleRadius * sizeScale;
        
        // 將繪製中心點往上偏移一個杯身高度，確保「杯底」完美貼齊 visualContactY
        const pHeight = pRadius * 1.05;
        const py = visualContactY - pHeight;

        this.drawCup(ctx, px, py, pRadius, body.render.fillStyle, body.itemIndex + 1, true);
    }

    drawCup(ctx, px, py, pRadius, color, textLabel, drawShadow = true) {
        ctx.save();
        ctx.translate(px, py);
        
        // 配合視角拉高，恢復杯子的圓潤度
        const pHeight = pRadius * 1.05; 
        const ellipseRatio = 0.25; 
        
        // shadow
        if (drawShadow) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.ellipse(0, pHeight * 0.8, pRadius * 0.8, pRadius * ellipseRatio, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // cup body
        ctx.globalAlpha = 0.7; // 設定半透明玻璃/果汁效果，解決遮擋問題
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-pRadius * 0.7, pHeight);
        ctx.lineTo(pRadius * 0.7, pHeight);
        ctx.lineTo(pRadius, -pHeight);
        ctx.lineTo(-pRadius, -pHeight);
        ctx.fill();
        ctx.globalAlpha = 1.0; // 恢復不透明度
        
        // top lid/liquid surface
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, -pHeight, pRadius, pRadius * ellipseRatio, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // rim
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, pRadius * 0.1);
        ctx.stroke();
        
        // curved reflection
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(-pRadius * 0.5, pHeight * 0.9);
        ctx.lineTo(-pRadius * 0.1, pHeight * 0.9);
        ctx.lineTo(-pRadius * 0.4, -pHeight * 0.9);
        ctx.lineTo(-pRadius * 0.8, -pHeight * 0.9);
        ctx.fill();

        // number or dot to distinguish
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.font = `bold ${Math.max(10, pRadius)}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textLabel, 0, 0);

        ctx.restore();
    }

    setupWorld() {
        const { Bodies, Composite } = Matter;
        const wallColor = this.config.theme.wallColor;
        const dangerColor = this.config.theme.dangerLineColor;

        const walls = [
            Bodies.rectangle(-25, this.gameHeight / 2, 50, this.gameHeight, { isStatic: true, render: { fillStyle: wallColor } }),
            Bodies.rectangle(this.gameWidth + 25, this.gameHeight / 2, 50, this.gameHeight, { isStatic: true, render: { fillStyle: wallColor } })
        ];

        if (this.config.theme.invertGravity) {
            walls.push(Bodies.rectangle(this.gameWidth / 2, -25, this.gameWidth, 50, { isStatic: true, render: { fillStyle: wallColor } }));
        } else {
            walls.push(Bodies.rectangle(this.gameWidth / 2, this.gameHeight + 25, this.gameWidth, 50, { isStatic: true, render: { fillStyle: wallColor } }));
        }

        const dangerY = this.config.theme.invertGravity ? this.gameHeight - 100 : 100;
        
        // Only add dangerLine to physics if NOT using custom 3D render (or add it invisible)
        const dangerLine = Bodies.rectangle(this.gameWidth / 2, dangerY, this.gameWidth, 2, { 
            isStatic: true, 
            isSensor: true, 
            render: { fillStyle: this.config.theme.pseudo3D ? 'transparent' : dangerColor },
            label: 'dangerLine'
        });

        Composite.add(this.engine.world, [...walls, dangerLine]);
    }

    spawnNextItem() {
        if (this.isGameOver) return;
        
        const { Bodies, Composite } = Matter;
        const maxStartIndex = Math.min(2, this.config.items.length - 1);
        
        while (this.nextItemsQueue.length < 2) {
            this.nextItemsQueue.push(Math.floor(Math.random() * (maxStartIndex + 1)));
        }
        
        const itemIndex = this.nextItemsQueue.shift();
        this.nextItemsQueue.push(Math.floor(Math.random() * (maxStartIndex + 1)));
        
        const itemDef = this.config.items[itemIndex];

        const spawnY = this.config.theme.invertGravity ? this.gameHeight - 50 : 50;

        this.currentBody = Bodies.circle(this.gameWidth / 2, spawnY, itemDef.radius, {
            isStatic: true,
            render: { fillStyle: itemDef.color },
            label: 'mergeItem',
            itemIndex: itemIndex
        });

        Composite.add(this.engine.world, this.currentBody);
        this.dropReady = true;
    }

    setupInput() {
        const handleMove = (e) => {
            if (!this.currentBody || !this.dropReady || this.isGameOver) return;
            
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const rect = this.render.canvas.getBoundingClientRect();
            
            const scaleX = this.gameWidth / rect.width;
            let canvasX = (clientX - rect.left) * scaleX;
            
            const spawnY = this.config.theme.invertGravity ? this.gameHeight - 50 : 50;
            const posScaleAtSpawn = 0.8 + (spawnY / this.gameHeight) * 0.15;
            let physicsX = this.gameWidth / 2 + (canvasX - this.gameWidth / 2) / posScaleAtSpawn;
            
            const radius = this.currentBody.circleRadius;
            physicsX = Math.max(radius, Math.min(this.gameWidth - radius, physicsX));

            Matter.Body.setPosition(this.currentBody, { x: physicsX, y: spawnY });
        };

        const handleDrop = (e) => {
            if (!this.currentBody || !this.dropReady || this.isGameOver) return;
            
            this.dropReady = false;
            const spawnY = this.config.theme.invertGravity ? this.gameHeight - 50 : 50;
            
            if (e && (e.changedTouches || e.clientX)) {
                let clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                const rect = this.render.canvas.getBoundingClientRect();
                const scaleX = this.gameWidth / rect.width;
                let canvasX = (clientX - rect.left) * scaleX;
                const posScaleAtSpawn = 0.8 + (spawnY / this.gameHeight) * 0.15;
                let physicsX = this.gameWidth / 2 + (canvasX - this.gameWidth / 2) / posScaleAtSpawn;
                const radius = this.currentBody.circleRadius;
                physicsX = Math.max(radius, Math.min(this.gameWidth - radius, physicsX));
                Matter.Body.setPosition(this.currentBody, { x: physicsX, y: spawnY });
            }

            Matter.Body.setStatic(this.currentBody, false);
            // 降低彈性，避免撞擊後因為微小彈跳而產生偏移
            this.currentBody.restitution = 0.05;
            // 提高摩擦與靜摩擦，讓圓形在擠壓時不易滑開
            this.currentBody.friction = 0.9;
            this.currentBody.frictionStatic = 10;
            this.currentBody.frictionAir = 0.04;
            
            // Push it hard if inverted gravity, but not too hard to prevent tunneling
            if (this.config.theme.invertGravity) {
                Matter.Body.setVelocity(this.currentBody, { x: 0, y: -15 });
            }
            
            this.currentBody = null;
            
            setTimeout(() => {
                if (!this.isGameOver) this.spawnNextItem();
            }, 1000);
        };

        this.container.addEventListener('mousemove', handleMove);
        this.container.addEventListener('touchmove', handleMove);
        this.container.addEventListener('mouseup', handleDrop);
        this.container.addEventListener('touchend', handleDrop);
    }

    handleCollision(event) {
        const { Composite, Bodies } = Matter;
        const pairs = event.pairs;
        const items = this.config.items;

        for (let i = 0; i < pairs.length; i++) {
            const bodyA = pairs[i].bodyA;
            const bodyB = pairs[i].bodyB;

            if (bodyA.label === 'mergeItem' && bodyB.label === 'mergeItem') {
                if (bodyA.itemIndex === bodyB.itemIndex && !bodyA.isMerging && !bodyB.isMerging) {
                    const index = bodyA.itemIndex;
                    
                    if (index < items.length - 1) {
                        bodyA.isMerging = true;
                        bodyB.isMerging = true;
                        
                        const newIndex = index + 1;
                        const newDef = items[newIndex];
                        
                        const midX = (bodyA.position.x + bodyB.position.x) / 2;
                        const midY = (bodyA.position.y + bodyB.position.y) / 2;

                        Composite.remove(this.engine.world, [bodyA, bodyB]);

                        const newBody = Bodies.circle(midX, midY, newDef.radius, {
                            render: { fillStyle: newDef.color },
                            label: 'mergeItem',
                            itemIndex: newIndex,
                            restitution: 0.05,
                            friction: 0.9,
                            frictionStatic: 10,
                            frictionAir: 0.04
                        });

                        Composite.add(this.engine.world, newBody);
                        
                        this.score += (newIndex + 1) * 2;
                        this.container.querySelector('#mg-score').innerText = this.score;
                    }
                }
            }
        }
    }

    checkGameOver() {
        if (this.isGameOver) return;

        const { Composite } = Matter;
        let isDanger = false;
        const bodies = Composite.allBodies(this.engine.world);
        
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (body.label === 'mergeItem' && !body.isStatic) {
                if (this.config.theme.invertGravity) {
                    if (body.position.y + body.circleRadius > this.gameHeight - 100 && body.velocity.y < 0.5 && body.velocity.y > -0.5) {
                        isDanger = true;
                        break;
                    }
                } else {
                    if (body.position.y - body.circleRadius < 100 && body.velocity.y > -0.5 && body.velocity.y < 0.5) {
                        isDanger = true;
                        break;
                    }
                }
            }
        }

        if (isDanger) {
            if (!this.gameOverTimer) {
                this.gameOverTimer = this.engine.timing.timestamp;
            } else if (this.engine.timing.timestamp - this.gameOverTimer > 2000) {
                this.triggerGameOver();
            }
        } else {
            this.gameOverTimer = null;
        }
    }

    triggerGameOver() {
        this.isGameOver = true;
        Matter.Runner.stop(this.runner);
        this.container.querySelector('#game-over').style.display = 'flex';
        this.container.querySelector('#mg-final-score').innerText = this.score;
    }

    resetGame() {
        const { Composite, Engine, Runner } = Matter;
        
        Composite.clear(this.engine.world);
        Engine.clear(this.engine);
        
        this.container.querySelector('#game-over').style.display = 'none';
        this.score = 0;
        this.container.querySelector('#mg-score').innerText = this.score;
        this.isGameOver = false;
        this.gameOverTimer = null;
        this.currentBody = null;
        this.nextItemsQueue = [];
        
        this.engine.world.gravity.y = this.config.theme.invertGravity ? -1 : 1;
        this.setupWorld();
        
        Runner.run(this.runner, this.engine);
        this.spawnNextItem();
    }
}
