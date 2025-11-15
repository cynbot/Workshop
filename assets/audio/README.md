# Audio Assets for The Workshop

This folder contains sound effects and music for The Workshop.

## Sound Effects Needed

Place the following audio files in this folder:

### Sound Effects (SFX)
- `click.mp3` - Generic UI click sound
- `pickup.mp3` - Sound when picking up a piece
- `place.mp3` - Sound when placing a piece on the workbench
- `build.mp3` - Sound when a construct is created
- `radio_on.mp3` - Sound when clicking the radio
- `water.mp3` - Sound when watering the plant

### Background Music
- `workshop_ambient.mp3` - Ambient background music for the workshop

## Audio Format Recommendations

- **Format**: MP3 (best browser compatibility) or OGG
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128-192 kbps (good quality without large file sizes)
- **File Size**: Keep individual files under 500KB when possible

## Volume Guidelines

The AudioManager will automatically apply these volume multipliers:
- Master Volume: 0.7 (70%)
- SFX Volume: 0.8 (80%)
- Music Volume: 0.3 (30%)

So create your audio at normal levels - the system will handle the mixing!

## Temporary Note

Until you add actual audio files, the game will run silently. The AudioManager gracefully handles missing files - no errors will be shown to users. Just add the files when you're ready!

## Finding/Creating Sounds

Some resources for finding sounds:
- **freesound.org** - Creative Commons sound effects
- **incompetech.com** - Royalty-free music
- **LMMS** or **Audacity** - Free tools to create/edit sounds
- **jfxr** or **sfxr** - Browser-based sound effect generators

## Implementation Details

Sound effects are triggered at these events:
- **Radio click** (js/game.js:298) - `radio_on`
- **Plant watering** (js/game.js:305) - `plant_water`
- **Piece pickup** (js/pieces.js:89) - `piece_pickup`
- **Piece placement** (js/pieces.js:183) - `piece_place`
- **Construct build** (js/game.js:405) - `construct_build`
- **Ambient music** (js/game.js:120) - `ambient` (auto-plays on start)
