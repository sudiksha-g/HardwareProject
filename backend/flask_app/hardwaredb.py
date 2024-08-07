class HardwareDB:
    def __init__(self, db):
        self.hardware_collection = db['hardware']

    def create_hardware_set(self, hwSetName, initCapacity):
        if self.hardware_collection.find_one({'hwName': hwSetName}):
            return "Hardware set with this name already exists."
        new_hw_set = {
            'hwName': hwSetName,
            'capacity': initCapacity,
            'availability': initCapacity
        }
        self.hardware_collection.insert_one(new_hw_set)
        return "Hardware set created successfully."

    def query_hardware_set(self, hwSetName):
        hw_set = self.hardware_collection.find_one({'hwName': hwSetName})
        return hw_set

    def update_availability(self, hwSetName, newAvailability):
        result = self.hardware_collection.update_one(
            {'hwName': hwSetName},
            {'$set': {'availability': newAvailability}}
        )
        if result.matched_count > 0:
            return "Availability updated successfully."
        return "Hardware set not found."

    def request_space(self, hwSetName, amount):
        hw_set = self.hardware_collection.find_one({'hwName': hwSetName})
        if not hw_set:
            return "Hardware set not found."
        if hw_set['availability'] < amount:
            return "Not enough hardware available."
        self.hardware_collection.update_one(
            {'hwName': hwSetName},
            {'$inc': {'availability': -amount}}
        )
        return "Space requested successfully."

    def get_all_hardware_names(self):
        hw_names = self.hardware_collection.find({}, {'hwName': 1, '_id': 0})
        return [hw['hwName'] for hw in hw_names]
