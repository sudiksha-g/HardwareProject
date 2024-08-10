from bson.json_util import dumps
import projectdb


class UserDB(projectdb.ProjectDB):
    def __init__(self, db):
        super().__init__(db)
        self.users_collection = db['users']

    def register_user(self, username, password):
        if self.users_collection.find_one({'username': username}):
            return dumps({"status": "error", "message": "User already exists."}), 500
        new_user = {
            'username': username,
            'password': password,
            'projects': []
        }
        self.users_collection.insert_one(new_user)
        return dumps({"status": "success", "message": "User registered successfully."}), 200

    def get_user(self, username):
        user = self.users_collection.find_one({'username': username})
        return user

    def get_all_users(self):
        all_users = self.users_collection.find()
        return all_users

    def login_user(self, username, password):
        user = self.get_user(username)
        if user and (user['password'] == password):
            return dumps({"status": "error", "code": 200, "message": "Login Successful"}), 200
        return dumps({"status": "error", "code": 500, "message": "Invalid username or password"}), 500

    def join_project(self, username, project_id):
        project = self.get_project(project_id)
        if (project):
            result = self.users_collection.update_one(
                {'username': username},
                {'$addToSet': {'projects': project_id}}
            )
        else:
            return dumps({"status": "Failure", "code": 400, "message": "Project does not exist"}), 400
        if result.modified_count > 0:
            return dumps({"status": "Success", "code": 200, "message": "User added to project successfully."}), 200
        elif result.matched_count > 0:
            return dumps({"status": "error", "code": 409, "message": "User already part of the project."}), 409
        else:
            return dumps({"status": "error", "code": 404, "message": "User not found."}), 404

    def get_user_projects(self, username):
        user = self.users_collection.find_one({'username': username})
        if user:
            project_id_list = user.get('projects', [])
            projects = self.projects_collection.find(
                {'projectId': {'$in': project_id_list}})
            projects = list(projects)
            return dumps({"projects": projects}), 200

        return dumps({"status": "error", "code": 500, "message": "User not found."}), 500
