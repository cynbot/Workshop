// Storage system for The Workshop
// Handles saves, loads, and persistent data

class StorageManager {
    constructor() {
        this.saveKey = CONFIG.storage.saveKey;
        this.data = this.load() || this.getDefaultData();
        this.autoSaveTimer = null;
    }

    getDefaultData() {
        return {
            firstVisit: Date.now(),
            lastVisit: Date.now(),
            totalVisits: 1,

            // Pieces
            unlockedPieces: Object.keys(CONFIG.pieces.definitions), // Start with all basic pieces
            pieceInventory: {},  // Count of each piece type

            // Constructs
            constructs: [],  // Array of built constructs
            constructCount: 0,
            namedConstructs: {},  // Custom names given

            // Plant
            plantStage: 0,
            plantWaterCount: 0,
            lastWatered: Date.now(),

            // Radio
            heardMessages: [],  // Track which messages have been played
            lastRadioClick: 0,

            // Workshop state
            workshopMood: 'neutral',  // Changes based on constructs built
            totalPiecesPlaced: 0,

            // Special unlocks
            specialEvents: {
                birthdayRevealed: false,
                memoryPalaceUnlocked: false,
                ghostProtocolFound: false
            },

            // Statistics
            stats: {
                constructsBuilt: 0,
                piecesCollected: 0,
                radioClicks: 0,
                plantInteractions: 0,
                timeSpent: 0  // in minutes
            }
        };
    }

    save() {
        try {
            this.data.lastVisit = Date.now();
            const jsonData = JSON.stringify(this.data);
            localStorage.setItem(this.saveKey, jsonData);
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    load() {
        try {
            const jsonData = localStorage.getItem(this.saveKey);
            if (jsonData) {
                const data = JSON.parse(jsonData);
                console.log('Game loaded successfully');

                // Update visit count
                data.totalVisits = (data.totalVisits || 0) + 1;

                return data;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
        return null;
    }

    // Check time since last visit
    getTimeSinceLastVisit() {
        const now = Date.now();
        const lastVisit = this.data.lastVisit || now;
        const hoursSince = (now - lastVisit) / (1000 * 60 * 60);
        return hoursSince;
    }

    // Check if it's time for special events
    checkSpecialEvents() {
        const events = [];
        const hoursSince = this.getTimeSinceLastVisit();

        // Workshop missed you events
        if (hoursSince > 72) {
            events.push({
                type: 'workshop_lonely',
                message: 'The workshop tried to build something while you were away...'
            });
        }

        // Check for birthday - November 17th!
        const today = new Date();
        const birthday = new Date('2024-11-17'); // Colin's birthday!
        if (today.getMonth() === birthday.getMonth() &&
            today.getDate() === birthday.getDate() &&
            !this.data.specialEvents.birthdayRevealed) {
            events.push({
                type: 'birthday',
                message: 'The workshop is celebrating something special today!'
            });
            this.data.specialEvents.birthdayRevealed = true;
        }

        // Memory palace unlock (after 30 days)
        const daysSinceFirst = (Date.now() - this.data.firstVisit) / (1000 * 60 * 60 * 24);
        if (daysSinceFirst >= 30 && !this.data.specialEvents.memoryPalaceUnlocked) {
            events.push({
                type: 'memory_palace',
                message: 'A tiny door has appeared behind the workbench...'
            });
            this.data.specialEvents.memoryPalaceUnlocked = true;
        }

        return events;
    }

    // Add a construct to storage
    addConstruct(construct) {
        this.data.constructs.push({
            id: construct.id,
            name: construct.name,
            pieces: construct.pieces,
            personality: construct.personality,
            createdAt: Date.now(),
            position: construct.position
        });

        this.data.stats.constructsBuilt++;
        this.data.constructCount++;
        this.save();
    }

    // Rename a construct
    renameConstruct(constructId, newName) {
        this.data.namedConstructs[constructId] = newName;
        this.save();
    }

    // Update plant growth
    waterPlant() {
        this.data.plantWaterCount++;
        this.data.lastWatered = Date.now();
        this.data.stats.plantInteractions++;

        // Check for growth
        if (this.data.plantWaterCount >= (this.data.plantStage + 1) * 3) {
            if (this.data.plantStage < CONFIG.ui.plant.stages - 1) {
                this.data.plantStage++;
                this.save();
                return {
                    grew: true,
                    stage: this.data.plantStage,
                    message: 'The plant seems happy and grew a little!'
                };
            }
        }

        this.save();
        return {
            grew: false,
            message: 'The plant appreciates the water.'
        };
    }

    // Track radio interaction
    radioClicked() {
        this.data.lastRadioClick = Date.now();
        this.data.stats.radioClicks++;
        this.save();
    }

    // Get a message that hasn't been heard recently
    getUnheardMessage(messages) {
        const unheard = messages.filter(msg => !this.data.heardMessages.includes(msg));

        if (unheard.length === 0) {
            // Reset if all messages heard
            this.data.heardMessages = [];
            return messages[Math.floor(Math.random() * messages.length)];
        }

        const message = unheard[Math.floor(Math.random() * unheard.length)];
        this.data.heardMessages.push(message);

        // Keep only last 10 heard messages
        if (this.data.heardMessages.length > 10) {
            this.data.heardMessages.shift();
        }

        this.save();
        return message;
    }

    // Start auto-save
    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.save();
        }, CONFIG.game.autoSaveInterval);
    }

    // Stop auto-save
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    // Clear all data (for testing)
    reset() {
        if (confirm('This will delete all your workshop progress. Are you sure?')) {
            localStorage.removeItem(this.saveKey);
            this.data = this.getDefaultData();
            this.save();
            location.reload();
        }
    }
}

// Create global storage manager
window.storage = new StorageManager();