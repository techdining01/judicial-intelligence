from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os

router = APIRouter()

# Set OpenAI API key - in production, use proper config
openai.api_key = os.getenv("OPENAI_API_KEY", "your-key-here")

class DialogueRequest(BaseModel):
    scenario_id: int
    user_message: str
    session_id: int

class DialogueResponse(BaseModel):
    judge_response: str
    score: float = None
    feedback: str = None

@router.post("/dialogue", response_model=DialogueResponse)
async def process_dialogue(request: DialogueRequest):
    # Mock scenario details - in real app, fetch from Django
    judge_persona = "strict constitutional judge"  # based on scenario

    prompt = f"""
    You are a {judge_persona} in a Nigerian moot court simulation.
    The user is presenting an argument. Respond as the judge would:
    - Ask probing questions
    - Challenge legal reasoning
    - Reference Nigerian law and precedents
    - Be professional and judicial

    User argument: {request.user_message}

    Respond as the judge:
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=500
        )
        judge_response = response.choices[0].message.content.strip()

        # Simple scoring logic
        score = min(1.0, len(request.user_message.split()) / 100)  # Mock
        feedback = "Consider citing specific sections of the Constitution."

        return DialogueResponse(
            judge_response=judge_response,
            score=score,
            feedback=feedback
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")