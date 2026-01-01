from fastapi import FastAPI, Query
from typing import List
from app.schemas.course import Course
from app.services.recommender import recommender

app = FastAPI(title = "CourseMinds", version = "1.0.0")

@app.get("/health")
def health_check():
    return {"status": "healthy", "services": "recommendation-engine"}

@app.get("/recommend", response_model=List[Course])
def recommend_courses(
    q: str = Query(..., min_length = 2, description = "What do you want to learn?")
):
    results = recommender.get_recommendations(q)
    return results