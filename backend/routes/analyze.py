from fastapi import APIRouter, HTTPException

from models.schemas import MoodResponse, TextInput
from services.nlp import analyze_mood

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=MoodResponse)
def post_analyze(body: TextInput) -> MoodResponse:
    text = body.text.strip()
    if not text or len(text) < 3:
        raise HTTPException(status_code=400, detail="Text too short")
    result = analyze_mood(text)
    return MoodResponse(**result)
