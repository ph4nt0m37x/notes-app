from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import notes_collection
from bson import ObjectId

notes_bp = Blueprint("notes", __name__)


# GET NOTES (ONLY FOR LOGGED-IN USER)
@notes_bp.route("/api/notes", methods=["GET"])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()

    notes = list(notes_collection.find({"user_id": user_id}))

    for note in notes:
        note["_id"] = str(note["_id"])

    return jsonify(notes)


# CREATE NOTE (ONLY FOR LOGGED-IN USER)
@notes_bp.route("/api/notes", methods=["POST"])
@jwt_required()
def create_note():
    user_id = get_jwt_identity()
    data = request.json

    note = {
        "title": data.get("title"),
        "content": data.get("content"),
        "user_id": user_id
    }

    result = notes_collection.insert_one(note)

    return jsonify({"id": str(result.inserted_id)}), 201

@notes_bp.route("/api/notes/<note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()

    result = notes_collection.delete_one({
        "_id": ObjectId(note_id),
        "user_id": user_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Note not found or not allowed"}), 404

    return jsonify({"message": "Note deleted"})

@notes_bp.route("/api/notes/<note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    user_id = get_jwt_identity()
    data = request.json

    updated_data = {
        "title": data.get("title"),
        "content": data.get("content")
    }

    result = notes_collection.update_one(
        {
            "_id": ObjectId(note_id),
            "user_id": user_id
        },
        {"$set": updated_data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Note not found or not allowed"}), 404

    return jsonify({"message": "Note updated"})