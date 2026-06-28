import os
from pymongo import MongoClient

DB_NAME = os.getenv("DATABASE_NAME")
username = os.getenv("MONGO_USERNAME")
password = os.getenv("MONGO_PASSWORD")
host = os.getenv("MONGO_HOST")
port = os.getenv("MONGO_PORT")

MONGO_URI = f"mongodb://{username}:{password}@{host}:{port}/?authSource=admin"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
notes_collection = db["notes"]