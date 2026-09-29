from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.core.config import get_settings
from app.core.logging import configure_logging, logger

# Route imports
from app.api.routes.chat import router as chat_router
from app.api.routes.career import router as career_router
from app.api.routes.roadmap import router as roadmap_router
from app.api.routes.resume import router as resume_router
from app.api.routes.interview import router as interview_router
from app.api.routes.matching import router as matching_router
from app.api.routes.courses import router as courses_router

configure_logging()
settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Internal AI service for Career Readiness Platform powered by Gemini 3.5 Flash Lite",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "UP",
        "service": "career-readiness-ai",
        "model": settings.GEMINI_MODEL,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat()
    }

# Register Routers
app.include_router(chat_router)
app.include_router(career_router)
app.include_router(roadmap_router)
app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(matching_router)
app.include_router(courses_router)

@app.on_event("startup")
async def startup_event():
    logger.info(f"✨ AI Intelligence Service starting up with model: {settings.GEMINI_MODEL}")
