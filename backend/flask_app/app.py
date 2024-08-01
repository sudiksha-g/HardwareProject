from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

client = MongoClient('localhost', 27017)

# db name: flask_db
db = client.flask_db

# collection name: user_data
user_collection = db.user_data


@app.route('/', methods=('GET', 'POST'))
def index():
    # fetch documents from user_data collection
    user_documents = user_collection.find()
    return dumps(list(user_documents))


@app.route('/register', methods=('GET', 'POST'))
def register():
    # use postman to send data in request and check, pass values for fields: name, username and password
    if request.method == 'POST':

        # fetch these details through registration form
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # add a single document to user_data collection
        new_user = user_collection.insert_one(data)

        return jsonify({"message": "Login successful!"})


if __name__ == '__main__':
    app.run(debug=True)
