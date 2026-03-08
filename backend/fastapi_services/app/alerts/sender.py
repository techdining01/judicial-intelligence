from fastapi import APIRouter
from pydantic import BaseModel
from .telegram import send_telegram_message

router = APIRouter()

class AlertPayload(BaseModel):
    chat_id: str
    message: str

@router.post("/send")
def send_alert(payload: AlertPayload):
    send_telegram_message(payload.chat_id, payload.message)
    return {"status": "sent"}
