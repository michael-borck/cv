"""
FastAPI Resume API
Real-time API access to Michael Borck's resume data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import yaml
from typing import Dict, Any, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Michael Borck Resume API",
    description="REST API providing programmatic access to Michael Borck's professional resume data",
    version="1.0.0",
    contact={
        "name": "Michael Borck",
        "url": "https://michaelborck.dev",
        "email": "michael.borck@curtin.edu.au",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://michaelborck.dev",
        "https://resume.michaelborck.dev",
        "https://michaelborck.education",
        "http://localhost:3000",  # For local development
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Global variable to store CV data
cv_data: Dict[str, Any] = {}

@app.on_event("startup")
async def startup_event():
    """Load CV data from YAML file on startup"""
    try:
        # Try Docker path first, then local development path
        docker_path = Path("/app/data/cv-data.yml")
        local_path = Path(__file__).parent.parent / "data" / "cv-data.yml"
        
        if docker_path.exists():
            yaml_path = docker_path
        elif local_path.exists():
            yaml_path = local_path
        else:
            logger.error(f"CV data file not found at {docker_path} or {local_path}")
            raise FileNotFoundError(f"CV data file not found at {docker_path} or {local_path}")
        
        with open(yaml_path, 'r', encoding='utf-8') as file:
            global cv_data
            cv_data = yaml.safe_load(file)
            
        logger.info(f"Successfully loaded CV data from {yaml_path}")
        logger.info(f"Data keys: {list(cv_data.keys())}")
    except Exception as e:
        logger.error(f"Failed to load CV data: {e}")
        raise

@app.get("/", tags=["General"])
async def root():
    """API root endpoint with information about available endpoints"""
    return {
        "api": "Michael Borck Resume API",
        "version": "1.0.0",
        "description": "REST API providing access to resume/CV data",
        "documentation": "/docs",
        "endpoints": {
            "profile": "/profile - Basic profile information",
            "experience": "/experience - Work history and experience",
            "skills": "/skills - Technical skills and expertise",
            "education": "/education - Educational background",
            "projects": "/projects - Notable projects",
            "publications": "/publications - Books and publications",
            "achievements": "/achievements - Key achievements",
            "contact": "/contact - Contact information",
        },
        "source": "https://github.com/michael-borck/resume.michaelborck.dev",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "data_loaded": bool(cv_data)
    }

@app.get("/profile", tags=["Profile"])
async def get_profile():
    """Get basic profile information"""
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    personal = cv_data.get('personal', {})
    summary = cv_data.get('summary', {})
    
    return {
        "name": personal.get('name'),
        "email": personal.get('email'),
        "phone": personal.get('phone'),
        "location": personal.get('location'),
        "linkedin": personal.get('linkedin'),
        "github": personal.get('github'),
        "portfolio": personal.get('portfolio'),
        "education_platform": personal.get('education_platform'),
        "summary": summary.get('main'),
        "tagline": "Make Contact Count",
        "years_experience": 25,
        "books_published": 4
    }

@app.get("/experience", tags=["Experience"])
async def get_experience(
    type: Optional[str] = None,
    limit: Optional[int] = None
):
    """
    Get work experience
    
    - **type**: Filter by experience type (academic, consulting, military)
    - **limit**: Limit number of results
    """
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    experience = cv_data.get('experience', [])
    
    # Filter by type if specified
    if type:
        experience = [exp for exp in experience if type.lower() in str(exp).lower()]
    
    # Limit results if specified
    if limit and limit > 0:
        experience = experience[:limit]
    
    return {
        "total": len(experience),
        "filters": {
            "type": type,
            "limit": limit
        },
        "data": experience
    }

@app.get("/skills", tags=["Skills"])
async def get_skills(category: Optional[str] = None):
    """
    Get technical skills
    
    - **category**: Filter by category (programming, certifications, etc.)
    """
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    skills = cv_data.get('skills', {})
    
    if category:
        if category in skills:
            return {
                "category": category,
                "data": skills[category]
            }
        else:
            raise HTTPException(
                status_code=404, 
                detail=f"Category '{category}' not found. Available: {list(skills.keys())}"
            )
    
    return skills

@app.get("/education", tags=["Education"])
async def get_education():
    """Get educational background"""
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    return {
        "education": cv_data.get('education', [])
    }

@app.get("/projects", tags=["Projects"])
async def get_projects():
    """Get list of projects"""
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    return {
        "projects": cv_data.get('projects', [])
    }

@app.get("/publications", tags=["Publications"])
async def get_publications():
    """Get publications including books and papers"""
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    publications = cv_data.get('publications', {})
    return {
        "books": publications.get('books', []),
        "thesis": publications.get('thesis', []),
        "conferences": publications.get('conferences', []),
        "honours": publications.get('honours', [])
    }

@app.get("/achievements", tags=["Achievements"])
async def get_achievements():
    """Get key achievements"""
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    return {
        "achievements": cv_data.get('achievements', [])
    }

@app.get("/contact", tags=["Contact"])
async def get_contact():
    """Get contact information"""
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    personal = cv_data.get('personal', {})
    
    return {
        "email": personal.get('email'),
        "phone": personal.get('phone'),
        "linkedin": personal.get('linkedin'),
        "github": personal.get('github'),
        "location": personal.get('location'),
        "portfolio": personal.get('portfolio'),
        "education_platform": personal.get('education_platform')
    }

@app.get("/export", tags=["Export"])
async def export_cv(format: str = "json"):
    """
    Export complete CV data
    
    - **format**: Export format (json or yaml)
    """
    if not cv_data:
        raise HTTPException(status_code=503, detail="CV data not loaded")
    
    if format.lower() == "json":
        return cv_data
    elif format.lower() == "yaml":
        # Return YAML as plain text
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse(
            yaml.dump(cv_data, default_flow_style=False),
            media_type="text/yaml"
        )
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid format '{format}'. Supported: json, yaml"
        )

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not found",
            "message": str(exc.detail) if hasattr(exc, 'detail') else "Resource not found",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)