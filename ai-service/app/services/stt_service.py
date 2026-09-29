"""
Speech-to-Text (STT) Service powered by Groq Cloud.
Standardized on whisper-large-v3-turbo for lightning-fast sub-second transcription.
"""

import httpx
from typing import Optional
from app.core.config import get_settings
from app.core.logging import logger
from app.schemas.interview import AudioTranscriptionResponse

class STTService:
    GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions"

    @classmethod
    async def transcribe_audio(
        cls,
        audio_bytes: bytes,
        filename: str = "audio.wav",
        language: str = "en"
    ) -> AudioTranscriptionResponse:
        """
        Transcribes candidate audio input using Groq whisper-large-v3-turbo.
        """
        settings = get_settings()
        api_key = settings.GROQ_API_KEY.strip()

        if not api_key or api_key.startswith("gsk_your") or api_key.startswith("placeholder"):
            logger.warning("Groq API key not configured. Returning fallback transcript.")
            return AudioTranscriptionResponse(
                text="I designed a microservices architecture utilizing Docker containers and asynchronous message queues.",
                model="mock-fallback",
                duration_seconds=2.5,
                language=language
            )

        headers = {
            "Authorization": f"Bearer {api_key}"
        }

        # Determine mime type
        ext = filename.split(".")[-1].lower() if "." in filename else "wav"
        mime_map = {
            "wav": "audio/wav",
            "mp3": "audio/mpeg",
            "m4a": "audio/m4a",
            "webm": "audio/webm",
            "ogg": "audio/ogg"
        }
        content_type = mime_map.get(ext, "audio/wav")

        files = {
            "file": (filename, audio_bytes, content_type)
        }
        data = {
            "model": settings.GROQ_WHISPER_MODEL or "whisper-large-v3-turbo",
            "response_format": "json",
            "temperature": "0.0",
            "language": language
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    cls.GROQ_AUDIO_URL,
                    headers=headers,
                    files=files,
                    data=data
                )

                if res.status_code == 200:
                    result = res.json()
                    transcript = result.get("text", "").strip()
                    logger.info(f"Groq Whisper transcription success ({len(transcript)} chars)")
                    return AudioTranscriptionResponse(
                        text=transcript,
                        model=settings.GROQ_WHISPER_MODEL,
                        duration_seconds=None,
                        language=language
                    )
                else:
                    logger.error(f"Groq Whisper error {res.status_code}: {res.text}")
                    raise RuntimeError(f"Groq STT transcription failed: {res.text}")

        except Exception as e:
            logger.error(f"Failed to transcribe audio via Groq Whisper: {e}")
            raise
