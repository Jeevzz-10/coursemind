from fastapi import FastAPI, Query
from typing import List, Optional
from app.schemas.course import Course
from app.services.recommender import recommender

app = FastAPI(title="CourseMinds", version="1.0.0")

@app.get("/health")
def health_check():
    return {"status": "healthy", "services": "recommendation-engine"}

@app.get("/recommend", response_model=List[Course])
def recommend_courses(
    # 1. Allow 'q' to be empty (if user just wants recommendations based on profile)
    q: Optional[str] = Query(None, min_length=0, description="Search query"),
    
    # 2. Accept 'interests' from the Gateway
    interests: str = Query("", description="User interests from profile")
):
    # Ensure query is not None for string operations
    search_query = q if q else ""
    
    # 3. Pass BOTH to the brain
    results = recommender.get_recommendations(search_query, interests)
    return results