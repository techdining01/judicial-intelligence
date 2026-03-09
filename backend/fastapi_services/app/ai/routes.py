from fastapi import APIRouter
from pydantic import BaseModel
from .summarizer import summarize_text, explain_in_plain_english
from .embedding import generate_embedding
from .normalization import structure_final_record
from .similarity import find_similar_cases
from .legal_drafting import generate_legal_document



router = APIRouter()

class TextPayload(BaseModel):
    text: str

class LegalDraftingRequest(BaseModel):
    document_type: str
    case_details: dict

@router.post("/legal-drafting")
def generate_document(request: LegalDraftingRequest):
    """Generate legal documents based on case details"""
    document = generate_legal_document(
        request.document_type,
        request.case_details
    )
    return {
        "document_type": request.document_type,
        "document": document,
        "status": "success"
    }

@router.post("/summarize")
def summarize(payload: TextPayload):
    return {
        "summary": summarize_text(payload.text),
        "plain_english": explain_in_plain_english(payload.text),
        "embedding": generate_embedding(payload.text)
    }

@router.post("/normalize")
def normalize_judgment(payload: TextPayload):
    record = structure_final_record(payload.text)
    return record

class JudgmentPayload(BaseModel):
    text: str
    case_id: int

@router.post("/process-judgment")
def process_judgment(payload: JudgmentPayload):
    # Normalize
    record = structure_final_record(payload.text)
    # Generate embedding
    embedding = generate_embedding(record['normalized_text'])
    # Store in DB
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Insert or update embedding
        cursor.execute("""
            INSERT OR REPLACE INTO intelligence_caseembedding (case_id, vector, created_at)
            VALUES (?, ?, datetime('now'))
        """, (payload.case_id, embedding))
        conn.commit()
        conn.close()
        return {"status": "success", "record": record}
    except Exception as e:
        return {"status": "error", "message": str(e)}



class PrecedentRequest(BaseModel):
    case_id: int
    vector: bytes
    all_vectors: dict[int, bytes]

@router.post("/precedents")
def search_precedents(payload: PrecedentRequest):
    try:
        # Convert bytes to numpy arrays
        target_vector = np.frombuffer(payload.vector, dtype=np.float32)
        all_vectors_converted = {}
        
        for case_id, vector_bytes in payload.all_vectors.items():
            vector = np.frombuffer(vector_bytes, dtype=np.float32)
            all_vectors_converted[int(case_id)] = vector.tolist()
        
        matches = find_similar_cases(
            target_vector.tolist(), 
            all_vectors_converted
        )
        return {"matches": matches, "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "error"}



@router.post("/daily-summary")
def daily_summary(payload: dict):
    return {"summary": "Generated summary"}

import os
import sqlite3
from pathlib import Path
import numpy as np

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
