class MergeGameCore {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        
        this.engine = null;
        this.render = null;
        this.runner = null;
        
        this.score = 0;
        this.isGameOver = false;
        this.isTransitioning = false;
        this.currentBody = null;
        this.dropReady = true;
        this.gameOverTimer = null;
        this.nextItemsQueue = [];
        this.spawnCounter = 0;

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
        if (!document.querySelector('link[href="https://fonts.googleapis.com/icon?family=Material+Icons"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
            document.head.appendChild(link);
        }

        this.container.innerHTML = `
            <div id="ui-layer" style="position: absolute; top: 0; left: 0; width: 100%; padding: 15px 20px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: flex-start; z-index: 10; pointer-events: none;">
                <div class="score-box" style="background: rgba(255, 255, 255, 0.9); padding: 8px 20px; border-radius: 25px; font-size: 22px; font-weight: bold; color: #333; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                    Score: <span id="mg-score">0</span>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 15px; pointer-events: auto;">
                    <button id="mg-in-game-restart-btn" style="background: rgba(255, 255, 255, 0.95); border: none; width: 48px; height: 48px; border-radius: 50%; color: #F42E35; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; justify-content: center; align-items: center; transition: transform 0.1s; flex-shrink: 0;">
                        <span class="material-icons" style="font-size: 26px;">refresh</span>
                    </button>
                    <div style="background: rgba(255, 255, 255, 0.85); border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 10px 0; width: 48px; display: flex; justify-content: center; align-items: center;">
                        <canvas id="mg-next-preview-canvas" width="40" height="95" style="display: block;"></canvas>
                    </div>
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
        
        const inGameRestartBtn = this.container.querySelector('#mg-in-game-restart-btn');
        if (inGameRestartBtn) {
            inGameRestartBtn.addEventListener('click', () => this.resetGame());
        }
    }

    initPhysics() {
        const { Engine, Runner, Events } = Matter;

        this.engine = Engine.create({
            positionIterations: 20, 
            velocityIterations: 20  
        });
        
        // Delegate rendering setup to subclass
        this.setupRenderer();

        this.setupWorld();
        this.engine.world.gravity.y = this.config.theme.invertGravity ? -1 : 1;

        Events.on(this.engine, 'collisionStart', this.handleCollision.bind(this));
        Events.on(this.engine, 'collisionActive', this.handleCollision.bind(this));
        Events.on(this.engine, 'beforeUpdate', () => {
            this.checkGameOver();
            this.updateGrowth();
        });

        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);

        this.setupInput();
        this.spawnNextItem();
    }
    
    setupRenderer() {
        // To be implemented by subclasses
        console.warn('setupRenderer should be implemented by a subclass');
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
        
        const dangerLine = Bodies.rectangle(this.gameWidth / 2, dangerY, this.gameWidth, 2, { 
            isStatic: true, 
            isSensor: true, 
            render: { fillStyle: this.config.theme.pseudo3D ? 'transparent' : dangerColor },
            label: 'dangerLine'
        });

        Composite.add(this.engine.world, [...walls, dangerLine]);
    }

    fillNextQueue() {
        while (this.nextItemsQueue.length < 2) {
            this.nextItemsQueue.push(this.generateRandomItem());
        }
    }

    generateRandomItem() {
        const maxStartIndex = Math.min(2, this.config.items.length - 1);
        return { type: 'mergeItem', index: Math.floor(Math.random() * (maxStartIndex + 1)) };
    }

    spawnNextItem() {
        if (this.isGameOver || this.isTransitioning) return;
        
        this.spawnCounter++;
        const currentSpawnId = this.spawnCounter;
        
        this.fillNextQueue();
        const nextItem = this.nextItemsQueue.shift();
        this.fillNextQueue();
        
        let itemDef, label;
        if (nextItem.type === 'obstacle') {
            itemDef = this.config.obstacles[nextItem.index];
            label = 'obstacle';
        } else {
            itemDef = this.config.items[nextItem.index];
            label = 'mergeItem';
        }

        const spawnY = this.config.theme.invertGravity ? this.gameHeight - 80 : 80;
        
        if (this.onNextItemSpawned) {
            this.onNextItemSpawned(itemDef, nextItem.index, () => {
                if (this.spawnCounter === currentSpawnId && !this.isTransitioning && !this.isGameOver) {
                    this.createCurrentBody(itemDef, label, nextItem.index, spawnY);
                }
            });
            return;
        }
        
        this.createCurrentBody(itemDef, label, nextItem.index, spawnY);
    }
    
    createCurrentBody(itemDef, label, itemIndex, spawnY) {
        const { Bodies, Composite } = Matter;
        this.currentBody = Bodies.circle(this.gameWidth / 2, spawnY, itemDef.radius, {
            isStatic: true,
            render: { fillStyle: itemDef.color },
            label: label,
            itemIndex: itemIndex
        });

        Composite.add(this.engine.world, this.currentBody);
        this.dropReady = true;
    }

    setupInput() {
        const handleMove = (e) => {
            if (this.isTransitioning || !this.currentBody || !this.dropReady || this.isGameOver) return;
            
            let clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const rect = this.render.canvas.getBoundingClientRect();
            
            const scaleX = this.gameWidth / rect.width;
            let canvasX = (clientX - rect.left) * scaleX;
            
            const spawnY = this.config.theme.invertGravity ? this.gameHeight - 80 : 80;
            const posScaleAtSpawn = 0.8 + (spawnY / this.gameHeight) * 0.15;
            let physicsX = this.gameWidth / 2 + (canvasX - this.gameWidth / 2) / posScaleAtSpawn;
            
            const radius = this.currentBody.circleRadius;
            physicsX = Math.max(radius, Math.min(this.gameWidth - radius, physicsX));

            Matter.Body.setPosition(this.currentBody, { x: physicsX, y: spawnY });
        };

        const handleDrop = (e) => {
            if (this.isTransitioning || !this.currentBody || !this.dropReady || this.isGameOver) return;
            
            this.dropReady = false;
            const spawnY = this.config.theme.invertGravity ? this.gameHeight - 80 : 80;
            
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
            
            const physicsConf = this.config.physics || {};
            this.currentBody.restitution = physicsConf.restitution ?? 0.05;
            this.currentBody.friction = physicsConf.friction ?? 0.9;
            this.currentBody.frictionStatic = physicsConf.frictionStatic ?? 10;
            this.currentBody.frictionAir = physicsConf.frictionAir ?? 0.01;
            
            const dropVelocity = physicsConf.dropVelocity ?? 15;
            
            if (this.config.theme.invertGravity) {
                Matter.Body.setVelocity(this.currentBody, { x: 0, y: -dropVelocity });
            } else {
                Matter.Body.setVelocity(this.currentBody, { x: 0, y: dropVelocity });
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

                        const initialRadius = newDef.radius * 0.3; 
                        
                        const physicsConf = this.config.physics || {};

                        const newBody = Bodies.circle(midX, midY, initialRadius, {
                            render: { fillStyle: newDef.color },
                            label: 'mergeItem',
                            itemIndex: newIndex,
                            restitution: physicsConf.restitution ?? 0.05,
                            friction: physicsConf.friction ?? 0.9,
                            frictionStatic: physicsConf.frictionStatic ?? 10,
                            frictionAir: physicsConf.frictionAir ?? 0.01
                        });
                        
                        newBody.targetRadius = newDef.radius;
                        newBody.currentRadius = initialRadius;
                        newBody.isGrowing = true;
                        newBody.isMerging = true; 

                        Composite.add(this.engine.world, newBody);
                        
                        this.score += (newIndex + 1) * 2;
                        this.container.querySelector('#mg-score').innerText = this.score;
                        
                        this.onItemMerged(newIndex, newBody);
                    }
                }
            }
        }
    }

    onItemMerged(newIndex, newBody) {
        // To be implemented by subclasses
    }

    updateGrowth() {
        const bodies = Matter.Composite.allBodies(this.engine.world);
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (body.isGrowing) {
                const oldRadius = body.currentRadius;
                body.currentRadius += body.targetRadius * 0.06; 
                
                if (body.currentRadius >= body.targetRadius) {
                    body.currentRadius = body.targetRadius;
                    body.isGrowing = false;
                    body.isMerging = false; 
                }
                
                const scaleFactor = body.currentRadius / oldRadius;
                Matter.Body.scale(body, scaleFactor, scaleFactor);
            } else if (body.isShrinking) {
                const oldRadius = body.currentRadius || body.circleRadius;
                const newRadius = oldRadius * 0.8;
                if (newRadius > 2) {
                    const scaleFactor = newRadius / oldRadius;
                    Matter.Body.scale(body, scaleFactor, scaleFactor);
                    body.currentRadius = newRadius;
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
        
        this.spawnCounter++;
        
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
        
        this.onGameReset();
    }
    
    onGameReset() {
        // To be implemented by subclasses
    }
}
