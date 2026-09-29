from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import get_settings
from app.core.logging import logger
from typing import Any, Optional

def extract_text(content: Any) -> str:
    """
    Extracts text cleanly whether response content is a plain string or a list of content blocks.
    """
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        texts = []
        for part in content:
            if isinstance(part, dict) and "text" in part:
                texts.append(part["text"])
            elif isinstance(part, str):
                texts.append(part)
        return "".join(texts)
    return str(content)

def get_llm(temperature: float = 0.2, structured_output_schema: Optional[Any] = None):
    """
    Returns an instance of ChatGoogleGenerativeAI initialized with Gemini 3.5 Flash Lite.
    """
    settings = get_settings()
    
    if settings.GOOGLE_API_KEY and not settings.GOOGLE_API_KEY.startswith("placeholder"):
        llm = ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=temperature,
        )
        if structured_output_schema:
            return llm.with_structured_output(structured_output_schema)
        return llm
    
    logger.warning("GOOGLE_API_KEY not configured or set to placeholder. Operating in fallback mode.")
    return None
