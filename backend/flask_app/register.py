from werkzeug.security import generate_password_hash
from flask import jsonify
from pymongo.errors import DuplicateKeyError


def registerUser(client, data):
    username = data.get('username')
    password = data.get('password')

    hashed_password = generate_password_hash(password)

    try:
        db = client.flask_db
        # collection name: user_data
        user_collection = db.user_data
    except Exception as error:
        return ("Exception occured!", error)

    try:
        user_id = user_collection.insert_one({
            "username": username,
            "password": hashed_password
        }).inserted_id
        return jsonify({"message": "User registered successfully!", "user_id": str(user_id)}), 201
    except DuplicateKeyError:
        return jsonify({"message": "Username already exists"}), 409
