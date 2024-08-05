from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from login import *
from register import *

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

client = MongoClient('localhost', 27017)

# For dev purpose, remove later
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


@app.route('/register', methods=('POST'))
def register():
    # use postman to send data in request and check, pass values for fields: name, username and password
    if request.method == 'POST':

        # fetch these details through registration form
        data = request.get_json()
        return registerUser(client, data)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return loginUser(client, data)


if __name__ == '__main__':
    app.run(debug=True)
