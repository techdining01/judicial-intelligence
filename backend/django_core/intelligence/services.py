import requests
from .models import CaseEmbedding, PrecedentResult
from courts.models import Case

FASTAPI_AI_URL = "http://fastapi:8001/ai/precedents"

def run_precedent_search(case: Case):
    source_embedding = CaseEmbedding.objects.get(case=case)

    all_embeddings = {
        emb.case.id: emb.vector
        for emb in CaseEmbedding.objects.exclude(case=case)
    }

    payload = {
        "case_id": case.id,
        "vector": source_embedding.vector,
        "all_vectors": all_embeddings,
    }

    response = requests.post(FASTAPI_AI_URL, json=payload)
    results = response.json()["matches"]

    for matched_case_id, score in results:
        PrecedentResult.objects.create(
            source_case=case,
            matched_case_id=matched_case_id,
            similarity_score=score,
        )
