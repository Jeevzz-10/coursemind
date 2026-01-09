# similar to ETL pipeline : moving data from json file to mongodb database.
import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_USER = os.getenv("MONGO_USER", "admin")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "secretpassowrd")
MONGO_DB = os.getenv("MONGO_DB", "courseminds")

MONGO_URL = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@localhost:27017"

async def seed_data():
    print("connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[MONGO_DB]
    collection = db.courses
    #read json file
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "courses.json")
    print(f"Reading data from {file_path}...")

    try:
        with open(file_path, "r") as f:
            courses_data = json.load(f)
    except FileNotFoundError:
        print("Error : data/courses.json not found!")
        return
    print(f"Found {len(courses_data)} courses. Inserting...")
    await collection.delete_many({})
    result = await collection.insert_many(courses_data)
    print(f"Sucess! Inserted {len(result.inserted_ids)} courses into database.")
    client.close()

if __name__ == "__main__":
    #run the async function
    asyncio.run(seed_data())