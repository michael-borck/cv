// Magazine Data Loader Module

export async function loadMagazineData() {
    try {
        const response = await fetch('data/magazine-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load magazine data: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading magazine data:', error);
        // Return fallback data if loading fails
        return getFallbackData();
    }
}

// Fallback data in case the JSON file can't be loaded
function getFallbackData() {
    return {
        metadata: {
            title: 'TechLife Magazine',
            subtitle: 'Special Edition',
            issue: 'Issue #2024',
            date: 'December 2024',
            author: 'Michael Borck',
            tagline: 'Innovation • Leadership • Technology'
        },
        hero: {
            title: 'The Michael Borck Story',
            subtitle: 'From Military Service to AI Innovation',
            lead: 'A journey through technology, education, and innovation',
            image: 'https://source.unsplash.com/1600x900/?technology,innovation',
            stats: [
                { value: '11+', label: 'Years Experience' },
                { value: '100%', label: 'Student Satisfaction' },
                { value: '4', label: 'Published Books' }
            ]
        },
        cover_story: {
            title: 'The Evolution of a Tech Leader',
            subtitle: 'From submarine systems to AI education',
            image: 'https://source.unsplash.com/800x1200/?artificial-intelligence',
            content: [
                {
                    type: 'intro',
                    text: 'A technologist whose career spans military service, academia, and cutting-edge AI innovation.'
                }
            ]
        },
        features: [],
        spotlight: { projects: [] },
        tech_stack: { categories: [] },
        timeline: { events: [] },
        testimonials: { quotes: [] },
        publications: { books: [] },
        contact: {
            email: 'michael.borck@curtin.edu.au',
            phone: '+61 (0) 400 000 000',
            linkedin: 'linkedin.com/in/michael-borck',
            github: 'github.com/michael-borck',
            location: 'Perth, WA, Australia'
        },
        sidebar: {
            quick_facts: [],
            achievements: []
        }
    };
}