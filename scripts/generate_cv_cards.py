#!/usr/bin/env python3
"""
Generate CV Cards JSON from cv-data.yml for CV Quest game
"""

import yaml
import json
import os

def load_cv_data():
    """Load CV data from YAML file"""
    with open('data/cv-data.yml', 'r') as f:
        return yaml.safe_load(f)

def create_card_decks(cv_data):
    """Create game card decks from CV data"""
    
    # Initialize card decks and mini-games
    card_decks = {
        'main': [],
        'professional': [],
        'personal': [],
        'work': [],
        'education': [],
        'military': [],
        'academic': [],
        'industry': [],
        'projects': [],
        'skills': [],
        'achievements': []
    }
    
    mini_games = {}
    personal_cards = []
    
    # Main deck - entry point
    card_decks['main'] = [
        {
            'type': 'main',
            'title': 'Choose Your Path',
            'text': f'You discover the chronicles of {cv_data["personal"]["name"]}, a versatile technologist with {len(cv_data["experience"])} career chapters. Which aspect of their journey interests you most?',
            'icon': '🧭',
            'imagePath': 'assets/img/professional/office-equipment.png',
            'leftChoice': 'Professional Journey',
            'rightChoice': 'Personal Story',
            'leftResult': 'switchDeckFn("professional")',
            'rightResult': 'switchDeckFn("personal")'
        }
    ]
    
    # Professional deck
    card_decks['professional'] = [
        {
            'type': 'main',
            'title': 'Professional Focus',
            'text': f'{cv_data["personal"]["name"]} has built an impressive career spanning military service, academia, and industry. Which era would you like to explore?',
            'icon': '💼',
            'imagePath': 'assets/img/professional/developer.png',
            'leftChoice': 'Work Experience',
            'rightChoice': 'Education & Research',
            'leftResult': 'switchDeckFn("work")',
            'rightResult': 'switchDeckFn("education")'
        }
    ]
    
    # Personal deck
    card_decks['personal'] = [
        {
            'type': 'main',
            'title': 'Personal Journey',
            'text': f'Beyond the professional achievements, discover the person behind the CV. {cv_data["personal"]["name"]} has diverse interests and creative projects.',
            'icon': '🧩',
            'imagePath': 'assets/img/personal/creativity.png',
            'leftChoice': 'Projects & Innovation',
            'rightChoice': 'Skills & Interests',
            'leftResult': 'switchDeckFn("projects")',
            'rightResult': 'switchDeckFn("skills")'
        }
    ]
    
    # Work experience deck - add more cards and connect to industry
    card_decks['work'] = [
        {
            'type': 'work',
            'title': 'Career Timeline',
            'text': f'Three distinct phases define this journey: Military Service (1989-2000), Academia (2001-Present), and Consulting (2008-Present). Where shall we begin?',
            'icon': '⏰',
            'imagePath': 'assets/img/professional/leadership.png',
            'leftChoice': 'Military Era',
            'rightChoice': 'Academic Journey',
            'leftResult': 'switchDeckFn("military")',
            'rightResult': 'switchDeckFn("academic")'
        },
        {
            'type': 'work',
            'title': 'Industry & Consulting',
            'text': f'Beyond military and academia, {cv_data["personal"]["name"]} has extensive consulting experience across multiple industries.',
            'icon': '💼',
            'imagePath': 'assets/img/professional/office-equipment.png',
            'leftChoice': 'Explore Consulting',
            'rightChoice': 'Back to Timeline',
            'leftResult': 'switchDeckFn("industry")',
            'rightResult': 'switchDeckFn("work")'
        }
    ]
    
    # Process military experience
    military_cards = []
    for exp in cv_data['experience']:
        if 'RAN' in exp.get('organization', '') or 'HQADF' in exp.get('organization', ''):
            responsibilities = exp.get('responsibilities', [])
            resp_text = ' '.join(responsibilities[:2]) if responsibilities else ''
            
            military_cards.append({
                'type': 'work',
                'title': exp['title'],
                'text': f"{exp['organization']} ({exp['period']}): {resp_text}",
                'icon': '⚔️',
                'imagePath': 'assets/img/professional/leadership.png',
                'leftChoice': 'Learn Skills',
                'rightChoice': 'Continue Journey',
                'leftResult': 'addSkillFn("Leadership"); increaseStatsFn(2, 1, 1)',
                'rightResult': 'nextCard()'
            })
    
    # Add military cards to deck
    card_decks['military'] = military_cards[:2]  # Limit to first 2 for gameplay
    # Add navigation card at the end
    card_decks['military'].append({
        'type': 'navigation',
        'title': 'Military Journey Complete',
        'text': 'You have explored the military service era. Where to next?',
        'icon': '🎖️',
        'imagePath': 'assets/img/professional/leadership.png',
        'leftChoice': 'Explore Academia',
        'rightChoice': 'Back to Career Timeline',
        'leftResult': 'switchDeckFn("academic")',
        'rightResult': 'switchDeckFn("work")'
    })
    
    # Process academic experience
    academic_cards = []
    for exp in cv_data['experience']:
        if 'University' in exp.get('organization', ''):
            responsibilities = exp.get('responsibilities', [])
            resp_text = responsibilities[0] if responsibilities else ''
            
            academic_cards.append({
                'type': 'work',
                'title': exp['title'],
                'text': f"{exp['organization']}: {resp_text}",
                'icon': '🎓',
                'imagePath': 'assets/img/education/university.png',
                'leftChoice': 'View Achievements',
                'rightChoice': 'Explore More',
                'leftResult': 'showMiniGameFn("teachingChallenge")',
                'rightResult': 'nextCard()'
            })
    
    card_decks['academic'] = academic_cards[:2]
    # Add navigation card
    card_decks['academic'].append({
        'type': 'navigation',
        'title': 'Academic Path Complete',
        'text': f'{cv_data["personal"]["name"]} has achieved 100% student satisfaction and pioneered AI education. Continue exploring?',
        'icon': '🎓',
        'imagePath': 'assets/img/education/university.png',
        'leftChoice': 'View Projects',
        'rightChoice': 'Back to Career',
        'leftResult': 'switchDeckFn("projects")',
        'rightResult': 'switchDeckFn("work")'
    })
    
    # Process industry/consulting experience
    industry_cards = []
    for exp in cv_data['experience']:
        if 'Consultant' in exp.get('title', '') or 'Contractor' in exp.get('title', ''):
            responsibilities = exp.get('responsibilities', [])
            resp_text = responsibilities[0] if responsibilities else ''
            
            industry_cards.append({
                'type': 'work',
                'title': exp['title'],
                'text': f"{exp.get('organization', 'Independent')}: {resp_text}",
                'icon': '💡',
                'imagePath': 'assets/img/professional/developer.png',
                'leftChoice': 'Gain Experience',
                'rightChoice': 'Next Challenge',
                'leftResult': 'addSkillFn("Consulting"); increaseStatsFn(1, 2, 1)',
                'rightResult': 'nextCard()'
            })
    
    card_decks['industry'] = industry_cards[:2]
    # Add navigation card
    card_decks['industry'].append({
        'type': 'navigation',
        'title': 'Consulting Journey Complete',
        'text': 'You have explored the consulting and industry experience. Ready for more?',
        'icon': '💡',
        'imagePath': 'assets/img/professional/developer.png',
        'leftChoice': 'View Skills',
        'rightChoice': 'Back to Main',
        'leftResult': 'switchDeckFn("skills")',
        'rightResult': 'switchDeckFn("main")'
    })
    
    # Education deck
    education_cards = []
    for edu in cv_data['education']:
        education_cards.append({
            'type': 'education',
            'title': edu['degree'],
            'text': f"{edu['field']} at {edu['institution']} ({edu['year']})",
            'icon': '🎓',
            'imagePath': 'assets/img/education/certificate.png',
            'leftChoice': 'Add Qualification',
            'rightChoice': 'Continue',
            'leftResult': f'addSkillFn("{edu["field"]}"); increaseStatsFn(1, 0, 1)',
            'rightResult': 'nextCard()'
        })
    
    card_decks['education'] = education_cards[:3]
    # Add navigation card
    card_decks['education'].append({
        'type': 'navigation',
        'title': 'Education Complete',
        'text': 'A strong foundation in Computer Science, Mathematics, and Business. Continue your exploration?',
        'icon': '🎓',
        'imagePath': 'assets/img/education/certificate.png',
        'leftChoice': 'Explore Projects',
        'rightChoice': 'Back to Main',
        'leftResult': 'switchDeckFn("projects")',
        'rightResult': 'switchDeckFn("main")'
    })
    
    # Projects deck
    project_cards = []
    for proj in cv_data.get('projects', []):
        project_cards.append({
            'type': 'project',
            'title': proj['name'],
            'text': proj.get('description', 'An innovative project'),
            'icon': '🚀',
            'imagePath': 'assets/img/projects/ai-project.png',
            'leftChoice': 'Study Project',
            'rightChoice': 'Next Project',
            'leftResult': 'addSkillFn("Innovation"); increaseStatsFn(1, 1, 2)',
            'rightResult': 'nextCard()'
        })
    
    card_decks['projects'] = project_cards[:4]
    # Add navigation card
    card_decks['projects'].append({
        'type': 'navigation',
        'title': 'Projects Explored',
        'text': 'You have discovered innovative AI tools and educational platforms. What next?',
        'icon': '🚀',
        'imagePath': 'assets/img/projects/ai-project.png',
        'leftChoice': 'View Skills',
        'rightChoice': 'Back to Main',
        'leftResult': 'switchDeckFn("skills")',
        'rightResult': 'switchDeckFn("main")'
    })
    
    # Skills deck - extract key programming skills with unique images
    skills_cards = []
    skill_images = {
        'Python': 'assets/img/icons/programming-languages/python.png',
        'C/C++': 'assets/img/icons/programming-languages/c++.png',
        'C#': 'assets/img/icons/programming-languages/java.png',  # Using Java as placeholder
        'Java': 'assets/img/icons/programming-languages/java.png',
        'JavaScript': 'assets/img/icons/programming-languages/javascript.png',
        'Matlab': 'assets/img/icons/software-tools/tex.png',  # Using TeX as placeholder
        'PHP': 'assets/img/icons/programming-languages/php.png',
        'CSS': 'assets/img/icons/web-technologies/css.png',
        'HTML': 'assets/img/icons/web-technologies/html.png'
    }
    
    for i, skill in enumerate(cv_data['skills']['programming']['core'][:6]):
        image_path = skill_images.get(skill, 'assets/img/icons/development-methodologies/software-design.png')
        skills_cards.append({
            'type': 'skill',
            'title': f'Master {skill}',
            'text': f'You discover expertise in {skill}. This is a valuable skill in modern development.',
            'icon': '💻',
            'imagePath': image_path,
            'leftChoice': 'Learn Skill',
            'rightChoice': 'Skip to Next',
            'leftResult': f'addSkillFn("{skill}"); increaseStatsFn(2, 0, 0); nextCard()',
            'rightResult': 'nextCard()'
        })
    
    card_decks['skills'] = skills_cards[:5]
    # Add navigation card
    card_decks['skills'].append({
        'type': 'navigation',
        'title': 'Skills Mastered',
        'text': 'You have discovered a diverse technical skillset. Ready to complete your journey?',
        'icon': '💻',
        'imagePath': 'assets/img/icons/programming-languages/python.png',
        'leftChoice': 'View Achievements',
        'rightChoice': 'Back to Main',
        'leftResult': 'switchDeckFn("achievements")',
        'rightResult': 'switchDeckFn("main")'
    })
    
    # Achievements deck - highlight key accomplishments
    card_decks['achievements'] = [
        {
            'type': 'achievement',
            'title': '100% Student Satisfaction',
            'text': 'Achieved perfect satisfaction scores across multiple units including ISYS3015, ISYS2001, and ISYS6018.',
            'icon': '🏆',
            'imagePath': 'assets/img/education/university.png',
            'leftChoice': 'Amazing!',
            'rightChoice': 'Continue',
            'leftResult': 'addSkillFn("Excellence"); increaseStatsFn(0, 0, 3)',
            'rightResult': 'nextCard()'
        },
        {
            'type': 'achievement',
            'title': 'AI Leader & Innovator',
            'text': 'AI Leader for School of Marketing and Management, creator of multiple AI-powered educational tools.',
            'icon': '🤖',
            'imagePath': 'assets/img/projects/ai-project.png',
            'leftChoice': 'Impressive!',
            'rightChoice': 'Continue',
            'leftResult': 'addSkillFn("AI Leadership"); increaseStatsFn(2, 0, 2)',
            'rightResult': 'nextCard()'
        },
        {
            'type': 'achievement',
            'title': 'Published Author',
            'text': '4 technical books (Creative Commons licensed) and 6+ peer-reviewed publications in computer vision and machine learning.',
            'icon': '📚',
            'imagePath': 'assets/img/education/learning.png',
            'leftChoice': 'Scholarly!',
            'rightChoice': 'Continue',
            'leftResult': 'addSkillFn("Research"); increaseStatsFn(1, 0, 2)',
            'rightResult': 'nextCard()'
        },
        {
            'type': 'achievement',
            'title': 'Path Complete!',
            'text': f'You\'ve explored one path through {cv_data["personal"]["name"]}\'s journey. There are many more stories to discover! Try different choices to uncover all experiences.',
            'icon': '🎉',
            'imagePath': 'assets/img/personal/teamwork.png',
            'leftChoice': 'Contact Michael',
            'rightChoice': 'Explore More Paths',
            'leftResult': 'showNotificationFn("Thank you for playing! Contact: michael.borck@curtin.edu.au")',
            'rightResult': 'switchDeckFn("main")'
        }
    ]
    
    # Create mini-games
    mini_games['deploymentChallenge'] = {
        'title': 'DEPLOYMENT CHALLENGE',
        'description': 'A critical deployment is failing in production. How do you handle it?',
        'buttons': [
            {'text': 'Rollback immediately', 'result': 'increaseStatsFn(1, 2, 0); showNotificationFn("Crisis averted!")'},
            {'text': 'Debug in production', 'result': 'increaseStatsFn(2, 0, 1); showNotificationFn("Risky but educational!")'},
            {'text': 'Call the team', 'result': 'increaseStatsFn(0, 1, 2); showNotificationFn("Teamwork wins!")'} 
        ]
    }
    
    mini_games['teachingChallenge'] = {
        'title': 'TEACHING MOMENT',
        'description': 'A student is struggling with a complex concept. Your approach?',
        'buttons': [
            {'text': 'Use real-world examples', 'result': 'increaseStatsFn(0, 2, 2); showNotificationFn("Student breakthrough!")'},
            {'text': 'Provide extra resources', 'result': 'increaseStatsFn(1, 1, 1); showNotificationFn("Steady progress!")'},
            {'text': 'One-on-one mentoring', 'result': 'increaseStatsFn(0, 1, 3); showNotificationFn("Personal touch works!")'} 
        ]
    }
    
    mini_games['personalValues'] = {
        'title': 'CORE VALUES',
        'description': f'What drives {cv_data["personal"]["name"]} forward?',
        'buttons': [
            {'text': 'Innovation & Creation', 'result': 'increaseStatsFn(2, 0, 1); showNotificationFn("Creative spirit!")'},
            {'text': 'Teaching & Mentoring', 'result': 'increaseStatsFn(0, 1, 3); showNotificationFn("Educator at heart!")'},
            {'text': 'Problem Solving', 'result': 'increaseStatsFn(3, 0, 0); showNotificationFn("Solution finder!")'} 
        ]
    }
    
    # Personal cards for interests
    personal_cards = []
    for interest in cv_data.get('interests', []):
        personal_cards.append({
            'type': 'personal',
            'title': f'Personal Interest: {interest}',
            'text': f'Outside of work, {cv_data["personal"]["name"]} enjoys {interest}.',
            'icon': '🎯',
            'imagePath': 'assets/img/personal/creativity.png'
        })
    
    return {
        'cardDecks': card_decks,
        'miniGames': mini_games,
        'personalCards': personal_cards
    }

def main():
    """Main function to generate CV cards"""
    print("Generating CV cards from cv-data.yml...")
    
    # Load CV data
    cv_data = load_cv_data()
    
    # Create card decks
    game_data = create_card_decks(cv_data)
    
    # Ensure output directory exists
    os.makedirs('creative/quest/data', exist_ok=True)
    
    # Write to JSON file
    output_path = 'creative/quest/data/cv-cards.json'
    with open(output_path, 'w') as f:
        json.dump(game_data, f, indent=2)
    
    print(f"✓ CV cards generated: {output_path}")
    print(f"  - {len(game_data['cardDecks'])} card decks")
    print(f"  - {len(game_data['miniGames'])} mini-games")
    print(f"  - {len(game_data['personalCards'])} personal cards")

if __name__ == "__main__":
    main()