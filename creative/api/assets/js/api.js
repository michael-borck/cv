// API Documentation Interactive Features

// Mock API responses (loaded from CV data)
let apiData = {};
let authToken = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    await loadApiData();
    initializeInteractions();
    initializeNavigation();
});

// Load CV data as API responses
async function loadApiData() {
    try {
        // Load actual API data from generated file
        const response = await fetch('data/api-responses.json');
        if (response.ok) {
            apiData = await response.json();
            return;
        } else {
            throw new Error('Failed to load API data');
        }
    } catch (error) {
        console.warn('Failed to load generated API data, using fallback:', error);
        // Fallback data structure
        apiData = {
            profile: {
                "id": "michael-borck",
                "name": "Michael Borck",
                "title": "AI Leader & Cyber Security Expert",
                "email": "michael.borck@curtin.edu.au",
                "phone": "+61 (0) 400 000 000",
                "location": "Perth, WA, Australia",
                "linkedin": "https://linkedin.com/in/michael-borck",
                "github": "https://github.com/michael-borck",
                "summary": "AI Leader and Cyber Security expert with 25+ years spanning military → academia → industry consulting transition. Author of 4 technical books, creator of innovative educational AI tools, and pioneer in AI-enhanced pedagogy.",
                "tagline": "Make Contact Count",
                "years_experience": 25,
                "books_published": 4,
                "teaching_philosophy": ["Caring", "Competence", "Passion"]
            },
            experience: [
                {
                    "id": "curtin-university",
                    "organization": "Curtin University",
                    "position": "Senior Lecturer",
                    "type": "academic",
                    "start_date": "2018-01-01",
                    "end_date": null,
                    "duration": "6+ years",
                    "location": "Perth, WA",
                    "description": "Leading AI education and research initiatives",
                    "key_responsibilities": [
                        "Technical Lead for Business AI Research Group",
                        "Pioneer in AI-enhanced pedagogy",
                        "Creator of interactive educational tools",
                        "Development of assessment frameworks"
                    ],
                    "achievements": [
                        "100% student satisfaction rating",
                        "Published 4 technical books",
                        "Created innovative AI teaching tools",
                        "Led research in educational technology"
                    ]
                },
                {
                    "id": "australian-navy",
                    "organization": "Royal Australian Navy",
                    "position": "Electronics Technician",
                    "type": "military",
                    "start_date": "1998-01-01",
                    "end_date": "2010-12-31",
                    "duration": "12 years",
                    "location": "Various locations",
                    "description": "Submarine electronics and combat systems specialist",
                    "key_responsibilities": [
                        "Maintenance of submarine electronics systems",
                        "Combat systems operation and support",
                        "Training and mentoring junior technicians",
                        "Technical documentation and procedures"
                    ],
                    "security_clearance": "Top Secret",
                    "specializations": ["Submarine Electronics", "Combat Systems", "Naval Communications"]
                }
            ],
            skills: {
                "programming": {
                    "languages": ["Python", "C/C++", "JavaScript", "Java", "C#", "Matlab", "PHP", "CSS", "HTML", "LaTeX", "SQL", "Bash"],
                    "frameworks": ["React", "Flask", "FastAPI", "FastHTML", "Vanilla JS", "WordPress"],
                    "specializations": ["AI/ML", "Web Development", "Data Analysis", "System Programming"]
                },
                "technologies": {
                    "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy"],
                    "databases": ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
                    "cloud": ["AWS", "Azure", "Google Cloud"],
                    "tools": ["Git", "Docker", "Linux", "Jupyter", "VS Code"]
                },
                "domain_expertise": [
                    "Artificial Intelligence",
                    "Machine Learning",
                    "Cybersecurity",
                    "Educational Technology",
                    "Research Methodology",
                    "Technical Writing"
                ]
            },
            education: [
                {
                    "degree": "Master of Science in Information Technology",
                    "institution": "Curtin University",
                    "year": "2016",
                    "focus": "Cybersecurity and AI"
                },
                {
                    "degree": "Bachelor of Science in Computer Science", 
                    "institution": "Edith Cowan University",
                    "year": "2014",
                    "focus": "Software Engineering"
                }
            ],
            projects: [
                {
                    "name": "AI-Enhanced Learning Platform",
                    "description": "Interactive educational platform using AI for personalized learning",
                    "technologies": ["Python", "Flask", "TensorFlow", "React"],
                    "status": "active",
                    "impact": "Improved student engagement by 40%"
                },
                {
                    "name": "Cybersecurity Assessment Framework",
                    "description": "Automated security assessment tool for educational institutions",
                    "technologies": ["Python", "FastAPI", "PostgreSQL"],
                    "status": "deployed",
                    "impact": "Used by 5+ universities"
                }
            ],
            publications: [
                {
                    "title": "AI in Education: A Practical Guide",
                    "type": "Book",
                    "year": "2023",
                    "publisher": "Creative Commons",
                    "description": "Comprehensive guide to implementing AI in educational settings"
                },
                {
                    "title": "Cybersecurity Fundamentals",
                    "type": "Book", 
                    "year": "2022",
                    "publisher": "Creative Commons",
                    "description": "Essential cybersecurity concepts for modern organizations"
                }
            ],
            achievements: [
                "100% Student Satisfaction Rating",
                "4 Published Technical Books",
                "Technical Lead - Business AI Research Group",
                "Pioneer in AI-Enhanced Pedagogy",
                "12 Years Military Service - Top Secret Clearance"
            ]
        };
    }
}

// Initialize interactive features
function initializeInteractions() {
    // Endpoint toggles
    document.querySelectorAll('.endpoint-header').forEach(header => {
        header.addEventListener('click', function() {
            const contentId = this.getAttribute('data-toggle');
            const content = document.getElementById(contentId);
            const icon = this.querySelector('.toggle-icon');
            
            if (content.classList.contains('active')) {
                content.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                icon.textContent = '▼';
            } else {
                content.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                icon.textContent = '▲';
            }
        });
    });

    // Authorization modal
    document.getElementById('authorizeBtn').addEventListener('click', showAuthModal);
    document.getElementById('downloadSpecBtn').addEventListener('click', downloadSpec);
}

// Navigation smooth scrolling
function initializeNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

// Update active navigation based on scroll position
function updateActiveNav() {
    const sections = document.querySelectorAll('.endpoint-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Show try section with parameters
function showTrySection(endpoint) {
    const tryPanel = document.getElementById(`${endpoint}-try`);
    if (tryPanel) {
        tryPanel.style.display = 'block';
    }
}

// Clear try section
function clearTrySection(endpoint) {
    const tryPanel = document.getElementById(`${endpoint}-try`);
    if (tryPanel) {
        // Clear all inputs
        const inputs = tryPanel.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
                input.value = '';
            } else if (input.type === 'select-one') {
                input.selectedIndex = 0;
            }
        });
    }
    
    // Also hide result if visible
    const resultContainer = document.getElementById(`${endpoint}-result`);
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
}

// Close result panel
function closeResult(resultId) {
    const resultContainer = document.getElementById(resultId);
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
}

// Execute endpoint with parameters
function executeEndpoint(endpoint) {
    const resultContainer = document.getElementById(`${endpoint}-result`);
    const responseContainer = document.getElementById(`${endpoint}-response`);
    
    // Show loading
    resultContainer.style.display = 'block';
    responseContainer.innerHTML = '<div class="loading"></div>';
    
    // Get parameters
    const params = getEndpointParameters(endpoint);
    
    // Simulate API call delay
    setTimeout(() => {
        let response = {};
        
        switch (endpoint) {
            case 'profile':
                response = apiData.profile;
                break;
            case 'experience':
                response = filterExperience(params);
                break;
            case 'experience-id':
                response = getExperienceById(params.id);
                break;
            case 'skills':
                response = filterSkills(params);
                break;
            case 'contact':
                response = {
                    status: "success",
                    message: "Message sent successfully",
                    id: "msg_" + Date.now(),
                    timestamp: new Date().toISOString(),
                    data: {
                        name: params.name,
                        email: params.email,
                        subject: params.subject,
                        message: params.message
                    }
                };
                
                // Update status for POST
                const statusElement = resultContainer.querySelector('.result-status');
                statusElement.textContent = '201 Created';
                statusElement.style.color = 'var(--green-color)';
                break;
            default:
                response = { error: "Endpoint not found" };
        }
        
        // Format and display response
        const formattedResponse = formatJsonResponse(response);
        responseContainer.innerHTML = formattedResponse;
        
    }, 800 + Math.random() * 1000); // Random delay between 800-1800ms
}

// Get parameters from form inputs
function getEndpointParameters(endpoint) {
    const params = {};
    
    switch (endpoint) {
        case 'experience':
            const typeSelect = document.getElementById('experience-type');
            const limitSelect = document.getElementById('experience-limit');
            if (typeSelect && typeSelect.value) params.type = typeSelect.value;
            if (limitSelect && limitSelect.value) params.limit = parseInt(limitSelect.value);
            break;
            
        case 'experience-id':
            const idSelect = document.getElementById('experience-id-param');
            if (idSelect && idSelect.value) params.id = idSelect.value;
            break;
            
        case 'skills':
            const categorySelect = document.getElementById('skills-category');
            if (categorySelect && categorySelect.value) params.category = categorySelect.value;
            break;
            
        case 'contact':
            params.name = document.getElementById('contact-name')?.value || '';
            params.email = document.getElementById('contact-email')?.value || '';
            params.subject = document.getElementById('contact-subject')?.value || '';
            params.message = document.getElementById('contact-message')?.value || '';
            break;
    }
    
    return params;
}

// Filter experience by parameters
function filterExperience(params) {
    let filteredData = [...apiData.experience];
    
    if (params.type) {
        filteredData = filteredData.filter(exp => exp.type === params.type);
    }
    
    if (params.limit) {
        filteredData = filteredData.slice(0, params.limit);
    }
    
    return {
        total: filteredData.length,
        filters_applied: params,
        data: filteredData
    };
}

// Get experience by ID
function getExperienceById(id) {
    const experience = apiData.experience.find(exp => exp.id === id);
    if (experience) {
        return experience;
    } else {
        return { 
            error: "Experience not found",
            message: `No experience record found with ID: ${id}`,
            available_ids: apiData.experience.map(exp => exp.id)
        };
    }
}

// Filter skills by category
function filterSkills(params) {
    if (params.category) {
        const categoryData = apiData.skills[params.category];
        if (categoryData) {
            return {
                category: params.category,
                data: categoryData
            };
        } else {
            return {
                error: "Category not found",
                message: `No skills found for category: ${params.category}`,
                available_categories: Object.keys(apiData.skills)
            };
        }
    }
    
    return apiData.skills;
}

// Format JSON response with syntax highlighting
function formatJsonResponse(data) {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Basic syntax highlighting
    return jsonString
        .replace(/(".*?")(\s*:)/g, '<span class="key">$1</span>$2')
        .replace(/:\s*(".*?")/g, ': <span class="string">$1</span>')
        .replace(/:\s*(true|false)/g, ': <span class="boolean">$1</span>')
        .replace(/:\s*(null)/g, ': <span class="null">$1</span>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <span class="number">$1</span>');
}

// Authorization modal functions
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function setAuthToken() {
    const token = document.getElementById('bearerToken').value;
    if (token) {
        authToken = token;
        closeAuthModal();
        
        // Update UI to show authenticated state
        const authBtn = document.getElementById('authorizeBtn');
        authBtn.innerHTML = '🔓 Authorized';
        authBtn.style.background = 'var(--green-color)';
        
        // Show success message
        showNotification('Authorization successful! Token has been set.', 'success');
    }
}

// Download OpenAPI spec
function downloadSpec() {
    const spec = {
        openapi: "3.0.0",
        info: {
            title: "Michael Borck API",
            version: "1.0.0",
            description: "Professional REST API for exploring Michael Borck's career profile, skills, and experience"
        },
        servers: [
            {
                url: "https://api.michael-borck.dev/v1",
                description: "Production API"
            }
        ],
        paths: {
            "/profile": {
                "get": {
                    "summary": "Get basic profile information",
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": { "$ref": "#/components/schemas/Profile" }
                                }
                            }
                        }
                    }
                }
            },
            "/experience": {
                "get": {
                    "summary": "Get all work experience", 
                    "parameters": [
                        {
                            "name": "type",
                            "in": "query",
                            "schema": { "type": "string" },
                            "description": "Filter by experience type"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": { "$ref": "#/components/schemas/ExperienceList" }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                Profile: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        title: { type: "string" },
                        email: { type: "string" },
                        location: { type: "string" }
                    }
                },
                ExperienceList: {
                    type: "object", 
                    properties: {
                        total: { type: "integer" },
                        data: {
                            type: "array",
                            items: { "$ref": "#/components/schemas/Experience" }
                        }
                    }
                },
                Experience: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        organization: { type: "string" },
                        position: { type: "string" },
                        type: { type: "string" },
                        start_date: { type: "string" },
                        end_date: { type: "string" }
                    }
                }
            }
        }
    };
    
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'michael-borck-api-spec.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('OpenAPI specification downloaded successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--green-color)' : 'var(--blue-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        z-index: 1001;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('authModal');
    if (e.target === modal) {
        closeAuthModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAuthModal();
    }
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        showAuthModal();
    }
});