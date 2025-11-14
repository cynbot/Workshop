// Piece system for The Workshop
// Handles piece spawning, dragging, and management

class PieceManager {
    constructor() {
        this.pieces = CONFIG.pieces.definitions;
        this.activePieces = [];  // Pieces currently in the workshop
        this.draggedPiece = null;
        this.workbenchSlots = [null, null, null];  // 3 slots for combining

        // Initialize with some pieces
        this.spawnInitialPieces();
    }

    spawnInitialPieces() {
        // Spawn 2-3 random pieces to start
        const startingPieces = ['dawn_circuit', 'midnight_core', 'heart_component'];
        startingPieces.forEach((pieceId, index) => {
            this.spawnPiece(pieceId, {
                x: 50 + (index * 80),
                y: 300
            });
        });
    }

    spawnPiece(pieceId, position = null) {
        const pieceDef = this.pieces[pieceId];
        if (!pieceDef) return null;

        const piece = {
            id: `${pieceId}_${Date.now()}`,
            type: pieceId,
            ...pieceDef,
            position: position || this.getRandomSpawnPosition(),
            velocity: { x: 0, y: 0 },
            inWorkbench: false,
            workbenchSlot: -1,
            scale: 1,
            rotation: 0,
            glowing: false
        };

        this.activePieces.push(piece);
        return piece;
    }

    getRandomSpawnPosition() {
        return {
            x: 30 + Math.random() * 300,
            y: 250 + Math.random() * 100
        };
    }

    // Check if a point is over a piece
    getPieceAtPosition(x, y) {
        // Check from top to bottom (reverse order for proper layering)
        for (let i = this.activePieces.length - 1; i >= 0; i--) {
            const piece = this.activePieces[i];
            const size = CONFIG.pieces.size;

            if (x >= piece.position.x - size/2 &&
                x <= piece.position.x + size/2 &&
                y >= piece.position.y - size/2 &&
                y <= piece.position.y + size/2) {
                return piece;
            }
        }
        return null;
    }

    // Start dragging a piece
    startDrag(x, y) {
        const piece = this.getPieceAtPosition(x, y);
        if (piece && !piece.inWorkbench) {
            this.draggedPiece = piece;
            this.dragOffset = {
                x: x - piece.position.x,
                y: y - piece.position.y
            };

            // Bring to front
            const index = this.activePieces.indexOf(piece);
            this.activePieces.splice(index, 1);
            this.activePieces.push(piece);

            piece.scale = 1.1;  // Slightly enlarge when dragging
            return true;
        }
        return false;
    }

    // Update drag position
    updateDrag(x, y) {
        if (this.draggedPiece) {
            this.draggedPiece.position.x = x - this.dragOffset.x;
            this.draggedPiece.position.y = y - this.dragOffset.y;

            // Check if near workbench
            const slot = this.getNearestWorkbenchSlot(x, y);
            if (slot !== -1) {
                this.draggedPiece.glowing = true;
            } else {
                this.draggedPiece.glowing = false;
            }
        }
    }

    // End dragging
    endDrag(x, y) {
        if (!this.draggedPiece) return null;

        const piece = this.draggedPiece;
        piece.scale = 1;  // Reset scale

        // Check if dropped on workbench
        const slot = this.getNearestWorkbenchSlot(x, y);
        if (slot !== -1 && !this.workbenchSlots[slot]) {
            // Snap to workbench slot
            this.placeInWorkbench(piece, slot);

            // Check if all slots filled (ready to build)
            if (this.workbenchSlots.every(s => s !== null)) {
                return {
                    action: 'build',
                    pieces: [...this.workbenchSlots]
                };
            }
        } else {
            // Just drop the piece
            piece.glowing = false;
        }

        this.draggedPiece = null;
        return null;
    }

    // Get nearest workbench slot
    getNearestWorkbenchSlot(x, y) {
        const wb = CONFIG.ui.workbench;
        const slotWidth = wb.width / wb.slots;

        // Check if within workbench bounds
        if (x >= wb.x && x <= wb.x + wb.width &&
            y >= wb.y && y <= wb.y + wb.height) {

            // Calculate which slot
            const slotIndex = Math.floor((x - wb.x) / slotWidth);
            return Math.min(slotIndex, wb.slots - 1);
        }

        return -1;
    }

    // Place piece in workbench slot
    placeInWorkbench(piece, slot) {
        const wb = CONFIG.ui.workbench;
        const slotWidth = wb.width / wb.slots;

        // Remove from previous slot if any
        if (piece.inWorkbench) {
            this.workbenchSlots[piece.workbenchSlot] = null;
        }

        // Place in new slot
        this.workbenchSlots[slot] = piece;
        piece.inWorkbench = true;
        piece.workbenchSlot = slot;
        piece.glowing = true;

        // Snap position
        piece.position = {
            x: wb.x + (slot * slotWidth) + slotWidth/2,
            y: wb.y + wb.height/2
        };
    }

    // Clear workbench after building
    clearWorkbench() {
        this.workbenchSlots.forEach(piece => {
            if (piece) {
                // Remove piece from active pieces
                const index = this.activePieces.indexOf(piece);
                if (index > -1) {
                    this.activePieces.splice(index, 1);
                }
            }
        });

        this.workbenchSlots = [null, null, null];
    }

    // Update piece animations
    update(deltaTime) {
        this.activePieces.forEach(piece => {
            // Gentle floating animation for pieces
            if (!piece.inWorkbench && !this.draggedPiece) {
                piece.position.y += Math.sin(Date.now() * 0.001 + piece.position.x) * 0.1;
            }

            // Glow pulse for workbench pieces
            if (piece.glowing) {
                piece.scale = 1 + Math.sin(Date.now() * 0.005) * 0.05;
            }
        });
    }

    // Draw all pieces
    draw(ctx) {
        this.activePieces.forEach(piece => {
            this.drawPiece(ctx, piece);
        });

        // Draw dragged piece on top
        if (this.draggedPiece) {
            this.drawPiece(ctx, this.draggedPiece);
        }
    }

    // Draw a single piece
    drawPiece(ctx, piece) {
        ctx.save();

        const size = CONFIG.pieces.size * piece.scale;
        const x = piece.position.x;
        const y = piece.position.y;

        // Shadow
        if (!piece.inWorkbench) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x - size/2 + 2, y - size/2 + 2, size, size);
        }

        // Glow effect
        if (piece.glowing) {
            ctx.shadowColor = piece.color;
            ctx.shadowBlur = 10;
        }

        // Main piece (placeholder rectangle for now)
        ctx.fillStyle = piece.color;
        ctx.fillRect(x - size/2, y - size/2, size, size);

        // Border
        ctx.strokeStyle = piece.glowing ? '#fff' : 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - size/2, y - size/2, size, size);

        // Element symbol (temporary)
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(piece.element[0].toUpperCase(), x, y);

        ctx.restore();
    }

    // Spawn time-based pieces
    checkTimeBasedSpawns() {
        const hour = new Date().getHours();

        // Dawn pieces in morning
        if (hour >= 5 && hour <= 8) {
            if (Math.random() < 0.1) {  // 10% chance
                this.spawnPiece('dawn_circuit');
            }
        }

        // Midnight pieces at night
        if (hour >= 22 || hour <= 2) {
            if (Math.random() < 0.1) {
                this.spawnPiece('midnight_core');
            }
        }
    }
}

// Create global piece manager (will be initialized in game.js)
window.PieceManager = PieceManager;