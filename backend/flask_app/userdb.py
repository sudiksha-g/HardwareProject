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

    def join_project(self, username, projectId):
        result = self.users_collection.update_one(
            {'username': username},
            {'$addToSet': {'projects': projectId}}
        )
        if result.modified_count > 0:
            return dumps({"status": "error", "code": 200, "message": "User added to project successfully."}), 200
        elif result.matched_count > 0:
            return dumps({"status": "error", "code": 500, "message": "User already part of the project."}), 500
        else:
            return dumps({"status": "error", "code": 500, "message": "User not found."}), 500

    def get_user_projects(self, username):
        user = self.users_collection.find_one({'username': username})
        if user:
            project_id_list = user.get('projects', [])
            print(project_id_list)
            projects = self.projects_collection.find(
                {'projectId': {'$in': project_id_list}})
            projects = list(projects)
            print("$$$$$$$$", projects)
            return dumps({"uo": projects})

        return dumps({"status": "error", "code": 500, "message": "User not found."}), 500
