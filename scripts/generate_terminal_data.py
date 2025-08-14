#!/usr/bin/env python3
"""
Generate Terminal CV data from cv-data.yml for the Zork-like text adventure
"""

import yaml
import json
import os

def load_cv_data():
    """Load CV data from YAML file"""
    with open('data/cv-data.yml', 'r') as f:
        return yaml.safe_load(f)

def create_terminal_world(cv_data):
    """Create the terminal game world from CV data"""
    
    # Define rooms with connections
    rooms = {
        'lobby': {
            'name': 'Career Lobby',
            'description': f"You stand in the grand lobby of {cv_data['personal']['name']}'s career. " +
                          "Digital displays show streaming data of achievements and experiences. " +
                          "Corridors lead to different career phases.",
            'ascii': """
    ╔═══════════════════════════════╗
    ║       CAREER LOBBY            ║
    ║   11+ Years of Experience     ║
    ╚═══════════════════════════════╝
            """,
            'exits': {
                'north': 'military',
                'east': 'academic',
                'south': 'consulting',
                'west': 'education'
            },
            'items': ['terminal', 'readme']
        },
        'military': {
            'name': 'Military Command Center',
            'description': "RAN Submarine Systems Centre. Security clearance required. " +
                          "The walls are lined with classified project files and strategic communications equipment.",
            'ascii': """
    ⚔️  MILITARY SERVICE  ⚔️
    1989-2000 | Leadership & IT
            """,
            'exits': {
                'south': 'lobby'
            },
            'items': ['security_badge', 'project_files']
        },
        'academic': {
            'name': 'University Lecture Hall',
            'description': "Curtin University. The hall echoes with the sound of engaged students. " +
                          "Whiteboards covered with AI algorithms and system designs.",
            'ascii': """
    🎓 ACADEMIC EXCELLENCE 🎓
    100% Student Satisfaction
            """,
            'exits': {
                'west': 'lobby',
                'north': 'research_lab'
            },
            'items': ['teaching_award', 'feedback_forms']
        },
        'research_lab': {
            'name': 'AI Research Laboratory',
            'description': "State-of-the-art AI research facility. Neural networks train on massive datasets. " +
                          "Computer vision algorithms process imagery in real-time.",
            'ascii': """
    🧠 AI RESEARCH LAB 🧠
    Computer Vision | Machine Learning
            """,
            'exits': {
                'south': 'academic'
            },
            'items': ['thesis', 'publications']
        },
        'consulting': {
            'name': 'Consulting Office',
            'description': "A modern workspace filled with client projects and innovative solutions. " +
                          "Multiple monitors display dashboards and development environments.",
            'ascii': """
    💼 CONSULTING SERVICES 💼
    AI Strategy | EdTech | Systems
            """,
            'exits': {
                'north': 'lobby',
                'east': 'innovation_lab'
            },
            'items': ['client_portfolio', 'consulting_toolkit']
        },
        'education': {
            'name': 'Education Center',
            'description': "Shelves lined with technical books and educational materials. " +
                          "A place of continuous learning and knowledge sharing.",
            'ascii': """
    📚 EDUCATION HUB 📚
    PhD | BSc | Grad Dip
            """,
            'exits': {
                'east': 'lobby'
            },
            'items': ['books', 'python_textbook', 'certificates']
        },
        'innovation_lab': {
            'name': 'Innovation Laboratory',
            'description': "Where ideas become reality. Prototypes and proof-of-concepts everywhere. " +
                          "The latest AI tools and frameworks ready for experimentation.",
            'ascii': """
    ⚡ INNOVATION LAB ⚡
    Creating Tomorrow's Solutions
            """,
            'exits': {
                'west': 'consulting'
            },
            'items': ['reality_reigns', 'talk_buddy', 'cloud_core_sim']
        }
    }
    
    # Define items that can be examined
    items = {
        'terminal': {
            'description': f"A retro terminal displaying contact information:\n" +
                          f"Email: {cv_data['personal']['email']}\n" +
                          f"LinkedIn: {cv_data['personal']['linkedin']}\n" +
                          f"GitHub: {cv_data['personal']['github']}",
            'takeable': False,
            'points': 0
        },
        'readme': {
            'description': "A README file that says:\n'Welcome, traveler. Type HELP for commands. Your journey through this career awaits.'",
            'takeable': True,
            'points': 5
        },
        'project_files': {
            'description': "Military messaging system documentation. Critical infrastructure that connected defense communications.",
            'takeable': True,
            'points': 10
        },
        'security_badge': {
            'description': "IT Manager - Submarine Systems Centre, RAN. Jul 1996 - Jan 2000. Level: CLASSIFIED",
            'takeable': True,
            'points': 15
        },
        'python_textbook': {
            'description': "'Python Step By Step in an AI World' - A comprehensive guide authored by Michael Borck",
            'takeable': True,
            'points': 10
        },
        'teaching_award': {
            'description': "Certificate of Excellence: 100% Student Satisfaction Score - ISYS3015, ISYS2001, ISYS6018",
            'takeable': True,
            'points': 20
        },
        'thesis': {
            'description': "PhD Thesis (2017): 'Feature Extraction from Multi-modal Data' - Combining GIS, Machine Learning & Computer Vision",
            'takeable': False,
            'points': 0
        },
        'reality_reigns': {
            'description': "Swipe-based decision game providing interactive fiction storytelling. 290+ downloads and growing!",
            'takeable': False,
            'points': 0
        },
        'talk_buddy': {
            'description': "AI-based audio interface for conversation practice. Used for medical diagnoses, HR discussions, and language learning.",
            'takeable': False,
            'points': 0
        },
        'cloud_core_sim': {
            'description': "Complete virtual company simulation with IT infrastructure, policies, and chatbot staff. Students love it!",
            'takeable': False,
            'points': 0
        },
        'feedback_forms': {
            'description': "Student feedback: 'Michael is an absolute legend', 'He really cared about my learning', 'Hard but fun!'",
            'takeable': True,
            'points': 15
        },
        'books': {
            'description': "Four published books (Creative Commons):\n" +
                         "- Python Step By Step in an AI World\n" +
                         "- JumpStart Python in the AI Era\n" +
                         "- Intentional Prompting: Blending AI and Human Oversight\n" +
                         "- Python Dev Book: From Zero to Production",
            'takeable': False,
            'points': 0
        },
        'publications': {
            'description': "Academic publications:\n" +
                         "- 6+ peer-reviewed papers on computer vision and machine learning\n" +
                         "- Conference presentations on AI in education\n" +
                         "- Research on automated feature extraction",
            'takeable': True,
            'points': 10
        },
        'certificates': {
            'description': f"Educational qualifications:\n" +
                         f"- PhD Computer Science (2017)\n" +
                         f"- BSc Computer Science Honours (2001)\n" +
                         f"- Graduate Diploma in Business (2000)",
            'takeable': True,
            'points': 15
        },
        'client_portfolio': {
            'description': "Consulting clients include:\n" +
                         "- CRCSI & Landgate WA (Computer Vision)\n" +
                         "- Educational institutions (AI Strategy)\n" +
                         "- Various startups (Technical Advisory)",
            'takeable': True,
            'points': 10
        },
        'consulting_toolkit': {
            'description': "Essential consulting tools:\n" +
                         "- AI/ML frameworks and platforms\n" +
                         "- Educational technology solutions\n" +
                         "- System architecture templates",
            'takeable': False,
            'points': 0
        }
    }
    
    # Extract skills for the game
    skills = {
        'programming': cv_data['skills']['programming'].get('core', []),
        'web': cv_data['skills']['programming'].get('web', []),
        'ai_ml': cv_data['skills']['programming'].get('ai_ml', []),
        'educational': cv_data['skills']['programming'].get('educational', []),
        'soft_skills': ['Leadership', 'Teaching', 'Problem Solving', 'Innovation', 'Communication']
    }
    
    # Create achievement system
    achievements = [
        {
            'id': 'explorer',
            'name': 'Career Explorer',
            'description': 'Visit all rooms in the career journey',
            'condition': 'visited_all_rooms',
            'points': 50
        },
        {
            'id': 'collector',
            'name': 'Knowledge Collector',
            'description': 'Collect 5 or more items',
            'condition': 'items_collected_5',
            'points': 30
        },
        {
            'id': 'scholar',
            'name': 'Academic Scholar',
            'description': 'Examine the thesis and publications',
            'condition': 'examined_research',
            'points': 25
        },
        {
            'id': 'innovator',
            'name': 'Innovation Enthusiast',
            'description': 'Explore all projects in the Innovation Lab',
            'condition': 'explored_innovations',
            'points': 35
        },
        {
            'id': 'networker',
            'name': 'Professional Networker',
            'description': 'Find and examine contact information',
            'condition': 'found_contacts',
            'points': 20
        }
    ]
    
    # Commands help text
    commands = {
        'help': 'Show available commands',
        'look': 'Look around the current room',
        'go [direction]': 'Move in a direction (north, south, east, west)',
        'examine [item]': 'Examine an item in detail',
        'take [item]': 'Take an item',
        'inventory': 'Show your inventory',
        'score': 'Show your current score',
        'achievements': 'Show available achievements',
        'skills': 'Display technical skills',
        'experience': 'Show work experience timeline',
        'contact': 'Display contact information',
        'clear': 'Clear the terminal screen',
        'restart': 'Restart the adventure',
        'about': 'About this terminal CV'
    }
    
    return {
        'rooms': rooms,
        'items': items,
        'skills': skills,
        'achievements': achievements,
        'commands': commands,
        'personal': cv_data['personal'],
        'experience': [
            {
                'title': exp['title'],
                'organization': exp['organization'],
                'period': exp['period']
            } for exp in cv_data['experience'][:5]  # Top 5 experiences
        ],
        'projects': [
            {
                'name': proj['name'],
                'description': proj.get('description', 'Innovative project')
            } for proj in cv_data.get('projects', [])[:5]  # Top 5 projects
        ]
    }

def main():
    """Main function to generate terminal CV data"""
    print("Generating Terminal CV data from cv-data.yml...")
    
    # Load CV data
    cv_data = load_cv_data()
    
    # Create terminal world
    terminal_data = create_terminal_world(cv_data)
    
    # Ensure output directory exists
    os.makedirs('creative/terminal/data', exist_ok=True)
    
    # Write to JSON file
    output_path = 'creative/terminal/data/terminal-data.json'
    with open(output_path, 'w') as f:
        json.dump(terminal_data, f, indent=2)
    
    print(f"✓ Terminal CV data generated: {output_path}")
    print(f"  - {len(terminal_data['rooms'])} rooms")
    print(f"  - {len(terminal_data['items'])} items")
    print(f"  - {len(terminal_data['achievements'])} achievements")
    print(f"  - {len(terminal_data['commands'])} commands")

if __name__ == "__main__":
    main()