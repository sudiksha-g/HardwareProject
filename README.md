# Hardware Project README
This is a working platform that will allow you to utilize the check in & out software for checking out mock pieces of hardware, deployed via Heroku.

Github repo link:
https://github.com/thisisanurag/mojo_repo

Steps to Run the Application Locally
1. Clone the Repository
Begin by cloning the repository from GitHub:
**bash
git clone git@github.com:thisisanurag/mojo_repo.git
**

2. Set Up the Python Virtual Environment
Navigate to the root directory and set up a Python virtual environment to manage
dependencies:
**bash
python -m venv venv**

3. Activate the Virtual Environment
Activate the virtual environment you just created:
**bash
source venv/bin/activate**

4. Navigate to the Backend Directory
Change the directory to the backend folder where the Flask application is located:
**bash
cd mojo_repo/backend/flask_app**

5. Install Python Dependencies
Install all the necessary Python packages listed in requirements.txt:
**bash
pip install -r requirements.txt**

6. Set Up the Flask Application
Set the Flask application environment variable:
**bash
export FLASK_APP=app.py**

7. Run the Flask Backend
Start the Flask server:
**bash
flask run**
The Flask backend should now be running on http://127.0.0.1:5000/.

8. Set Up the React Frontend
Open a new terminal window or tab and navigate to the React frontend directory:
**bash
cd mojo_repo/haas-app**

9. Install Node.js Dependencies
Install the necessary Node.js packages:
**bash
npm install**

10. Build the React Application
Build the React application for production:
**bash
npm run build
**

11. Serve the React Build
Use the serve package to serve the built React application:
**bash
serve -s build**
This will serve your React frontend, typically available at http://localhost:3000.

12. Keep Both Terminals Running
Make sure to keep both the Flask backend and React frontend terminals running to have the
