from flask import jsonify
from werkzeug.security import check_password_hash


def loginUser(client, data):

    username = data.get('username')
    password = data.get('password')

    try:
        db = client.flask_db
    # collection name: user_data
        user_collection = db.user_data
    except Exception as error:
        return ("Exception occured!", error)
    user = user_collection.find_one({"username": username})

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401
