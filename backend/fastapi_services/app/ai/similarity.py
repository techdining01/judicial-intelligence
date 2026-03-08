import numpy as np
from numpy.linalg import norm

def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return float(np.dot(vec1, vec2) / (norm(vec1) * norm(vec2)))


def find_similar_cases(target_vector, all_vectors, threshold=0.75):
    results = []

    for case_id, vector in all_vectors.items():
        score = cosine_similarity(target_vector, vector)
        if score >= threshold:
            results.append((case_id, score))

    results.sort(key=lambda x: x[1], reverse=True)
    return results


