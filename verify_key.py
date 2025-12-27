import requests
import sys

def verify_deepgram_key(api_key):
    url = "https://api.deepgram.com/v1/projects"
    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json"
    }
    
    print(f"Verifying key starting with: {api_key[:4]}...")
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:

            print("✅ SUCCESS: Your Deepgram API key is valid!")
            projects = response.json().get("projects", [])
            print(f"Found {len(projects)} project(s).")
            return True
        elif response.status_code == 401:
            print("❌ FAILED: Unauthorized (401). Your API key is invalid or has been revoked.")
            return False
        else:
            print(f"❓ UNKNOWN: Received status code {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"⚠️ ERROR: Could not connect to Deepgram. {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python verify_key.py YOUR_API_KEY")
    else:
        verify_deepgram_key(sys.argv[1])
