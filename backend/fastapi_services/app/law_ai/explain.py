from .prompts import LAW_EXPLAIN_PROMPT

def explain_law(law_text, llm):
    prompt = LAW_EXPLAIN_PROMPT.format(law_text=law_text)
    return llm.generate(prompt)
