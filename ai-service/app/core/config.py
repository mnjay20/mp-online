from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "AI Career Intelligence Service"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # Google AI / Gemini API Credentials
    GOOGLE_API_KEY: str = "placeholder-gemini-key"
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    TAVILY_API_KEY: str = ""
    
    # Groq API for Whisper STT
    GROQ_API_KEY: str = ""
    GROQ_WHISPER_MODEL: str = "whisper-large-v3-turbo"
    
    # Backend URL for internal callbacks / queries if needed
    BACKEND_URL: str = "http://localhost:5000"
    
    # Supabase credentials for pgvector & read-only tools
    SUPABASE_URL: str = "https://placeholder.supabase.co"
    SUPABASE_ANON_KEY: str = "placeholder-anon-key"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache()
def get_settings() -> Settings:
    return Settings()
