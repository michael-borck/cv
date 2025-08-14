// Game State Management
// Encapsulates game state and provides methods to modify it

export class GameState {
  constructor() {
    this.state = {
      currentDeck: 'main',
      cardsLeft: 20,
      skills: 0,
      experience: 0,
      achievements: 0,
      skillsInventory: [],
      currentCardIndex: 0,
      previousDeck: null, // Track previous deck for returning from mini-games
    };
  }
  
  // Reset game state
  reset() {
    this.state.currentDeck = 'main';
    this.state.cardsLeft = 20;
    this.state.skills = 0;
    this.state.experience = 0;
    this.state.achievements = 0;
    this.state.skillsInventory = [];
    this.state.currentCardIndex = 0;
    this.state.previousDeck = null;
  }
  
  // Getters
  getCurrentDeck() { return this.state.currentDeck; }
  getCardsLeft() { return this.state.cardsLeft; }
  getSkills() { return this.state.skills; }
  getExperience() { return this.state.experience; }
  getAchievements() { return this.state.achievements; }
  getSkillsInventory() { return [...this.state.skillsInventory]; } // Return a copy
  getCurrentCardIndex() { return this.state.currentCardIndex; }
  getPreviousDeck() { return this.state.previousDeck; }
  
  // Setters
  setCurrentDeck(deck) { this.state.currentDeck = deck; }
  setCurrentCardIndex(index) { this.state.currentCardIndex = index; }
  setPreviousDeck(deck) { this.state.previousDeck = deck; }
  
  // Decrement cards left
  decrementCardsLeft() { 
    this.state.cardsLeft--; 
    return this.state.cardsLeft;
  }
  
  // Add skill
  addSkill(skill) {
    if (!this.state.skillsInventory.includes(skill)) {
      this.state.skillsInventory.push(skill);
      return true; // Skill was added
    }
    return false; // Skill was already in inventory
  }
  
  // Increase stats
  increaseStats(skillInc, expInc, achieveInc) {
    this.state.skills += skillInc;
    this.state.experience += expInc;
    this.state.achievements += achieveInc;
  }
  
  // Check if game should end (0 cards left and in main deck)
  shouldEndGame() {
    return this.state.cardsLeft <= 0 && this.state.currentDeck === 'main';
  }
  
  // Get full stats for game over screen
  getFinalStats() {
    return {
      skills: this.state.skills,
      experience: this.state.experience,
      achievements: this.state.achievements
    };
  }
}

// Export a singleton instance
export const gameState = new GameState();