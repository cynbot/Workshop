// Radio system for The Workshop
// Plays friend messages and ambient quotes

class RadioSystem {
    constructor() {
        this.isPlaying = false;
        this.currentMessage = null;
        this.messageTimeout = null;
        this.static = false;
        this.antennaWave = 0;

        // Your friends' birthday quotes!
        this.birthdayQuotes = [
            "Here's to the witness of my high pizza dance - Dale",
            "Happy birthday to my telepathically linked dumb joke maker - Dale",
            "To the best voice in Radio New Vegas, happy birthday Colin!! 🥳🎂🎊 - Guillermo",
            "Three cheers to one of the coolest people out there! May there be lots of adventure and joy for the new year ahead Colin! - Guillermo",
            "When I hear of the Great American Songbook, I think of Colin as its top singer of our time! 🥳✊🏼 - Guillermo",
            "Don't know if you're aware of this but, of all our friends I relate to you the most. Happy birthday Colin never stop being you, always here, Lindsay 🫂 - Lindsay",
            "Drink some water! Love ya amigo - Smol",
            "Never stop creating 🤖 - Cyn"
        ];

        // Time-based ambient messages
        this.ambientMessages = {
            morning: [
                "The workshop wakes with you",
                "Morning light reveals new pieces",
                "Dawn circuits humming softly",
                "Coffee would be nice right about now"
            ],
            afternoon: [
                "The workshop hums contentedly",
                "Afternoon shadows dancing on the workbench",
                "Perfect time for building",
                "The constructs seem happy today"
            ],
            evening: [
                "Golden hour in the workshop",
                "Time moves differently here",
                "The day's work sitting proudly on the shelf",
                "Sunset paints everything amber"
            ],
            night: [
                "Stars visible through the window",
                "The workshop dreams with you",
                "Midnight cores glowing softly",
                "Quiet hours for quiet building"
            ]
        };

        // Workshop personality messages
        this.workshopMessages = [
            "This space exists because friendship needed it to",
            "Every construct remembers being built",
            "The workshop missed you",
            "Something's different today... in a good way",
            "The radio picks up signals from parallel workshops",
            "Constructs talk to each other when you're away",
            "This is a third space, neither here nor there",
            "The plant is listening",
            "Digital spaces can hold real feelings",
            "The workshop is learning your patterns"
        ];

        // Special event messages
        this.specialMessages = {
            firstVisit: "Welcome to the workshop. It's been waiting for you.",
            returning: "The lights stayed on for you",
            afterLongAbsence: "The workshop tried to build something while you were gone",
            manyConstructs: "The shelf is filling up nicely",
            plantGrown: "The plant seems to trust you now",
            lateNight: "Building in the quiet hours hits different",
            birthday: "🎉 THE WORKSHOP IS CELEBRATING! 🎉"
        };

        this.bounds = CONFIG.ui.radio;
    }

    // Check if click is on radio
    isClicked(x, y) {
        return x >= this.bounds.x &&
               x <= this.bounds.x + this.bounds.width &&
               y >= this.bounds.y &&
               y <= this.bounds.y + this.bounds.height;
    }

    // Handle radio click
    onClick() {
        if (this.isPlaying) return;  // Already playing

        // Clear any existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }

        // Get appropriate message
        const message = this.getNextMessage();

        // Show message
        this.playMessage(message);

        // Track interaction
        window.storage.radioClicked();
    }

    // Get next message based on context
    getNextMessage() {
        // BIRTHDAY PARTY MODE! Just cycle through the beautiful friend quotes
        // The first visit gets a special welcome
        if (window.storage.data.totalVisits === 1) {
            return this.specialMessages.firstVisit;
        }

        // Then all the birthday love!
        return window.storage.getUnheardMessage(this.birthdayQuotes);
    }

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    // Play a message with effects
    playMessage(message) {
        this.isPlaying = true;
        this.currentMessage = message;
        this.static = true;

        // Show static for a moment
        setTimeout(() => {
            this.static = false;
            this.displayMessage(message);
        }, 300);

        // Clear message after display time
        this.messageTimeout = setTimeout(() => {
            this.hideMessage();
            this.isPlaying = false;
            this.currentMessage = null;
        }, CONFIG.game.messageDisplayTime);
    }

    // Display message in UI
    displayMessage(message) {
        const messageDisplay = document.getElementById('message-display');
        messageDisplay.textContent = message;
        messageDisplay.classList.remove('hidden');
    }

    // Hide message
    hideMessage() {
        const messageDisplay = document.getElementById('message-display');
        messageDisplay.classList.add('hidden');
    }

    // Update radio animation
    update(deltaTime) {
        // Antenna wave animation
        this.antennaWave += deltaTime * 0.003;

        // Static effect when playing
        if (this.static) {
            // Random static particles would go here
        }
    }

    // Draw the radio
    draw(ctx) {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const width = this.bounds.width;
        const height = this.bounds.height;

        // Radio body
        ctx.fillStyle = '#8B4513';  // Brown
        ctx.fillRect(x, y, width, height);

        // Radio face
        ctx.fillStyle = '#D2691E';  // Lighter brown
        ctx.fillRect(x + 5, y + 5, width - 10, height - 10);

        // Speaker grille
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 10 + i * 5);
            ctx.lineTo(x + width - 10, y + 10 + i * 5);
            ctx.stroke();
        }

        // Tuning dial
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + width - 15, y + height - 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Power light (glows when playing)
        ctx.fillStyle = this.isPlaying ? '#00FF00' : '#006400';
        ctx.fillRect(x + 10, y + height - 8, 3, 3);

        // Antenna
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width/2, y);

        // Wavy antenna when playing
        if (this.isPlaying) {
            const wave = Math.sin(this.antennaWave) * 3;
            ctx.lineTo(x + width/2 + wave, y - this.bounds.antennaHeight);
        } else {
            ctx.lineTo(x + width/2, y - this.bounds.antennaHeight);
        }
        ctx.stroke();

        // Antenna tip
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x + width/2 + (this.isPlaying ? Math.sin(this.antennaWave) * 3 : 0),
                y - this.bounds.antennaHeight, 3, 0, Math.PI * 2);
        ctx.fill();

        // Static effect overlay
        if (this.static) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 10; i++) {
                const px = x + Math.random() * width;
                const py = y + Math.random() * height;
                ctx.fillRect(px, py, 1, 1);
            }
        }

        // "Click me" hint if not played recently
        if (!this.isPlaying && window.storage.data.stats.radioClicks === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('click me', x + width/2, y - 5);
        }
    }
}

// Create global radio system (will be initialized in game.js)
window.RadioSystem = RadioSystem;