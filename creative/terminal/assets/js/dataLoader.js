// Terminal CV - Data Loader Module

export async function loadGameData() {
    try {
        const response = await fetch('data/terminal-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load game data: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading game data:', error);
        // Return fallback data if loading fails
        return getFallbackData();
    }
}

// Fallback data in case the JSON file can't be loaded
function getFallbackData() {
    return {
        rooms: {
            lobby: {
                name: 'Career Lobby',
                description: 'You stand in the grand lobby. Type "help" for commands.',
                exits: {},
                items: []
            }
        },
        items: {},
        skills: {
            programming: ['JavaScript', 'Python', 'TypeScript'],
            soft_skills: ['Problem Solving', 'Leadership']
        },
        achievements: [],
        commands: {
            help: 'Show available commands',
            look: 'Look around the current room',
            quit: 'Exit the terminal'
        },
        personal: {
            name: 'Michael Borck',
            email: 'michael.borck@curtin.edu.au',
            phone: '+61 (0) 400 000 000',
            linkedin: 'linkedin.com/in/michael-borck',
            github: 'github.com/michael-borck',
            location: 'Perth, WA, Australia'
        },
        experience: [],
        projects: []
    };
}