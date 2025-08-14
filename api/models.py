"""
Pydantic models for API request/response validation
"""

from pydantic import BaseModel, Field, EmailStr, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class ExperienceType(str, Enum):
    academic = "academic"
    consulting = "consulting"
    military = "military"
    industry = "industry"

class SkillCategory(str, Enum):
    programming = "programming"
    certifications = "certifications"
    web = "web"
    ai_ml = "ai_ml"
    educational = "educational"

# Response Models
class ProfileResponse(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: str
    linkedin: Optional[HttpUrl]
    github: Optional[HttpUrl]
    portfolio: Optional[HttpUrl]
    education_platform: Optional[HttpUrl]
    summary: str
    tagline: str
    years_experience: int
    books_published: int

class ExperienceItem(BaseModel):
    title: str = Field(..., description="Job title or position")
    organization: str = Field(..., description="Company or organization name")
    location: Optional[str] = Field(None, description="Work location")
    period: str = Field(..., description="Employment period")
    responsibilities: List[str] = Field(default=[], description="Key responsibilities")
    projects: Optional[List[str]] = Field(default=[], description="Notable projects")

class ExperienceResponse(BaseModel):
    total: int = Field(..., description="Total number of experience items")
    filters: Dict[str, Any] = Field(..., description="Applied filters")
    data: List[ExperienceItem]

class EducationItem(BaseModel):
    degree: str
    field: Optional[str]
    institution: str
    year: Optional[int]
    thesis: Optional[str]

class ProjectItem(BaseModel):
    name: str
    description: Optional[str]
    year: Optional[str]
    technologies: Optional[List[str]] = []
    url: Optional[HttpUrl] = None
    github: Optional[HttpUrl] = None

class PublicationBook(BaseModel):
    title: str
    description: Optional[str]
    license: Optional[str]

class PublicationConference(BaseModel):
    authors: str
    year: int
    title: str
    venue: str
    location: Optional[str]
    publisher: Optional[str]
    volume: Optional[str]
    pages: Optional[str]

class PublicationsResponse(BaseModel):
    books: List[PublicationBook] = []
    thesis: List[Dict[str, Any]] = []
    conferences: List[PublicationConference] = []
    honours: List[Dict[str, Any]] = []

class SkillSet(BaseModel):
    core: Optional[List[str]] = []
    web: Optional[List[str]] = []
    ai_ml: Optional[List[str]] = []
    educational: Optional[List[str]] = []

class CertificationItem(BaseModel):
    name: str
    year: Optional[int]

class ContactInfo(BaseModel):
    email: EmailStr
    phone: Optional[str]
    linkedin: Optional[HttpUrl]
    github: Optional[HttpUrl]
    location: Optional[str]
    portfolio: Optional[HttpUrl]
    education_platform: Optional[HttpUrl]

class ContactMessage(BaseModel):
    """Model for contact form submission"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    
class ContactResponse(BaseModel):
    """Response after contact form submission"""
    success: bool
    message: str
    id: str
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    data_loaded: bool

class ErrorResponse(BaseModel):
    error: str
    message: str
    timestamp: datetime

class APIInfoResponse(BaseModel):
    api: str
    version: str
    description: str
    documentation: str
    endpoints: Dict[str, str]
    source: str
    timestamp: datetime

# Search/Filter Models
class ExperienceFilter(BaseModel):
    type: Optional[ExperienceType] = None
    organization: Optional[str] = None
    year_start: Optional[int] = None
    year_end: Optional[int] = None
    limit: Optional[int] = Field(None, ge=1, le=50)

class SkillSearch(BaseModel):
    query: str = Field(..., min_length=1, max_length=50)
    category: Optional[SkillCategory] = None

# Export format enum
class ExportFormat(str, Enum):
    json = "json"
    yaml = "yaml"
    
# Pagination models
class PaginationParams(BaseModel):
    skip: int = Field(0, ge=0, description="Number of items to skip")
    limit: int = Field(10, ge=1, le=100, description="Number of items to return")

# Response metadata
class ResponseMetadata(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = "1.0.0"
    source: str = "cv-data.yml"