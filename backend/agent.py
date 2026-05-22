import os
import requests
from dotenv import load_dotenv

# Load environment variables (.env se key nikalega, security ke liye)
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
# Level 10 Open-Source Model (Mistral 7B) for DevOps intelligence
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def mosin_ai_agent(user_command: str):
    if not HF_TOKEN:
        return "🚨 System Error: HF_TOKEN is missing. Please set it in your .env file."

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    
    # AI ko Mosin Ops Engineer ka roop dena
    prompt = f"<s>[INST] You are Mosin Ops, an elite AI DevOps platform. Convert the following user request into a clear DevOps execution plan, YAML, or Docker configuration. Be professional and output only the technical solution. Request: {user_command} [/INST]"
    
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 500, "temperature": 0.2}
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response_data = response.json()
        
        # Catch Hugging Face model loading delays
        if isinstance(response_data, dict) and "error" in response_data:
            return f"🚨 AI Engine Booting Up: {response_data['error']} (Please wait 10 seconds and retry)"
            
        # Clean up output to remove the prompt text
        output = response_data[0]['generated_text'].replace(prompt, "").strip()
        return output
    except Exception as e:
        return f"🚨 Engine Crash: {str(e)}"

if __name__ == "__main__":
    print("🚀 Mosin Ops Level 10 AI Agent Initialized!")
    print("Running diagnostic test...")
    # Demo command to test the brain locally
    test_request = "Write a Dockerfile for a Python FastAPI app"
    result = mosin_ai_agent(test_request)
    print(f"\n💡 AI Response:\n{result}")
  
