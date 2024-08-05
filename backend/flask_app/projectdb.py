from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
db = client['flask_db'] 
projects_collection = db['projects']


def queryProject(client, projectId):
    db = client['flask_db']
    projects_collection = db['projects']
    project = projects_collection.find_one({'projectId': projectId})
    return project

def createProject(client, projectName, projectId, description):
    db = client['flask_db']
    projects_collection = db['projects']
    if projects_collection.find_one({'projectId': projectId}):
        return "Project with this ID already exists."

    new_project = {
        'projectName': projectName,
        'projectId': projectId,
        'description': description,
        'hwSets': {},
        'users': []
    }

    projects_collection.insert_one(new_project)
    return "Project created successfully."

def addUser(client, projectId, username):
    db = client['flask_db']
    projects_collection = db['projects']
    result = projects_collection.update_one(
        {'projectId': projectId},
        {'$addToSet': {'users': username}}
    )

    if result.modified_count > 0:
        return "User added to project successfully."
    elif result.matched_count > 0:
        return "User is already part of the project."
    else:
        return "Project not found."

def updateUsage(client, projectId, hwSetName, qty):
    db = client['flask_db']
    projects_collection = db['projects']
    result = projects_collection.update_one(
        {'projectId': projectId},
        {'$set': {f'hwSets.{hwSetName}': qty}}
    )
    if result.modified_count > 0:
        return "Hardware usage updated successfully."
    return "Project not found."

def checkOutHW(client, projectId, hwSetName, qty, username):
    db = client['flask_db']
    projects_collection = db['projects']
    project = projects_collection.find_one({'projectId': projectId})
    if not project:
        return "Project not found."
    current_qty = project['hwSets'].get(hwSetName, 0)
    if current_qty < qty:
        return "Insufficient hardware quantity available."
    projects_collection.update_one(
        {'projectId': projectId},
        {'$inc': {f'hwSets.{hwSetName}': -qty}}
    )
    return "Hardware checked out successfully."

def checkInHW(client, projectId, hwSetName, qty, username):
    db = client['flask_db']
    projects_collection = db['projects']
    project = projects_collection.find_one({'projectId': projectId})
    if not project:
        return "Project not found."
    projects_collection.update_one(
        {'projectId': projectId},
        {'$inc': {f'hwSets.{hwSetName}': qty}}
    )
    return "Hardware checked in successfully."
