import requests
import json

# Test the normalization endpoint first (doesn't require API key)
def test_normalization():
    url = "http://127.0.0.1:8001/ai/normalize"
    data = {"text": "The court considered the matter of contract breach between the plaintiff and defendant. After reviewing the evidence, the court found in favor of the plaintiff."}
    
    try:
        response = requests.post(url, json=data)
        print(f"Normalization Status: {response.status_code}")
        print(f"Normalization Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Normalization Error: {e}")
        return False

# Test legal drafting (requires API key)
def test_legal_drafting():
    url = "http://127.0.0.1:8001/ai/legal-drafting"
    data = {
        "document_type": "motion",
        "case_details": {
            "case_type": "Contract Law",
            "legal_issue": "Breach of Contract",
            "jurisdiction": "Lagos State High Court",
            "facts": "The plaintiff claims the defendant failed to deliver goods as agreed."
        }
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Legal Drafting Status: {response.status_code}")
        print(f"Legal Drafting Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Legal Drafting Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Phase 3 AI Implementation...")
    print("=" * 50)
    
    # Test normalization (should work without API key)
    print("1. Testing Normalization Pipeline:")
    test_normalization()
    
    print("\n2. Testing Legal Drafting:")
    test_legal_drafting()
    
    print("\nPhase 3 testing completed.")
