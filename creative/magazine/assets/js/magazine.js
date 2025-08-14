// TechLife Magazine - Main JavaScript
import { loadMagazineData } from './dataLoader.js';
import { initAnimations } from './animations.js';
import { initInteractions } from './interactions.js';

// Global magazine data
let magazineData = null;

// Initialize the magazine
async function initMagazine() {
    try {
        // Show loading state
        showLoading();
        
        // Load magazine data
        magazineData = await loadMagazineData();
        
        // Populate content
        populateMetadata();
        populateHero();
        populateCoverStory();
        populateFeatures();
        populateProjects();
        populateTechStack();
        populateTimeline();
        populateTestimonials();
        populatePublications();
        populateContact();
        populateSidebar();
        
        // Initialize animations and interactions
        initAnimations();
        initInteractions();
        
        // Hide loading state
        hideLoading();
        
    } catch (error) {
        console.error('Error initializing magazine:', error);
        showError();
    }
}

// Show loading state
function showLoading() {
    // Add loading class to body
    document.body.classList.add('loading');
}

// Hide loading state
function hideLoading() {
    // Remove loading class
    document.body.classList.remove('loading');
    
    // Trigger entrance animations
    document.body.classList.add('loaded');
}

// Show error state
function showError() {
    document.body.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
            <div>
                <h1>Oops! Something went wrong.</h1>
                <p>Please refresh the page to try again.</p>
            </div>
        </div>
    `;
}

// Populate metadata
function populateMetadata() {
    const { metadata } = magazineData;
    
    // Update issue info
    const issueInfo = document.getElementById('issueInfo');
    if (issueInfo) {
        issueInfo.textContent = `${metadata.issue} • ${metadata.date}`;
    }
    
    // Update page title
    document.title = `${metadata.title} - ${metadata.subtitle}`;
}

// Populate hero section
function populateHero() {
    const { hero } = magazineData;
    
    // Set hero image
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        heroImage.style.backgroundImage = `url('${hero.image}')`;
    }
    
    // Set hero content
    setTextContent('heroTitle', hero.title);
    setTextContent('heroSubtitle', hero.subtitle);
    setTextContent('heroLead', hero.lead);
    
    // Create stats
    const heroStats = document.getElementById('heroStats');
    if (heroStats && hero.stats) {
        heroStats.innerHTML = hero.stats.map(stat => `
            <div class="stat-item">
                <span class="stat-value">${stat.value}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');
    }
}

// Populate cover story
function populateCoverStory() {
    const { cover_story } = magazineData;
    
    setTextContent('coverTitle', cover_story.title);
    setTextContent('coverSubtitle', cover_story.subtitle);
    
    // Set cover image
    const coverImage = document.getElementById('coverImage');
    if (coverImage) {
        coverImage.src = cover_story.image;
        coverImage.alt = cover_story.title;
    }
    
    // Build cover content
    const coverContent = document.getElementById('coverContent');
    if (coverContent && cover_story.content) {
        coverContent.innerHTML = cover_story.content.map(section => {
            if (section.type === 'intro') {
                return `<p class="story-intro">${section.text}</p>`;
            } else if (section.type === 'chapter') {
                return `
                    <div class="chapter">
                        <h3 class="chapter-title">${section.title}</h3>
                        <p class="chapter-text">${section.text}</p>
                        ${section.highlight ? `<div class="chapter-highlight">${section.highlight}</div>` : ''}
                    </div>
                `;
            }
            return '';
        }).join('');
    }
}

// Populate features
function populateFeatures() {
    const { features } = magazineData;
    const featuresGrid = document.getElementById('featuresGrid');
    
    if (featuresGrid && features) {
        featuresGrid.innerHTML = features.map((feature, index) => `
            <article class="feature-card observe-slide-up" style="animation-delay: ${index * 0.1}s">
                <img src="${feature.image}" alt="${feature.title}" class="feature-image">
                <div class="feature-content">
                    <span class="feature-category">${feature.category}</span>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p class="feature-subtitle">${feature.subtitle}</p>
                    <p class="feature-text">${feature.content}</p>
                    ${feature.highlights ? `
                        <ul class="feature-highlights">
                            ${feature.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </article>
        `).join('');
    }
}

// Populate projects
function populateProjects() {
    const { spotlight } = magazineData;
    const projectsCarousel = document.getElementById('projectsCarousel');
    
    if (projectsCarousel && spotlight && spotlight.projects) {
        projectsCarousel.innerHTML = spotlight.projects.map(project => `
            <div class="project-card hover-lift">
                <img src="${project.image}" alt="${project.name}" class="project-image">
                <div class="project-content">
                    <h3 class="project-name">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">${project.tech}</div>
                    <div class="project-impact">${project.impact}</div>
                </div>
            </div>
        `).join('');
    }
}

// Populate tech stack
function populateTechStack() {
    const { tech_stack } = magazineData;
    const techGrid = document.getElementById('techGrid');
    
    if (techGrid && tech_stack && tech_stack.categories) {
        techGrid.innerHTML = tech_stack.categories.map(category => `
            <div class="tech-category observe-scale">
                <div class="tech-icon">${category.icon}</div>
                <h3 class="tech-name">${category.name}</h3>
                <div class="tech-items">
                    ${category.items.map(item => `<span class="tech-item">${item}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Populate timeline
function populateTimeline() {
    const { timeline } = magazineData;
    const timelineWrapper = document.getElementById('timelineWrapper');
    
    if (timelineWrapper && timeline && timeline.events) {
        timelineWrapper.innerHTML = timeline.events.map((event, index) => `
            <div class="timeline-event observe-slide-${index % 2 === 0 ? 'left' : 'right'}">
                <div class="timeline-year">${event.year}</div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${event.title}</h3>
                    <div class="timeline-org">${event.organization}</div>
                    <p class="timeline-description">${event.description}</p>
                    <span class="timeline-type ${event.type}">${event.type}</span>
                </div>
            </div>
        `).join('');
    }
}

// Populate testimonials
function populateTestimonials() {
    const { testimonials } = magazineData;
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    
    if (testimonialsGrid && testimonials && testimonials.quotes) {
        testimonialsGrid.innerHTML = testimonials.quotes.map(quote => `
            <div class="testimonial-card fade-in-up">
                <p class="testimonial-text">${quote.text}</p>
                <div class="testimonial-author">${quote.author}</div>
                <div class="testimonial-course">${quote.course}</div>
            </div>
        `).join('');
    }
}

// Populate publications
function populatePublications() {
    const { publications } = magazineData;
    const booksShowcase = document.getElementById('booksShowcase');
    
    if (booksShowcase && publications && publications.books) {
        booksShowcase.innerHTML = `
            <div class="books-grid">
                ${publications.books.map(book => `
                    <div class="book-card hover-lift">
                        <img src="${book.image}" alt="${book.title}" class="book-cover">
                        <h3 class="book-title">${book.title}</h3>
                        <div class="book-year">${book.year}</div>
                        <div class="book-type">${book.type}</div>
                        <p class="book-description">${book.description}</p>
                    </div>
                `).join('')}
            </div>
            ${publications.research ? `
                <div class="research-note">
                    ${publications.research}
                </div>
            ` : ''}
        `;
    }
}

// Populate contact section
function populateContact() {
    const { contact } = magazineData;
    
    // Set contact image
    const contactImage = document.getElementById('contactImage');
    if (contactImage && contact.image) {
        contactImage.style.backgroundImage = `url('${contact.image}')`;
    }
    
    // Build contact info
    const contactInfo = document.getElementById('contactInfo');
    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="contact-item">
                <div class="contact-label">Email</div>
                <div class="contact-value">
                    <a href="mailto:${contact.email}">${contact.email}</a>
                </div>
            </div>
            <div class="contact-item">
                <div class="contact-label">Phone</div>
                <div class="contact-value">${contact.phone}</div>
            </div>
            <div class="contact-item">
                <div class="contact-label">LinkedIn</div>
                <div class="contact-value">
                    <a href="https://${contact.linkedin}" target="_blank">Profile</a>
                </div>
            </div>
            <div class="contact-item">
                <div class="contact-label">GitHub</div>
                <div class="contact-value">
                    <a href="https://${contact.github}" target="_blank">Repository</a>
                </div>
            </div>
            <div class="contact-item">
                <div class="contact-label">Location</div>
                <div class="contact-value">${contact.location}</div>
            </div>
        `;
    }
}

// Populate sidebar
function populateSidebar() {
    const { sidebar } = magazineData;
    
    // Quick facts
    const quickFacts = document.getElementById('quickFacts');
    if (quickFacts && sidebar && sidebar.quick_facts) {
        quickFacts.innerHTML = `
            <h3>Quick Facts</h3>
            ${sidebar.quick_facts.map(fact => `
                <div class="fact-item">
                    <span class="fact-label">${fact.label}</span>
                    <span class="fact-value">${fact.value}</span>
                </div>
            `).join('')}
        `;
    }
    
    // Achievements
    const achievements = document.getElementById('achievements');
    if (achievements && sidebar && sidebar.achievements) {
        achievements.innerHTML = `
            <h3>Achievements</h3>
            <ul>
                ${sidebar.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        `;
    }
}

// Helper function to set text content
function setTextContent(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMagazine);

// Export for debugging
window.magazineDebug = {
    getData: () => magazineData,
    reload: initMagazine
};