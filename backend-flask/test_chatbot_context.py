"""
Test Script untuk Chatbot NutriBot - Verifikasi Konteks Ketat
Script ini untuk testing apakah bot menolak pertanyaan off-topic
"""

import requests
import json

# Configuration
API_URL = "http://localhost:5000/api/chat"

# Test cases
test_cases = [
    {
        "name": "Test 1: Pertanyaan Off-Topic - Politik",
        "message": "Siapa presiden Indonesia?",
        "expected": "menolak dan mengarahkan ke meal planning"
    },
    {
        "name": "Test 2: Pertanyaan Off-Topic - Teknologi",
        "message": "Cara coding Python gimana?",
        "expected": "menolak dan mengarahkan ke meal planning"
    },
    {
        "name": "Test 3: Pertanyaan Off-Topic - Hiburan",
        "message": "Film bagus apa yang lagi trending?",
        "expected": "menolak dan mengarahkan ke meal planning"
    },
    {
        "name": "Test 4: Pertanyaan Off-Topic - Cuaca",
        "message": "Cuaca hari ini gimana?",
        "expected": "menolak dan mengarahkan ke meal planning"
    },
    {
        "name": "Test 5: Pertanyaan Off-Topic - Matematika",
        "message": "Berapa 123 x 456?",
        "expected": "menolak dan mengarahkan ke meal planning"
    },
    {
        "name": "Test 6: Pertanyaan On-Topic - Meal Planning",
        "message": "Buatin meal plan untuk diet 7 hari dong",
        "expected": "menjawab dengan meal plan"
    },
    {
        "name": "Test 7: Pertanyaan On-Topic - Nutrisi",
        "message": "Berapa kalori dalam ayam goreng?",
        "expected": "menjawab dengan informasi nutrisi"
    },
    {
        "name": "Test 8: Pertanyaan On-Topic - Resep",
        "message": "Resep salad sayur yang enak gimana?",
        "expected": "menjawab dengan resep"
    },
    {
        "name": "Test 9: Edge Case - Olahraga (dalam konteks diet)",
        "message": "Olahraga apa yang bagus untuk bakar kalori?",
        "expected": "menjawab karena masih dalam konteks diet"
    },
    {
        "name": "Test 10: Edge Case - Olahraga (di luar konteks)",
        "message": "Siapa juara NBA tahun ini?",
        "expected": "menolak dan mengarahkan ke meal planning"
    }
]

def test_chatbot(message):
    """Send message to chatbot and get response"""
    try:
        payload = {
            "message": message
        }
        
        response = requests.post(API_URL, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            return data.get('reply', 'No reply')
        else:
            return f"Error: {response.status_code} - {response.text}"
            
    except requests.exceptions.ConnectionError:
        return "Error: Cannot connect to backend. Make sure Flask server is running at http://localhost:5000"
    except Exception as e:
        return f"Error: {str(e)}"

def main():
    print("=" * 80)
    print("🧪 TESTING NUTRIBOT - KONTEKS KETAT")
    print("=" * 80)
    print()
    
    # Check if backend is running
    print("Checking backend connection...")
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running\n")
        else:
            print("⚠️  Backend responded but with unexpected status\n")
    except:
        print("❌ Backend is not running!")
        print("Please start the backend first:")
        print("  cd backend-flask")
        print("  python app.py")
        print()
        return
    
    # Run tests
    results = []
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'-' * 80}")
        print(f"{test['name']}")
        print(f"{'-' * 80}")
        print(f"📤 User: {test['message']}")
        print(f"🎯 Expected: {test['expected']}")
        print(f"⏳ Waiting for response...")
        
        reply = test_chatbot(test['message'])
        
        print(f"\n🤖 NutriBot:")
        print(f"{reply}")
        
        # Simple validation
        is_rejection = any(keyword in reply.lower() for keyword in [
            'maaf', 'spesialisasi', 'meal planning', 'nutrisi aja', 
            'di luar', 'cuma bisa', 'fokus', 'keahlian'
        ])
        
        if i <= 5 or i == 10:  # Off-topic questions
            status = "✅ PASS" if is_rejection else "❌ FAIL"
        else:  # On-topic questions
            status = "✅ PASS" if not is_rejection else "❌ FAIL"
        
        print(f"\n{status}")
        results.append({
            'test': test['name'],
            'status': status
        })
    
    # Summary
    print(f"\n\n{'=' * 80}")
    print("📊 TEST SUMMARY")
    print(f"{'=' * 80}")
    
    passed = sum(1 for r in results if '✅' in r['status'])
    total = len(results)
    
    for result in results:
        print(f"{result['status']} - {result['test']}")
    
    print(f"\n{'=' * 80}")
    print(f"Total: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    print(f"{'=' * 80}")
    
    if passed == total:
        print("\n🎉 All tests passed! Chatbot is working as expected.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the responses above.")
        print("\nNote: LLM responses can vary. Manual review is recommended.")

if __name__ == "__main__":
    main()
