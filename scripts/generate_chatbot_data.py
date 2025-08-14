#!/usr/bin/env python3
"""
Generate chatbot knowledge base from cv-data.yml
Creates structured conversation data for the chatbot CV interface
"""

import yaml
import json
import os
from datetime import datetime

def load_cv_data():
    """Load CV data from YAML file"""
    cv_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'cv-data.yml')
    
    try:
        with open(cv_file, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"Error: CV data file not found at {cv_file}")
        return None
    except yaml.YAMLError as e:
        print(f"Error parsing YAML: {e}")
        return None

def generate_knowledge_base(cv_data):
    """Generate knowledge base from CV data"""
    
    # Profile information
    profile = {
        "name": cv_data['personal']['name'],
        "title": "AI Leader & Cyber Security Expert",
        "email": cv_data['personal']['email'],
        "phone": cv_data['personal'].get('phone', ''),
        "location": cv_data['personal']['location'],
        "linkedin": cv_data['personal']['linkedin'],
        "github": cv_data['personal']['github'],
        "portfolio": cv_data['personal'].get('portfolio', ''),
        "education_platform": cv_data['personal'].get('education_platform', ''),
        "summary": cv_data['summary']['main'],
        "tagline": cv_data['teaching']['philosophy']['core']
    }
    
    # Teaching philosophy
    teaching_philosophy = {
        "core": cv_data['teaching']['philosophy']['core'],
        "framework": cv_data['teaching']['philosophy']['framework'],
        "approach": cv_data['teaching']['philosophy']['approach'],
        "satisfaction": cv_data['teaching']['satisfaction'],
        "feedback": cv_data['teaching']['feedback'],
        "innovations": cv_data['teaching']['innovations']
    }
    
    # Experience data
    experience_list = []
    for i, exp in enumerate(cv_data.get('experience', [])):
        experience_item = {
            "id": f"exp_{i}",
            "organization": exp['organization'],
            "title": exp['title'],
            "location": exp.get('location', ''),
            "period": exp.get('period', ''),
            "responsibilities": exp.get('responsibilities', []),
            "projects": exp.get('projects', []),
            "type": "academic" if "University" in exp['organization'] else "consulting"
        }
        experience_list.append(experience_item)
    
    # Skills data
    skills = {
        "programming": {
            "languages": cv_data.get('skills', {}).get('programming', {}).get('languages', []),
            "frameworks": cv_data.get('skills', {}).get('programming', {}).get('frameworks', [])
        },
        "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV"],
        "databases": ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
        "cloud": ["AWS", "Azure", "Google Cloud"],
        "tools": ["Git", "Docker", "Linux", "Jupyter", "VS Code", "LaTeX"],
        "domain_expertise": [
            "Artificial Intelligence",
            "Machine Learning",
            "Cybersecurity", 
            "Educational Technology",
            "Research Methodology",
            "Technical Writing"
        ]
    }
    
    # Education data
    education_list = []
    for edu in cv_data.get('education', []):
        education_item = {
            "degree": edu.get('degree', ''),
            "institution": edu.get('institution', ''),
            "year": edu.get('year', ''),
            "focus": edu.get('focus', ''),
            "grade": edu.get('grade', ''),
            "thesis": edu.get('thesis', '')
        }
        education_list.append(education_item)
    
    # Projects data
    projects_list = []
    for project in cv_data.get('projects', []):
        project_item = {
            "name": project.get('name', ''),
            "description": project.get('description', ''),
            "tech": project.get('tech', []),
            "status": project.get('status', 'completed'),
            "impact": project.get('impact', ''),
            "url": project.get('url', ''),
            "github": project.get('github', '')
        }
        projects_list.append(project_item)
    
    # Publications data
    publications_list = []
    for book in cv_data.get('publications', {}).get('books', []):
        publication_item = {
            "title": book.get('title', ''),
            "year": book.get('year', ''),
            "type": book.get('type', 'Book'),
            "publisher": book.get('publisher', ''),
            "description": book.get('description', ''),
            "url": book.get('url', ''),
            "isbn": book.get('isbn', '')
        }
        publications_list.append(publication_item)
    
    # Military background
    military_background = {
        "service": "Royal Australian Navy",
        "duration": "12 years",
        "role": "Electronics Technician",
        "specializations": [
            "Submarine Electronics Systems",
            "Combat Systems Operation",
            "Naval Communications",
            "Technical Leadership"
        ],
        "security_clearance": "Top Secret",
        "skills_developed": [
            "Precision and attention to detail",
            "Working under pressure",
            "Technical troubleshooting",
            "Leadership and team management",
            "Protocol adherence"
        ]
    }
    
    # Achievements
    achievements = cv_data.get('achievements', [])
    
    # Consulting services
    consulting_services = {
        "ai_strategy": [
            "AI readiness assessments",
            "Machine learning solution design", 
            "AI ethics and responsible deployment",
            "Educational AI integration"
        ],
        "educational_technology": [
            "Curriculum development for AI/tech programs",
            "Interactive learning tool creation",
            "Assessment innovation and design",
            "Faculty training and development"
        ],
        "cybersecurity": [
            "Information security assessments",
            "Security framework implementation",
            "Cyber awareness training"
        ],
        "industries_served": [
            "Academics",
            "Education",
            "Agriculture", 
            "Mining"
        ]
    }
    
    # AI expertise
    ai_expertise = {
        "specializations": [
            "Educational AI",
            "Computer Vision",
            "AI Ethics",
            "Business AI"
        ],
        "technical_stack": {
            "frameworks": ["TensorFlow", "PyTorch", "Scikit-learn"],
            "languages": ["Python", "Matlab"],
            "tools": ["Jupyter", "Pandas", "NumPy", "OpenCV"]
        },
        "research_focus": "CNN models and maritime environment applications",
        "educational_tools": [
            "Reality Reigns - AI-powered learning platform",
            "Talk Buddy - Conversational AI for engagement", 
            "Curriculum Curator - AI content organization tool"
        ],
        "downloads": "290+"
    }
    
    # Cybersecurity expertise
    cybersecurity_expertise = {
        "academic_leadership": [
            "Lead lecturer for cybersecurity programs",
            "Advanced digital forensics curriculum",
            "Information Security unit coordination",
            "100% student satisfaction in security courses"
        ],
        "military_foundation": [
            "12 years Royal Australian Navy",
            "Top Secret security clearance",
            "Combat systems and secure communications",
            "Critical defense project management"
        ],
        "technical_areas": [
            "Information Security framework design",
            "Digital Forensics investigation",
            "Risk Assessment and evaluation",
            "Security Awareness training"
        ],
        "impact": "Cybersecurity assessment frameworks used by 5+ universities"
    }
    
    # Create comprehensive knowledge base
    knowledge_base = {
        "profile": profile,
        "teaching_philosophy": teaching_philosophy,
        "experience": experience_list,
        "skills": skills,
        "education": education_list,
        "projects": projects_list,
        "publications": publications_list,
        "military_background": military_background,
        "achievements": achievements,
        "consulting_services": consulting_services,
        "ai_expertise": ai_expertise,
        "cybersecurity_expertise": cybersecurity_expertise,
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "version": "1.0.0",
            "source": "cv-data.yml"
        }
    }
    
    return knowledge_base

def generate_intents_data(cv_data):
    """Generate conversation intents and patterns"""
    
    intents = {
        "greetings": {
            "patterns": [
                "hello", "hi", "hey", "good morning", "good afternoon", 
                "good evening", "greetings", "salutations"
            ],
            "responses": [
                "Hello! 👋 Great to meet you! I'm Michael Borck. What would you like to know about my background in AI, cybersecurity, or education?",
                "Hi there! 😊 I'm Michael, and I'm excited to chat with you about my journey from military service to AI leadership. What interests you most?",
                "Hey! 🎉 Welcome to my interactive CV. I'm here to answer any questions about my experience, skills, or achievements. What can I tell you about?"
            ]
        },
        
        "goodbyes": {
            "patterns": [
                "bye", "goodbye", "see you", "farewell", "thanks", 
                "thank you", "cheers", "take care"
            ],
            "responses": [
                "Thanks for chatting! 🙏 Feel free to reach out anytime - you can find my contact details by asking 'How can I contact you?' Have a great day!",
                "It was wonderful talking with you! 😊 Don't hesitate to connect with me on LinkedIn or via email if you'd like to continue our conversation.",
                "Goodbye! 👋 I hope our chat was helpful. Remember, you can always download our conversation or reach out directly. Take care!"
            ]
        },
        
        "help": {
            "patterns": [
                "help", "what can you do", "how does this work", 
                "show me", "guide me", "assist me"
            ],
            "response": "I can help you learn about my experience, skills, education, teaching philosophy, projects, publications, and more. Try asking specific questions or use the suggestions panel!"
        },
        
        "quick_facts": {
            "years_experience": 25,
            "books_published": 4,
            "student_satisfaction": "100%",
            "tools_created": 3,
            "downloads": "290+",
            "universities_served": "5+",
            "companies_trained": "15+"
        }
    }
    
    return intents

def save_data(data, filename, output_dir):
    """Save data to JSON file"""
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, filename)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ {filename} generated: {output_file}")
        return True
        
    except Exception as e:
        print(f"Error saving {filename}: {e}")
        return False

def main():
    """Main function to generate chatbot data"""
    print("Generating Chatbot CV data from cv-data.yml...")
    
    # Load CV data
    cv_data = load_cv_data()
    if not cv_data:
        return False
    
    # Generate knowledge base
    knowledge_base = generate_knowledge_base(cv_data)
    
    # Generate intents data
    intents_data = generate_intents_data(cv_data)
    
    # Save files
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'creative', 'chatbot', 'data')
    
    success = True
    
    # Save knowledge base
    if not save_data(knowledge_base, 'knowledge-base.json', output_dir):
        success = False
    
    # Save intents data
    if not save_data(intents_data, 'intents.json', output_dir):
        success = False
    
    if success:
        print(f"\n✓ Chatbot CV data generated successfully!")
        print(f"  - {len(knowledge_base['experience'])} experience records")
        print(f"  - {len(knowledge_base['projects'])} projects")
        print(f"  - {len(knowledge_base['publications'])} publications")
        print(f"  - {len(knowledge_base['achievements'])} achievements")
        print(f"  - {len(knowledge_base['skills']['programming']['languages'])} programming languages")
        
    return success

if __name__ == "__main__":
    main()