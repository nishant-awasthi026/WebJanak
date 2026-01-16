
import requests
import json
import time

def test_model_server():
    print("\n🔍 Testing Model Server (Port 5000)...")
    try:
        # 1. Health Check
        print("  Checking /health...")
        resp = requests.get("http://localhost:5000/health", timeout=5)
        print(f"  Health Status: {resp.status_code}")
        print(f"  Response: {resp.text}")

        # 2. Generation Check
        print("  Testing direct generation...")
        payload = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say hello!"}
            ],
            "max_tokens": 50
        }
        start = time.time()
        resp = requests.post("http://localhost:5000/v1/chat/completions", json=payload, timeout=30)
        dur = time.time() - start
        
        if resp.status_code == 200:
            print(f"  ✅ Generation Successful ({dur:.2f}s)")
            print(f"  Output: {resp.json()['choices'][0]['message']['content']}")
        else:
            print(f"  ❌ Generation Failed: {resp.status_code}")
            print(f"  Error: {resp.text}")
            
    except Exception as e:
        print(f"  ❌ Model Server Error: {e}")

def test_backend_server():
    print("\n🔍 Testing Node.js Backend (Port 3000)...")
    try:
        print("  Testing /api/generate endpoint...")
        payload = {"prompt": "Create a simple button"}
        start = time.time()
        resp = requests.post("http://localhost:3000/api/generate", json=payload, timeout=30)
        dur = time.time() - start
        
        if resp.status_code == 200:
            data = resp.json()
            if data.get('success'):
                print(f"  ✅ Backend Verification Successful ({dur:.2f}s)")
                print(f"  Generated Code Length: {len(data.get('code', ''))} chars")
            else:
                print(f"  ❌ Backend Returned Error: {data.get('error')}")
        else:
            print(f"  ❌ Backend Failed: {resp.status_code}")
            print(f"  Error: {resp.text[:200]}") # Print first 200 chars
            
    except Exception as e:
        print(f"  ❌ Backend Connection Error: {e}")

if __name__ == "__main__":
    print("="*60)
    print("🚀 WebJanak Diagnostic Tool")
    print("="*60)
    test_model_server()
    test_backend_server()
    print("\n" + "="*60)
