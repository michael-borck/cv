// Response Generation Engine

// Generate contextual response based on intent and entities
function generateContextualResponse(intent, entities, query) {
    const analysis = analyzeQuery(query);
    
    // Handle special cases first
    if (analysis.isGreeting) {
        return getGreetingResponse();
    }
    
    if (analysis.isGoodbye) {
        return getGoodbyeResponse();
    }
    
    if (analysis.isHelp) {
        return getHelpResponse();
    }
    
    // Handle main intents
    switch (intent.intent) {
        case 'experience':
            return getExperienceResponse(entities, analysis);
        case 'skills':
            return getSkillsResponse(entities, analysis);
        case 'education':
            return getEducationResponse(entities, analysis);
        case 'military':
            return getMilitaryResponse(entities, analysis);
        case 'teaching':
            return getTeachingResponse(entities, analysis);
        case 'projects':
            return getProjectsResponse(entities, analysis);
        case 'publications':
            return getPublicationsResponse(entities, analysis);
        case 'achievements':
            return getAchievementsResponse(entities, analysis);
        case 'contact':
            return getContactResponse(entities, analysis);
        case 'consulting':
            return getConsultingResponse(entities, analysis);
        case 'ai':
            return getAIResponse(entities, analysis);
        case 'cybersecurity':
            return getCybersecurityResponse(entities, analysis);
        default:
            return getUnknownResponse(query);
    }
}

// Greeting responses
function getGreetingResponse() {
    const greetings = [
        "Hello! 👋 Great to meet you! I'm Michael Borck. What would you like to know about my background in AI, cybersecurity, or education?",
        "Hi there! 😊 I'm Michael, and I'm excited to chat with you about my journey from military service to AI leadership. What interests you most?",
        "Hey! 🎉 Welcome to my interactive CV. I'm here to answer any questions about my experience, skills, or achievements. What can I tell you about?"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
}

// Goodbye responses
function getGoodbyeResponse() {
    const goodbyes = [
        "Thanks for chatting! 🙏 Feel free to reach out anytime - you can find my contact details by asking 'How can I contact you?' Have a great day!",
        "It was wonderful talking with you! 😊 Don't hesitate to connect with me on LinkedIn or via email if you'd like to continue our conversation.",
        "Goodbye! 👋 I hope our chat was helpful. Remember, you can always download our conversation or reach out directly. Take care!"
    ];
    
    return goodbyes[Math.floor(Math.random() * goodbyes.length)];
}

// Help responses
function getHelpResponse() {
    return `
        <div>
            <p><strong>💡 I'm here to help!</strong> You can ask me about:</p>
            <ul>
                <li><strong>Experience:</strong> "Tell me about your work experience" or "What do you do?"</li>
                <li><strong>Skills:</strong> "What programming languages do you know?" or "Tell me about your AI expertise"</li>
                <li><strong>Education:</strong> "What's your educational background?"</li>
                <li><strong>Teaching:</strong> "What's your teaching philosophy?" or "What courses do you teach?"</li>
                <li><strong>Publications:</strong> "What books have you written?"</li>
                <li><strong>Projects:</strong> "What projects have you worked on?"</li>
                <li><strong>Contact:</strong> "How can I contact you?"</li>
            </ul>
            <p>You can also click the 💡 button for more suggestions, or use the quick action buttons on the right!</p>
        </div>
    `;
}

// Experience responses
function getExperienceResponse(entities, analysis) {
    if (entities.organizations && entities.organizations.includes('curtin university')) {
        return `
            <div>
                <p><strong>🎓 My Experience at Curtin University</strong></p>
                <p>I've been with Curtin University since 2016, currently serving as a <strong>Senior Lecturer</strong> in the School of Marketing and Management. Here are my key roles:</p>
                <ul>
                    <li><strong>AI Leader:</strong> Leading AI program development for 500+ students across undergraduate and postgraduate programs</li>
                    <li><strong>Technical Lead:</strong> Business AI Research Group</li>
                    <li><strong>Core Teaching:</strong> AI, Python Programming, and Cybersecurity</li>
                    <li><strong>Student Success:</strong> Achieved 100% student satisfaction scores through innovative teaching methods</li>
                </ul>
                <p>I'm passionate about making AI education accessible and engaging! Would you like to know more about my teaching approach or research work?</p>
            </div>
        `;
    }
    
    if (entities.organizations && entities.organizations.some(org => ['navy', 'military'].includes(org))) {
        return getMilitaryResponse(entities, analysis);
    }
    
    return `
        <div>
            <p><strong>💼 My Professional Journey</strong></p>
            <p>I have <strong>25+ years</strong> of experience spanning military → academia → industry consulting. Here's my career progression:</p>
            
            <p><strong>🎓 Current Role (2016-Present):</strong><br>
            Senior Lecturer at Curtin University, leading AI education and research initiatives.</p>
            
            <p><strong>⚓ Military Background (12 years):</strong><br>
            Royal Australian Navy - Electronics Technician specializing in submarine systems and combat electronics.</p>
            
            <p><strong>💡 Consulting Work:</strong><br>
            AI strategy, educational technology, and cybersecurity consulting across academics, education, agriculture, and mining sectors.</p>
            
            <p>My unique combination of technical depth and educational innovation sets me apart. Would you like to explore any specific area in more detail?</p>
        </div>
    `;
}

// Skills responses
function getSkillsResponse(entities, analysis) {
    if (entities.programming_languages && entities.programming_languages.length > 0) {
        const askedLanguages = entities.programming_languages;
        return `
            <div>
                <p><strong>💻 Programming Languages</strong></p>
                <p>Great question! I have extensive experience with:</p>
                <ul>
                    <li><strong>Python:</strong> My primary language for AI/ML, data analysis, and web development (10+ years)</li>
                    <li><strong>JavaScript:</strong> Full-stack web development, interactive educational tools</li>
                    <li><strong>C/C++:</strong> System programming and performance-critical applications</li>
                    <li><strong>Java & C#:</strong> Enterprise applications and object-oriented design</li>
                    <li><strong>SQL:</strong> Database design and complex queries</li>
                    <li><strong>HTML/CSS:</strong> Modern web interfaces and responsive design</li>
                </ul>
                <p>I particularly excel in <strong>Python for AI/ML</strong> applications. Would you like to know more about my AI expertise or other technical skills?</p>
            </div>
        `;
    }
    
    return `
        <div>
            <p><strong>⚡ My Technical Skills</strong></p>
            
            <p><strong>🔤 Programming Languages:</strong><br>
            Python (expert), JavaScript, C/C++, Java, C#, Matlab, PHP, SQL, HTML/CSS, LaTeX, Bash</p>
            
            <p><strong>🤖 AI/ML Technologies:</strong><br>
            TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, OpenCV</p>
            
            <p><strong>🌐 Web Frameworks:</strong><br>
            React, Flask, FastAPI, FastHTML</p>
            
            <p><strong>☁️ Cloud & Tools:</strong><br>
            AWS, Azure, Docker, Git, Linux, Jupyter, VS Code</p>
            
            <p><strong>🎯 Domain Expertise:</strong><br>
            Artificial Intelligence, Machine Learning, Cybersecurity, Educational Technology, Research Methodology</p>
            
            <p>I'm particularly passionate about using AI to enhance education. Want to know more about any specific area?</p>
        </div>
    `;
}

// Education responses
function getEducationResponse(entities, analysis) {
    return `
        <div>
            <p><strong>🎓 Educational Background</strong></p>
            
            <p><strong>Master of Science in Information Technology</strong><br>
            Curtin University (2016)<br>
            <em>Focus: Cybersecurity and AI</em></p>
            
            <p><strong>Bachelor of Science in Computer Science</strong><br>
            Edith Cowan University (2014)<br>
            <em>Focus: Software Engineering</em></p>
            
            <p><strong>🔄 Continuous Learning:</strong><br>
            I'm a firm believer in lifelong learning! I regularly engage with:</p>
            <ul>
                <li>Latest AI/ML research and methodologies</li>
                <li>Educational technology innovations</li>
                <li>Cybersecurity threat landscape updates</li>
                <li>Teaching pedagogy and student engagement strategies</li>
            </ul>
            
            <p>My academic journey mirrors my teaching philosophy: <em>"Make Contact Count"</em> - every learning opportunity should be maximized!</p>
        </div>
    `;
}

// Military responses
function getMilitaryResponse(entities, analysis) {
    return `
        <div>
            <p><strong>⚓ Military Service - Royal Australian Navy</strong></p>
            
            <p>I served <strong>12 years</strong> as an <strong>Electronics Technician</strong> specializing in:</p>
            <ul>
                <li><strong>Submarine Electronics Systems:</strong> Maintenance and operation of complex submarine electronics</li>
                <li><strong>Combat Systems:</strong> Supporting naval combat and communication systems</li>
                <li><strong>Technical Leadership:</strong> Training and mentoring junior technicians</li>
                <li><strong>Security:</strong> Held Top Secret security clearance</li>
            </ul>
            
            <p><strong>🎖️ Key Skills Developed:</strong></p>
            <ul>
                <li>Precision and attention to detail</li>
                <li>Working under pressure in critical situations</li>
                <li>Technical troubleshooting and problem-solving</li>
                <li>Leadership and team management</li>
                <li>Strict adherence to protocols and procedures</li>
            </ul>
            
            <p>This military foundation has been invaluable in my academic career, particularly in cybersecurity and systems thinking. The discipline and technical rigor I learned continue to shape my approach to education and research.</p>
        </div>
    `;
}

// Teaching responses
function getTeachingResponse(entities, analysis) {
    if (analysis.originalQuery.toLowerCase().includes('philosophy')) {
        return `
            <div>
                <p><strong>👨‍🏫 My Teaching Philosophy</strong></p>
                
                <p><strong>Core Principle:</strong> <em>"Make Contact Count"</em> - maximizing impact through every student interaction</p>
                
                <p><strong>🏗️ Built on Three Pillars:</strong></p>
                <ul>
                    <li><strong>💝 Caring:</strong> Genuine concern for student success and well-being</li>
                    <li><strong>🎯 Competence:</strong> Deep technical knowledge and pedagogical expertise</li>
                    <li><strong>🔥 Passion:</strong> Enthusiasm for the subject matter and teaching</li>
                </ul>
                
                <p><strong>📚 Grounded in:</strong></p>
                <ul>
                    <li>Constructivist learning theory</li>
                    <li>Bloom's Taxonomy</li>
                    <li>Universal Design for Learning (UDL)</li>
                </ul>
                
                <p><strong>🏆 Results:</strong> 100% student satisfaction scores across multiple units!</p>
                
                <p>Student feedback: <em>"Michael is an absolute legend, I love his teaching style"</em> and <em>"He really did feel like he cared about my learning"</em></p>
            </div>
        `;
    }
    
    return `
        <div>
            <p><strong>👨‍🏫 Teaching & Education</strong></p>
            
            <p>I'm passionate about education and have achieved <strong>100% student satisfaction</strong> across all my units:</p>
            
            <p><strong>📚 Core Teaching Areas:</strong></p>
            <ul>
                <li><strong>Artificial Intelligence:</strong> Making AI accessible and practical</li>
                <li><strong>Python Programming:</strong> From basics to advanced applications</li>
                <li><strong>Cybersecurity:</strong> Information security and digital forensics</li>
                <li><strong>Business Programming:</strong> Practical coding for business applications</li>
            </ul>
            
            <p><strong>💡 Educational Innovations:</strong></p>
            <ul>
                <li><strong>Cloud Core Simulation:</strong> Virtual company with IT infrastructure for authentic experiences</li>
                <li><strong>AI-Enhanced Tools:</strong> Reality Reigns, Talk Buddy, Curriculum Curator</li>
                <li><strong>Real-World Integration:</strong> Assessments that prepare students for workplace environments</li>
            </ul>
            
            <p>Want to know more about my teaching philosophy or specific educational tools I've created?</p>
        </div>
    `;
}

// Projects responses
function getProjectsResponse(entities, analysis) {
    return `
        <div>
            <p><strong>🚀 Recent Projects & Innovations</strong></p>
            
            <p><strong>🤖 AI-Enhanced Educational Tools:</strong></p>
            <ul>
                <li><strong>Reality Reigns:</strong> AI-powered learning platform with personalized pathways</li>
                <li><strong>Talk Buddy:</strong> Conversational AI for student engagement</li>
                <li><strong>Curriculum Curator:</strong> AI tool for educational content organization</li>
            </ul>
            
            <p><strong>🏢 Cloud Core Simulation:</strong><br>
            Complete virtual company with IT infrastructure, policies, and staff chatbot for authentic audit experiences. Students report it feels like "working in real-time"!</p>
            
            <p><strong>🔐 Cybersecurity Assessment Framework:</strong><br>
            Automated security assessment tool for educational institutions, now used by 5+ universities.</p>
            
            <p><strong>📊 Business AI Research:</strong><br>
            Leading research initiatives in AI applications for business and education.</p>
            
            <p><strong>📈 Impact:</strong> 290+ downloads of educational tools, improved student engagement by 40%</p>
            
            <p>Each project focuses on making technology more accessible and education more engaging. Want details about any specific project?</p>
        </div>
    `;
}

// Publications responses
function getPublicationsResponse(entities, analysis) {
    return `
        <div>
            <p><strong>📚 Publications & Writings</strong></p>
            
            <p>I've authored <strong>4 technical books</strong> (Creative Commons licensed) to make knowledge freely accessible:</p>
            
            <p><strong>Recent Books:</strong></p>
            <ul>
                <li><strong>"AI in Education: A Practical Guide" (2023)</strong><br>
                Comprehensive guide to implementing AI in educational settings</li>
                <li><strong>"Cybersecurity Fundamentals" (2022)</strong><br>
                Essential cybersecurity concepts for modern organizations</li>
                <li><strong>"Programming for Business Applications" (2021)</strong><br>
                Practical coding approaches for business solutions</li>
                <li><strong>"Educational Technology Innovation" (2020)</strong><br>
                Strategies for integrating technology in learning environments</li>
            </ul>
            
            <p><strong>📝 Research Publications:</strong><br>
            6+ peer-reviewed publications in computer vision and machine learning, focusing on mobile mapping systems and educational applications.</p>
            
            <p><strong>🌍 Open Source Contribution:</strong><br>
            Lead developer for "Image Processing for Orange" - serving the broader scientific community.</p>
            
            <p>All my publications emphasize practical applications and real-world impact. Would you like to know more about any specific topic?</p>
        </div>
    `;
}

// Achievements responses
function getAchievementsResponse(entities, analysis) {
    return `
        <div>
            <p><strong>🏆 Key Achievements</strong></p>
            
            <p><strong>🎓 Educational Leadership:</strong></p>
            <ul>
                <li>AI Leader for School of Marketing and Management</li>
                <li>Developed AI curriculum serving 500+ students</li>
                <li>100% student satisfaction scores across multiple units</li>
                <li>Created award-winning "Cloud Core" virtual company simulation</li>
            </ul>
            
            <p><strong>📚 Publishing & Research:</strong></p>
            <ul>
                <li>4 published technical books (Creative Commons)</li>
                <li>6+ peer-reviewed research publications</li>
                <li>Lead developer for open-source scientific tools</li>
            </ul>
            
            <p><strong>💼 Industry Impact:</strong></p>
            <ul>
                <li>Executive education for 100+ professionals across 15+ companies</li>
                <li>Technical Lead - Business AI Research Group</li>
                <li>Consulting across academics, education, agriculture, and mining</li>
            </ul>
            
            <p><strong>🛡️ Military Recognition:</strong></p>
            <ul>
                <li>12 years distinguished service in Royal Australian Navy</li>
                <li>Top Secret security clearance</li>
                <li>Submarine electronics and combat systems specialist</li>
            </ul>
            
            <p>Each achievement reflects my commitment to excellence and making a positive impact!</p>
        </div>
    `;
}

// Contact responses
function getContactResponse(entities, analysis) {
    return `
        <div>
            <p><strong>📞 Let's Connect!</strong></p>
            
            <p><strong>📧 Email:</strong> <a href="mailto:michael.borck@curtin.edu.au">michael.borck@curtin.edu.au</a></p>
            
            <p><strong>🌐 Professional Networks:</strong></p>
            <ul>
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/michaelborck" target="_blank">linkedin.com/in/michaelborck</a></li>
                <li><strong>GitHub:</strong> <a href="https://github.com/michael-borck" target="_blank">github.com/michael-borck</a></li>
            </ul>
            
            <p><strong>💼 Professional Websites:</strong></p>
            <ul>
                <li><strong>Portfolio:</strong> <a href="https://michaelborck.dev" target="_blank">michaelborck.dev</a></li>
                <li><strong>Education Platform:</strong> <a href="https://michaelborck.education" target="_blank">michaelborck.education</a></li>
            </ul>
            
            <p><strong>📍 Location:</strong> Perth, Western Australia</p>
            
            <p><strong>💬 Best Ways to Reach Me:</strong></p>
            <ul>
                <li>Email for formal inquiries and collaborations</li>
                <li>LinkedIn for professional networking</li>
                <li>GitHub for technical discussions and code collaboration</li>
            </ul>
            
            <p>I'm always open to discussing AI, education, cybersecurity, or potential collaborations. Don't hesitate to reach out!</p>
        </div>
    `;
}

// Consulting responses
function getConsultingResponse(entities, analysis) {
    return `
        <div>
            <p><strong>💼 Consulting Services</strong></p>
            
            <p>Yes, I'm available for consulting! I provide expertise in:</p>
            
            <p><strong>🤖 AI Strategy & Implementation:</strong></p>
            <ul>
                <li>AI readiness assessments for organizations</li>
                <li>Machine learning solution design</li>
                <li>AI ethics and responsible deployment</li>
                <li>Educational AI integration</li>
            </ul>
            
            <p><strong>🎓 Educational Technology:</strong></p>
            <ul>
                <li>Curriculum development for AI/tech programs</li>
                <li>Interactive learning tool creation</li>
                <li>Assessment innovation and design</li>
                <li>Faculty training and development</li>
            </ul>
            
            <p><strong>🔐 Cybersecurity:</strong></p>
            <ul>
                <li>Information security assessments</li>
                <li>Security framework implementation</li>
                <li>Cyber awareness training</li>
            </ul>
            
            <p><strong>🏭 Industry Experience:</strong><br>
            I've delivered executive education to 100+ professionals across academics, education, agriculture, and mining sectors.</p>
            
            <p><strong>📧 Ready to discuss your project?</strong><br>
            Contact me at <a href="mailto:michael.borck@curtin.edu.au">michael.borck@curtin.edu.au</a> to explore how we can work together!</p>
        </div>
    `;
}

// AI-specific responses
function getAIResponse(entities, analysis) {
    return `
        <div>
            <p><strong>🤖 My AI Expertise</strong></p>
            
            <p>I'm passionate about <strong>Artificial Intelligence and Machine Learning</strong>! Here's my focus:</p>
            
            <p><strong>🎯 Specializations:</strong></p>
            <ul>
                <li><strong>Educational AI:</strong> Using AI to enhance learning experiences</li>
                <li><strong>Computer Vision:</strong> 6+ publications in mobile mapping systems</li>
                <li><strong>AI Ethics:</strong> Responsible AI deployment and governance</li>
                <li><strong>Business AI:</strong> Technical Lead for Business AI Research Group</li>
            </ul>
            
            <p><strong>🛠️ Technical Stack:</strong></p>
            <ul>
                <li><strong>Frameworks:</strong> TensorFlow, PyTorch, Scikit-learn</li>
                <li><strong>Languages:</strong> Python (expert), Matlab</li>
                <li><strong>Tools:</strong> Jupyter, Pandas, NumPy, OpenCV</li>
            </ul>
            
            <p><strong>📚 AI in Education:</strong><br>
            I've created AI-powered educational tools (Reality Reigns, Talk Buddy, Curriculum Curator) that have been downloaded 290+ times!</p>
            
            <p><strong>🔬 Research Focus:</strong><br>
            My research investigates CNN models and their application to maritime environments, advancing computer vision for marine monitoring.</p>
            
            <p>Want to know more about any specific AI application or my educational AI tools?</p>
        </div>
    `;
}

// Cybersecurity responses
function getCybersecurityResponse(entities, analysis) {
    return `
        <div>
            <p><strong>🔐 Cybersecurity Expertise</strong></p>
            
            <p>Cybersecurity is one of my core areas! Here's my experience:</p>
            
            <p><strong>🎓 Academic Leadership:</strong></p>
            <ul>
                <li>Lead lecturer for cybersecurity programs at Curtin University</li>
                <li>Advanced digital forensics curriculum development</li>
                <li>Information Security unit coordination (ISYS6018)</li>
                <li>100% student satisfaction in security courses</li>
            </ul>
            
            <p><strong>⚓ Military Foundation:</strong></p>
            <ul>
                <li>12 years Royal Australian Navy experience</li>
                <li>Top Secret security clearance</li>
                <li>Combat systems and secure communications</li>
                <li>Critical defense project management</li>
            </ul>
            
            <p><strong>🛠️ Technical Areas:</strong></p>
            <ul>
                <li><strong>Information Security:</strong> Framework design and implementation</li>
                <li><strong>Digital Forensics:</strong> Investigation and analysis techniques</li>
                <li><strong>Risk Assessment:</strong> Organizational security evaluations</li>
                <li><strong>Security Awareness:</strong> Training and education programs</li>
            </ul>
            
            <p><strong>📊 Real-World Impact:</strong><br>
            Created cybersecurity assessment frameworks now used by 5+ universities, helping organizations strengthen their security posture.</p>
            
            <p>My unique combination of military, academic, and industry experience provides a comprehensive security perspective. Want to discuss any specific security challenges?</p>
        </div>
    `;
}

// Unknown/fallback responses
function getUnknownResponse(query) {
    const suggestions = [
        "I'd love to help! Try asking about my <strong>experience</strong>, <strong>skills</strong>, <strong>education</strong>, or <strong>projects</strong>.",
        "I didn't quite catch that. You could ask about my <strong>teaching philosophy</strong>, <strong>AI expertise</strong>, or <strong>cybersecurity background</strong>.",
        "Let me help you better! Try questions like 'What programming languages do you know?' or 'Tell me about your military service'.",
        "I'm here to discuss my background! Ask about my <strong>books</strong>, <strong>achievements</strong>, or how to <strong>contact me</strong>."
    ];
    
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    return `
        <div>
            <p>🤔 ${suggestion}</p>
            <p>You can also click the <strong>💡 suggestions button</strong> for more ideas, or try one of these popular questions:</p>
            <ul>
                <li>"Tell me about your experience"</li>
                <li>"What programming languages do you know?"</li>
                <li>"What books have you written?"</li>
                <li>"How can I contact you?"</li>
            </ul>
        </div>
    `;
}