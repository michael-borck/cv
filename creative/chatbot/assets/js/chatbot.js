// Chatbot CV - Main Chat Interface

// Global variables
let conversationHistory = [];
let isTyping = false;
let knowledgeBase = {};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    showLoading(true);
    await loadKnowledgeBase();
    initializeChatInterface();
    showWelcomeMessage();
    showLoading(false);
});

// Load knowledge base from CV data
async function loadKnowledgeBase() {
    try {
        const response = await fetch('data/knowledge-base.json');
        if (response.ok) {
            knowledgeBase = await response.json();
        } else {
            throw new Error('Failed to load knowledge base');
        }
    } catch (error) {
        console.warn('Failed to load knowledge base, using fallback:', error);
        // Fallback knowledge base
        knowledgeBase = {
            profile: {
                name: "Michael Borck",
                title: "AI Leader & Cyber Security Expert",
                summary: "AI Leader and Cyber Security expert with 25+ years spanning military → academia → industry consulting transition."
            },
            experience: [],
            skills: {},
            education: [],
            projects: [],
            publications: [],
            achievements: []
        };
    }
}

// Initialize chat interface
function initializeChatInterface() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const suggestionsBtn = document.getElementById('suggestionsBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const charCount = document.getElementById('charCount');

    // Message input handling
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length}/500`;
        sendBtn.disabled = length === 0 || isTyping;
        
        // Enable/disable send button based on input
        if (length > 0 && !isTyping) {
            sendBtn.style.transform = 'scale(1)';
        } else {
            sendBtn.style.transform = 'scale(0.95)';
        }
    });

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                sendMessage();
            }
        }
    });

    // Send button
    sendBtn.addEventListener('click', sendMessage);

    // Clear chat
    clearChatBtn.addEventListener('click', clearConversation);

    // Suggestions panel
    suggestionsBtn.addEventListener('click', toggleSuggestions);

    // Download conversation
    downloadBtn.addEventListener('click', downloadConversation);

    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            document.getElementById('messageInput').value = query;
            sendMessage();
            hideSuggestions();
        });
    });

    // Quick actions
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        const suggestionsPanel = document.getElementById('suggestionsPanel');
        const suggestionsBtn = document.getElementById('suggestionsBtn');
        
        if (!suggestionsPanel.contains(e.target) && e.target !== suggestionsBtn) {
            hideSuggestions();
        }
    });
}

// Show welcome message
function showWelcomeMessage() {
    const welcomeMessage = {
        type: 'bot',
        content: `
            <div class="welcome-message">
                <h2>👋 Hi! I'm Michael Borck</h2>
                <p>Welcome to my interactive CV! I'm here to answer questions about my background, experience, skills, and achievements. Feel free to ask me anything about my work in AI, cybersecurity, education, or my journey from military service to academia.</p>
                <div class="message-links">
                    <a href="#" class="message-link" onclick="quickAsk('Tell me about your experience')">My Experience</a>
                    <a href="#" class="message-link" onclick="quickAsk('What programming languages do you know?')">Technical Skills</a>
                    <a href="#" class="message-link" onclick="quickAsk('What books have you written?')">Publications</a>
                    <a href="#" class="message-link" onclick="quickAsk('What\\'s your teaching philosophy?')">Teaching</a>
                </div>
            </div>
        `,
        timestamp: new Date()
    };
    
    displayMessage(welcomeMessage, false);
}

// Send message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;

    // Clear input
    messageInput.value = '';
    document.getElementById('charCount').textContent = '0/500';
    document.getElementById('sendBtn').disabled = true;

    // Add user message
    const userMessage = {
        type: 'user',
        content: message,
        timestamp: new Date()
    };
    
    displayMessage(userMessage);
    conversationHistory.push(userMessage);

    // Show typing indicator
    showTypingIndicator();

    // Get bot response
    const response = await generateResponse(message);
    
    hideTypingIndicator();

    // Add bot response
    const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date()
    };
    
    displayMessage(botMessage);
    conversationHistory.push(botMessage);
}

// Generate response using NLP and knowledge base
async function generateResponse(query) {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    try {
        // Use NLP to analyze the query
        const intent = analyzeIntent(query);
        const entities = extractEntities(query);
        
        // Generate response based on intent and entities
        return generateContextualResponse(intent, entities, query);
        
    } catch (error) {
        console.error('Error generating response:', error);
        return "I apologize, but I'm having trouble processing that question right now. Could you try rephrasing it or ask about my experience, skills, education, or projects?";
    }
}

// Display message in chat
function displayMessage(message, animate = true) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    
    if (animate) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
    }
    
    const avatar = message.type === 'user' ? 'U' : 'MB';
    const avatarColor = message.type === 'user' ? 'var(--text-secondary)' : 'var(--primary-color)';
    
    messageDiv.innerHTML = `
        <div class="message-avatar" style="background: ${avatarColor}">
            ${avatar}
        </div>
        <div class="message-content">
            <div class="message-bubble">
                ${message.content}
            </div>
            <div class="message-time">
                ${formatTime(message.timestamp)}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    if (animate) {
        // Trigger animation
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show/hide typing indicator
function showTypingIndicator() {
    isTyping = true;
    document.getElementById('typingIndicator').style.display = 'flex';
    document.getElementById('sendBtn').disabled = true;
}

function hideTypingIndicator() {
    isTyping = false;
    document.getElementById('typingIndicator').style.display = 'none';
    
    // Re-enable send button if there's text
    const messageInput = document.getElementById('messageInput');
    document.getElementById('sendBtn').disabled = messageInput.value.trim().length === 0;
}

// Quick ask function for welcome message links
function quickAsk(question) {
    document.getElementById('messageInput').value = question;
    sendMessage();
}

// Handle quick actions
function handleQuickAction(action) {
    const queries = {
        'experience': 'Tell me about your professional experience',
        'skills': 'What are your main technical skills?',
        'education': 'What is your educational background?',
        'contact': 'How can I contact you?'
    };
    
    if (queries[action]) {
        document.getElementById('messageInput').value = queries[action];
        sendMessage();
    }
}

// Suggestions panel
function toggleSuggestions() {
    const panel = document.getElementById('suggestionsPanel');
    panel.classList.toggle('active');
}

function hideSuggestions() {
    document.getElementById('suggestionsPanel').classList.remove('active');
}

// Clear conversation
function clearConversation() {
    if (confirm('Are you sure you want to clear the conversation?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        conversationHistory = [];
        showWelcomeMessage();
    }
}

// Download conversation
function downloadConversation() {
    if (conversationHistory.length === 0) {
        alert('No conversation to download!');
        return;
    }
    
    let content = `Conversation with Michael Borck - AI CV Chatbot\n`;
    content += `Downloaded: ${new Date().toLocaleString()}\n`;
    content += `${'='.repeat(50)}\n\n`;
    
    conversationHistory.forEach(message => {
        const sender = message.type === 'user' ? 'You' : 'Michael Borck';
        const time = formatTime(message.timestamp);
        const text = message.content.replace(/<[^>]*>/g, ''); // Strip HTML
        
        content += `[${time}] ${sender}:\n${text}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `michael-borck-cv-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Conversation downloaded successfully!', 'success');
}

// Utility functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// CSS for notifications
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close suggestions
    if (e.key === 'Escape') {
        hideSuggestions();
    }
    
    // Ctrl/Cmd + / to show suggestions
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleSuggestions();
    }
    
    // Ctrl/Cmd + K to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearConversation();
    }
});