# LEGAL INTEL - BACKEND ARCHITECTURE

This document outlines the complete backend architecture for the Legal Intel platform, detailing the separation of concerns between Django and FastAPI services.

---

## OVERVIEW

Legal Intel uses a dual-service backend architecture:

### Django (Primary Backend)
- **Responsibility**: User management, SaaS operations, data persistence
- **Strengths**: Mature ORM, admin interface, authentication systems
- **Port**: 8000

### FastAPI (AI & Processing Services)
- **Responsibility**: AI reasoning, document processing, search, scraping
- **Strengths**: High performance, async processing, ML integration
- **Port**: 8002

---

## DJANGO SERVICE ARCHITECTURE

### Core Responsibilities

#### 1. Authentication & Authorization
```python
# apps/authentication/models.py
class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLES)
    subscription_tier = models.CharField(max_length=20, choices=SUBSCRIPTION_TIERS)
    jurisdiction = models.CharField(max_length=100)
    law_firm = models.CharField(max_length=200, blank=True)
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar_url = models.URLField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    bar_number = models.CharField(max_length=50, blank=True)
    practice_areas = models.JSONField(default=list)
```

#### 2. SaaS Management
```python
# apps/saas/models.py
class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=50)
    status = models.CharField(max_length=20)  # active, cancelled, expired
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    features = models.JSONField(default=dict)
    
class UsageTracking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.CharField(max_length=50)  # research, drafting, training
    usage_count = models.IntegerField(default=0)
    period = models.DateField()
```

#### 3. Data Models & Persistence
```python
# apps/legal_data/models.py
class LegalDocument(models.Model):
    title = models.CharField(max_length=500)
    document_type = models.CharField(max_length=50)  # judgment, statute, regulation
    jurisdiction = models.CharField(max_length=100)
    court = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    content = models.TextField()
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Case(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    case_number = models.CharField(max_length=100)
    jurisdiction = models.CharField(max_length=100)
    status = models.CharField(max_length=20)  # active, closed, archived
    created_at = models.DateTimeField(auto_now_add=True)
    
class Evidence(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='evidence')
    title = models.CharField(max_length=500)
    file = models.FileField(upload_to='evidence/')
    evidence_type = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    extracted_text = models.TextField(blank=True)
    tags = models.JSONField(default=list)
```

#### 4. Session Management
```python
# apps/sessions/models.py
class TrainingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_type = models.CharField(max_length=50)  # moot_court, video_courtroom
    scenario = models.CharField(max_length=100)
    status = models.CharField(max_length=20)  # active, paused, completed
    score = models.IntegerField(null=True)
    duration = models.IntegerField(null=True)  # seconds
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True)
    
class SessionTranscript(models.Model):
    session = models.ForeignKey(TrainingSession, on_delete=models.CASCADE, related_name='transcripts')
    speaker = models.CharField(max_length=100)
    text = models.TextField()
    timestamp = models.DateTimeField()
    message_type = models.CharField(max_length=20)  # statement, objection, ruling
```

### Django API Endpoints

#### Authentication
```python
# apps/authentication/api.py
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
POST /api/auth/refresh-token
GET  /api/auth/profile
PUT  /api/auth/profile
```

#### SaaS Management
```python
# apps/saas/api.py
GET  /api/subscription/current
POST /api/subscription/upgrade
GET  /api/usage/stats
POST /api/usage/track
```

#### Case Management
```python
# apps/legal_data/api.py
GET    /api/cases/
POST   /api/cases/
GET    /api/cases/{id}/
PUT    /api/cases/{id}/
DELETE /api/cases/{id}/
GET    /api/cases/{id}/evidence/
POST   /api/cases/{id}/evidence/
```

---

## FASTAPI SERVICE ARCHITECTURE

### Core Responsibilities

#### 1. AI Reasoning Engine
```python
# services/ai_engine/main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Legal AI Engine")

class ReasoningRequest(BaseModel):
    text: str
    context: dict
    legal_domain: str

@app.post("/api/ai/analyze-reasoning")
async def analyze_reasoning(request: ReasoningRequest):
    # AI reasoning logic
    return {
        "strength_score": 0.85,
        "legal_issues": ["contract breach", "damages"],
        "suggestions": ["cite precedent case", "strengthen factual basis"],
        "counterarguments": ["statute of limitations"]
    }
```

#### 2. Video Interaction Processing
```python
# services/video_interaction/main.py
class VideoSessionRequest(BaseModel):
    session_id: str
    user_input: str
    scenario: str

@app.post("/api/video/process-input")
async def process_video_input(request: VideoSessionRequest):
    # Process user input in video courtroom
    ai_response = await generate_ai_response(request.user_input, request.scenario)
    score_update = await calculate_score(request.session_id, request.user_input)
    
    return {
        "ai_response": ai_response,
        "score": score_update,
        "next_question": await generate_next_question(request.scenario)
    }
```

#### 3. Legal Document Scraping
```python
# services/scraping/main.py
@app.post("/api/scraping/court-judgments")
async def scrape_judgments(request: ScrapingRequest):
    # Web scraping logic for court websites
    judgments = await scrape_court_website(
        court=request.court,
        date_range=request.date_range,
        case_types=request.case_types
    )
    return {"judgments": judgments, "total": len(judgments)}
```

#### 4. Rules Engine
```python
# services/rules_engine/main.py
class RuleApplication(BaseModel):
    facts: list
    jurisdiction: str
    legal_area: str

@app.post("/api/rules/apply")
async def apply_legal_rules(request: RuleApplication):
    # Apply legal rules to facts
    applicable_rules = await find_applicable_rules(request.jurisdiction, request.legal_area)
    analysis = await analyze_against_rules(request.facts, applicable_rules)
    
    return {
        "applicable_rules": applicable_rules,
        "analysis": analysis,
        "recommendations": await generate_recommendations(analysis)
    }
```

#### 5. Vector Search
```python
# services/vector_search/main.py
@app.post("/api/search/semantic")
async def semantic_search(request: SearchRequest):
    # Vector similarity search
    embedding = await generate_embedding(request.query)
    similar_docs = await find_similar_documents(embedding, request.filters)
    
    return {
        "results": similar_docs,
        "total": len(similar_docs),
        "search_time": 0.05
    }
```

### FastAPI Service Structure

```
backend/fastapi/
├── services/
│   ├── ai_engine/
│   │   ├── main.py
│   │   ├── reasoning.py
│   │   ├── summarization.py
│   │   └── document_analysis.py
│   ├── video_interaction/
│   │   ├── main.py
│   │   ├── session_manager.py
│   │   ├── ai_responses.py
│   │   └── scoring.py
│   ├── scraping/
│   │   ├── main.py
│   │   ├── court_scrapers.py
│   │   ├── document_extractors.py
│   │   └── data_cleaners.py
│   ├── rules_engine/
│   │   ├── main.py
│   │   ├── rule_parser.py
│   │   ├── inference_engine.py
│   │   └── knowledge_base.py
│   └── vector_search/
│       ├── main.py
│       ├── embeddings.py
│       ├── similarity.py
│       └── indexing.py
├── shared/
│   ├── database.py
│   ├── auth.py
│   ├── models.py
│   └── utils.py
└── requirements.txt
```

---

## SERVICE COMMUNICATION

### Inter-Service API Calls

#### Django → FastAPI
```python
# Django service calling FastAPI
import httpx

async def get_ai_analysis(text: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8002/api/ai/analyze-reasoning",
            json={"text": text, "context": {}, "legal_domain": "contract_law"}
        )
        return response.json()
```

#### FastAPI → Django
```python
# FastAPI service calling Django
async def get_user_session(session_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:8000/api/sessions/{session_id}/"
        )
        return response.json()
```

### Authentication Across Services
```python
# Shared JWT token validation
import jwt
from fastapi import HTTPException, Depends

async def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

## DATABASE ARCHITECTURE

### Primary Database (PostgreSQL)
```sql
-- Django tables
users, user_profiles, subscriptions, usage_tracking
legal_documents, cases, evidence, training_sessions
session_transcripts, notifications, user_workspaces

-- Shared indexes
CREATE INDEX idx_documents_jurisdiction ON legal_documents(jurisdiction);
CREATE INDEX idx_cases_user_status ON cases(user_id, status);
CREATE INDEX idx_sessions_user_type ON training_sessions(user_id, session_type);
```

### Vector Database (Pinecone/Weaviate)
```python
# For semantic search
document_embeddings = {
    "document_id": "doc_123",
    "embedding": [0.1, 0.2, 0.3, ...],  # 768-dimensional vector
    "metadata": {
        "jurisdiction": "Lagos",
        "document_type": "judgment",
        "date": "2024-01-15"
    }
}
```

### Cache Layer (Redis)
```python
# Caching frequently accessed data
redis_client.setex(f"document:{doc_id}", 3600, document_json)
redis_client.setex(f"user:{user_id}:sessions", 1800, sessions_json)
```

---

## DEPLOYMENT ARCHITECTURE

### Container Configuration

#### Docker Compose
```yaml
version: '3.8'
services:
  django:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/legal_intel
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  fastapi:
    build: ./backend/fastapi
    ports:
      - "8002:8002"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/legal_intel
      - VECTOR_DB_URL=http://pinecone:8080
    depends_on:
      - db
      - pinecone

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=legal_intel
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  pinecone:
    image: pineconeio/pinecone:latest
    ports:
      - "8080:8080"
```

### Environment Variables

#### Django (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/legal_intel
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
FASTAPI_URL=http://localhost:8002
```

#### FastAPI (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/legal_intel
VECTOR_DB_API_KEY=your-pinecone-api-key
OPENAI_API_KEY=your-openai-api-key
DJANGO_URL=http://localhost:8000
```

---

## MONITORING & LOGGING

### Application Monitoring
```python
# Prometheus metrics
from prometheus_client import Counter, Histogram

REQUEST_COUNT = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    response = await call_next(request)
    REQUEST_DURATION.observe(time.time() - start_time)
    return response
```

### Structured Logging
```python
import structlog

logger = structlog.get_logger()

@app.post("/api/ai/analyze-reasoning")
async def analyze_reasoning(request: ReasoningRequest):
    logger.info("reasoning_request_started", 
                user_id=request.user_id, 
                text_length=len(request.text))
    
    try:
        result = await process_reasoning(request)
        logger.info("reasoning_request_completed", 
                    user_id=request.user_id,
                    score=result.strength_score)
        return result
    except Exception as e:
        logger.error("reasoning_request_failed", 
                     user_id=request.user_id,
                     error=str(e))
        raise
```

---

## SECURITY IMPLEMENTATION

### API Security
```python
# Rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/ai/analyze-reasoning")
@limiter.limit("100/minute")
async def analyze_reasoning(request: Request, reasoning_request: ReasoningRequest):
    pass
```

### Data Encryption
```python
from cryptography.fernet import Fernet

class EncryptionService:
    def __init__(self, key: str):
        self.cipher = Fernet(key.encode())
    
    def encrypt_sensitive_data(self, data: str) -> str:
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        return self.cipher.decrypt(encrypted_data.encode()).decode()
```

### Access Control
```python
# Role-based permissions
class Permission(Enum):
    READ_DOCUMENTS = "read_documents"
    WRITE_DOCUMENTS = "write_documents"
    USE_AI_SERVICES = "use_ai_services"
    MANAGE_SUBSCRIPTION = "manage_subscription"

def check_permission(user: User, permission: Permission):
    role_permissions = ROLE_PERMISSIONS.get(user.role, [])
    return permission in role_permissions
```

---

## PERFORMANCE OPTIMIZATION

### Database Optimization
```python
# Query optimization
from django.db.models import Prefetch, Q

# Efficient case loading with related evidence
cases = Case.objects.filter(
    user=request.user
).prefetch_related(
    Prefetch('evidence', queryset=Evidence.objects.order_by('-created_at'))
).select_related('user')

# Database connection pooling
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'legal_intel',
        'USER': 'user',
        'PASSWORD': 'pass',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'MAX_CONNS': 20,
            'MIN_CONNS': 5,
        }
    }
}
```

### Async Processing
```python
# Background tasks with Celery
from celery import Celery

app = Celery('legal_intel')

@app.task
async def process_document_async(document_id: int):
    document = LegalDocument.objects.get(id=document_id)
    # Send to FastAPI for processing
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://localhost:8002/api/documents/process",
            json={"document_id": document_id}
        )
```

---

This backend architecture provides a robust, scalable foundation for the Legal Intel platform, with clear separation of concerns between Django's data management strengths and FastAPI's AI processing capabilities.
