from pydantic import BaseModel
from typing import List

class TextInput(BaseModel):
    text: str

class CaseListInput(BaseModel):
    cases: List[str]
