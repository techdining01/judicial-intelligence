"""
Judicial Intelligence Platform — FastAPI application.
Boundary: AI, scraping, rules engine, vector search. No auth/SaaS logic.
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer

from .alerts.sender import router as alert_router
from .ai.routes import router as ai_router
from .law_ai.routes import router as law_ai_router
from .auth.jwt import get_current_user

# Scraping routers (single router with both routes)
from .scraping.routers import router as scrape_router
from .routes.rules import router as rules_router
from .routes.training import router as training_router
from .routes.moot_court import router as moot_court_router
from .routes.notifications import router as notifications_router
from .routes.legal_research import router as legal_research_router
from .routes.legal_practice import router as legal_practice_router

app = FastAPI(
    title="Judicial Intelligence API",
    description="AI services, legal rules engine, scraping, and precedent search",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

app.include_router(alert_router, prefix="/alerts", tags=["alerts"])
app.include_router(ai_router, prefix="/ai", tags=["ai"])
app.include_router(law_ai_router, prefix="/law", tags=["law"])
app.include_router(scrape_router, prefix="/scrape", tags=["scraping"])
app.include_router(rules_router, prefix="/rules", tags=["rules"])
app.include_router(training_router, prefix="/training", tags=["training"])
app.include_router(moot_court_router, prefix="/moot-court", tags=["moot-court"])
app.include_router(notifications_router, prefix="/notifications", tags=["notifications"])
app.include_router(legal_research_router, prefix="/legal-research", tags=["legal-research"])
app.include_router(legal_practice_router, prefix="/legal-practice", tags=["legal-practice"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "judicial-intelligence-api"}


@app.get("/secure")
def secure(user=Depends(get_current_user)):
    return {"message": "Authorized", "user": user}
