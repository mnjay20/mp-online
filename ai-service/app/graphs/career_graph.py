from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from app.services.career_service import CareerService
from app.core.logging import logger

class CareerGraphState(TypedDict):
    student_id: str
    career_id: str
    matching_skills: List[str]
    missing_skills: List[Dict[str, Any]]
    readiness_score: int
    roadmap_summary: str

async def node_extract_profile(state: CareerGraphState) -> Dict[str, Any]:
    logger.info(f"LangGraph [extract_profile] for student: {state['student_id']}")
    return {"matching_skills": ["Python", "SQL", "Git"]}

async def node_compute_gap(state: CareerGraphState) -> Dict[str, Any]:
    logger.info(f"LangGraph [compute_gap] for career: {state['career_id']}")
    gap_result = await CareerService.analyze_skill_gap(state['student_id'], state['career_id'])
    return {
        "readiness_score": gap_result.readiness_score,
        "missing_skills": [item.model_dump() for item in gap_result.missing_skills]
    }

async def node_generate_roadmap(state: CareerGraphState) -> Dict[str, Any]:
    logger.info("LangGraph [generate_roadmap] finalizing milestones")
    roadmap_result = await CareerService.generate_roadmap(state['student_id'], state['career_id'])
    return {"roadmap_summary": roadmap_result.overview}

def build_career_readiness_graph():
    builder = StateGraph(CareerGraphState)
    builder.add_node("extract_profile", node_extract_profile)
    builder.add_node("compute_gap", node_compute_gap)
    builder.add_node("generate_roadmap", node_generate_roadmap)

    builder.add_edge(START, "extract_profile")
    builder.add_edge("extract_profile", "compute_gap")
    builder.add_edge("compute_gap", "generate_roadmap")
    builder.add_edge("generate_roadmap", END)

    return builder.compile()

career_readiness_graph = build_career_readiness_graph()
