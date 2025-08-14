# Resume API

Real REST API for Michael Borck's resume data, built with FastAPI.

## Features

- 🚀 **FastAPI** - Modern, fast web framework
- 📖 **Auto Documentation** - Interactive API docs at `/docs`
- 🔄 **Single Source of Truth** - Reads from `cv-data.yml`
- 🔒 **CORS Enabled** - Secure cross-origin requests
- 📦 **Docker Ready** - Easy deployment with containers
- ⚡ **Type Safe** - Pydantic models for validation

## Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /profile` - Basic profile information
- `GET /experience` - Work history (with filters)
- `GET /skills` - Technical skills
- `GET /education` - Educational background
- `GET /projects` - Project list
- `GET /publications` - Books and papers
- `GET /achievements` - Key achievements
- `GET /contact` - Contact information
- `GET /export?format=json|yaml` - Export full CV

## Local Development

### Install Dependencies
```bash
cd api/
pip install -r requirements.txt
```

### Run Development Server
```bash
uvicorn main:app --reload --port 8000
```

### Access API
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Docker Deployment

### Build and Run
```bash
# From the repository root (not api/ folder)
docker build -f api/Dockerfile -t resume-api .
docker run -p 8000:8000 resume-api
```

### Using Docker Compose
```bash
cd api/
docker-compose up -d
```

## Production Deployment (VPS)

### 1. Clone Repository
```bash
git clone https://github.com/michael-borck/resume.michaelborck.dev.git
cd resume.michaelborck.dev
```

### 2. Build and Run with Docker Compose
```bash
cd api/
docker-compose up -d
```

### 3. Configure Nginx (Reverse Proxy)
```nginx
server {
    server_name api.resume.michaelborck.dev;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. SSL with Let's Encrypt
```bash
sudo certbot --nginx -d api.resume.michaelborck.dev
```

## Environment Variables

Create `.env` file for production:
```env
ENV=production
LOG_LEVEL=info
CORS_ORIGINS=https://michaelborck.dev,https://resume.michaelborck.dev
```

## Testing

### Run Tests
```bash
pytest
```

### Test Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Get profile
curl http://localhost:8000/profile

# Get experience with filters
curl "http://localhost:8000/experience?type=academic&limit=5"

# Export as YAML
curl "http://localhost:8000/export?format=yaml"
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Tech Stack

- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **PyYAML** - YAML parsing
- **Docker** - Containerization

## License

MIT