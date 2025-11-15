// Workshop environment for The Workshop
// Handles background, plant, window, and atmosphere

class WorkshopEnvironment {
    constructor() {
        this.timeOfDay = this.getTimeOfDay();
        this.plantBounds = CONFIG.ui.plant;
        this.windowBounds = CONFIG.ui.window;
        this.workbenchBounds = CONFIG.ui.workbench;

        // Plant animation
        this.plantSway = 0;
        this.plantGrowthAnimation = 0;

        // Window animation
        this.windowGlow = 0;

        // Workshop personality
        this.mood = 'cozy';  // Changes based on constructs

        // Particle effects
        this.particles = [];  // Dust motes, sparkles, etc.

        // Background images (optional - will use code drawing if not loaded)
        this.backgroundImages = {
            day: null,
            night: null
        };

        // Try to load background images
        this.loadBackgroundImages();
    }

    loadBackgroundImages() {
        // Load day background
        const dayImg = new Image();
        dayImg.src = CONFIG.getAssetPath(CONFIG.workshop.day);
        dayImg.onload = () => {
            this.backgroundImages.day = dayImg;
            console.log('✓ Day background loaded');
        };
        dayImg.onerror = () => {
            console.log('No day background image - using code drawing');
        };

        // Load night background
        const nightImg = new Image();
        nightImg.src = CONFIG.getAssetPath(CONFIG.workshop.night);
        nightImg.onload = () => {
            this.backgroundImages.night = nightImg;
            console.log('✓ Night background loaded');
        };
        nightImg.onerror = () => {
            console.log('No night background image - using code drawing');
        };
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= CONFIG.workshop.dayStart && hour < CONFIG.workshop.nightStart) {
            return 'day';
        }
        return 'night';
    }

    // Check if click is on plant
    isPlantClicked(x, y) {
        return x >= this.plantBounds.x &&
               x <= this.plantBounds.x + this.plantBounds.width &&
               y >= this.plantBounds.y &&
               y <= this.plantBounds.y + this.plantBounds.height;
    }

    // Handle plant interaction
    waterPlant() {
        const result = window.storage.waterPlant();

        // Create water particle effect
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                type: 'water',
                x: this.plantBounds.x + this.plantBounds.width/2,
                y: this.plantBounds.y,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2,
                life: 1.0,
                color: '#4169E1'
            });
        }

        if (result.grew) {
            this.plantGrowthAnimation = 1.0;
        }

        return result;
    }

    // Update environment
    update(deltaTime) {
        // Update time of day
        this.timeOfDay = this.getTimeOfDay();

        // Plant sway animation
        this.plantSway += deltaTime * 0.002;

        // Growth animation decay
        if (this.plantGrowthAnimation > 0) {
            this.plantGrowthAnimation -= deltaTime * 0.001;
        }

        // Window glow at night
        if (this.timeOfDay === 'night') {
            this.windowGlow = 0.5 + Math.sin(Date.now() * 0.001) * 0.3;
        } else {
            this.windowGlow = 0;
        }

        // Update particles (deltaTime-based for smooth movement)
        const dtFactor = deltaTime / 16.67;  // Normalize to 60fps
        this.particles = this.particles.filter(p => {
            p.x += p.vx * dtFactor;
            p.y += p.vy * dtFactor;
            p.vy += 0.1 * dtFactor;  // Gravity
            p.life -= deltaTime * 0.002;
            return p.life > 0;
        });

        // Spawn occasional dust motes (time-based)
        if (!this.lastParticleSpawn) this.lastParticleSpawn = 0;
        this.lastParticleSpawn += deltaTime;

        if (this.lastParticleSpawn > 100) {  // Spawn every ~100ms
            this.lastParticleSpawn = 0;
            this.particles.push({
                type: 'dust',
                x: Math.random() * CONFIG.canvas.width,
                y: Math.random() * CONFIG.canvas.height / 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: Math.random() * 0.2,
                life: 1.0,
                color: this.timeOfDay === 'day' ? '#FFD700' : '#C0C0C0'
            });
        }
    }

    // Draw the workshop
    draw(ctx) {
        // Draw background
        this.drawBackground(ctx);

        // Draw window
        this.drawWindow(ctx);

        // Draw shelves
        this.drawShelves(ctx);

        // Draw workbench
        this.drawWorkbench(ctx);

        // Draw plant
        this.drawPlant(ctx);

        // Draw particles
        this.drawParticles(ctx);
    }

    drawBackground(ctx) {
        // Try to use background image first
        const bgImage = this.timeOfDay === 'day' ? this.backgroundImages.day : this.backgroundImages.night;

        if (bgImage && bgImage.complete) {
            // Draw the background image
            ctx.drawImage(bgImage, 0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
            return; // Skip code drawing
        }

        // Fall back to code drawing if image not available
        const colors = this.timeOfDay === 'day' ? CONFIG.colors.day : CONFIG.colors.night;

        // Main background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, colors.background);
        gradient.addColorStop(1, this.timeOfDay === 'day' ? '#A8B8C8' : '#0a0515');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Floor
        ctx.fillStyle = this.timeOfDay === 'day' ? '#654321' : '#3a2414';
        ctx.fillRect(0, CONFIG.canvas.height - 100, CONFIG.canvas.width, 100);

        // Floor boards
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 40, CONFIG.canvas.height - 100);
            ctx.lineTo(i * 40, CONFIG.canvas.height);
            ctx.stroke();
        }

        // Wall texture (subtle)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let i = 0; i < 20; i++) {
            ctx.fillRect(
                Math.random() * CONFIG.canvas.width,
                Math.random() * CONFIG.canvas.height - 100,
                2, 2
            );
        }
    }

    drawWindow(ctx) {
        const x = this.windowBounds.x;
        const y = this.windowBounds.y;
        const width = this.windowBounds.width;
        const height = this.windowBounds.height;

        // Window frame
        ctx.fillStyle = '#4A3828';
        ctx.fillRect(x - 5, y - 5, width + 10, height + 10);

        // Window panes
        if (this.timeOfDay === 'day') {
            // Day sky
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#98D8E8');
            ctx.fillStyle = gradient;
        } else {
            // Night sky
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, '#0a0a2e');
            gradient.addColorStop(1, '#1a1a3e');
            ctx.fillStyle = gradient;
        }
        ctx.fillRect(x, y, width, height);

        // Stars at night
        if (this.timeOfDay === 'night') {
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 5; i++) {
                const starX = x + 10 + Math.random() * (width - 20);
                const starY = y + 10 + Math.random() * (height - 20);
                const size = Math.random() * 2;
                ctx.fillRect(starX, starY, size, size);
            }

            // Moon
            ctx.fillStyle = '#F0E68C';
            ctx.beginPath();
            ctx.arc(x + width - 15, y + 15, 8, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Sun
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x + width - 15, y + 15, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // Window cross
        ctx.strokeStyle = '#4A3828';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + width/2, y);
        ctx.lineTo(x + width/2, y + height);
        ctx.moveTo(x, y + height/2);
        ctx.lineTo(x + width, y + height/2);
        ctx.stroke();

        // Window glow (at night)
        if (this.windowGlow > 0) {
            ctx.fillStyle = `rgba(255, 255, 200, ${this.windowGlow * 0.1})`;
            ctx.fillRect(x, y, width, height);
        }
    }

    drawShelves(ctx) {
        const shelf = CONFIG.ui.shelf;

        for (let row = 0; row < shelf.rows; row++) {
            const y = shelf.y + row * 50;

            // Shelf board
            ctx.fillStyle = this.timeOfDay === 'day' ? '#8B4513' : '#5a2d0c';
            ctx.fillRect(shelf.x, y + 30, shelf.width, 8);

            // Shelf shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(shelf.x, y + 38, shelf.width, 3);

            // Shelf supports
            ctx.fillStyle = '#654321';
            ctx.fillRect(shelf.x, y + 25, 5, 15);
            ctx.fillRect(shelf.x + shelf.width - 5, y + 25, 5, 15);
        }
    }

    drawWorkbench(ctx) {
        const wb = this.workbenchBounds;

        // Workbench surface
        ctx.fillStyle = this.timeOfDay === 'day' ? '#8B6F47' : '#5a4630';
        ctx.fillRect(wb.x - 10, wb.y, wb.width + 20, wb.height);

        // Workbench top (lighter)
        ctx.fillStyle = this.timeOfDay === 'day' ? '#A0826D' : '#6a5640';
        ctx.fillRect(wb.x - 10, wb.y, wb.width + 20, 5);

        // Work surface marks
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(wb.x + Math.random() * wb.width, wb.y + 10);
            ctx.lineTo(wb.x + Math.random() * wb.width, wb.y + wb.height - 10);
            ctx.stroke();
        }

        // Slot indicators
        const slotWidth = wb.width / wb.slots;
        ctx.strokeStyle = this.timeOfDay === 'day' ? '#FFD700' : '#00ffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        for (let i = 0; i < wb.slots; i++) {
            const slotX = wb.x + i * slotWidth + 10;
            const slotY = wb.y + 20;
            ctx.strokeRect(slotX, slotY, slotWidth - 20, wb.height - 40);
        }

        ctx.setLineDash([]);  // Reset line dash

        // Workbench legs
        ctx.fillStyle = '#4A3828';
        ctx.fillRect(wb.x, wb.y + wb.height, 5, 40);
        ctx.fillRect(wb.x + wb.width - 5, wb.y + wb.height, 5, 40);
    }

    drawPlant(ctx) {
        const stage = window.storage.data.plantStage;
        const x = this.plantBounds.x;
        const y = this.plantBounds.y;
        const width = this.plantBounds.width;
        const height = this.plantBounds.height;

        // Pot
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(x, y + height - 10);
        ctx.lineTo(x + 5, y + height);
        ctx.lineTo(x + width - 5, y + height);
        ctx.lineTo(x + width, y + height - 10);
        ctx.closePath();
        ctx.fill();

        // Pot rim
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(x - 2, y + height - 12, width + 4, 4);

        // Soil
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 2, y + height - 10, width - 4, 8);

        // Plant based on stage
        if (stage >= 0) {
            const swayOffset = Math.sin(this.plantSway) * 2;

            ctx.save();
            ctx.translate(x + width/2 + swayOffset, y + height - 10);

            // Growth animation scale
            const growthScale = 1 + this.plantGrowthAnimation * 0.3;
            ctx.scale(growthScale, growthScale);

            ctx.fillStyle = '#228B22';

            switch(stage) {
                case 0:  // Tiny sprout
                    ctx.fillRect(-1, -5, 2, 5);
                    ctx.fillStyle = '#90EE90';
                    ctx.fillRect(-3, -5, 2, 2);
                    ctx.fillRect(1, -5, 2, 2);
                    break;

                case 1:  // Small plant
                    ctx.fillRect(-1, -10, 2, 10);
                    ctx.fillStyle = '#90EE90';
                    ctx.fillRect(-4, -8, 3, 3);
                    ctx.fillRect(1, -8, 3, 3);
                    ctx.fillRect(-3, -5, 2, 2);
                    ctx.fillRect(1, -5, 2, 2);
                    break;

                case 2:  // Healthy plant
                    ctx.fillRect(-1, -15, 2, 15);
                    ctx.fillStyle = '#90EE90';
                    // Leaves
                    ctx.fillRect(-5, -12, 4, 4);
                    ctx.fillRect(1, -12, 4, 4);
                    ctx.fillRect(-4, -8, 3, 3);
                    ctx.fillRect(1, -8, 3, 3);
                    ctx.fillRect(-3, -5, 2, 2);
                    ctx.fillRect(1, -5, 2, 2);
                    break;

                case 3:  // Thriving with flower
                    ctx.fillRect(-1, -20, 2, 20);
                    ctx.fillStyle = '#90EE90';
                    // Many leaves
                    ctx.fillRect(-6, -15, 4, 4);
                    ctx.fillRect(2, -15, 4, 4);
                    ctx.fillRect(-5, -10, 3, 3);
                    ctx.fillRect(2, -10, 3, 3);
                    ctx.fillRect(-4, -6, 2, 2);
                    ctx.fillRect(2, -6, 2, 2);

                    // Flower
                    ctx.fillStyle = '#FFB6C1';
                    ctx.fillRect(-2, -22, 4, 4);
                    ctx.fillStyle = '#FF69B4';
                    ctx.fillRect(-1, -21, 2, 2);
                    break;
            }

            ctx.restore();
        }

        // Sparkles when recently watered
        const timeSinceWater = Date.now() - window.storage.data.lastWatered;
        if (timeSinceWater < 3000) {
            ctx.fillStyle = 'rgba(135, 206, 235, 0.6)';
            for (let i = 0; i < 3; i++) {
                const sparkleX = x + Math.random() * width;
                const sparkleY = y + height - 15 + Math.random() * 10;
                ctx.fillRect(sparkleX, sparkleY, 2, 2);
            }
        }

        // "Water me" hint if plant is thirsty
        if (timeSinceWater > 600000 && stage < 3) {  // 10 minutes
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('💧', x + width/2, y - 5);
        }
    }

    drawParticles(ctx) {
        this.particles.forEach(particle => {
            ctx.fillStyle = particle.color + Math.floor(particle.life * 255).toString(16).padStart(2, '0');
            ctx.fillRect(particle.x, particle.y, 2, 2);
        });
    }
}

// Create global workshop environment (will be initialized in game.js)
window.WorkshopEnvironment = WorkshopEnvironment;