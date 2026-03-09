import requests
import json

BASE_URL = "http://127.0.0.1:8002"

def test_supported_states():
    """Test getting supported states"""
    response = requests.get(f"{BASE_URL}/rules/states")
    print(f"Supported States Status: {response.status_code}")
    print(f"Supported States: {response.json()}")
    return response.status_code == 200

def test_monetary_limit():
    """Test monetary limit endpoint"""
    data = {
        "state": "lagos",
        "court_type": "magistrate_court",
        "grade": "grade_a"
    }
    response = requests.post(f"{BASE_URL}/rules/monetary-limit", json=data)
    print(f"Monetary Limit Status: {response.status_code}")
    print(f"Monetary Limit: {response.json()}")
    return response.status_code == 200

def test_filing_fee():
    """Test filing fee calculation"""
    data = {
        "state": "lagos",
        "claim_amount": 750000
    }
    response = requests.post(f"{BASE_URL}/rules/filing-fee", json=data)
    print(f"Filing Fee Status: {response.status_code}")
    print(f"Filing Fee: {response.json()}")
    return response.status_code == 200

def test_hearing_timeline():
    """Test hearing timeline"""
    data = {
        "state": "lagos",
        "case_category": "civil_cases"
    }
    response = requests.post(f"{BASE_URL}/rules/hearing-timeline", json=data)
    print(f"Hearing Timeline Status: {response.status_code}")
    print(f"Hearing Timeline: {response.json()}")
    return response.status_code == 200

def test_comprehensive_case_info():
    """Test comprehensive case information"""
    data = {
        "state": "lagos",
        "case_details": {
            "court_type": "magistrate_court",
            "grade": "grade_a",
            "case_type": "contract_disputes",
            "case_category": "civil_cases",
            "division": "ikeja",
            "claim_amount": 750000,
            "incident_date": "2024-01-15"
        }
    }
    response = requests.post(f"{BASE_URL}/rules/comprehensive-case-info", json=data)
    print(f"Comprehensive Case Info Status: {response.status_code}")
    print(f"Comprehensive Case Info: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_state_comparison():
    """Test state comparison"""
    data = {
        "states": ["lagos", "kano", "rivers"],
        "rule_type": "monetary_limit",
        "params": {
            "court_type": "magistrate_court",
            "grade": "grade_a"
        }
    }
    response = requests.post(f"{BASE_URL}/rules/compare-states", json=data)
    print(f"State Comparison Status: {response.status_code}")
    print(f"State Comparison: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_kano_specific():
    """Test Kano-specific rules"""
    data = {
        "state": "kano",
        "court_type": "sharia_court",
        "sharia_level": "area_court"
    }
    response = requests.post(f"{BASE_URL}/rules/monetary-limit", json=data)
    print(f"Kano Sharia Court Status: {response.status_code}")
    print(f"Kano Sharia Court: {response.json()}")
    return response.status_code == 200

def test_rivers_specific():
    """Test Rivers-specific rules"""
    data = {
        "state": "rivers",
        "case_category": "oil_gas_cases"
    }
    response = requests.post(f"{BASE_URL}/rules/hearing-timeline", json=data)
    print(f"Rivers Oil & Gas Status: {response.status_code}")
    print(f"Rivers Oil & Gas: {response.json()}")
    return response.status_code == 200

if __name__ == "__main__":
    print("Testing Phase 4 - Legal Rules Engine")
    print("=" * 50)
    
    tests = [
        ("Supported States", test_supported_states),
        ("Monetary Limit", test_monetary_limit),
        ("Filing Fee", test_filing_fee),
        ("Hearing Timeline", test_hearing_timeline),
        ("Comprehensive Case Info", test_comprehensive_case_info),
        ("State Comparison", test_state_comparison),
        ("Kano Sharia Rules", test_kano_specific),
        ("Rivers Oil & Gas Rules", test_rivers_specific),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        print("-" * 30)
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"Error: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("PHASE 4 TEST RESULTS:")
    print("=" * 50)
    
    passed = 0
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 Phase 4 implementation is COMPLETE and WORKING!")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
