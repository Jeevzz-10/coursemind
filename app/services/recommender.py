#recommender is now connected to database (no longer to json files)
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

load_dotenv()

class RecommendationService:
    def __init__(self):
        self.courses = []
        self.tfidf_matrix = None
        self.vectorizer = None

        self.mongo_user = os.getenv("MONGO_USER", "admin")
        self.mongo_password = os.getenv("MONGO_PASSWORD", "secretpassword")
        self.mongo_db_name = os.getenv("MONGO_DB", "courseminds")

        self.mongo_uri = f"mongodb://{self.mongo_user}:{self.mongo_password}@localhost:27017"
        self._load_data()
        self._train_model()
    
    def _load_data(self):
        #connect to mongodb and fetch all courses.
        print("recommender connecting to mongodb...")
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.mongo_db_name]
            collection = db.courses

            self.courses = list(collection.find({} , {"_id":0}))

            print(f"loaded {len(self.courses)} courses from MongoDB.")
            client.close()
        except Exception as e:
            print(f"Error loading data from MongoDB: {e}")
            self.courses = []
    
    def _train_model(self):
        #convert english text to math vectors
        if not self.courses:
            print("Warning: No courses found")
            return
        corpus = []
        for course in self.courses:
            text = f"{course['title']} {course['description']} {' '.join(course['tags'])}"
            corpus.append(text)
        
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        print("Model Trained.")

    def get_recommendations(self, query_text: str, top_k: int=3):
        #returns matches
        if not self.tfidf_matrix is not None:
            return []
        query_vec = self.vectorizer.transform([query_text])
        cosine_scores = linear_kernel(query_vec, self.tfidf_matrix).flatten()
        related_indices = cosine_scores.argsort()[:-top_k-1:-1]
        
        results = []
        for idx in related_indices:
            if cosine_scores[idx]>0:
                results.append(self.courses[idx])
        
        return results

recommender = RecommendationService()