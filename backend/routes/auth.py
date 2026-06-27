from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database import users_collection
from flask_bcrypt import Bcrypt

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


# REGISTER
@auth_bp.route("/api/register", methods=["POST"])
def register():
    print("REGISTER HIT")
    data = request.json

    username = data.get("username")
    password = data.get("password")

    # check if user exists
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    users_collection.insert_one({
        "username": username,
        "password": hashed_password
    })

    return jsonify({"message": "User created"}), 201

# LOGIN

@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "token": token
    })