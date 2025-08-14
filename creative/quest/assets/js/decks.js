// Card Decks and Mini-Games Data
// This file loads CV data from cv-cards.json and provides it to the game

// These functions will be initialized from script.js
let switchDeckFn;
let showMiniGameFn;
let addSkillFn;
let increaseStatsFn;
let showNotificationFn;
let nextCardFn;

// Initialize the deck functions with references from script.js
export function initDeckFunctions(functions) {
  switchDeckFn = functions.switchDeck;
  showMiniGameFn = functions.showMiniGame;
  addSkillFn = functions.addSkill;
  increaseStatsFn = functions.increaseStats;
  showNotificationFn = functions.showNotification;
  nextCardFn = functions.nextCard || (() => {
    // Default nextCard implementation
    if (functions.createCard) {
      const currentDeck = window.gameState?.getCurrentDeck() || 'main';
      const currentIndex = window.gameState?.getCurrentCardIndex() || 0;
      if (currentIndex < cardDecks[currentDeck].length - 1) {
        functions.createCard(currentIndex + 1);
      }
    }
  });
}

// Card data - will be populated from JSON
export let cardDecks = {};
export let miniGames = {};
export let personalCards = [];

// Function to evaluate string function calls
function createFunctionFromString(funcStr) {
  // Parse function calls like 'switchDeckFn("professional")'
  // or compound calls like 'addSkillFn("Python"); increaseStatsFn(1, 2, 0)'
  
  return function() {
    // Split by semicolon for multiple commands
    const commands = funcStr.split(';').map(cmd => cmd.trim()).filter(cmd => cmd);
    
    commands.forEach(command => {
      // Extract function name and arguments
      const match = command.match(/(\w+)\((.*)\)/);
      if (!match) return;
      
      const funcName = match[1];
      const argsStr = match[2];
      
      // Parse arguments (handle strings and numbers)
      let args = [];
      if (argsStr) {
        // Simple argument parser - handles strings in quotes and numbers
        args = argsStr.split(',').map(arg => {
          arg = arg.trim();
          // Remove quotes from strings
          if ((arg.startsWith('"') && arg.endsWith('"')) || 
              (arg.startsWith("'") && arg.endsWith("'"))) {
            return arg.slice(1, -1);
          }
          // Parse numbers
          if (!isNaN(arg)) {
            return Number(arg);
          }
          return arg;
        });
      }
      
      // Call the appropriate function
      switch(funcName) {
        case 'switchDeckFn':
          if (switchDeckFn) switchDeckFn(...args);
          break;
        case 'showMiniGameFn':
          if (showMiniGameFn) showMiniGameFn(...args);
          break;
        case 'addSkillFn':
          if (addSkillFn) addSkillFn(...args);
          break;
        case 'increaseStatsFn':
          if (increaseStatsFn) increaseStatsFn(...args);
          break;
        case 'showNotificationFn':
          if (showNotificationFn) showNotificationFn(...args);
          break;
        case 'nextCard':
          if (nextCardFn) nextCardFn();
          break;
      }
    });
  };
}

// Load CV data from JSON
export async function loadCVData() {
  try {
    const response = await fetch('data/cv-cards.json');
    const data = await response.json();
    
    // Process card decks
    cardDecks = data.cardDecks;
    
    // Convert string function references to actual functions
    Object.keys(cardDecks).forEach(deckName => {
      cardDecks[deckName].forEach(card => {
        if (card.leftResult && typeof card.leftResult === 'string') {
          card.leftResult = createFunctionFromString(card.leftResult);
        }
        if (card.rightResult && typeof card.rightResult === 'string') {
          card.rightResult = createFunctionFromString(card.rightResult);
        }
      });
    });
    
    // Process mini-games
    miniGames = data.miniGames;
    
    // Convert mini-game button results to functions
    Object.keys(miniGames).forEach(gameName => {
      if (miniGames[gameName].buttons) {
        miniGames[gameName].buttons.forEach(button => {
          if (button.result && typeof button.result === 'string') {
            button.result = createFunctionFromString(button.result);
          }
        });
      }
    });
    
    // Load personal cards
    personalCards = data.personalCards || [];
    
    console.log('CV data loaded successfully:', {
      decks: Object.keys(cardDecks).length,
      miniGames: Object.keys(miniGames).length,
      personalCards: personalCards.length
    });
    
    return true;
  } catch (error) {
    console.error('Failed to load CV data:', error);
    
    // Fallback to default data
    cardDecks = {
      main: [{
        type: "main",
        title: "CV Quest",
        text: "Failed to load CV data. Please refresh the page.",
        icon: "⚠️",
        imagePath: 'assets/img/professional/office-equipment.png',
        leftChoice: "Retry",
        rightChoice: "Continue Anyway",
        leftResult: () => window.location.reload(),
        rightResult: () => console.log("Continuing with default data")
      }]
    };
    
    return false;
  }
}