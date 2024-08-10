from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo.errors import DuplicateKeyError
from login import *
from register import *
import projectdb
from userdb import UserDB
from projectdb import ProjectDB
from hardwaredb import HardwareDB
app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = '8692eb049743088c8e8068e72d47cab56e45bbaca24ca74054b900b51e30dee5'
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

client = MongoClient('localhost', 27017)
db = client['flask_db']

userdb = UserDB(db)
projectdb = ProjectDB(db)
hardwaredb = HardwareDB(db)

# Instantiating checkedOutList
hardwaredb.create_hardware_set(1, 100)
hardwaredb.create_hardware_set(2, 100)
# projectdb.init_projects()


@app.route('/registerUser', methods=['POST'])
def register_user():
    data = request.get_json()
    return userdb.register_user(data["username"], data["password"])


@app.route('/loginUser', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    response = userdb.login_user(username, password)
    if response == 200:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return response


@app.route('/getUserProjects', methods=['POST'])
@jwt_required()
def get_user_projects():
    data = request.get_json()
    return userdb.get_user_projects(data["username"])


@app.route('/createProject', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    return dumps(projectdb.create_project(data["projectId"], data["projectName"], data["projectDesc"]))


@app.route('/joinProject', methods=['POST'])
@jwt_required()
def join_project():
    data = request.get_json()
    return dumps(userdb.join_project(data["username"], data["projectId"]))


@app.route('/checkOut', methods=['POST'])
@jwt_required()
def check_out():
    data = request.get_json()
    return dumps(projectdb.check_out_hardware(data["projectId"], data["hwSetNum"], data["value"]))


@app.route('/checkIn', methods=['POST'])
@jwt_required()
def check_in():
    data = request.get_json()
    return dumps(projectdb.check_in_hardware(data["projectId"], data["hwSetNum"], data["value"]))
# @app.route('/getAllUsers', methods=['GET'])
# def get_all_users():
#     return dumps(userdb.get_all_users())


# @app.route('/getProjects', methods=['GET'])
# def get_projects():
#     data = request.get_json()
#     return dumps(projectdb.queryProject(client, data["projectId"]))


# @app.route('/getAllProjects', methods=['GET'])
# def get_all_projects():
#     return dumps(projectdb.get_all_projects())


@app.route('/queryHardwareSet', methods=['POST'])
@jwt_required()
def query_hardware_set():
    data = request.get_json()
    return dumps(hardwaredb.query_hardware_set(data["hwSetNum"]))


if __name__ == '__main__':
    app.run(debug=True)
