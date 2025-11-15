# Art Guide for The Workshop

This guide explains what art you can create to replace the placeholder graphics.

## Current Status
Right now, everything is drawn with code (canvas shapes and colors). You can add images to replace any or all of these elements!

## Art Files You Can Create

### 1. Background Images (Optional)
**Files:**
- `workshop-day.png` - Background for daytime (6 AM - 8 PM)
- `workshop-night.png` - Background for nighttime (8 PM - 6 AM)

**Size:** 360 x 640 pixels (the full canvas)

**What to include:**
- The workshop room background
- Walls, floor, shelves
- Window (or leave space for it at x:140, y:20, 80x60)
- Workbench area (or leave space at x:90, y:400, 180x100)
- Plant pot area (or leave space at x:280, y:90, 40x50)
- Radio area (or leave space at x:50, y:80, 60x40)

**Tips:**
- Make it cozy! This is Colin's birthday gift workshop
- Day version should be bright and warm
- Night version should be darker with maybe some ambient lighting
- You can draw over the whole canvas - the UI elements will render on top

---

### 2. Piece Sprite Sheet (Optional)
**File:** `pieces.png`

**Size:** 144 x 24 pixels (6 pieces in a horizontal strip)

**Layout:** Each piece is 24x24 pixels, arranged horizontally:
```
[Dawn Circuit] [Midnight Core] [Memory Gear] [Rebel Spark] [Rain Fragment] [Heart Component]
    0-23px        24-47px         48-71px       72-95px       96-119px       120-143px
```

**Piece Descriptions:**
1. **Dawn Circuit** (0,0) - Golden/yellow, holds the first light, awakening energy
2. **Midnight Core** (24,0) - Dark blue/purple, dreams within circuits, resting energy
3. **Memory Gear** (48,0) - Orange/golden, remembers everything, nostalgic energy
4. **Rebel Spark** (72,0) - Neon pink/magenta, questions authority, defiant energy
5. **Rain Fragment** (96,0) - Blue, collected from windows, flowing energy
6. **Heart Component** (120,0) - Pink, the caring core, caring energy

**Tips:**
- Think of them as small mechanical/magical parts
- They should look like things you'd combine to build a creature
- Can be abstract or literal (gears, circuits, crystals, etc.)

---

### 3. Construct Sprite Sheet (Optional - Advanced)
**File:** `constructs.png`

**Size:** Variable - each construct is 32x32 pixels

**How it works:**
- The game procedurally generates constructs, so this is OPTIONAL
- If you want to draw specific constructs, you'd create them as 32x32 tiles
- The system is set up for 3-frame animations (96px wide per construct)
- **Recommendation:** Skip this for now, the procedural generation works well!

---

## How to Add Your Art

### Option 1: Replace Individual Elements
1. Create just the files you want (e.g., only background images)
2. Drop them in `assets/placeholder/`
3. The game will use your images and fall back to code for the rest

### Option 2: Full Art Replacement
1. Create all the images listed above
2. Drop them in `assets/placeholder/`
3. Everything will use your custom art!

### Option 3: Multiple Art Sets
1. Create a new folder like `assets/final/` or `assets/birthday/`
2. Put your art in that folder
3. Change `artFolder: 'placeholder'` to `artFolder: 'final'` in `js/config.js` (line 12)

---

## Easiest Starting Point

**I recommend starting with just the background images!**

1. Create `workshop-day.png` (360x640)
2. Draw the workshop room however you imagine it
3. Don't worry about the UI elements - they'll draw on top
4. Test it in the game
5. Then create `workshop-night.png` as a darker variant

The pieces and constructs look fine as colored shapes, so those can wait!

---

## Art Style Recommendations

**Vibe:** Cozy, personal, magical workshop
- Think: Studio Ghibli meets electronics workshop
- Or: Pixel art game sprite aesthetic
- Or: Hand-drawn sketch style
- Whatever feels right for Colin!

**Colors:**
- Day: Warm, inviting (browns, golds, soft blues)
- Night: Atmospheric, glowing (deep purples, blues, ambient lights)

**Details to consider:**
- Does the workshop have windows? (There's one in the code at 140,20)
- What's outside the window? (Stars at night, sun/sky during day)
- Wooden shelves or metal? Industrial or homey?
- Is there clutter? Tools? Other magical/mechanical items?

---

## File Format
- **PNG** with transparency (recommended)
- **JPG** works too (no transparency)
- Keep file sizes reasonable (<500KB each if possible)

---

## Testing Your Art

1. Add your image files to `assets/placeholder/`
2. Commit and push to GitHub
3. Wait ~1 minute for GitHub Pages to deploy
4. Check https://cynbot.github.io/Workshop
5. Your art should appear!

If an image doesn't load, check the browser console for errors.

---

## Current Canvas Layout Reference

```
360x640 canvas

┌─────────────────────────────────────┐
│                                     │ 0-20: top margin
│     [Window 140,20-220,80]          │
│         ☀️/🌙 [Radio 50,80]         │
│                         [Plant]     │
│                                     │
│     ════════════════════            │ Shelves at 150,200,250
│     [Constructs live here]          │
│     ════════════════════            │
│     ════════════════════            │
│                                     │
│     ┌─────────────────┐             │ Workbench at 400
│     │  [Workbench]    │             │
│     │  3 piece slots  │             │
│     └─────────────────┘             │
│                                     │
│  [Pieces appear around 540-580]     │
│                                     │
│═════════════════════════════════════│ Floor at 540
└─────────────────────────────────────┘ 640
```

---

## Questions?
Just ask! I can help with:
- Specific dimensions for any element
- Color palette suggestions
- How to integrate partial art
- Anything else!

Happy creating! 🎨
