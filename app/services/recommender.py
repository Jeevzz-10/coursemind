import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

class RecommendationService:
    def __init__(self):
        self.courses = []
        self.tfidf_matrix = None
        self.vectorizer = None
        #automatically load data and train model when engine starts
        self._load_data()
        self._train_model()
    
    def _load_data(self):
        #load data from data/courses.json
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        file_path = os.path.join(base_dir, "data", "courses.json")
        with open(file_path, "r") as f:
            self.courses = json.load(f)
            print(f"Data loaded {len(self.courses)} courses from the database.")#for now its data/courses.json
    
    def _train_model(self):
        #converts english text to math(vectors).
        corpus = []
        for course in self.courses:
            text = f"{course['title']} {course['description']} {' '.join(course['tags'])}"
            corpus.append(text)
        self.vectorizer = TfidfVectorizer(stop_words = 'english') #removes words like 'the', 'and', etc..
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        print("Model Trained.")
    
    def get_recommendations(self, query_text: str, top_k: int = 3):
        query_vec = self.vectorizer.transform([query_text])
        # Measure Similarity (Cosine Similarity)
        # linear_kernel is a fast way to calculate how similar the query is to every course.
        # Returns scores like: [0.1, 0.95, 0.0, 0.4]
        cosine_scores = linear_kernel(query_vec, self.tfidf_matrix).flatten()
        # Sort the scores
        # argsort gives us the INDICES of the best matches (e.g., Course #2, then Course #5)
        # We reverse it ([:-1]) to get highest scores first
        related_indices = cosine_scores.argsort()[:-top_k-1:-1]
        results = []
        for idx in related_indices:
            if cosine_scores[idx] > 0:
                results.append(self.courses[idx])
        
        return results

recommender = RecommendationService()