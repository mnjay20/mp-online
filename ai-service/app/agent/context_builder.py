import httpx
from app.core.config import get_settings
from app.core.logging import logger
from app.schemas.context import StudentContext, StudentSkillItem, StudentEducationItem, StudentProjectItem

class ContextBuilder:
    @staticmethod
    async def build_context(student_id: str, focus_area: str = "GENERAL") -> StudentContext:
        """
        Dynamically constructs selective, authoritative student context
        from PostgreSQL/Supabase rather than hallucinated conversational memory.
        """
        settings = get_settings()
        
        # Build context object
        context = StudentContext(student_id=student_id)
        
        # If backend URL is reachable, fetch student data
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(f"{settings.BACKEND_URL}/api/students/me")
                if res.status_code == 200:
                    profile_data = res.json().get("data", {})
                    context.full_name = f"{profile_data.get('first_name', '')} {profile_data.get('last_name', '')}".strip()
                    context.bio = profile_data.get("bio")
        except Exception as e:
            logger.debug(f"Context builder using direct fallback for student {student_id}: {e}")
            
        return context
