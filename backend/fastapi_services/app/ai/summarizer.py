import os
from google import genai
from dotenv import load_dotenv
from decouple import config

load_dotenv(".env")

client = genai.Client(
    api_key=config("GEMINI_KEY", default=os.getenv("GEMINI_KEY"))
)

MODEL = "gemini-2.0-flash"



def summarize_text(text: str) -> str:
    prompt = f"""
    Summarize the following Nigerian legal text clearly and professionally.
    Preserve legal meaning. Avoid speculation.

    TEXT:
    {text}
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text.strip()


def explain_in_plain_english(text: str) -> str:
    prompt = f"""
    Explain the following Nigerian legal text in very simple English.
    Assume the reader has no legal background.
    Do NOT remove legal meaning.

    TEXT:
    {text}
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text.strip()


def summarize_cases(cases: list[str]) -> str:
    combined = "\n\n---\n\n".join(cases)

    prompt = f"""
    You are analyzing multiple Nigerian court cases.
    Produce:
    1. A combined summary
    2. Key legal principles
    3. Common patterns

    CASES:
    {combined}
    """

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text.strip()
