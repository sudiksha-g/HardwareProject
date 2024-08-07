from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token


class UserDB:
    def __init__(self, db):
        self.users_collection = db['users']

    def register_user(self, username, password):
        if self.users_collection.find_one({'username': username}):
            return "User already exists."
        new_user = {
            'username': username,
            'password': generate_password_hash(password),
            'projects': []
        }
        self.users_collection.insert_one(new_user)
        return "User registered successfully."

    def get_user(self, username):
        user = self.users_collection.find_one({'username': username})
        return user

    def get_all_users(self):
        all_users = self.users_collection.find()
        return all_users

    def login_user(self, username, password):
        user = self.get_user(username)
        if user and check_password_hash(user['password'], password):
            access_token = create_access_token(identity={"username": username})
            return {"message": "Login successful!", "access_token": access_token}
        return "Invalid username or password."

    def join_project(self, username, projectId):
        result = self.users_collection.update_one(
            {'username': username},
            {'$addToSet': {'projects': projectId}}
        )
        if result.modified_count > 0:
            return "User added to project successfully."
        elif result.matched_count > 0:
            return "User already part of the project."
        else:
            return "User not found."

    def get_user_projects(self, username):
        user = self.users_collection.find_one({'username': username}, {
            'projects': 1, '_id': 0})
        if user:
            return user.get('projects', [])
        return "User not found."
