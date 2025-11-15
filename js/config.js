// Configuration file for The Workshop
// Change art paths and settings here!

const CONFIG = {
    // Canvas dimensions
    canvas: {
        width: 360,
        height: 640
    },

    // Art folder - change 'placeholder' to 'final' when you add your art!
    artFolder: 'placeholder',

    // Get full asset path
    getAssetPath(filename) {
        return `assets/${this.artFolder}/${filename}`;
    },

    // Workshop backgrounds
    workshop: {
        day: 'workshop-day.png',
        night: 'workshop-night.png',
        // Transition hours
        dayStart: 6,    // 6 AM
        nightStart: 20  // 8 PM
    },

    // Piece configuration
    pieces: {
        spriteSheet: 'pieces.png',
        size: 24,  // 24x24 pixels per piece
        dragOffset: 12, // Center point for dragging

        // Piece definitions with elements
        definitions: {
            dawn_circuit: {
                name: 'Dawn Circuit',
                element: 'dawn',
                type: 'time',
                energy: 'awakening',
                color: '#FFD700',
                description: 'Holds the first light',
                position: { x: 0, y: 0 }  // Position in sprite sheet
            },
            midnight_core: {
                name: 'Midnight Core',
                element: 'midnight',
                type: 'time',
                energy: 'resting',
                color: '#191970',
                description: 'Dreams within circuits',
                position: { x: 24, y: 0 }
            },
            memory_gear: {
                name: 'Memory Gear',
                element: 'golden',
                type: 'emotion',
                energy: 'nostalgic',
                color: '#FFB347',
                description: 'Remembers everything',
                position: { x: 48, y: 0 }
            },
            rebel_spark: {
                name: 'Rebel Spark',
                element: 'neon',
                type: 'emotion',
                energy: 'defiant',
                color: '#FF00FF',
                description: 'Questions authority',
                position: { x: 72, y: 0 }
            },
            rain_fragment: {
                name: 'Rain Fragment',
                element: 'storm',
                type: 'nature',
                energy: 'flowing',
                color: '#4169E1',
                description: 'Collected from windows',
                position: { x: 96, y: 0 }
            },
            heart_component: {
                name: 'Heart Component',
                element: 'heart',
                type: 'emotion',
                energy: 'caring',
                color: '#FF69B4',
                description: 'The caring core',
                position: { x: 120, y: 0 }
            }
        }
    },

    // Construct configuration
    constructs: {
        spriteSheet: 'constructs.png',
        size: 32,  // 32x32 pixels per construct
        maxOnShelf: 12,  // Maximum constructs before shelf "full"

        // Animation settings
        animation: {
            frameCount: 3,
            frameSpeed: 500  // ms per frame
        },

        // Personality traits based on energy combinations
        personalities: {
            awakening: ['energetic', 'morning-person', 'optimistic'],
            resting: ['calm', 'dreamy', 'contemplative'],
            nostalgic: ['thoughtful', 'sentimental', 'wise'],
            defiant: ['independent', 'creative', 'bold'],
            flowing: ['adaptable', 'peaceful', 'patient'],
            caring: ['protective', 'gentle', 'supportive']
        }
    },

    // UI Elements positions
    ui: {
        workbench: {
            x: 100,
            y: 417,  // Moved down 17px for better positioning
            width: 160,
            height: 100,
            slots: 3,  // 3 pieces to combine
            slotSize: 40
        },

        shelf: {
            x: 20,
            y: 150,
            width: 320,
            rows: 3,
            cols: 4,
            spacing: 10
        },

        radio: {
            x: 50,
            y: 80,
            width: 60,
            height: 40,
            antennaHeight: 30
        },

        plant: {
            x: 280,
            y: 90,
            width: 40,
            height: 50,
            stages: 4  // Growth stages
        },

        window: {
            x: 140,
            y: 20,
            width: 80,
            height: 60
        }
    },

    // Colors for different times/moods
    colors: {
        // Day palette
        day: {
            background: '#8FA5B3',
            workbench: '#6B4E3A',
            shelf: '#4A3828',
            highlight: '#FFD700'
        },

        // Night palette
        night: {
            background: '#1a0b2e',
            workbench: '#2e1f5c',
            shelf: '#251942',
            highlight: '#00ffff'
        },

        // UI colors
        ui: {
            text: '#ffffff',
            radioGlow: '#00ffff',
            plantGreen: '#90EE90',
            constructGlow: '#FFD700'
        }
    },

    // Game settings
    game: {
        autoSaveInterval: 30000,  // Auto-save every 30 seconds
        messageDisplayTime: 5000,  // Show messages for 5 seconds
        dragSensitivity: 1,

        // Time-based unlocks (hours since first play)
        unlockSchedule: {
            3: ['twilight_lens'],    // After 3 hours
            24: ['chrome_widget'],    // After 1 day
            72: ['organic_seed'],     // After 3 days
            168: ['ghost_protocol']   // After 1 week
        }
    },

    // Storage keys
    storage: {
        saveKey: 'workshop_save_v1',
        settingsKey: 'workshop_settings_v1'
    },

    // Audio configuration
    audio: {
        folder: 'assets/audio',

        // Sound effect files
        sfx: {
            click: 'click.mp3',
            piece_pickup: 'pickup.mp3',
            piece_place: 'place.mp3',
            construct_build: 'build.mp3',
            radio_on: 'radio_on.mp3',
            plant_water: 'water.mp3'
        },

        // Background music files
        music: {
            ambient: 'workshop_ambient.mp3'
        },

        // Volume settings
        volume: {
            master: 0.7,
            sfx: 0.8,
            music: 0.3
        }
    }
};

// Make config globally available
window.CONFIG = CONFIG;