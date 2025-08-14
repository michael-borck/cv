// Floating Chat Widget - Embeddable Component
// Can be included on any page for universal CV chat access

class FloatingChatWidget {
    constructor(options = {}) {
        this.options = {
            position: 'bottom-right',
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            apiEndpoint: options.apiEndpoint || '/creative/chatbot/',
            ...options
        };
        
        this.isOpen = false;
        this.isMinimized = false;
        this.conversationHistory = [];
        this.knowledgeBase = {};
        this.currentContext = this.detectPageContext();
        
        this.init();
    }
    
    async init() {
        await this.loadKnowledgeBase();
        this.createWidget();
        this.attachEventListeners();
        this.setupKeyboardShortcuts();
    }
    
    // Detect what page/section user is currently viewing
    detectPageContext() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (path.includes('/api/')) return 'api';
        if (path.includes('/magazine/')) return 'magazine';
        if (path.includes('/quest/')) return 'quest';
        if (path.includes('/terminal/')) return 'terminal';
        if (path.includes('cv-michael-borck.html')) return 'traditional';
        if (path.includes('slides')) return 'presentation';
        if (hash) return `section-${hash.substring(1)}`;
        
        return 'portfolio';
    }
    
    async loadKnowledgeBase() {
        try {
            const response = await fetch(`${this.options.apiEndpoint}data/knowledge-base.json`);
            if (response.ok) {
                this.knowledgeBase = await response.json();
            }
        } catch (error) {
            console.warn('Failed to load chat knowledge base:', error);
            this.knowledgeBase = this.getFallbackKnowledge();
        }
    }
    
    getFallbackKnowledge() {
        return {
            profile: {
                name: "Michael Borck",
                title: "AI Leader & Cyber Security Expert"
            }
        };
    }
    
    createWidget() {
        // Create widget container
        this.widget = document.createElement('div');
        this.widget.className = 'floating-chat-widget';
        this.widget.innerHTML = this.getWidgetHTML();
        
        // Add styles
        this.addWidgetStyles();
        
        // Append to body
        document.body.appendChild(this.widget);
        
        // Initialize components
        this.chatPanel = this.widget.querySelector('.chat-panel');
        this.chatButton = this.widget.querySelector('.chat-button');
        this.messagesContainer = this.widget.querySelector('.chat-messages');
        this.inputField = this.widget.querySelector('.chat-input');
        this.sendButton = this.widget.querySelector('.send-button');
        this.suggestionsDropdown = this.widget.querySelector('.suggestions-dropdown');
        
        // Show welcome message
        this.addWelcomeMessage();
    }
    
    getWidgetHTML() {
        return `
            <!-- Floating Button -->
            <div class="chat-button" title="Chat with Michael">
                <div class="chat-icon">💬</div>
                <div class="notification-dot" style="display: none;"></div>
            </div>
            
            <!-- Chat Panel -->
            <div class="chat-panel" style="display: none;">
                <!-- Header -->
                <div class="chat-header">
                    <div class="profile-info">
                        <div class="avatar">MB</div>
                        <div class="details">
                            <div class="name">Michael Borck</div>
                            <div class="status">AI Expert • Online</div>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="header-btn suggestions-btn" title="Show suggestions">
                            💡
                        </button>
                        <button class="header-btn minimize-btn" title="Minimize">
                            ➖
                        </button>
                        <button class="header-btn close-btn" title="Close">
                            ✕
                        </button>
                    </div>
                </div>
                
                <!-- Messages Area -->
                <div class="chat-messages"></div>
                
                <!-- Suggestions Dropdown -->
                <div class="suggestions-dropdown" style="display: none;">
                    <div class="suggestions-section">
                        <div class="section-title">💼 Experience & Background</div>
                        <div class="suggestion-chips">
                            <button class="suggestion-chip" data-query="Tell me about your experience">Experience</button>
                            <button class="suggestion-chip" data-query="What's your military background?">Military</button>
                            <button class="suggestion-chip" data-query="What do you teach?">Teaching</button>
                        </div>
                    </div>
                    <div class="suggestions-section">
                        <div class="section-title">⚡ Skills & Expertise</div>
                        <div class="suggestion-chips">
                            <button class="suggestion-chip" data-query="What programming languages do you know?">Programming</button>
                            <button class="suggestion-chip" data-query="Tell me about your AI expertise">AI & ML</button>
                            <button class="suggestion-chip" data-query="What's your cybersecurity experience?">Cybersecurity</button>
                        </div>
                    </div>
                    <div class="suggestions-section">
                        <div class="section-title">📚 Projects & Publications</div>
                        <div class="suggestion-chips">
                            <button class="suggestion-chip" data-query="What books have you written?">Books</button>
                            <button class="suggestion-chip" data-query="Tell me about your projects">Projects</button>
                            <button class="suggestion-chip" data-query="What are your achievements?">Achievements</button>
                        </div>
                    </div>
                    <div class="suggestions-section">
                        <div class="section-title">📞 Contact & More</div>
                        <div class="suggestion-chips">
                            <button class="suggestion-chip" data-query="How can I contact you?">Contact</button>
                            <button class="suggestion-chip" data-query="Do you do consulting?">Consulting</button>
                            <button class="suggestion-chip" data-query="What's your teaching philosophy?">Philosophy</button>
                        </div>
                    </div>
                </div>
                
                <!-- Typing Indicator -->
                <div class="typing-indicator" style="display: none;">
                    <div class="typing-avatar">MB</div>
                    <div class="typing-bubbles">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <!-- Input Area -->
                <div class="chat-input-area">
                    <div class="input-container">
                        <input type="text" class="chat-input" placeholder="Ask me anything..." maxlength="500">
                        <button class="send-button" disabled>
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="quick-actions">
                        <button class="quick-action" data-query="Tell me about your experience">💼</button>
                        <button class="quick-action" data-query="What skills do you have?">⚡</button>
                        <button class="quick-action" data-query="How can I contact you?">📧</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    addWidgetStyles() {
        if (document.getElementById('floating-chat-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'floating-chat-styles';
        styles.textContent = `
            .floating-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            /* Floating Button */
            .chat-button {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, ${this.options.primaryColor}, ${this.options.secondaryColor});
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            
            .chat-button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(0,0,0,0.2);
            }
            
            .chat-button:active {
                transform: scale(0.95);
            }
            
            .chat-icon {
                font-size: 24px;
                transition: transform 0.3s ease;
            }
            
            .chat-button.open .chat-icon {
                transform: rotate(180deg);
            }
            
            .notification-dot {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 12px;
                height: 12px;
                background: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            /* Chat Panel */
            .chat-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 520px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .chat-panel.open {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            
            .chat-panel.minimized {
                height: 60px;
                overflow: hidden;
            }
            
            /* Header */
            .chat-header {
                background: linear-gradient(135deg, ${this.options.primaryColor}, ${this.options.secondaryColor});
                color: white;
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .profile-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .avatar {
                width: 36px;
                height: 36px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 14px;
            }
            
            .details .name {
                font-weight: 600;
                font-size: 16px;
            }
            
            .details .status {
                font-size: 12px;
                opacity: 0.9;
            }
            
            .header-actions {
                display: flex;
                gap: 8px;
            }
            
            .header-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s ease;
            }
            
            .header-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            /* Messages */
            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                scroll-behavior: smooth;
            }
            
            .chat-messages::-webkit-scrollbar {
                width: 4px;
            }
            
            .chat-messages::-webkit-scrollbar-thumb {
                background: #e5e7eb;
                border-radius: 2px;
            }
            
            .message {
                margin-bottom: 16px;
                display: flex;
                gap: 8px;
                animation: messageSlide 0.3s ease;
            }
            
            .message.user {
                flex-direction: row-reverse;
            }
            
            .message-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: ${this.options.primaryColor};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
                flex-shrink: 0;
            }
            
            .message.user .message-avatar {
                background: #6b7280;
            }
            
            .message-bubble {
                max-width: 75%;
                padding: 10px 14px;
                border-radius: 16px;
                line-height: 1.4;
                font-size: 14px;
            }
            
            .message.bot .message-bubble {
                background: #f3f4f6;
                color: #374151;
                border-bottom-left-radius: 4px;
            }
            
            .message.user .message-bubble {
                background: ${this.options.primaryColor};
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Welcome Message */
            .welcome-message {
                background: linear-gradient(135deg, ${this.options.primaryColor}, ${this.options.secondaryColor});
                color: white;
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 16px;
                text-align: center;
            }
            
            .welcome-message h3 {
                font-size: 16px;
                margin-bottom: 8px;
            }
            
            .welcome-message p {
                font-size: 13px;
                opacity: 0.9;
                line-height: 1.4;
            }
            
            /* Suggestions Dropdown */
            .suggestions-dropdown {
                background: white;
                border-top: 1px solid #e5e7eb;
                max-height: 200px;
                overflow-y: auto;
                padding: 12px;
            }
            
            .suggestions-section {
                margin-bottom: 12px;
            }
            
            .section-title {
                font-size: 12px;
                font-weight: 600;
                color: #6b7280;
                margin-bottom: 8px;
            }
            
            .suggestion-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .suggestion-chip {
                background: #f3f4f6;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 6px 10px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .suggestion-chip:hover {
                background: ${this.options.primaryColor};
                color: white;
                border-color: ${this.options.primaryColor};
            }
            
            /* Typing Indicator */
            .typing-indicator {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .typing-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: ${this.options.primaryColor};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
            }
            
            .typing-bubbles {
                display: flex;
                gap: 3px;
                padding: 8px 12px;
                background: #f3f4f6;
                border-radius: 16px;
            }
            
            .typing-bubbles span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #9ca3af;
                animation: typing 1.4s infinite;
            }
            
            .typing-bubbles span:nth-child(2) { animation-delay: 0.2s; }
            .typing-bubbles span:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes typing {
                0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                40% { opacity: 1; transform: scale(1); }
            }
            
            /* Input Area */
            .chat-input-area {
                background: white;
                border-top: 1px solid #e5e7eb;
                padding: 12px;
            }
            
            .input-container {
                display: flex;
                gap: 8px;
                align-items: center;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 20px;
                padding: 8px 12px;
            }
            
            .chat-input {
                flex: 1;
                border: none;
                background: none;
                outline: none;
                font-size: 14px;
                color: #374151;
            }
            
            .chat-input::placeholder {
                color: #9ca3af;
            }
            
            .send-button {
                background: ${this.options.primaryColor};
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                opacity: 0.5;
            }
            
            .send-button:not(:disabled) {
                opacity: 1;
            }
            
            .send-button:hover:not(:disabled) {
                transform: scale(1.1);
            }
            
            .quick-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                justify-content: center;
            }
            
            .quick-action {
                background: none;
                border: 1px solid #e5e7eb;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            
            .quick-action:hover {
                background: ${this.options.primaryColor};
                border-color: ${this.options.primaryColor};
                transform: scale(1.1);
            }
            
            /* Mobile Responsive */
            @media (max-width: 480px) {
                .floating-chat-widget {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .chat-button {
                    position: relative;
                    margin: 0 auto;
                }
                
                .chat-panel {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                }
                
                .chat-panel.minimized {
                    height: 60px;
                    top: auto;
                    bottom: 80px;
                    border-radius: 16px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    attachEventListeners() {
        // Toggle chat
        this.chatButton.addEventListener('click', () => this.toggle());
        
        // Header buttons
        this.widget.querySelector('.close-btn').addEventListener('click', () => this.close());
        this.widget.querySelector('.minimize-btn').addEventListener('click', () => this.toggleMinimize());
        this.widget.querySelector('.suggestions-btn').addEventListener('click', () => this.toggleSuggestions());
        
        // Input handling
        this.inputField.addEventListener('input', (e) => this.handleInput(e));
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Suggestion chips
        this.widget.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-chip') || e.target.classList.contains('quick-action')) {
                const query = e.target.getAttribute('data-query');
                if (query) {
                    this.inputField.value = query;
                    this.sendMessage();
                    this.hideSuggestions();
                }
            }
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.widget.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            
            // Escape to close chat
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.isMinimized = false;
        this.chatPanel.style.display = 'flex';
        this.chatButton.classList.add('open');
        
        // Trigger animation
        setTimeout(() => {
            this.chatPanel.classList.add('open');
        }, 10);
        
        // Focus input
        setTimeout(() => {
            this.inputField.focus();
        }, 300);
        
        // Add contextual message if first time opening
        if (this.conversationHistory.length === 1) { // Only welcome message
            this.addContextualMessage();
        }
    }
    
    close() {
        this.isOpen = false;
        this.chatPanel.classList.remove('open', 'minimized');
        this.chatButton.classList.remove('open');
        this.hideSuggestions();
        
        setTimeout(() => {
            this.chatPanel.style.display = 'none';
        }, 300);
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.chatPanel.classList.toggle('minimized');
        this.hideSuggestions();
    }
    
    toggleSuggestions() {
        const dropdown = this.suggestionsDropdown;
        const isVisible = dropdown.style.display !== 'none';
        
        if (isVisible) {
            this.hideSuggestions();
        } else {
            this.showSuggestions();
        }
    }
    
    showSuggestions() {
        this.suggestionsDropdown.style.display = 'block';
    }
    
    hideSuggestions() {
        this.suggestionsDropdown.style.display = 'none';
    }
    
    handleInput(e) {
        const value = e.target.value.trim();
        this.sendButton.disabled = value.length === 0;
    }
    
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.inputField.value = '';
        this.sendButton.disabled = true;
        
        // Show typing indicator
        this.showTyping();
        
        // Generate response
        const response = await this.generateResponse(message);
        
        // Hide typing and add bot response
        this.hideTyping();
        this.addMessage(response, 'bot');
        
        // Store in history
        this.conversationHistory.push({ message, response, timestamp: Date.now() });
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'user' ? 'U' : 'MB';
        const avatarBg = sender === 'user' ? '#6b7280' : this.options.primaryColor;
        
        messageDiv.innerHTML = `
            <div class="message-avatar" style="background: ${avatarBg}">${avatar}</div>
            <div class="message-bubble">${content}</div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    addWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-message';
        welcomeDiv.innerHTML = `
            <h3>👋 Hi! I'm Michael</h3>
            <p>Ask me anything about my experience, skills, projects, or background. Try clicking the suggestions button above!</p>
        `;
        
        this.messagesContainer.appendChild(welcomeDiv);
        this.conversationHistory.push({ type: 'welcome', timestamp: Date.now() });
    }
    
    addContextualMessage() {
        let contextMessage = '';
        
        switch (this.currentContext) {
            case 'api':
                contextMessage = "I see you're exploring my API documentation! Feel free to ask about my technical skills, programming experience, or the design decisions behind this API showcase.";
                break;
            case 'magazine':
                contextMessage = "You're browsing my magazine-style CV! Ask me about any of the articles, my publications, or the educational innovations mentioned.";
                break;
            case 'quest':
                contextMessage = "Enjoying the CV Quest game? I'd love to hear what you think about this creative approach to showcasing career information!";
                break;
            case 'terminal':
                contextMessage = "Cool terminal interface, right? This Zork-style adventure reflects my love for retro computing and interactive experiences.";
                break;
            case 'traditional':
                contextMessage = "You're viewing my traditional CV format. Perfect for formal applications! Ask me about any experience, skills, or achievements you'd like to know more about.";
                break;
            default:
                contextMessage = "Welcome to my CV portfolio! Each format tells my story differently. What would you like to explore?";
        }
        
        setTimeout(() => {
            this.addMessage(contextMessage, 'bot');
        }, 1000);
    }
    
    showTyping() {
        this.widget.querySelector('.typing-indicator').style.display = 'flex';
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    hideTyping() {
        this.widget.querySelector('.typing-indicator').style.display = 'none';
    }
    
    async generateResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        try {
            // Import and use the existing NLP and response system
            if (window.analyzeQuery && window.generateContextualResponse) {
                const analysis = window.analyzeQuery(message);
                const intent = window.analyzeIntent(message);
                const entities = window.extractEntities(message);
                
                return window.generateContextualResponse(intent, entities, message);
            } else {
                // Fallback response system
                return this.generateFallbackResponse(message);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            return "I apologize, but I'm having trouble processing that question. Could you try rephrasing it?";
        }
    }
    
    generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! 👋 Great to meet you! What would you like to know about my background?";
        }
        
        if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
            return "I have 25+ years of experience spanning military service, academia, and industry consulting. Currently, I'm a Senior Lecturer at Curtin University leading AI education initiatives. Would you like to know more about any specific area?";
        }
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('programming')) {
            return "I specialize in Python, AI/ML, cybersecurity, and educational technology. My expertise includes TensorFlow, PyTorch, and creating innovative learning tools. What specific skills interest you?";
        }
        
        if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return "You can reach me at michael.borck@curtin.edu.au or connect with me on LinkedIn. I'm always open to discussing AI, education, or potential collaborations!";
        }
        
        return "That's an interesting question! I'd be happy to tell you about my experience in AI, cybersecurity, education, or any other aspect of my background. What specifically would you like to know?";
    }
    
    // Public API methods
    showNotification() {
        this.widget.querySelector('.notification-dot').style.display = 'block';
    }
    
    hideNotification() {
        this.widget.querySelector('.notification-dot').style.display = 'none';
    }
    
    destroy() {
        if (this.widget) {
            this.widget.remove();
        }
        
        const styles = document.getElementById('floating-chat-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Auto-initialize if on a page that should have the widget
window.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already on the dedicated chat page
    if (!window.location.pathname.includes('/chatbot/')) {
        window.floatingChat = new FloatingChatWidget();
    }
});

// Export for manual initialization
window.FloatingChatWidget = FloatingChatWidget;