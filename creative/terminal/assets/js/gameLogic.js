// Terminal CV - Game Logic and Commands

// Game State Management
export const gameState = {
    currentRoom: 'lobby',
    inventory: [],
    visitedRooms: new Set(),
    score: 0,
    commandHistory: [],
    historyIndex: 0,
    examinedItems: new Set(),
    achievements: new Set(),
    takenItems: new Set(),
    
    init(gameData) {
        this.currentRoom = 'lobby';
        this.inventory = [];
        this.visitedRooms = new Set(['lobby']);
        this.score = 0;
        this.commandHistory = [];
        this.historyIndex = 0;
        this.examinedItems = new Set();
        this.achievements = new Set();
        this.takenItems = new Set();
    },
    
    getCurrentRoom() {
        return this.currentRoom;
    },
    
    setCurrentRoom(room) {
        this.currentRoom = room;
        this.visitedRooms.add(room);
    },
    
    visitRoom(room) {
        this.visitedRooms.add(room);
    },
    
    hasVisited(room) {
        return this.visitedRooms.has(room);
    },
    
    addToInventory(item) {
        if (!this.inventory.includes(item)) {
            this.inventory.push(item);
            this.takenItems.add(item);
            return true;
        }
        return false;
    },
    
    getInventory() {
        return this.inventory;
    },
    
    hasItem(item) {
        return this.inventory.includes(item);
    },
    
    isItemTaken(item) {
        return this.takenItems.has(item);
    },
    
    addScore(points) {
        this.score += points;
    },
    
    getScore() {
        return this.score;
    },
    
    markExamined(item) {
        this.examinedItems.add(item);
    },
    
    hasExamined(item) {
        return this.examinedItems.has(item);
    },
    
    unlockAchievement(id) {
        if (!this.achievements.has(id)) {
            this.achievements.add(id);
            return true;
        }
        return false;
    },
    
    hasAchievement(id) {
        return this.achievements.has(id);
    },
    
    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
    },
    
    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.commandHistory[this.historyIndex];
        }
        return null;
    },
    
    getNextCommand() {
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        }
        this.historyIndex = this.commandHistory.length;
        return null;
    }
};

// Command implementations
export const commands = {
    help(target, gameData, ui) {
        ui.appendOutput("<span class='cyan'>Available Commands:</span>");
        ui.appendOutput("");
        for (const [cmd, desc] of Object.entries(gameData.commands)) {
            ui.appendOutput(`  <span class='help-command'>${cmd}</span>`);
            ui.appendOutput(`  <span class='help-description'>→ ${desc}</span>`);
        }
        ui.appendOutput("");
        ui.appendOutput("<span class='dim'>Tip: Use TAB for autocomplete, UP/DOWN for command history</span>");
    },
    
    look(target, gameData, ui) {
        ui.showRoom();
    },
    
    go(direction, gameData, ui) {
        if (!direction) {
            ui.appendOutput("<span class='error'>Go where? Specify a direction (north, south, east, west)</span>");
            return;
        }
        
        const currentRoom = gameState.getCurrentRoom();
        const room = gameData.rooms[currentRoom];
        
        if (room.exits && room.exits[direction]) {
            gameState.setCurrentRoom(room.exits[direction]);
            ui.appendOutput(`<span class='cyan'>You go ${direction}...</span>`);
            ui.showRoom();
            checkAchievements(gameData, ui);
        } else {
            ui.appendOutput(`<span class='error'>You can't go ${direction} from here.</span>`);
        }
    },
    
    examine(item, gameData, ui) {
        if (!item) {
            ui.appendOutput("<span class='error'>Examine what? Specify an item.</span>");
            return;
        }
        
        // Check if item exists in current room or inventory
        const currentRoom = gameState.getCurrentRoom();
        const room = gameData.rooms[currentRoom];
        const roomItems = room.items || [];
        
        if (roomItems.includes(item) || gameState.hasItem(item)) {
            const itemData = gameData.items[item];
            if (itemData) {
                ui.appendOutput(`<span class='yellow'>Examining ${item}:</span>`);
                ui.appendOutput(itemData.description);
                gameState.markExamined(item);
                
                // Add points for first examination
                if (!gameState.hasExamined(item) && itemData.points > 0) {
                    gameState.addScore(itemData.points);
                    ui.appendOutput(`<span class='green'>+${itemData.points} points!</span>`);
                }
                
                checkAchievements(gameData, ui);
            } else {
                ui.appendOutput(`<span class='error'>The ${item} seems ordinary.</span>`);
            }
        } else {
            ui.appendOutput(`<span class='error'>You don't see any ${item} here.</span>`);
        }
    },
    
    take(item, gameData, ui) {
        if (!item) {
            ui.appendOutput("<span class='error'>Take what? Specify an item.</span>");
            return;
        }
        
        const currentRoom = gameState.getCurrentRoom();
        const room = gameData.rooms[currentRoom];
        const roomItems = room.items || [];
        
        if (roomItems.includes(item) && !gameState.isItemTaken(item)) {
            const itemData = gameData.items[item];
            if (itemData && itemData.takeable) {
                if (gameState.addToInventory(item)) {
                    ui.appendOutput(`<span class='green'>You take the ${item}.</span>`);
                    
                    if (itemData.points > 0) {
                        gameState.addScore(itemData.points);
                        ui.appendOutput(`<span class='green'>+${itemData.points} points!</span>`);
                    }
                    
                    checkAchievements(gameData, ui);
                } else {
                    ui.appendOutput(`<span class='dim'>You already have the ${item}.</span>`);
                }
            } else {
                ui.appendOutput(`<span class='error'>You can't take the ${item}.</span>`);
            }
        } else {
            ui.appendOutput(`<span class='error'>There's no ${item} here to take.</span>`);
        }
    },
    
    inventory(target, gameData, ui) {
        const items = gameState.getInventory();
        if (items.length === 0) {
            ui.appendOutput("<span class='dim'>Your inventory is empty.</span>");
        } else {
            ui.appendOutput("<span class='cyan'>You are carrying:</span>");
            items.forEach(item => {
                ui.appendOutput(`  • <span class='item'>${item}</span>`);
            });
        }
    },
    
    score(target, gameData, ui) {
        ui.appendOutput(`<span class='cyan'>Current Score: ${gameState.getScore()} points</span>`);
        ui.appendOutput(`<span class='dim'>Rooms visited: ${gameState.visitedRooms.size}/${Object.keys(gameData.rooms).length}</span>`);
        ui.appendOutput(`<span class='dim'>Items collected: ${gameState.getInventory().length}</span>`);
        ui.appendOutput(`<span class='dim'>Achievements: ${gameState.achievements.size}/${gameData.achievements.length}</span>`);
    },
    
    achievements(target, gameData, ui) {
        ui.appendOutput("<span class='cyan'>Achievements:</span>");
        ui.appendOutput("");
        
        gameData.achievements.forEach(achievement => {
            if (gameState.hasAchievement(achievement.id)) {
                ui.appendOutput(`  ✓ <span class='green'>${achievement.name}</span> (+${achievement.points}pts)`);
                ui.appendOutput(`    <span class='dim'>${achievement.description}</span>`);
            } else {
                ui.appendOutput(`  ○ <span class='dim'>???</span>`);
                ui.appendOutput(`    <span class='dim'>${achievement.description}</span>`);
            }
        });
    },
    
    skills(target, gameData, ui) {
        ui.appendOutput("<span class='cyan'>Technical Skills:</span>");
        ui.appendOutput("");
        
        if (gameData.skills.programming && gameData.skills.programming.length > 0) {
            ui.appendOutput("  <span class='yellow'>Programming:</span>");
            ui.appendOutput(`    ${gameData.skills.programming.join(', ')}`);
        }
        
        if (gameData.skills.web && gameData.skills.web.length > 0) {
            ui.appendOutput("  <span class='yellow'>Web Technologies:</span>");
            ui.appendOutput(`    ${gameData.skills.web.join(', ')}`);
        }
        
        if (gameData.skills.ai_ml && gameData.skills.ai_ml.length > 0) {
            ui.appendOutput("  <span class='yellow'>AI/ML:</span>");
            ui.appendOutput(`    ${gameData.skills.ai_ml.join(', ')}`);
        }
        
        if (gameData.skills.soft_skills && gameData.skills.soft_skills.length > 0) {
            ui.appendOutput("  <span class='yellow'>Soft Skills:</span>");
            ui.appendOutput(`    ${gameData.skills.soft_skills.join(', ')}`);
        }
    },
    
    experience(target, gameData, ui) {
        ui.appendOutput("<span class='cyan'>Professional Experience:</span>");
        ui.appendOutput("");
        
        gameData.experience.forEach(exp => {
            ui.appendOutput(`<div class='timeline-entry'>`);
            ui.appendOutput(`  <span class='timeline-year'>${exp.period}</span>`);
            ui.appendOutput(`  <span class='yellow'>${exp.title}</span>`);
            ui.appendOutput(`  <span class='dim'>${exp.organization}</span>`);
            ui.appendOutput(`</div>`);
        });
    },
    
    contact(target, gameData, ui) {
        ui.appendOutput("<span class='cyan'>Contact Information:</span>");
        ui.appendOutput("");
        ui.appendOutput(`  <span class='yellow'>Name:</span> ${gameData.personal.name}`);
        ui.appendOutput(`  <span class='yellow'>Email:</span> ${gameData.personal.email}`);
        ui.appendOutput(`  <span class='yellow'>Phone:</span> ${gameData.personal.phone}`);
        ui.appendOutput(`  <span class='yellow'>LinkedIn:</span> ${gameData.personal.linkedin}`);
        ui.appendOutput(`  <span class='yellow'>GitHub:</span> ${gameData.personal.github}`);
        ui.appendOutput(`  <span class='yellow'>Location:</span> ${gameData.personal.location}`);
    },
    
    clear(target, gameData, ui) {
        document.getElementById('terminalOutput').innerHTML = '';
        ui.showRoom();
    },
    
    restart(target, gameData, ui) {
        if (confirm('Are you sure you want to restart? All progress will be lost.')) {
            gameState.init(gameData);
            document.getElementById('terminalOutput').innerHTML = '';
            ui.appendOutput("<span class='yellow'>Game restarted!</span>");
            ui.appendOutput("");
            ui.showRoom();
        }
    },
    
    about(target, gameData, ui) {
        ui.appendOutput("<span class='cyan'>About Terminal CV</span>");
        ui.appendOutput("");
        ui.appendOutput("This is an interactive terminal-based CV experience.");
        ui.appendOutput(`Explore the career journey of ${gameData.personal.name}.`);
        ui.appendOutput("");
        ui.appendOutput("Navigate through different career phases, examine achievements,");
        ui.appendOutput("and discover the full professional story in a unique Zork-like adventure.");
        ui.appendOutput("");
        ui.appendOutput("<span class='dim'>Built with vanilla JavaScript and love for retro terminals.</span>");
    }
};

// Add command aliases
commands.h = commands.help;
commands['?'] = commands.help;
commands.l = commands.look;
commands.n = () => commands.go('north', ...arguments);
commands.s = () => commands.go('south', ...arguments);
commands.e = () => commands.go('east', ...arguments);
commands.w = () => commands.go('west', ...arguments);
commands.north = () => commands.go('north', ...arguments);
commands.south = () => commands.go('south', ...arguments);
commands.east = () => commands.go('east', ...arguments);
commands.west = () => commands.go('west', ...arguments);
commands.x = commands.examine;
commands.i = commands.inventory;
commands.inv = commands.inventory;

// Achievement checking
function checkAchievements(gameData, ui) {
    // Check explorer achievement
    if (gameState.visitedRooms.size === Object.keys(gameData.rooms).length) {
        if (gameState.unlockAchievement('explorer')) {
            const achievement = gameData.achievements.find(a => a.id === 'explorer');
            showAchievement(achievement, ui);
        }
    }
    
    // Check collector achievement
    if (gameState.getInventory().length >= 5) {
        if (gameState.unlockAchievement('collector')) {
            const achievement = gameData.achievements.find(a => a.id === 'collector');
            showAchievement(achievement, ui);
        }
    }
    
    // Check scholar achievement
    if (gameState.hasExamined('thesis') && gameState.hasExamined('publications')) {
        if (gameState.unlockAchievement('scholar')) {
            const achievement = gameData.achievements.find(a => a.id === 'scholar');
            showAchievement(achievement, ui);
        }
    }
    
    // Check innovator achievement
    if (gameState.hasExamined('reality_reigns') && 
        gameState.hasExamined('talk_buddy') && 
        gameState.hasExamined('cloud_core_sim')) {
        if (gameState.unlockAchievement('innovator')) {
            const achievement = gameData.achievements.find(a => a.id === 'innovator');
            showAchievement(achievement, ui);
        }
    }
    
    // Check networker achievement
    if (gameState.hasExamined('terminal')) {
        if (gameState.unlockAchievement('networker')) {
            const achievement = gameData.achievements.find(a => a.id === 'networker');
            showAchievement(achievement, ui);
        }
    }
}

// Show achievement notification
function showAchievement(achievement, ui) {
    if (achievement) {
        ui.appendOutput("");
        ui.appendOutput(`<div class='achievement'>`);
        ui.appendOutput(`  🏆 ACHIEVEMENT UNLOCKED!`);
        ui.appendOutput(`  ${achievement.name} (+${achievement.points} points)`);
        ui.appendOutput(`  ${achievement.description}`);
        ui.appendOutput(`</div>`);
        gameState.addScore(achievement.points);
    }
}