import hardwaredb


class ProjectDB(hardwaredb.HardwareDB):
    def __init__(self, db):
        super().__init__(db)
        self.capacity = [100, 100]
        self.availability = [100, 100]
        self.projects_collection = db['projects']

    def get_all_projects(self):
        all_projects = self.projects_collection.find()
        return all_projects

    def get_project(self, project_id):
        project = self.projects_collection.find_one({'projectId': project_id})
        return project

    def create_project(self, project_id, project_name, description):
        if self.projects_collection.find_one({'projectId': project_id}):
            return "Project with this ID already exists."

        new_project = {
            'projectId': project_id,
            'projectName': project_name,
            'description': description,
            'checkedOutList': [0, 0],
            'users': []
        }

        self.projects_collection.insert_one(new_project)
        return "Project created successfully."

    def add_user(client, projectId, username):
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

    # def updateUsage(client, projectId, hwSetName, qty):
    #     db = client['flask_db']
    #     projects_collection = db['projects']
    #     result = projects_collection.update_one(
    #         {'projectId': projectId},
    #         {'$set': {f'checkedOutList.{hwSetName}': qty}}
    #     )
    #     if result.modified_count > 0:
    #         return "Hardware usage updated successfully."
    #     return "Project not found."

    def check_out_hardware(self, project_id, hw_set_num, value):
        project = self.projects_collection.find_one({'projectId': project_id})
        checked_out_list = project['checkedOutList']
        checked_out_value = self.de_allocate_units(hw_set_num, value)
        hw_set_num -= 1
        if checked_out_value:
            checked_out_list[hw_set_num] += checked_out_value
            self.projects_collection.update_one(
                {'projectId': project_id},
                {'$set': {'checkedOutList': checked_out_list}}
            )
            return "Checked out, "+checked_out_value
        return "Couldn't check out"

    def check_in_hardware(self, project_id, hw_set_num, value):
        project = self.projects_collection.find_one({'projectId': project_id})
        checked_out_list = project['checkedOutList']
        hw_set_num -= 1
        if checked_out_list[hw_set_num] < value:
            return "Not enough hardware checked out."
        checked_in_value = self.allocate_units(hw_set_num+1, value)
        if checked_in_value:
            checked_out_list[hw_set_num] -= checked_in_value
            self.collection.update_one(
                {'projectId': project_id},
                {'$set': {'checkedOutList': checked_out_list}}
            )
            return "Checked in, "+checked_in_value
        return "Couldn't check in"
