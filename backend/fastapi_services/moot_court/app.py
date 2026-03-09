from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai  # assuming OpenAI API
import os

app = FastAPI(title="AI Moot Court Engine")

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

class DialogueRequest(BaseModel):
    scenario_id: int
    user_message: str
    session_id: int

class DialogueResponse(BaseModel):
    judge_response: str
    score: float = None
    feedback: str = None

@app.post("/dialogue", response_model=DialogueResponse)
async def process_dialogue(request: DialogueRequest):
    # Here, integrate with Django to get scenario details
    # For now, mock
    scenario_prompt = f"Act as a {request.scenario_id} judge in a moot court. Respond to: {request.user_message}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": scenario_prompt},
                {"role": "user", "content": request.user_message}
            ]
        )
        judge_response = response.choices[0].message.content

        # Mock scoring
        score = 0.8
        feedback = "Good argument, but cite more precedents."

        return DialogueResponse(judge_response=judge_response, score=score, feedback=feedback)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))