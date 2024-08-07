class ProjectDB:
    def __init__(self, db):
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
            'hwSets': [[0, 100, 100], [0, 100, 100]],
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
    #         {'$set': {f'hwSets.{hwSetName}': qty}}
    #     )
    #     if result.modified_count > 0:
    #         return "Hardware usage updated successfully."
    #     return "Project not found."

    def check_out_hardware(self, project_id, hardware_set_num, value):
        project = self.projects_collection.find_one({'projectId': project_id})
        hw_sets = project['hwSets']
        msg = ""
        if hw_sets[hardware_set_num][1] < value:
            hw_sets[hardware_set_num][1] = 0
            hw_sets[hardware_set_num][0] = hw_sets[hardware_set_num][2]
            msg += "Not enough availability to check out entire quantity, "
        else:
            hw_sets[hardware_set_num][1] -= value
            hw_sets[hardware_set_num][0] += value
        self.collection.update_one(
            {'projectId': project_id},
            {'$set': {'hwSets': hw_sets}}
        )
        return msg+"Checked Out Successfully!"

    def check_in_hardware(self, project_id, hardware_set_num, value):
        project = self.projects_collection.find_one({'projectId': project_id})
        hw_sets = project['hwSets']
        msg = ""
        if hw_sets[hardware_set_num][0] < value:
            hw_sets[hardware_set_num][0] = 0
            hw_sets[hardware_set_num][1] = hw_sets[hardware_set_num][2]
            msg += "Not enough checked out items to be checked in, "
        else:
            hw_sets[hardware_set_num][0] -= value
            hw_sets[hardware_set_num][1] += value
        self.collection.update_one(
            {'projectId': project_id},
            {'$set': {'hwSets': hw_sets}}
        )
        return msg+"Checked In Successfully!"
