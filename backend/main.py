from fastapi import FastAPI
from pydantic import BaseModel
from agent import mosin_ai_agent
from fastapi.middleware.cors import CORSMiddleware

# Initialize the Engine
app = FastAPI(title="MosinLSOps Core Engine", version="1.0.0")

# Security: CORS Policy (Allowing Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development mode (will restrict in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Data Model
class CommandRequest(BaseModel):
    command: str

# Health Check Endpoint (To verify system is alive)
@app.get("/")
def system_status():
    return {
        "status": "Online",
        "engine": "MosinLSOps AI Agentic Backend",
        "health": "100%"
    }

# Core AI Execution Endpoint
@app.post("/execute")
def execute_command(request: CommandRequest):
    print(f"📥 Received Command: {request.command}")
    
    # Sending command to our AI Brain
    ai_response = mosin_ai_agent(request.command)
    
    return {
        "status": "success",
        "response": ai_response
    }
  
