// Dynamic construct generation system for The Workshop
// Every combination creates something unique!

class ConstructGenerator {
    constructor() {
        this.constructs = [];  // Active constructs in workshop
        this.constructIdCounter = 0;

        // Name generation components
        this.prefixes = {
            // Time-based
            dawn: ['Morning', 'Bright', 'Early', 'Sunrise', 'Aurora'],
            midnight: ['Night', 'Dream', 'Star', 'Luna', 'Shadow'],
            twilight: ['Dusk', 'Ember', 'Fade', 'Between'],

            // Emotion-based
            heart: ['Caring', 'Gentle', 'Warm', 'Loving', 'Sweet'],
            neon: ['Rebel', 'Wild', 'Free', 'Spark', 'Electric'],
            golden: ['Memory', 'Nostalgic', 'Precious', 'Ancient'],

            // Nature-based
            storm: ['Rain', 'Thunder', 'Cloud', 'Misty', 'Flowing'],
            organic: ['Living', 'Growing', 'Natural', 'Green']
        };

        this.suffixes = {
            // Personality-based
            energetic: ['Sprite', 'Spark', 'Bolt', 'Runner'],
            calm: ['Guardian', 'Keeper', 'Watcher', 'Sage'],
            chaotic: ['Gremlin', 'Spirit', 'Wisp', 'Storm'],
            balanced: ['Friend', 'Companion', 'Helper', 'Assistant']
        };

        // Personality traits
        this.traits = {
            energetic: [
                'bounces constantly',
                'never sits still',
                'vibrates with enthusiasm',
                'always ready to help'
            ],
            calm: [
                'moves slowly and deliberately',
                'contemplates existence',
                'radiates peace',
                'watches over others'
            ],
            chaotic: [
                'glitches adorably',
                'does things backwards',
                'questions physics',
                'rewrites its own rules'
            ],
            protective: [
                'guards the workshop',
                'checks on other constructs',
                'stands watch at night',
                'keeps everyone safe'
            ],
            curious: [
                'investigates everything',
                'asks silent questions',
                'peers at visitors',
                'collects interesting data'
            ]
        };
    }

    // Main generation function - creates unique construct from any 3 pieces
    generateConstruct(piece1, piece2, piece3) {
        const pieces = [piece1, piece2, piece3];
        const elements = pieces.map(p => p.element);
        const energies = pieces.map(p => p.energy);
        const colors = pieces.map(p => p.color);

        // Calculate synergy
        const synergy = this.calculateSynergy(elements, energies);

        // Generate personality
        const personality = this.generatePersonality(energies, synergy);

        // Generate name
        const name = this.generateName(elements, personality);

        // Generate appearance
        const appearance = this.generateAppearance(colors, elements, synergy);

        // Generate behavior
        const behavior = this.generateBehavior(personality, synergy);

        // Generate message
        const message = this.generateMessage(personality, elements);

        // Create the construct
        const construct = {
            id: `construct_${++this.constructIdCounter}`,
            pieces: pieces.map(p => p.type),
            elements: elements,
            name: name,
            personality: personality,
            synergy: synergy,
            appearance: appearance,
            behavior: behavior,
            message: message,
            created: Date.now(),
            position: this.getNextShelfPosition(),
            scale: 1,
            rotation: 0,
            animationFrame: 0
        };

        this.constructs.push(construct);
        return construct;
    }

    // Calculate synergy based on element combinations
    calculateSynergy(elements, energies) {
        // Check for matching elements (harmonious)
        const uniqueElements = [...new Set(elements)];
        const elementHarmony = 1 - (uniqueElements.length - 1) * 0.25;  // 1.0 for all same, 0.5 for all different

        // Check for energy compatibility
        const energyTypes = {
            awakening: 'active',
            resting: 'passive',
            nostalgic: 'reflective',
            defiant: 'chaotic',
            flowing: 'adaptive',
            caring: 'supportive'
        };

        const mappedEnergies = energies.map(e => energyTypes[e] || 'neutral');
        const uniqueEnergies = [...new Set(mappedEnergies)];

        let synergyType;
        let synergyLevel;

        if (uniqueElements.length === 1) {
            synergyType = 'perfect_harmony';
            synergyLevel = 1.0;
        } else if (uniqueEnergies.length === 1) {
            synergyType = 'energy_sync';
            synergyLevel = 0.9;
        } else if (mappedEnergies.includes('chaotic') && mappedEnergies.includes('passive')) {
            synergyType = 'interesting_tension';
            synergyLevel = 0.6;
        } else if (uniqueElements.length === 3) {
            synergyType = 'diverse_balance';
            synergyLevel = 0.7;
        } else {
            synergyType = 'unique_blend';
            synergyLevel = 0.75;
        }

        return {
            type: synergyType,
            level: synergyLevel,
            description: this.getSynergyDescription(synergyType)
        };
    }

    getSynergyDescription(type) {
        const descriptions = {
            perfect_harmony: 'In perfect sync, moving as one',
            energy_sync: 'Energies aligned and flowing',
            interesting_tension: 'Contradictions create something new',
            diverse_balance: 'Every element has its place',
            unique_blend: 'An unexpected but delightful combination'
        };
        return descriptions[type] || 'A mysterious combination';
    }

    // Generate personality based on pieces
    generatePersonality(energies, synergy) {
        const personalityWeights = {
            energetic: 0,
            calm: 0,
            chaotic: 0,
            protective: 0,
            curious: 0
        };

        // Weight based on energies
        energies.forEach(energy => {
            switch(energy) {
                case 'awakening':
                    personalityWeights.energetic += 2;
                    personalityWeights.curious += 1;
                    break;
                case 'resting':
                    personalityWeights.calm += 2;
                    personalityWeights.protective += 1;
                    break;
                case 'defiant':
                    personalityWeights.chaotic += 2;
                    personalityWeights.energetic += 1;
                    break;
                case 'caring':
                    personalityWeights.protective += 2;
                    personalityWeights.calm += 1;
                    break;
                case 'flowing':
                    personalityWeights.curious += 2;
                    personalityWeights.calm += 1;
                    break;
                case 'nostalgic':
                    personalityWeights.calm += 1;
                    personalityWeights.protective += 1;
                    break;
            }
        });

        // Get dominant personality
        const dominant = Object.entries(personalityWeights)
            .sort((a, b) => b[1] - a[1])[0][0];

        // Get a trait
        const traits = this.traits[dominant];
        const trait = traits[Math.floor(Math.random() * traits.length)];

        return {
            type: dominant,
            trait: trait,
            weights: personalityWeights
        };
    }

    // Generate a unique name
    generateName(elements, personality) {
        // Get prefix from dominant element
        const elementCounts = {};
        elements.forEach(e => {
            elementCounts[e] = (elementCounts[e] || 0) + 1;
        });
        const dominantElement = Object.entries(elementCounts)
            .sort((a, b) => b[1] - a[1])[0][0];

        const prefixList = this.prefixes[dominantElement] || this.prefixes.dawn;
        const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];

        // Get suffix from personality
        const suffixCategory = personality.type === 'energetic' ? 'energetic' :
                              personality.type === 'calm' ? 'calm' :
                              personality.type === 'chaotic' ? 'chaotic' : 'balanced';

        const suffixList = this.suffixes[suffixCategory];
        const suffix = suffixList[Math.floor(Math.random() * suffixList.length)];

        return `${prefix} ${suffix}`;
    }

    // Generate appearance data
    generateAppearance(colors, elements, synergy) {
        // Blend colors
        const blendedColor = this.blendColors(colors);

        // Determine shape based on elements
        const shapes = ['round', 'angular', 'crystalline', 'organic'];
        const shapeIndex = Math.floor(synergy.level * shapes.length);
        const shape = shapes[Math.min(shapeIndex, shapes.length - 1)];

        // Size variation
        const size = 32 + (synergy.level * 8);  // 32-40 pixels

        return {
            color: blendedColor,
            shape: shape,
            size: size,
            glowIntensity: synergy.level
        };
    }

    // Blend colors (simple average for now)
    blendColors(colors) {
        // Convert hex to RGB, average, convert back
        const rgbs = colors.map(this.hexToRgb);
        const avg = {
            r: Math.floor(rgbs.reduce((sum, c) => sum + c.r, 0) / rgbs.length),
            g: Math.floor(rgbs.reduce((sum, c) => sum + c.g, 0) / rgbs.length),
            b: Math.floor(rgbs.reduce((sum, c) => sum + c.b, 0) / rgbs.length)
        };
        return this.rgbToHex(avg);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 255, g: 255, b: 255};
    }

    rgbToHex({r, g, b}) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Generate behavior patterns
    generateBehavior(personality, synergy) {
        const behaviors = {
            idle: [],
            active: [],
            special: []
        };

        // Add behaviors based on personality
        switch(personality.type) {
            case 'energetic':
                behaviors.idle = ['bounce', 'vibrate'];
                behaviors.active = ['spin', 'jump'];
                break;
            case 'calm':
                behaviors.idle = ['sway', 'breathe'];
                behaviors.active = ['nod', 'meditate'];
                break;
            case 'chaotic':
                behaviors.idle = ['glitch', 'flicker'];
                behaviors.active = ['teleport', 'invert'];
                break;
            case 'protective':
                behaviors.idle = ['scan', 'patrol'];
                behaviors.active = ['shield', 'alert'];
                break;
            case 'curious':
                behaviors.idle = ['tilt', 'peek'];
                behaviors.active = ['investigate', 'record'];
                break;
        }

        // Add special behavior for high synergy
        if (synergy.level > 0.8) {
            behaviors.special.push('harmony_glow');
        }

        return behaviors;
    }

    // Generate a descriptive message
    generateMessage(personality, elements) {
        const intros = [
            'seems to be',
            'appears to be',
            'is definitely',
            'might be',
            'could be'
        ];

        const intro = intros[Math.floor(Math.random() * intros.length)];

        return `This construct ${intro} ${personality.trait}. ${this.getElementComment(elements)}`;
    }

    getElementComment(elements) {
        const unique = [...new Set(elements)];
        if (unique.length === 1) {
            return `Pure ${unique[0]} energy flows through it.`;
        } else if (unique.length === 2) {
            return `A blend of ${unique[0]} and ${unique[1]}.`;
        } else {
            return `An interesting mix of ${elements.join(', ')}.`;
        }
    }

    // Get next available shelf position
    getNextShelfPosition() {
        const shelf = CONFIG.ui.shelf;
        const used = this.constructs.length - 1;  // Current construct not yet added

        const row = Math.floor(used / shelf.cols);
        const col = used % shelf.cols;

        return {
            x: shelf.x + (col * (320 / shelf.cols)) + 20,
            y: shelf.y + (row * 50) + 20
        };
    }

    // Update construct animations
    update(deltaTime) {
        this.constructs.forEach(construct => {
            // Update animation frame
            construct.animationFrame += deltaTime * 0.001;

            // Apply behavior animations
            const behavior = construct.behavior.idle[0];  // Use first idle behavior
            switch(behavior) {
                case 'bounce':
                    construct.position.y += Math.sin(construct.animationFrame * 3) * 0.5;
                    break;
                case 'sway':
                    construct.rotation = Math.sin(construct.animationFrame * 2) * 0.1;
                    break;
                case 'vibrate':
                    construct.position.x += Math.sin(construct.animationFrame * 10) * 0.2;
                    break;
                case 'glitch':
                    if (Math.random() < 0.01) {
                        construct.position.x += (Math.random() - 0.5) * 2;
                    }
                    break;
            }
        });
    }

    // Draw all constructs
    draw(ctx) {
        this.constructs.forEach(construct => {
            this.drawConstruct(ctx, construct);
        });
    }

    // Draw a single construct
    drawConstruct(ctx, construct) {
        ctx.save();

        const x = construct.position.x;
        const y = construct.position.y;
        const size = construct.appearance.size;

        // Apply rotation
        ctx.translate(x, y);
        ctx.rotate(construct.rotation);

        // Glow effect
        if (construct.appearance.glowIntensity > 0.7) {
            ctx.shadowColor = construct.appearance.color;
            ctx.shadowBlur = 10 * construct.appearance.glowIntensity;
        }

        // Draw based on shape (placeholder for now)
        ctx.fillStyle = construct.appearance.color;

        switch(construct.appearance.shape) {
            case 'round':
                ctx.beginPath();
                ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'angular':
                ctx.fillRect(-size/2, -size/2, size, size);
                break;
            case 'crystalline':
                // Diamond shape
                ctx.beginPath();
                ctx.moveTo(0, -size/2);
                ctx.lineTo(size/2, 0);
                ctx.lineTo(0, size/2);
                ctx.lineTo(-size/2, 0);
                ctx.closePath();
                ctx.fill();
                break;
            case 'organic':
                // Blob shape
                ctx.beginPath();
                ctx.ellipse(0, 0, size/2, size/2.5, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        // Eyes (simple dots for personality)
        ctx.fillStyle = '#fff';
        ctx.fillRect(-5, -5, 3, 3);
        ctx.fillRect(2, -5, 3, 3);

        ctx.restore();

        // Draw name below
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(construct.name, x, y + size/2 + 10);
    }
}

// Create global construct generator (will be initialized in game.js)
window.ConstructGenerator = ConstructGenerator;