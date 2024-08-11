class Project:
    def __init__(self, db):
        self.project_collection = db.projects
        return

    def create_new_project(self, data, user_id):
        proj = {
            "project_id": data["project_id"],
            "project_name": data["project_name"],
            "project_desc": data["project_desc"]
        }
        self.project_collection.insert_one(proj)
        return
