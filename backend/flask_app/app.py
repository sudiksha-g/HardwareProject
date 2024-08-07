from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from login import *
from register import *
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, unset_jwt_cookies
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config['SECRET_KEY'] = os.environ.get(
    'FLASK_SECRET_KEY', 'default_secret_key')
app.config['JWT_SECRET_KEY'] = os.environ.get(
    'JWT_SECRET_KEY', 'default_jwt_secret_key')
jwt = JWTManager(app)

client = MongoClient('localhost', 27017)

# For dev purpose, remove later
# db name: flask_db
db = client.flask_db
# collection name: user_data
user_collection = db.user_data
user_collection.create_index("username", unique=True)


@app.route('/', methods=['GET', 'POST'])
def index():
    # fetch documents from user_data collection
    user_documents = user_collection.find()
    return dumps(list(user_documents))


@app.route('/register', methods=(['POST']))
def register():
    # use postman to send data in request and check, pass values for fields: name, username and password
    if request.method == 'POST':

        # fetch these details through registration form
        data = request.get_json()
        return registerUser(client, data)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(client, data)


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    print(current_user)
    return jsonify(logged_in_as=current_user), 200


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


if __name__ == '__main__':
    app.run(debug=True)
