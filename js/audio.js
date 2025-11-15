// Audio system for The Workshop
// Manages sound effects and background music

class AudioManager {
    constructor() {
        this.sounds = new Map();  // Loaded audio buffers
        this.music = new Map();   // Background music tracks
        this.enabled = true;      // Master on/off
        this.volumes = {
            master: CONFIG.audio.volume.master,
            sfx: CONFIG.audio.volume.sfx,
            music: CONFIG.audio.volume.music
        };

        // Currently playing music
        this.currentMusic = null;
        this.musicFadeInterval = null;

        // Load settings from storage
        this.loadSettings();

        // Preload audio files
        this.preloadAudio();
    }

    // Load audio settings from storage
    loadSettings() {
        const settings = window.storage?.data?.audioSettings;
        if (settings) {
            this.enabled = settings.enabled !== false;  // Default to true
            if (settings.volumes) {
                this.volumes = { ...this.volumes, ...settings.volumes };
            }
        }
    }

    // Save audio settings to storage
    saveSettings() {
        if (window.storage) {
            if (!window.storage.data.audioSettings) {
                window.storage.data.audioSettings = {};
            }
            window.storage.data.audioSettings = {
                enabled: this.enabled,
                volumes: { ...this.volumes }
            };
            window.storage.save();
        }
    }

    // Preload all audio files
    preloadAudio() {
        // Preload sound effects
        Object.entries(CONFIG.audio.sfx).forEach(([key, filename]) => {
            this.loadSound(key, `${CONFIG.audio.folder}/${filename}`);
        });

        // Preload music
        Object.entries(CONFIG.audio.music).forEach(([key, filename]) => {
            this.loadMusic(key, `${CONFIG.audio.folder}/${filename}`);
        });
    }

    // Load a sound effect
    loadSound(key, path) {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = path;

        // Handle load errors gracefully
        audio.addEventListener('error', (e) => {
            console.warn(`⚠️ Audio file not found: ${path}`);
        });

        // Log successful load
        audio.addEventListener('canplaythrough', () => {
            console.log(`✓ Audio loaded: ${key} from ${path}`);
        }, { once: true });

        this.sounds.set(key, audio);
    }

    // Load a music track
    loadMusic(key, path) {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = path;
        audio.loop = true;  // Music loops by default

        // Handle load errors gracefully
        audio.addEventListener('error', () => {
            console.warn(`⚠️ Music file not found: ${path}`);
        });

        // Log successful load
        audio.addEventListener('canplaythrough', () => {
            console.log(`♪ Music loaded: ${key} from ${path}`);
        }, { once: true });

        this.music.set(key, audio);
    }

    // Play a sound effect
    play(soundKey, volumeOverride = null) {
        if (!this.enabled) return;

        const sound = this.sounds.get(soundKey);
        if (!sound) {
            // Silently fail if sound doesn't exist yet
            return;
        }

        // Clone the audio element so we can play multiple instances
        const audioClone = sound.cloneNode();
        const volume = volumeOverride !== null ? volumeOverride :
                      this.volumes.sfx * this.volumes.master;
        audioClone.volume = Math.max(0, Math.min(1, volume));

        // Play and clean up when done
        audioClone.play().catch(() => {
            // Silently handle play errors (autoplay policy, etc)
        });

        audioClone.addEventListener('ended', () => {
            audioClone.remove();
        });
    }

    // Play background music
    playMusic(musicKey, fade = true) {
        if (!this.enabled) return;

        const track = this.music.get(musicKey);
        if (!track) {
            return;
        }

        // Stop current music if playing
        if (this.currentMusic && this.currentMusic !== track) {
            this.stopMusic(fade);
        }

        this.currentMusic = track;
        track.volume = 0;

        track.play().catch(() => {
            // Silently handle play errors
        });

        // Fade in
        if (fade) {
            this.fadeMusicTo(this.volumes.music * this.volumes.master, 2000);
        } else {
            track.volume = this.volumes.music * this.volumes.master;
        }
    }

    // Stop background music
    stopMusic(fade = true) {
        if (!this.currentMusic) return;

        if (fade) {
            this.fadeMusicTo(0, 1000, () => {
                if (this.currentMusic) {
                    this.currentMusic.pause();
                    this.currentMusic.currentTime = 0;
                    this.currentMusic = null;
                }
            });
        } else {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }

    // Fade music to target volume
    fadeMusicTo(targetVolume, duration, callback = null) {
        if (!this.currentMusic) return;

        // Clear any existing fade
        if (this.musicFadeInterval) {
            clearInterval(this.musicFadeInterval);
        }

        const startVolume = this.currentMusic.volume;
        const volumeChange = targetVolume - startVolume;
        const steps = 30;  // 30 steps for smooth fade
        const stepDuration = duration / steps;
        let currentStep = 0;

        this.musicFadeInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            if (progress >= 1) {
                this.currentMusic.volume = targetVolume;
                clearInterval(this.musicFadeInterval);
                this.musicFadeInterval = null;
                if (callback) callback();
            } else {
                // Ease-in-out curve
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                this.currentMusic.volume = startVolume + (volumeChange * eased);
            }
        }, stepDuration);
    }

    // Toggle audio on/off
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();

        if (!this.enabled && this.currentMusic) {
            this.currentMusic.pause();
        } else if (this.enabled && this.currentMusic && this.currentMusic.paused) {
            this.currentMusic.play().catch(() => {});
        }

        return this.enabled;
    }

    // Set master volume
    setMasterVolume(volume) {
        this.volumes.master = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
        this.saveSettings();
    }

    // Set SFX volume
    setSFXVolume(volume) {
        this.volumes.sfx = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    // Set music volume
    setMusicVolume(volume) {
        this.volumes.music = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
        this.saveSettings();
    }

    // Update currently playing music volume
    updateMusicVolume() {
        if (this.currentMusic) {
            this.currentMusic.volume = this.volumes.music * this.volumes.master;
        }
    }

    // Get current settings
    getSettings() {
        return {
            enabled: this.enabled,
            volumes: { ...this.volumes }
        };
    }
}

// Create global audio manager (will be initialized in game.js)
window.AudioManager = AudioManager;
