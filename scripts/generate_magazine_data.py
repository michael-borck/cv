#!/usr/bin/env python3
"""
Generate Magazine CV data from cv-data.yml for the TechLife Magazine format
"""

import yaml
import json
import os
from datetime import datetime

def load_cv_data():
    """Load CV data from YAML file"""
    with open('data/cv-data.yml', 'r') as f:
        return yaml.safe_load(f)

def create_magazine_content(cv_data):
    """Create magazine content from CV data"""
    
    # Current date for magazine issue
    current_date = datetime.now().strftime("%B %Y")
    issue_number = datetime.now().strftime("%Y%m")
    
    # Magazine sections with Unsplash images (using Unsplash Source API)
    magazine_data = {
        'metadata': {
            'title': 'TechLife Magazine',
            'subtitle': f'{cv_data["personal"]["name"]} Special Edition',
            'issue': f'Issue #{issue_number}',
            'date': current_date,
            'author': cv_data['personal']['name'],
            'tagline': 'Innovation • Leadership • Technology'
        },
        
        'hero': {
            'title': f'The {cv_data["personal"]["name"]} Story',
            'subtitle': 'From Military Service to AI Innovation',
            'lead': 'A journey through technology, education, and innovation spanning over two decades',
            'image': 'https://source.unsplash.com/1600x900/?technology,innovation',
            'stats': [
                {'value': '11+', 'label': 'Years Experience'},
                {'value': '100%', 'label': 'Student Satisfaction'},
                {'value': '4', 'label': 'Published Books'},
                {'value': '290+', 'label': 'App Downloads'}
            ]
        },
        
        'cover_story': {
            'title': 'The Evolution of a Tech Leader',
            'subtitle': 'From submarine systems to AI education',
            'image': 'https://source.unsplash.com/800x1200/?artificial-intelligence,education',
            'content': [
                {
                    'type': 'intro',
                    'text': f'Meet {cv_data["personal"]["name"]}, a technologist whose career spans military service, academia, and cutting-edge AI innovation.'
                },
                {
                    'type': 'chapter',
                    'title': 'Military Foundations',
                    'text': 'Beginning in the Royal Australian Navy, Michael managed critical submarine systems and military communications infrastructure, laying the groundwork for a career built on precision and reliability.',
                    'highlight': 'IT Manager for Submarine Systems Centre, handling classified defense projects'
                },
                {
                    'type': 'chapter',
                    'title': 'Academic Excellence',
                    'text': 'Transitioning to academia, Michael became a beloved educator at Curtin University, achieving the rare feat of 100% student satisfaction across multiple units.',
                    'highlight': 'AI Leader for School of Marketing and Management'
                },
                {
                    'type': 'chapter',
                    'title': 'Innovation Drive',
                    'text': 'As an innovator, Michael has created multiple AI-powered educational tools, published four technical books, and developed applications that bridge the gap between technology and practical learning.',
                    'highlight': 'Creator of Reality Reigns, Talk Buddy, and Cloud Core Sim'
                }
            ]
        },
        
        'features': [
            {
                'id': 'military',
                'category': 'CAREER MILESTONE',
                'title': 'Military Service Excellence',
                'subtitle': '1989-2000: Building the Foundation',
                'image': 'https://source.unsplash.com/800x600/?military,technology',
                'content': 'A decade of military service provided the discipline and technical expertise that would define a career.',
                'highlights': [
                    'Submarine Systems IT Management',
                    'Military Messaging Systems',
                    'Strategic Communications'
                ]
            },
            {
                'id': 'education',
                'category': 'ACADEMIC JOURNEY',
                'title': 'The Pursuit of Knowledge',
                'subtitle': 'PhD to Professional Excellence',
                'image': 'https://source.unsplash.com/800x600/?university,research',
                'content': 'From Bachelor\'s to PhD, a continuous journey of learning and discovery in Computer Science.',
                'highlights': [
                    'PhD in Computer Science (2017)',
                    'BSc Computer Science Honours (2001)',
                    'Graduate Diploma in Business (2000)'
                ]
            },
            {
                'id': 'teaching',
                'category': 'EDUCATION IMPACT',
                'title': 'Transforming Education with AI',
                'subtitle': 'Making Learning Engaging',
                'image': 'https://source.unsplash.com/800x600/?classroom,teaching',
                'content': 'Pioneering AI integration in education while maintaining the highest student satisfaction scores.',
                'highlights': [
                    '100% Student Satisfaction',
                    'AI Curriculum Development',
                    'Interactive Learning Tools'
                ]
            },
            {
                'id': 'innovation',
                'category': 'TECH INNOVATION',
                'title': 'Building Tomorrow\'s Tools',
                'subtitle': 'From Concept to Reality',
                'image': 'https://source.unsplash.com/800x600/?startup,innovation',
                'content': 'Creating practical applications that solve real-world problems in education and beyond.',
                'highlights': [
                    'Reality Reigns Game',
                    'Talk Buddy AI Interface',
                    'Cloud Core Simulator'
                ]
            }
        ],
        
        'spotlight': {
            'title': 'Project Spotlight',
            'projects': [
                {
                    'name': proj['name'],
                    'description': proj.get('description', ''),
                    'image': f'https://source.unsplash.com/400x300/?{proj["name"].lower().replace(" ", ",")},technology',
                    'tech': proj.get('tech', 'Python, AI/ML'),
                    'impact': proj.get('impact', 'Innovative solution')
                } for proj in cv_data.get('projects', [])[:4]
            ]
        },
        
        'tech_stack': {
            'title': 'Technology Arsenal',
            'subtitle': 'Tools and Technologies',
            'categories': [
                {
                    'name': 'Programming Languages',
                    'items': cv_data['skills']['programming'].get('core', []),
                    'icon': '💻'
                },
                {
                    'name': 'Web Technologies',
                    'items': cv_data['skills']['programming'].get('web', []),
                    'icon': '🌐'
                },
                {
                    'name': 'AI & Machine Learning',
                    'items': cv_data['skills']['programming'].get('ai_ml', []),
                    'icon': '🤖'
                },
                {
                    'name': 'Educational Tech',
                    'items': cv_data['skills']['programming'].get('educational', []),
                    'icon': '🎓'
                }
            ]
        },
        
        'timeline': {
            'title': 'Career Timeline',
            'subtitle': 'A Journey Through Tech',
            'events': [
                {
                    'year': exp['period'].split(' – ')[0] if ' – ' in exp['period'] else exp['period'].split(' - ')[0],
                    'title': exp['title'],
                    'organization': exp['organization'],
                    'description': exp.get('responsibilities', [''])[0] if exp.get('responsibilities') else '',
                    'type': 'military' if 'RAN' in exp['organization'] or 'HQADF' in exp['organization'] 
                           else 'academic' if 'University' in exp['organization']
                           else 'consulting'
                } for exp in cv_data['experience'][:8]
            ]
        },
        
        'testimonials': {
            'title': 'What Students Say',
            'quotes': [
                {
                    'text': 'Michael is an absolute legend. His passion for teaching and technology is infectious.',
                    'author': 'Anonymous Student',
                    'course': 'ISYS3015'
                },
                {
                    'text': 'He really cared about my learning and made complex topics accessible and fun.',
                    'author': 'Graduate Student',
                    'course': 'AI & Machine Learning'
                },
                {
                    'text': 'The best lecturer I\'ve had. Makes you excited about the possibilities of technology.',
                    'author': 'Anonymous Student',
                    'course': 'ISYS2001'
                }
            ]
        },
        
        'publications': {
            'title': 'Published Works',
            'subtitle': 'Books & Research',
            'books': [
                {
                    'title': 'Python Step By Step in an AI World',
                    'year': '2024',
                    'type': 'Technical Book',
                    'description': 'A comprehensive guide to Python in the age of AI',
                    'image': 'https://source.unsplash.com/300x450/?python,programming,book'
                },
                {
                    'title': 'JumpStart Python in the AI Era',
                    'year': '2024',
                    'type': 'Technical Book',
                    'description': 'Fast-track your Python skills for AI development',
                    'image': 'https://source.unsplash.com/300x450/?artificial,intelligence,book'
                },
                {
                    'title': 'Intentional Prompting',
                    'year': '2024',
                    'type': 'AI Guide',
                    'description': 'Blending AI and Human Oversight for optimal results',
                    'image': 'https://source.unsplash.com/300x450/?ai,robot,book'
                },
                {
                    'title': 'Python Dev Book',
                    'year': '2024',
                    'type': 'Technical Book',
                    'description': 'From Zero to Production - complete development guide',
                    'image': 'https://source.unsplash.com/300x450/?coding,development,book'
                }
            ],
            'research': '6+ peer-reviewed publications in computer vision and machine learning'
        },
        
        'contact': {
            'title': 'Get In Touch',
            'subtitle': 'Let\'s Connect',
            'email': cv_data['personal']['email'],
            'phone': cv_data['personal']['phone'],
            'linkedin': cv_data['personal']['linkedin'],
            'github': cv_data['personal']['github'],
            'location': cv_data['personal']['location'],
            'image': 'https://source.unsplash.com/800x400/?perth,australia,city'
        },
        
        'sidebar': {
            'quick_facts': [
                {'label': 'Current Role', 'value': 'Lecturer & AI Leader'},
                {'label': 'Location', 'value': cv_data['personal']['location']},
                {'label': 'Specialization', 'value': 'AI, Education, Innovation'},
                {'label': 'Years Experience', 'value': '11+'}
            ],
            'achievements': [
                '🏆 100% Student Satisfaction',
                '📚 4 Published Books',
                '🤖 AI Program Leader',
                '🎯 290+ App Downloads',
                '🔬 6+ Research Publications',
                '💡 Multiple Innovation Projects'
            ],
            'certifications': [cert['name'] for cert in cv_data.get('certifications', [])[:5]]
        }
    }
    
    return magazine_data

def main():
    """Main function to generate magazine data"""
    print("Generating Magazine CV data from cv-data.yml...")
    
    # Load CV data
    cv_data = load_cv_data()
    
    # Create magazine content
    magazine_data = create_magazine_content(cv_data)
    
    # Ensure output directory exists
    os.makedirs('creative/magazine/data', exist_ok=True)
    
    # Write to JSON file
    output_path = 'creative/magazine/data/magazine-data.json'
    with open(output_path, 'w') as f:
        json.dump(magazine_data, f, indent=2)
    
    print(f"✓ Magazine CV data generated: {output_path}")
    print(f"  - {len(magazine_data['features'])} feature articles")
    print(f"  - {len(magazine_data['spotlight']['projects'])} spotlighted projects")
    print(f"  - {len(magazine_data['publications']['books'])} published books")
    print(f"  - {len(magazine_data['timeline']['events'])} timeline events")

if __name__ == "__main__":
    main()