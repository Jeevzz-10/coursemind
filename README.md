# CourseMinds - Course Recommendation Engine

A Microservices-based recommendation system that suggests technical courses based on content similarity using Machine Learning (TF-IDF) and Vector Space Models.

## Features (Phase 1 MVP)
* **Content-Based Filtering:** Uses TF-IDF (Term Frequency-Inverse Document Frequency) to analyze course descriptions.
* **Vector Similarity:** Calculates Cosine Similarity to find the closest matching courses.
* **FastAPI Backend:** High-performance async API for serving recommendations.
* **Data Validation:** Strict schema validation using Pydantic.

## Tech Stack
* **Language:** Python 3.10+
* **Framework:** FastAPI
* **ML Libraries:** Scikit-learn, Pandas, NumPy
* **Server:** Uvicorn
