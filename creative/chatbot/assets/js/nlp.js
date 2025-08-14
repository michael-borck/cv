// NLP Engine - Keyword Matching and Intent Analysis

// Intent patterns and keywords
const intentPatterns = {
    experience: {
        keywords: ['experience', 'work', 'job', 'career', 'employment', 'position', 'role', 'background', 'history', 'professional'],
        patterns: [
            /tell me about your (work|job|career|experience)/i,
            /what.*(experience|work|job)/i,
            /where (have you|did you) work/i,
            /what.*(do you do|is your job)/i
        ]
    },
    
    skills: {
        keywords: ['skill', 'technology', 'programming', 'language', 'framework', 'tool', 'expertise', 'technical', 'abilities'],
        patterns: [
            /what.*(skill|programming|language|technology)/i,
            /what can you (do|program)/i,
            /tell me about your (skill|expertise|technical)/i,
            /what.*(framework|tool|technology)/i
        ]
    },
    
    education: {
        keywords: ['education', 'degree', 'university', 'college', 'study', 'qualification', 'academic', 'school', 'learning'],
        patterns: [
            /what.*(education|degree|qualification)/i,
            /where did you (study|go to school|get your degree)/i,
            /tell me about your (education|academic)/i,
            /what.*(university|college)/i
        ]
    },
    
    military: {
        keywords: ['military', 'army', 'navy', 'service', 'defense', 'submarine', 'combat', 'security clearance'],
        patterns: [
            /tell me about your (military|navy|service)/i,
            /what.*(military|navy|defense)/i,
            /submarine/i,
            /security clearance/i
        ]
    },
    
    teaching: {
        keywords: ['teach', 'teaching', 'student', 'education', 'pedagogy', 'philosophy', 'classroom', 'course', 'unit'],
        patterns: [
            /what.*(teach|teaching)/i,
            /tell me about your (teaching|philosophy)/i,
            /what.*(course|unit|class)/i,
            /how do you (teach|engage)/i
        ]
    },
    
    projects: {
        keywords: ['project', 'work', 'build', 'create', 'develop', 'portfolio', 'recent'],
        patterns: [
            /what.*(project|work|build)/i,
            /tell me about your (project|work)/i,
            /what have you (built|created|developed)/i,
            /show me your (portfolio|work)/i
        ]
    },
    
    publications: {
        keywords: ['book', 'publication', 'write', 'author', 'publish', 'research', 'paper', 'article'],
        patterns: [
            /what.*(book|publication|write)/i,
            /have you (written|published)/i,
            /tell me about your (book|publication|research)/i,
            /what.*(research|paper)/i
        ]
    },
    
    achievements: {
        keywords: ['achievement', 'award', 'recognition', 'accomplishment', 'success', 'proud'],
        patterns: [
            /what.*(achievement|award|accomplishment)/i,
            /what are you (proud|successful)/i,
            /tell me about your (achievement|success)/i,
            /any (award|recognition)/i
        ]
    },
    
    contact: {
        keywords: ['contact', 'email', 'phone', 'reach', 'connect', 'linkedin', 'github', 'location'],
        patterns: [
            /how.*(contact|reach|connect)/i,
            /what.*(email|phone|linkedin)/i,
            /where.*(located|live)/i,
            /how can i (contact|reach)/i
        ]
    },
    
    consulting: {
        keywords: ['consulting', 'consultant', 'hire', 'available', 'work together', 'collaboration', 'services'],
        patterns: [
            /do you (consult|consulting)/i,
            /are you (available|hire)/i,
            /can we (work together|collaborate)/i,
            /what.*(service|consulting)/i
        ]
    },
    
    ai: {
        keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network'],
        patterns: [
            /tell me about.*(ai|artificial intelligence)/i,
            /what.*(ai|machine learning|ml)/i,
            /artificial intelligence/i,
            /machine learning/i
        ]
    },
    
    cybersecurity: {
        keywords: ['cyber', 'cybersecurity', 'security', 'information security', 'cyber security'],
        patterns: [
            /tell me about.*(cyber|security)/i,
            /what.*(cybersecurity|cyber security)/i,
            /information security/i,
            /security/i
        ]
    }
};

// Entity extraction patterns
const entityPatterns = {
    programming_languages: [
        'python', 'javascript', 'java', 'c++', 'c#', 'matlab', 'php', 'sql', 'html', 'css', 'bash'
    ],
    technologies: [
        'tensorflow', 'pytorch', 'react', 'flask', 'fastapi', 'docker', 'aws', 'azure', 'linux'
    ],
    organizations: [
        'curtin university', 'royal australian navy', 'navy', 'military'
    ],
    topics: [
        'books', 'research', 'teaching', 'students', 'philosophy'
    ]
};

// Common question patterns
const questionTypes = {
    what: /^what.*/i,
    how: /^how.*/i,
    where: /^where.*/i,
    when: /^when.*/i,
    why: /^why.*/i,
    who: /^who.*/i,
    tell: /^tell me.*/i,
    describe: /^describe.*/i,
    explain: /^explain.*/i,
    list: /^list.*/i,
    show: /^show.*/i
};

// Analyze user intent
function analyzeIntent(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check for exact pattern matches first
    for (const [intent, config] of Object.entries(intentPatterns)) {
        for (const pattern of config.patterns) {
            if (pattern.test(normalizedQuery)) {
                return {
                    intent: intent,
                    confidence: 0.9,
                    method: 'pattern'
                };
            }
        }
    }
    
    // Check for keyword matches
    let bestMatch = { intent: 'unknown', confidence: 0, method: 'keyword' };
    
    for (const [intent, config] of Object.entries(intentPatterns)) {
        let score = 0;
        let matches = 0;
        
        for (const keyword of config.keywords) {
            if (normalizedQuery.includes(keyword)) {
                matches++;
                // Boost score for exact word matches
                const wordBoundaryRegex = new RegExp(`\\b${keyword}\\b`, 'i');
                if (wordBoundaryRegex.test(normalizedQuery)) {
                    score += 2;
                } else {
                    score += 1;
                }
            }
        }
        
        // Calculate confidence based on matches and query length
        const confidence = Math.min(score / Math.max(normalizedQuery.split(' ').length * 0.3, 1), 1);
        
        if (confidence > bestMatch.confidence) {
            bestMatch = {
                intent: intent,
                confidence: confidence,
                method: 'keyword',
                matches: matches
            };
        }
    }
    
    // If confidence is too low, mark as unknown
    if (bestMatch.confidence < 0.3) {
        bestMatch.intent = 'unknown';
    }
    
    return bestMatch;
}

// Extract entities from query
function extractEntities(query) {
    const normalizedQuery = query.toLowerCase();
    const entities = {};
    
    for (const [entityType, items] of Object.entries(entityPatterns)) {
        const found = [];
        
        for (const item of items) {
            if (normalizedQuery.includes(item)) {
                found.push(item);
            }
        }
        
        if (found.length > 0) {
            entities[entityType] = found;
        }
    }
    
    return entities;
}

// Determine question type
function getQuestionType(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    for (const [type, pattern] of Object.entries(questionTypes)) {
        if (pattern.test(normalizedQuery)) {
            return type;
        }
    }
    
    return 'statement';
}

// Calculate semantic similarity (simple version)
function calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(' ').filter(w => w.length > 2);
    const words2 = text2.toLowerCase().split(' ').filter(w => w.length > 2);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
}

// Check for greeting patterns
function isGreeting(query) {
    const greetingPatterns = [
        /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
        /^(greetings|salutations)/i
    ];
    
    return greetingPatterns.some(pattern => pattern.test(query.trim()));
}

// Check for goodbye patterns
function isGoodbye(query) {
    const goodbyePatterns = [
        /^(bye|goodbye|see you|farewell|thanks|thank you|cheers)/i,
        /^(have a good|take care|until next time)/i
    ];
    
    return goodbyePatterns.some(pattern => pattern.test(query.trim()));
}

// Check for help requests
function isHelpRequest(query) {
    const helpPatterns = [
        /^(help|what can you|what do you|how does this work)/i,
        /^(show me|guide me|assist me)/i
    ];
    
    return helpPatterns.some(pattern => pattern.test(query.trim()));
}

// Main analysis function
function analyzeQuery(query) {
    return {
        intent: analyzeIntent(query),
        entities: extractEntities(query),
        questionType: getQuestionType(query),
        isGreeting: isGreeting(query),
        isGoodbye: isGoodbye(query),
        isHelp: isHelpRequest(query),
        originalQuery: query,
        normalizedQuery: query.toLowerCase().trim()
    };
}