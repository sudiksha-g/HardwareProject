from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
db = client['flask_db']  
hardware_collection = db['hardwareSets']


def createHardwareSet(client, hwSetName, initCapacity):
    db = client['flask_db']
    hardware_collection = db['flask_db']
    if hardware_collection.find_one({'hwName': hwSetName}):
        return "Hardware set with this name already exists."
    new_hw_set = {
        'hwName': hwSetName,
        'capacity': initCapacity,
        'availability': initCapacity
    }
    hardware_collection.insert_one(new_hw_set)
    return "Hardware set created successfully."


def queryHardwareSet(client, hwSetName):
    db = client['flask_db']
    hardware_collection = db['hardwareSets']
    hw_set = hardware_collection.find_one({'hwName': hwSetName})
    return hw_set


def updateAvailability(client, hwSetName, newAvailability):
    db = client['flask_db']
    hardware_collection = db['hardwareSets']
    result = hardware_collection.update_one(
        {'hwName': hwSetName},
        {'$set': {'availability': newAvailability}}
    )
    if result.matched_count > 0:
        return "Availability updated successfully."
    return "Hardware set not found."


def requestSpace(client, hwSetName, amount):
    db = client['flask_db']
    hardware_collection = db['hardwareSets']
    hw_set = hardware_collection.find_one({'hwName': hwSetName})
    if not hw_set:
        return "Hardware set not found."
    if hw_set['availability'] < amount:
        return "Not enough hardware available."
    hardware_collection.update_one(
        {'hwName': hwSetName},
        {'$inc': {'availability': -amount}}
    )
    return "Space requested successfully."


def getAllHwNames(client):
    db = client['flask_db']
    hardware_collection = db['hardwareSets']
    hw_names = hardware_collection.find({}, {'hwName': 1, '_id': 0})
    return [hw['hwName'] for hw in hw_names]
