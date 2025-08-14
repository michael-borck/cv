#!/usr/bin/env python3
"""
Generate API specification data from cv-data.yml
Creates mock API responses for the API CV documentation interface
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

def generate_api_responses(cv_data):
    """Generate API responses from CV data"""
    
    # Profile endpoint response
    profile = {
        "id": "michael-borck",
        "name": cv_data['personal']['name'],
        "title": "AI Leader & Cyber Security Expert",  # Derived from summary
        "email": cv_data['personal']['email'],
        "phone": cv_data['personal'].get('phone', 'Not provided'),
        "location": cv_data['personal']['location'],
        "linkedin": cv_data['personal']['linkedin'],
        "github": cv_data['personal']['github'],
        "portfolio": cv_data['personal'].get('portfolio', ''),
        "education_platform": cv_data['personal'].get('education_platform', ''),
        "summary": cv_data['summary']['main'],
        "tagline": cv_data['teaching']['philosophy']['core'],
        "years_experience": 25,  # From summary: "25+ years"
        "books_published": len(cv_data.get('publications', {}).get('books', [])),
        "teaching_philosophy": {
            "core": cv_data['teaching']['philosophy']['core'],
            "framework": cv_data['teaching']['philosophy']['framework'],
            "approach": cv_data['teaching']['philosophy']['approach']
        }
    }
    
    # Experience endpoint response
    experience_list = []
    for i, exp in enumerate(cv_data.get('experience', [])):
        experience_item = {
            "id": f"{exp['organization'].lower().replace(' ', '-').replace('.', '')}-{i}",
            "organization": exp['organization'],
            "position": exp['title'],  # Field is called 'title' in YAML
            "type": "academic" if "University" in exp['organization'] else "consulting",
            "period": exp.get('period', ''),
            "location": exp.get('location', ''),
            "description": exp.get('description', ''),
            "responsibilities": exp.get('responsibilities', []),
            "projects": exp.get('projects', [])
        }
        
        experience_list.append(experience_item)
    
    # Skills endpoint response
    skills = {
        "programming": {
            "languages": cv_data.get('skills', {}).get('programming', {}).get('languages', []),
            "frameworks": cv_data.get('skills', {}).get('programming', {}).get('frameworks', []),
            "specializations": ["AI/ML", "Web Development", "Data Analysis", "System Programming", "Educational Technology"]
        },
        "technologies": {
            "ai_ml": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV"],
            "databases": ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
            "cloud": ["AWS", "Azure", "Google Cloud"],
            "tools": ["Git", "Docker", "Linux", "Jupyter", "VS Code", "LaTeX"]
        },
        "domain_expertise": [
            "Artificial Intelligence",
            "Machine Learning", 
            "Cybersecurity",
            "Educational Technology",
            "Research Methodology",
            "Technical Writing",
            "Military Systems",
            "Assessment Innovation"
        ]
    }
    
    # Education endpoint response
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
    
    # Projects endpoint response
    projects_list = []
    for project in cv_data.get('projects', []):
        project_item = {
            "id": project.get('name', '').lower().replace(' ', '-'),
            "name": project.get('name', ''),
            "description": project.get('description', ''),
            "technologies": project.get('tech', []),
            "status": project.get('status', 'completed'),
            "impact": project.get('impact', ''),
            "url": project.get('url', ''),
            "github": project.get('github', '')
        }
        projects_list.append(project_item)
    
    # Publications endpoint response
    publications_list = []
    for book in cv_data.get('publications', {}).get('books', []):
        publication_item = {
            "id": book.get('title', '').lower().replace(' ', '-'),
            "title": book.get('title', ''),
            "type": book.get('type', 'Book'),
            "year": book.get('year', ''),
            "publisher": book.get('publisher', ''),
            "description": book.get('description', ''),
            "url": book.get('url', ''),
            "isbn": book.get('isbn', '')
        }
        publications_list.append(publication_item)
    
    # Achievements endpoint response
    achievements = cv_data.get('achievements', [])
    
    # Create API specification structure
    api_spec = {
        "profile": profile,
        "experience": experience_list,
        "skills": skills,
        "education": education_list,
        "projects": projects_list,
        "publications": publications_list,
        "achievements": achievements,
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "version": "1.0.0",
            "source": "cv-data.yml"
        }
    }
    
    return api_spec

def calculate_years_experience(cv_data):
    """Calculate total years of experience"""
    # This is a simplified calculation
    # In reality, you'd parse dates and calculate properly
    experience_years = 0
    for exp in cv_data.get('experience', []):
        if 'duration' in exp:
            duration_str = exp['duration'].lower()
            if 'year' in duration_str:
                # Extract number before 'year'
                import re
                match = re.search(r'(\d+)', duration_str)
                if match:
                    experience_years += int(match.group(1))
    
    return max(experience_years, 25)  # Minimum 25 years based on summary

def save_api_data(api_data, output_dir):
    """Save API data to JSON file"""
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'api-responses.json')
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(api_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ API responses generated: {output_file}")
        return True
        
    except Exception as e:
        print(f"Error saving API data: {e}")
        return False

def generate_openapi_spec(cv_data, api_data):
    """Generate OpenAPI 3.0 specification"""
    
    spec = {
        "openapi": "3.0.0",
        "info": {
            "title": "Michael Borck API",
            "version": "1.0.0",
            "description": "Professional REST API for exploring Michael Borck's career profile, skills, and experience through standardized endpoints.",
            "contact": {
                "name": "Michael Borck",
                "email": cv_data['personal']['email'],
                "url": f"https://linkedin.com/in/{cv_data['personal']['linkedin']}"
            },
            "license": {
                "name": "Creative Commons",
                "url": "https://creativecommons.org/"
            }
        },
        "servers": [
            {
                "url": "https://api.michael-borck.dev/v1",
                "description": "Production API"
            },
            {
                "url": "https://staging-api.michael-borck.dev/v1", 
                "description": "Staging environment"
            }
        ],
        "security": [
            {
                "bearerAuth": []
            }
        ],
        "paths": {
            "/profile": {
                "get": {
                    "summary": "Get basic profile information",
                    "description": "Returns basic profile information including name, title, location, and contact details.",
                    "tags": ["Profile"],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/Profile"}
                                }
                            }
                        }
                    }
                }
            },
            "/experience": {
                "get": {
                    "summary": "Get all work experience",
                    "description": "Returns complete work history with roles, responsibilities, and achievements.",
                    "tags": ["Experience"],
                    "parameters": [
                        {
                            "name": "type",
                            "in": "query",
                            "schema": {"type": "string", "enum": ["academic", "military", "industry", "consulting"]},
                            "description": "Filter by experience type"
                        },
                        {
                            "name": "limit",
                            "in": "query", 
                            "schema": {"type": "integer", "minimum": 1, "maximum": 50},
                            "description": "Maximum number of records to return"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/ExperienceList"}
                                }
                            }
                        }
                    }
                }
            },
            "/experience/{id}": {
                "get": {
                    "summary": "Get specific experience by ID",
                    "description": "Returns detailed information about a specific work experience.",
                    "tags": ["Experience"],
                    "parameters": [
                        {
                            "name": "id",
                            "in": "path",
                            "required": True,
                            "schema": {"type": "string"},
                            "description": "Experience record ID"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/Experience"}
                                }
                            }
                        },
                        "404": {
                            "description": "Experience not found"
                        }
                    }
                }
            },
            "/skills": {
                "get": {
                    "summary": "Get all skills by category",
                    "description": "Returns technical skills organized by category (programming, tools, domain expertise).",
                    "tags": ["Skills"],
                    "parameters": [
                        {
                            "name": "category",
                            "in": "query",
                            "schema": {"type": "string", "enum": ["programming", "technologies", "domain_expertise"]},
                            "description": "Filter by skill category"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/Skills"}
                                }
                            }
                        }
                    }
                }
            },
            "/contact": {
                "post": {
                    "summary": "Send a contact message",
                    "description": "Submit a contact form message.",
                    "tags": ["Contact"],
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/ContactRequest"}
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Message sent successfully",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/ContactResponse"}
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid request"
                        }
                    }
                }
            }
        },
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            },
            "schemas": {
                "Profile": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "name": {"type": "string"},
                        "title": {"type": "string"},
                        "email": {"type": "string", "format": "email"},
                        "phone": {"type": "string"},
                        "location": {"type": "string"},
                        "linkedin": {"type": "string", "format": "uri"},
                        "github": {"type": "string", "format": "uri"},
                        "summary": {"type": "string"},
                        "years_experience": {"type": "integer"},
                        "books_published": {"type": "integer"}
                    }
                },
                "Experience": {
                    "type": "object", 
                    "properties": {
                        "id": {"type": "string"},
                        "organization": {"type": "string"},
                        "position": {"type": "string"},
                        "type": {"type": "string"},
                        "start_date": {"type": "string"},
                        "end_date": {"type": "string"},
                        "duration": {"type": "string"},
                        "description": {"type": "string"},
                        "key_responsibilities": {
                            "type": "array",
                            "items": {"type": "string"}
                        },
                        "achievements": {
                            "type": "array", 
                            "items": {"type": "string"}
                        }
                    }
                },
                "ExperienceList": {
                    "type": "object",
                    "properties": {
                        "total": {"type": "integer"},
                        "data": {
                            "type": "array",
                            "items": {"$ref": "#/components/schemas/Experience"}
                        }
                    }
                },
                "Skills": {
                    "type": "object",
                    "properties": {
                        "programming": {
                            "type": "object",
                            "properties": {
                                "languages": {"type": "array", "items": {"type": "string"}},
                                "frameworks": {"type": "array", "items": {"type": "string"}}
                            }
                        },
                        "technologies": {
                            "type": "object",
                            "properties": {
                                "ai_ml": {"type": "array", "items": {"type": "string"}},
                                "databases": {"type": "array", "items": {"type": "string"}},
                                "cloud": {"type": "array", "items": {"type": "string"}}
                            }
                        }
                    }
                },
                "ContactRequest": {
                    "type": "object",
                    "required": ["name", "email", "message"],
                    "properties": {
                        "name": {"type": "string"},
                        "email": {"type": "string", "format": "email"},
                        "subject": {"type": "string"},
                        "message": {"type": "string"}
                    }
                },
                "ContactResponse": {
                    "type": "object",
                    "properties": {
                        "status": {"type": "string"},
                        "message": {"type": "string"},
                        "id": {"type": "string"},
                        "timestamp": {"type": "string", "format": "date-time"}
                    }
                }
            }
        }
    }
    
    return spec

def main():
    """Main function to generate API documentation data"""
    print("Generating API CV data from cv-data.yml...")
    
    # Load CV data
    cv_data = load_cv_data()
    if not cv_data:
        return False
    
    # Generate API responses
    api_data = generate_api_responses(cv_data)
    
    # Generate OpenAPI spec
    openapi_spec = generate_openapi_spec(cv_data, api_data)
    
    # Save files
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'creative', 'api', 'data')
    
    success = True
    
    # Save API responses
    if not save_api_data(api_data, output_dir):
        success = False
    
    # Save OpenAPI spec
    spec_file = os.path.join(output_dir, 'openapi-spec.json')
    try:
        with open(spec_file, 'w', encoding='utf-8') as f:
            json.dump(openapi_spec, f, indent=2, ensure_ascii=False)
        print(f"✓ OpenAPI spec generated: {spec_file}")
    except Exception as e:
        print(f"Error saving OpenAPI spec: {e}")
        success = False
    
    if success:
        print(f"\n✓ API CV data generated successfully!")
        print(f"  - {len(api_data['experience'])} experience records")
        print(f"  - {len(api_data['projects'])} projects")
        print(f"  - {len(api_data['publications'])} publications")
        print(f"  - {len(api_data['achievements'])} achievements")
        
    return success

if __name__ == "__main__":
    main()