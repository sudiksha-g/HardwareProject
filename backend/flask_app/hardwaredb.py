class HardwareDB:
    def __init__(self, db):
        self.hardware_collection = db['hardware']

    def create_hardware_set(self, hw_set_num, init_capacity):
        if self.hardware_collection.find_one({'hwNum': hw_set_num}):
            return "Hardware set with this name already exists."
        new_hw_set = {
            'hwNum': hw_set_num,
            'capacity': init_capacity,
            'availability': init_capacity
        }
        self.hardware_collection.insert_one(new_hw_set)
        return "Hardware set created successfully."

    def query_hardware_set(self, hw_set_num):
        hw_set = self.hardware_collection.find_one({'hwNum': hw_set_num})
        return hw_set

    def update_availability(self, hw_set_num, new_availability):
        result = self.hardware_collection.update_one(
            {'hwNum': hw_set_num},
            {'$set': {'availability': new_availability}}
        )
        if result.matched_count > 0:
            return "Availability updated successfully."
        return "Hardware set not found."

    def request_space(self, hw_set_num, value):
        hw_set = self.hardware_collection.find_one({'hwNum': hw_set_num})
        if not hw_set:
            return False
            # return "Hardware set not found."
        if hw_set['availability'] < value:
            self.update_availability(hw_set_num, 0)
            return hw_set['availability']
            # return "Not enough hardware available."
        self.hardware_collection.update_one(
            {'hwNum': hw_set_num},
            {'$inc': {'availability': -value}}
        )
        return value
        # return "Space requested successfully."

    def get_all_hardware_names(self):
        hw_names = self.hardware_collection.find({}, {'hwNum': 1, '_id': 0})
        return [hw['hwNum'] for hw in hw_names]
