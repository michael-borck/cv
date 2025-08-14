# Terminal CV - Interactive Zork-like Resume

An interactive terminal-based CV experience that presents professional information as a text adventure game, inspired by classic games like Zork.

## 🎮 How to Play

### Starting the Game
1. Open `index.html` in a web browser
2. Or serve locally: `python3 -m http.server 8000` and navigate to http://localhost:8000

### Basic Commands
- `help` or `h` - Show all available commands
- `look` or `l` - Look around the current room
- `go [direction]` - Move in a direction (north, south, east, west)
- `examine [item]` or `x [item]` - Examine an item in detail
- `take [item]` - Pick up an item
- `inventory` or `i` - Show what you're carrying
- `score` - Display current score and progress

### Navigation Shortcuts
- `n` - Go north
- `s` - Go south
- `e` - Go east
- `w` - Go west

### Special Commands
- `skills` - Display technical skills
- `experience` - Show work experience timeline
- `contact` - Display contact information
- `achievements` - View unlocked achievements
- `clear` - Clear the terminal screen
- `about` - Learn about this terminal CV

## 🗺️ Map Overview

```
        [Military Command]
                |
    [Education]--[Career Lobby]--[University Hall]
                |                        |
        [Consulting Office]      [AI Research Lab]
                |
        [Innovation Lab]
```

## 🏆 Achievements

- **Career Explorer** - Visit all rooms in the career journey
- **Knowledge Collector** - Collect 5 or more items
- **Academic Scholar** - Examine the thesis and publications
- **Innovation Enthusiast** - Explore all projects in the Innovation Lab
- **Professional Networker** - Find and examine contact information

## 🎯 Features

- **Retro Terminal Aesthetic**: Green phosphor CRT effect with scan lines
- **Command History**: Use UP/DOWN arrows to navigate previous commands
- **Autocomplete**: Press TAB to autocomplete commands and targets
- **Score System**: Earn points by exploring and collecting items
- **Achievement System**: Unlock achievements through exploration
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technical Details

### File Structure
```
terminal/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── terminal.css    # Terminal styling
│   └── js/
│       ├── terminal.js     # Main game engine
│       ├── gameLogic.js    # Command processing
│       └── dataLoader.js   # Data loading module
└── data/
    └── terminal-data.json  # Game content (generated from cv-data.yml)
```

### Data Generation
The game content is generated from the main CV data file:
```bash
python3 scripts/generate_terminal_data.py
```

This creates `terminal-data.json` with:
- Room descriptions and connections
- Item descriptions and properties
- Achievement definitions
- Personal information
- Experience and project data

## 🎨 Customization

### Modifying Content
1. Edit `data/cv-data.yml` in the project root
2. Run `python3 scripts/generate_terminal_data.py`
3. Refresh the browser

### Styling
- Edit `assets/css/terminal.css` for visual changes
- Modify colors, fonts, and effects
- Adjust CRT scan line effects

### Adding Rooms/Items
Edit `scripts/generate_terminal_data.py` to:
- Add new rooms in the `rooms` dictionary
- Create new items in the `items` dictionary
- Define connections between rooms
- Add new achievements

## 🐛 Debug Mode

Open browser console and use:
```javascript
terminalDebug.gameState        // View current game state
terminalDebug.gameData()        // View loaded game data
terminalDebug.showRoom()        // Refresh room display
terminalDebug.appendOutput(text) // Add text to terminal
```

## 📝 Notes

- The terminal maintains command history across the session
- All progress is lost on page refresh (intentionally retro!)
- The game adapts content from cv-data.yml automatically
- Mobile users can use on-screen keyboard for input

## 🎮 Tips for Players

1. **Explore Everything**: Visit all rooms and examine all items
2. **Collect Items**: Some items can be taken and add to your score
3. **Read Carefully**: Item descriptions contain real CV information
4. **Use Tab**: Autocomplete saves typing
5. **Check Achievements**: See what you haven't unlocked yet

Enjoy exploring the career journey in this unique terminal adventure!