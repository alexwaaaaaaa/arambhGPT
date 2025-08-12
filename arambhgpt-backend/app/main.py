from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import routers
from .auth import router as auth_router
from .chat import router as chat_router
from .history import router as history_router
from .mood import router as mood_router
from .notifications import router as notifications_router
from .social import router as social_router
from .ai_context import router as ai_context_router
from .ai_learning import router as ai_learning_router
from .feedback_system import router as feedback_router
from .professionals import router as professionals_router
from .communication import router as communication_router
from .webrtc_signaling import router as webrtc_router
from .wallet import router as wallet_router
from .file_upload import router as file_upload_router
from .professional_auth import router as professional_auth_router

# Create FastAPI app
app = FastAPI(
    title="ArambhGPT API",
    description="AI-powered mental health chat API with Honey",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(chat_router, tags=["chat"])
app.include_router(history_router, tags=["history"])
app.include_router(mood_router, tags=["mood"])
app.include_router(notifications_router, tags=["notifications"])
app.include_router(social_router, tags=["social"])
app.include_router(ai_context_router, tags=["ai-context"])
app.include_router(ai_learning_router, tags=["ai-learning"])
app.include_router(feedback_router, tags=["feedback"])
app.include_router(professionals_router, tags=["professionals"])
app.include_router(file_upload_router, tags=["file-upload"])
app.include_router(professional_auth_router, tags=["professional-auth"])
app.include_router(wallet_router, tags=["wallet"])
app.include_router(communication_router, prefix="/api/communication", tags=["communication"])
app.include_router(webrtc_router, prefix="/api/webrtc", tags=["webrtc"])

@app.get("/")
async def root():
    return {"message": "ArambhGPT API with Honey is running! 🍯"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ArambhGPT API", "ai": "Honey"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "True").lower() == "true"
    )