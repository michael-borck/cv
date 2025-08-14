# CV Quest - Standalone Version

A swipe-card adventure game that presents Michael Borck's CV as an interactive gaming experience.

## Structure

```
quest/
├── index.html           # Main game HTML
├── assets/
│   ├── css/
│   │   └── styles.css   # Game styling
│   ├── js/
│   │   ├── script.js    # Main game logic
│   │   ├── decks.js     # Card deck loader
│   │   └── gameState.js # Game state management
│   └── img/             # Game images
└── data/
    └── cv-cards.json    # Generated from cv-data.yml
```

## How It Works

1. **Data Generation**: The `cv-cards.json` file is generated from `../../data/cv-data.yml` using the Python script `../../scripts/generate_cv_cards.py`

2. **Dynamic Loading**: The game loads CV data from `cv-cards.json` at runtime, converting string function references to actual JavaScript functions

3. **Game Mechanics**:
   - Swipe left/right or click to make choices
   - Collect skills and achievements
   - Play mini-games
   - Multiple paths through the CV content
   - Different endings to encourage replay

## Running the Game

### Option 1: Direct File Access
Open `index.html` directly in a browser (may have CORS issues with some browsers)

### Option 2: Local Server (Recommended)
```bash
# From the quest directory
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 3: Via Make
```bash
# From the project root
make quest

# Then follow the instructions to serve locally
```

## Updating Content

1. Edit `../../data/cv-data.yml` with new CV information
2. Run `make quest` from project root to regenerate `cv-cards.json`
3. The game will automatically use the updated data

## Customization

- **Styling**: Edit `assets/css/styles.css`
- **Game Logic**: Modify `assets/js/script.js`
- **Card Generation**: Update `../../scripts/generate_cv_cards.py`
- **Images**: Replace images in `assets/img/` with your own

## Features

- 📱 Touch/swipe support for mobile
- 🎮 Gamified CV exploration
- 🏆 Achievement system
- 💼 Multiple career paths to explore
- 🎯 Mini-games and challenges
- 📊 Stats tracking (skills, experience, achievements)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full touch support

## Credits

Based on the resume-quest game structure, adapted for CV presentation.