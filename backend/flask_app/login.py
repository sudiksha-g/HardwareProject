from flask import jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token


def login_user(client, data):

    username = data.get('username')
    password = data.get('password')

    try:
        db = client.flask_db
    # collection name: user_data
        user_collection = db.user_data
    except Exception as error:
        return jsonify({"message": "Exception occurred!", "error": str(error)}), 500
    user = user_collection.find_one({"username": username})

    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity={"username": username})
        return jsonify({"message": "Login successful!", "access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401
