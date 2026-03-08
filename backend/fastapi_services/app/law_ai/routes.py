from fastapi import APIRouter
from pydantic import BaseModel
from .explain import explain_law

router = APIRouter()

class LawExplainRequest(BaseModel):
    law_text: str

@router.post("/explain-law")
def explain(payload: LawExplainRequest):
    explanation = explain_law(payload.law_text, llm=None)
    return {"explanation": explanation}
