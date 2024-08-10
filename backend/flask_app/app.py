from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
from login import *
from register import *
import projectdb
from userdb import UserDB
from projectdb import ProjectDB
from hardwaredb import HardwareDB
app = Flask(__name__)
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
    return userdb.login_user(data["username"], data["password"])


@app.route('/getUserProjects', methods=['POST'])
def get_user_projects():
    data = request.get_json()
    return userdb.get_user_projects(data["username"])


@app.route('/createProject', methods=['POST'])
def create_project():
    data = request.get_json()
    return dumps(projectdb.create_project(data["projectId"], data["projectName"], data["projectDesc"]))


@app.route('/joinProject', methods=['POST'])
def join_project():
    data = request.get_json()
    return dumps(userdb.join_project(data["username"], data["projectId"]))


@app.route('/checkOut', methods=['POST'])
def check_out():
    data = request.get_json()
    return dumps(projectdb.check_out_hardware(data["projectId"], data["hwSetNum"], data["value"]))


@app.route('/checkIn', methods=['POST'])
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
def query_hardware_set():
    data = request.get_json()
    return dumps(hardwaredb.query_hardware_set(data["hwSetNum"]))


if __name__ == '__main__':
    app.run(debug=True)
