// Terminal CV - Main Game Engine
import { gameState, commands } from './gameLogic.js';
import { loadGameData } from './dataLoader.js';

// DOM elements
const terminalOutput = document.getElementById('terminalOutput');
const commandInput = document.getElementById('commandInput');
const terminalBody = document.getElementById('terminalBody');
const roomStatus = document.getElementById('roomStatus');
const scoreStatus = document.getElementById('scoreStatus');
const itemsStatus = document.getElementById('itemsStatus');

// Game data
let gameData = null;

// Initialize the terminal
async function initTerminal() {
    // Load game data
    gameData = await loadGameData();
    
    // Initialize game state with data
    gameState.init(gameData);
    
    // Start boot sequence
    bootSequence();
    
    // Set up input handler
    setupInputHandler();
    
    // Focus on input
    commandInput.focus();
}

// Boot sequence animation
function bootSequence() {
    const bootMessages = [
        "BOOTING TERMINAL CV SYSTEM...",
        "Loading career data...",
        "Initializing experience modules...",
        "Mounting skill repositories...",
        "Establishing network connections...",
        "",
        "SYSTEM READY",
        "",
        getASCIILogo(),
        "",
        `<span class='cyan'>Welcome to the Terminal CV of ${gameData.personal.name}</span>`,
        "<span class='yellow'>Type 'help' for available commands</span>",
        ""
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < bootMessages.length) {
            appendOutput(bootMessages[index]);
            index++;
        } else {
            clearInterval(interval);
            showRoom();
        }
    }, 100);
}

// ASCII Logo
function getASCIILogo() {
    return `<pre class='ascii-art'>
╔════════════════════════════════════════╗
║                                        ║
║     TERMINAL CV - ADVENTURE MODE      ║
║          ${gameData.personal.name.padEnd(26)}    ║
║     AI Leader & Tech Innovator        ║
║                                        ║
╚════════════════════════════════════════╝
</pre>`;
}

// Setup input handler
function setupInputHandler() {
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                gameState.addToHistory(command);
                appendOutput(`<span class='green'>></span> ${command}`);
                processCommand(command.toLowerCase());
                commandInput.value = '';
                updateStatusBar();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const previousCommand = gameState.getPreviousCommand();
            if (previousCommand) {
                commandInput.value = previousCommand;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCommand = gameState.getNextCommand();
            commandInput.value = nextCommand || '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            autocomplete();
        }
    });
    
    // Keep focus on input
    document.addEventListener('click', () => {
        commandInput.focus();
    });
}

// Process commands
function processCommand(cmd) {
    const parts = cmd.split(' ');
    const action = parts[0];
    const target = parts.slice(1).join(' ');
    
    // Check if command exists
    if (commands[action]) {
        commands[action](target, gameData, { appendOutput, showRoom, updateStatusBar });
    } else {
        appendOutput(`<span class='error'>Unknown command: ${action}. Type 'help' for available commands.</span>`);
    }
}

// Show current room
function showRoom() {
    const currentRoom = gameState.getCurrentRoom();
    const room = gameData.rooms[currentRoom];
    
    if (!room) {
        appendOutput(`<span class='error'>Error: Room '${currentRoom}' not found!</span>`);
        return;
    }
    
    // Mark room as visited
    gameState.visitRoom(currentRoom);
    
    // Display room
    appendOutput("");
    appendOutput(`<span class='room-title'>${room.name}</span>`);
    if (room.ascii) {
        appendOutput(`<pre class='ascii-art'>${room.ascii}</pre>`);
    }
    appendOutput(room.description);
    
    // Show exits
    const exits = Object.keys(room.exits || {});
    if (exits.length > 0) {
        appendOutput(`<span class='cyan'>Exits: ${exits.join(', ')}</span>`);
    }
    
    // Show items
    const items = room.items || [];
    const visibleItems = items.filter(item => !gameState.isItemTaken(item));
    if (visibleItems.length > 0) {
        appendOutput(`<span class='yellow'>You see: ${visibleItems.map(i => `<span class='item'>${i}</span>`).join(', ')}</span>`);
    }
    
    appendOutput("");
}

// Append output to terminal
function appendOutput(text) {
    const line = document.createElement('div');
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    
    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Update status bar
function updateStatusBar() {
    const currentRoom = gameState.getCurrentRoom();
    const room = gameData.rooms[currentRoom];
    
    roomStatus.textContent = room ? room.name.toUpperCase() : 'UNKNOWN';
    scoreStatus.textContent = `SCORE: ${gameState.getScore()}`;
    itemsStatus.textContent = `ITEMS: ${gameState.getInventory().length}`;
}

// Autocomplete functionality
function autocomplete() {
    const input = commandInput.value.trim().toLowerCase();
    if (!input) return;
    
    const parts = input.split(' ');
    
    if (parts.length === 1) {
        // Autocomplete commands
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(parts[0]));
        if (matches.length === 1) {
            commandInput.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            appendOutput(`<span class='dim'>Possible commands: ${matches.join(', ')}</span>`);
        }
    } else if (parts.length === 2) {
        // Autocomplete targets based on command
        const action = parts[0];
        const partial = parts[1];
        
        if (action === 'go') {
            // Autocomplete directions
            const room = gameData.rooms[gameState.getCurrentRoom()];
            const exits = Object.keys(room.exits || {});
            const matches = exits.filter(exit => exit.startsWith(partial));
            if (matches.length === 1) {
                commandInput.value = `${action} ${matches[0]}`;
            }
        } else if (action === 'examine' || action === 'take') {
            // Autocomplete items
            const room = gameData.rooms[gameState.getCurrentRoom()];
            const items = room.items || [];
            const matches = items.filter(item => item.startsWith(partial));
            if (matches.length === 1) {
                commandInput.value = `${action} ${matches[0]}`;
            }
        }
    }
}

// Start the terminal when DOM is ready
document.addEventListener('DOMContentLoaded', initTerminal);

// Export for debugging
window.terminalDebug = {
    gameState,
    gameData: () => gameData,
    showRoom,
    appendOutput
};