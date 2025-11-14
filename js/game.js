// Main game controller for The Workshop
// Ties everything together

class WorkshopGame {
    constructor() {
        this.canvas = document.getElementById('workshop-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Make canvas crisp for pixel art
        this.ctx.imageSmoothingEnabled = false;

        // Game systems
        this.workshop = null;
        this.pieceManager = null;
        this.constructGenerator = null;
        this.radio = null;

        // Game state
        this.isRunning = false;
        this.lastTime = 0;

        // Input handling
        this.touches = {};
        this.mouse = { x: 0, y: 0, down: false };

        this.init();
    }

    async init() {
        console.log('Initializing The Workshop...');

        // Show loading screen
        document.getElementById('loading').classList.remove('hidden');

        // Initialize systems
        this.workshop = new WorkshopEnvironment();
        this.pieceManager = new PieceManager();
        this.constructGenerator = new ConstructGenerator();
        this.radio = new RadioSystem();

        // Check for special events on load
        const events = window.storage.checkSpecialEvents();
        events.forEach(event => {
            console.log('Special event:', event.message);
            // Could show these as notifications
        });

        // Restore saved constructs
        this.loadSavedConstructs();

        // Set up input handlers
        this.setupInputHandlers();

        // Mobile canvas setup
        this.setupMobileCanvas();
        window.addEventListener('resize', () => this.setupMobileCanvas());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.setupMobileCanvas(), 100);
        });

        // Start auto-save
        window.storage.startAutoSave();

        // Temporary debug info for mobile testing
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('github.io')) {
            const debug = document.createElement('div');
            debug.id = 'debug-info';
            debug.style.cssText = 'position:fixed;bottom:0;left:0;background:rgba(0,0,0,0.8);color:#0f0;padding:5px;font-size:10px;z-index:9999;font-family:monospace;';
            debug.innerHTML = `v1.1 | ${this.canvas.width}x${this.canvas.height} | PWA:${window.matchMedia('(display-mode: standalone)').matches}`;
            document.body.appendChild(debug);

            // Update debug info on resize
            window.addEventListener('resize', () => {
                debug.innerHTML = `v1.1 | Win:${window.innerWidth}x${window.innerHeight} | Canvas:${this.canvas.style.width}`;
            });
        }

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
            this.start();
        }, 1000);
    }

    loadSavedConstructs() {
        const savedConstructs = window.storage.data.constructs || [];
        savedConstructs.forEach(saved => {
            // Recreate construct from saved data
            const construct = {
                ...saved,
                animationFrame: 0,
                scale: 1,
                rotation: 0
            };
            this.constructGenerator.constructs.push(construct);
        });
    }

    setupInputHandlers() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Touch events (for mobile)
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupMobileCanvas() {
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scale to fit container
        const scaleX = containerWidth / this.canvas.width;
        const scaleY = containerHeight / this.canvas.height;
        const scale = Math.min(scaleX, scaleY, 1); // Never scale up, only down

        // Apply scaling via CSS
        this.canvas.style.width = (this.canvas.width * scale) + 'px';
        this.canvas.style.height = (this.canvas.height * scale) + 'px';

        // Center the canvas
        if (scale < 1) {
            this.canvas.style.margin = '0 auto';
        }

        console.log(`Canvas scaled to ${scale} for container ${containerWidth}x${containerHeight}`);
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    getTouchPos(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        this.mouse = { ...pos, down: true };
        this.handleInteractionStart(pos.x, pos.y);
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        this.mouse = { ...pos, down: this.mouse.down };

        if (this.mouse.down) {
            this.handleInteractionMove(pos.x, pos.y);
        }
    }

    handleMouseUp(e) {
        const pos = this.getMousePos(e);
        this.mouse = { ...pos, down: false };
        this.handleInteractionEnd(pos.x, pos.y);
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const pos = this.getTouchPos(touch);
        this.touches[touch.identifier] = pos;
        this.handleInteractionStart(pos.x, pos.y);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
            const pos = this.getTouchPos(touch);
            this.touches[touch.identifier] = pos;
            this.handleInteractionMove(pos.x, pos.y);
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const pos = this.touches[touch.identifier];
        if (pos) {
            this.handleInteractionEnd(pos.x, pos.y);
            delete this.touches[touch.identifier];
        }
    }

    handleInteractionStart(x, y) {
        // Check radio click
        if (this.radio.isClicked(x, y)) {
            this.radio.onClick();
            return;
        }

        // Check plant click
        if (this.workshop.isPlantClicked(x, y)) {
            const result = this.workshop.waterPlant();
            if (result.grew) {
                // Show growth message
                this.showMessage(result.message);

                // Check if plant produced special piece
                if (window.storage.data.plantStage === 3) {
                    // Fully grown - spawn special piece!
                    this.pieceManager.spawnPiece('heart_component', {
                        x: this.workshop.plantBounds.x,
                        y: this.workshop.plantBounds.y - 20
                    });
                    this.showMessage('The plant dropped something special!');
                }
            }
            return;
        }

        // Try to drag a piece
        this.pieceManager.startDrag(x, y);
    }

    handleInteractionMove(x, y) {
        this.pieceManager.updateDrag(x, y);
    }

    handleInteractionEnd(x, y) {
        const result = this.pieceManager.endDrag(x, y);

        if (result && result.action === 'build') {
            this.buildConstruct(result.pieces);
        }
    }

    buildConstruct(pieces) {
        // Generate the construct
        const construct = this.constructGenerator.generateConstruct(
            pieces[0], pieces[1], pieces[2]
        );

        // Save to storage
        window.storage.addConstruct(construct);

        // Clear workbench
        this.pieceManager.clearWorkbench();

        // Show naming UI
        this.showNamingUI(construct);

        // Spawn new pieces after building
        setTimeout(() => {
            this.spawnNewPieces();
        }, 1000);
    }

    showNamingUI(construct) {
        const nameInput = document.getElementById('construct-name-input');
        const generatedName = document.getElementById('generated-name');
        const customNameField = document.getElementById('custom-name');

        generatedName.textContent = construct.name;
        customNameField.value = '';
        nameInput.classList.remove('hidden');

        // Handle keeping original name
        document.getElementById('keep-name').onclick = () => {
            nameInput.classList.add('hidden');
            this.showMessage(`${construct.name} ${construct.personality.trait}`);
        };

        // Handle custom name
        document.getElementById('set-name').onclick = () => {
            const customName = customNameField.value.trim();
            if (customName) {
                window.storage.renameConstruct(construct.id, customName);
                construct.name = customName;
            }
            nameInput.classList.add('hidden');
            this.showMessage(`${construct.name} ${construct.personality.trait}`);
        };
    }

    showMessage(text) {
        const messageDisplay = document.getElementById('message-display');
        messageDisplay.textContent = text;
        messageDisplay.classList.remove('hidden');

        setTimeout(() => {
            messageDisplay.classList.add('hidden');
        }, 3000);
    }

    spawnNewPieces() {
        // Spawn 1-2 random pieces
        const pieceTypes = Object.keys(CONFIG.pieces.definitions);
        const numPieces = Math.random() > 0.5 ? 2 : 1;

        for (let i = 0; i < numPieces; i++) {
            const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
            this.pieceManager.spawnPiece(randomType);
        }
    }

    start() {
        console.log('Starting game loop...');
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update
        this.update(deltaTime);

        // Render
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Update all systems
        this.workshop.update(deltaTime);
        this.pieceManager.update(deltaTime);
        this.constructGenerator.update(deltaTime);
        this.radio.update(deltaTime);

        // Check for time-based spawns occasionally
        if (Math.random() < 0.001) {
            this.pieceManager.checkTimeBasedSpawns();
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw layers in order
        this.workshop.draw(this.ctx);  // Background, shelves, workbench, plant
        this.constructGenerator.draw(this.ctx);  // Constructs on shelves
        this.pieceManager.draw(this.ctx);  // Pieces
        this.radio.draw(this.ctx);  // Radio on top

        // Debug info (remove in production)
        if (false) {  // Set to true for debug
            this.drawDebugInfo();
        }
    }

    drawDebugInfo() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Constructs: ${this.constructGenerator.constructs.length}`, 10, 20);
        this.ctx.fillText(`Pieces: ${this.pieceManager.activePieces.length}`, 10, 35);
        this.ctx.fillText(`Plant Stage: ${window.storage.data.plantStage}`, 10, 50);
        this.ctx.fillText(`Visits: ${window.storage.data.totalVisits}`, 10, 65);
    }

    stop() {
        this.isRunning = false;
        window.storage.stopAutoSave();
        window.storage.save();
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating game...');
    window.game = new WorkshopGame();
});

// Save on page unload
window.addEventListener('beforeunload', () => {
    if (window.storage) {
        window.storage.save();
    }
});