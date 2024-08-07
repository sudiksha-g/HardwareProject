from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
import projectdb
from userdb import UserDB
from projectdb import ProjectDB
from hardwaredb import HardwareDB
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
db = client['flask_db']

userdb = UserDB(db)
projectdb = ProjectDB(db)
hardwaredb = HardwareDB(db)


@app.route('/getAllUsers', methods=['GET'])
def get_all_users():
    return dumps(userdb.get_all_users())


@app.route('/registerUser', methods=['POST'])
def register_user():
    data = request.get_json()
    return dumps(userdb.register_user(data["username"], data["password"]))


@app.route('/loginUser', methods=['POST'])
def login_user():
    data = request.get_json()
    return dumps(userdb.login_user(data["username"], data["password"]))


@app.route('/getProjects', methods=['GET'])
def get_projects():
    data = request.get_json()
    return dumps(projectdb.queryProject(client, data["projectId"]))


@app.route('/createProject', methods=['POST'])
def create_project():
    data = request.get_json()
    return dumps(projectdb.create_project(data["projectId"], data["projectName"], data["projectDesc"]))


@app.route('/getAllProjects', methods=['GET'])
def get_all_projects():
    return dumps(projectdb.get_all_projects())


@app.route('/getUserProjects', methods=['GET'])
def get_user_projects():
    data = request.get_json()
    return dumps(userdb.get_user_projects_list(data["username"]))


@app.route('/joinProject', methods=['GET'])
def join_project():
    data = request.get_json()
    return dumps(userdb.join_project(data["username"], data["projectId"]))


@app.route('/checkOut', methods=['POST'])
def check_out():
    data = request.get_json()
    return dumps(projectdb.check_out_hardware(data["projectID"], data["hwSetNum"], data["value"]))


@app.route('/checkIn', methods=['POST'])
def check_in():
    data = request.get_json()
    return dumps(projectdb.check_in_hardware(data["projectID"], data["hwSetNum"], data["value"]))


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
