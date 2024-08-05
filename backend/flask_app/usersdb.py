from pymongo import MongoClient
import projectdb


client = MongoClient('mongodb://localhost:27017/')
db = client['flask_db']  
users_collection = db['users']

def addUser(client, username, password):
    db = client['flask_db']
    users_collection = db['users']
    if users_collection.find_one({'username': username}):
        return "User already exists."
    new_user = {
        'username': username,
        'password': password,
        'projects': []
    }
    users_collection.insert_one(new_user)
    return "User added successfully."

def __queryUser(client, username):
    db = client['flask_db']
    users_collection = db['users']
    user = users_collection.find_one({'username': username})
    return user

def login(client, username, password):
    user = __queryUser(client, username)
    if user and user['password'] == password:
        return "Login successful."
    return "Invalid username or password."

def joinProject(client, username, projectId):
    db = client['flask_db']
    users_collection = db['users']
    result = users_collection.update_one(
        {'username': username},
        {'$addToSet': {'projects': projectId}}
    )
    if result.modified_count > 0:
        return "User added to project successfully."
    elif result.matched_count > 0:
        return "User already part of the project."
    else:
        return "User not found."

def getUserProjectsList(client, username):
    db = client['flask_db']
    users_collection = db['users']
    user = users_collection.find_one({'username': username}, {'projects': 1, '_id': 0})
    if user:
        return user.get('projects', [])
    return "User not found."
