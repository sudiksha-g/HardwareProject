from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
db = client['flask_db']  
user_collection = db['users']



def addUser(client, username, password):
    db = client['flask_db']
    user_collection = db['users']
    user_data = {
        'username': username,
        'password': password,
        'projects': [] 
    }
    user_collection.insert_one(user_data)

def __queryUser(client, username):
    db = client['flask_db']
    user_collection = db['users']

    user = user_collection.find_one({'username': username})
    return user


def login(client, username, password):
    user = __queryUser(client, username)
    if user:
        return user['password'] == password 
    return False


if __name__ == "__main__":
    addUser(client, 'jyotsna','pwd12345')
    login_status = login(client, 'jyotsna', 'pwd12345')
    print(f"Login successful: {login_status}")


