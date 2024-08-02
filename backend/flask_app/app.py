from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

client = MongoClient('localhost', 27017)

# db name: flask_db
db = client.flask_db

# collection name: user_data
user_collection = db.user_data
user_collection.create_index("username", unique=True)


@app.route('/', methods=('GET', 'POST'))
def index():
    # fetch documents from user_data collection
    user_documents = user_collection.find()
    return dumps(list(user_documents))
    # return "Hi!"


@app.route('/register', methods=('GET', 'POST'))
def register():
    # use postman to send data in request and check, pass values for fields: name, username and password
    if request.method == 'POST':

        # fetch these details through registration form
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        hashed_password = generate_password_hash(password)

        try:
            user_id = user_collection.insert_one({
                "username": username,
                "password": hashed_password
            }).inserted_id
            return jsonify({"message": "User registered successfully!", "user_id": str(user_id)}), 201
        except DuplicateKeyError:
            return jsonify({"message": "Username already exists"}), 409

        # add a single document to user_data collection
        # new_user = user_collection.insert_one(data)

        # return jsonify({"message": "Register successful!"})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = user_collection.find_one({"username": username})

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401


if __name__ == '__main__':
    app.run(debug=True)
