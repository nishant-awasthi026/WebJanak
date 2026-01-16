
import requests
import json
import sys

url = "http://localhost:5000/v1/chat/completions"
headers = {"Content-Type": "application/json"}
data = {
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Generate a simple HTML button that says 'Click Me'"}
    ],
    "max_tokens": 100
}

print(f"Testing {url}...")
try:
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        print("✅ Server is responding!")
        print("Response:", response.json()['choices'][0]['message']['content'])
    else:
        print(f"❌ Server returned status {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Connection failed: {e}")
