def precedent_risk(similar_cases):
    """
    similar_cases = [(case_id, similarity_score)]
    """

    if not similar_cases:
        return {
            "score": 0.3,
            "note": "No strong precedent alignment found"
        }

    avg_score = sum(score for _, score in similar_cases) / len(similar_cases)

    if avg_score >= 0.85:
        risk = 0.1
    elif avg_score >= 0.7:
        risk = 0.3
    else:
        risk = 0.6

    return {
        "score": risk,
        "note": "Risk based on precedent similarity strength"
    }
