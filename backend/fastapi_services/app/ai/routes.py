from fastapi import APIRouter
from pydantic import BaseModel
from .summarizer import summarize_text, explain_in_plain_english
from .embedding import generate_embedding
from fastapi import APIRouter
from pydantic import BaseModel
from .similarity import find_similar_cases



router = APIRouter()

class TextPayload(BaseModel):
    text: str

@router.post("/summarize")
def summarize(payload: TextPayload):
    return {
        "summary": summarize_text(payload.text),
        "plain_english": explain_in_plain_english(payload.text),
        "embedding": generate_embedding(payload.text)
    }



class PrecedentRequest(BaseModel):
    case_id: int
    vector: list[float]
    all_vectors: dict[int, list[float]]

@router.post("/precedents")
def search_precedents(payload: PrecedentRequest):
    matches = find_similar_cases(
        payload.vector, payload.all_vectors
    )
    return {"matches": matches}



@router.post("/daily-summary")
def daily_summary(payload: dict):
    return {"summary": "Generated summary"}

import os
import sqlite3
from pathlib import Path

# Path to Django SQLite DB (set DJANGO_DB_PATH or run from backend with default)
DB_PATH = Path(os.getenv("DJANGO_DB_PATH", str(Path(__file__).resolve().parents[3] / "django_core" / "db.sqlite3")))

@router.get("/simulations")
def get_simulations():
    # Directly query the shared SQLite database from FastAPI
    simulations = []
    try:
        if DB_PATH.exists():
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT id, title, description, category, video_url, ai_prompt_used, created_at FROM intelligence_aivideosimulation")
            rows = cursor.fetchall()
            for row in rows:
                simulations.append(dict(row))
            conn.close()
    except Exception as e:
        print(f"Error fetching simulations: {e}")
    
    return {"simulations": simulations}
