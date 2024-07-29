from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
# from flask_session import Session

from model import connect_to_db, db
import crud
import datetime
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

app = Flask(__name__)
app.secret_key = os.getenv("EmmaJane5678")
app.config['DEBUG'] = True


@app.route("/")
def homepage():
    """Homepage"""

    return render_template("homepage.html")


@app.route("/<path>")
def path(path):

    return render_template("homepage.html")


@app.route("/login", methods=['POST'])
def login():
    """Login"""

    email = request.json.get('email')
    password = request.json.get('password')

    user = crud.get_user_by_email(email)

    if user:
        print("The user is in database")
        if user.password == password:

            session['user'] = user.user_id

            return jsonify({
                "id": user.user_id,
                "fname": user.fname,
                "lname": user.lname,
                "email": user.email,
                "team": user.team
            })

        else:
            return "", "401 Incorrect password."

    else:
        return "", "401 Incorrect username & password."


@app.route("/register", methods=['POST'])
def register():
    """Register"""

    fname = request.json.get('fname')
    lname = request.json.get('lname')
    email = request.json.get('email')
    password = request.json.get('password')
    team = request.json.get('team')
    role = request.json.get('role')

    user = crud.get_user_by_email(email)

    if user:
        return jsonify({'error': 'Sorry, that email is already being used. Please try again with a different email.'}), 401
    else:
        user = crud.create_user(fname, lname, email, password, team, role)
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "id": user.user_id,
            "email": user.email,
            "team": user.team
        })


# Upload profile photos
@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        file_to_upload = request.files['file']
        user_id = request.form['user_id']

        # Upload the image to Cloudinary
        upload_result = cloudinary.uploader.upload(file_to_upload)
        secure_url = upload_result['secure_url']

        # Update the user's profile image in the database
        user = crud.get_user_by_id(user_id)
        if user:
            user.profile_image = secure_url
            db.session.commit()
            return jsonify({'secure_url': secure_url, 'message': 'Profile image updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# DASHBOARD
@app.route("/dashboard", methods=['GET'])
def profile():
    """Profile"""

    user_id = session.get('user')

    if user_id:
        user = crud.get_user_by_id(user_id)
        projects = crud.get_projects_by_user_id(user_id)

        if user:

            curr_projects_data = [
                {
                    "id": project["project_id"],
                    "pname": project["pname"],
                    "address": project["address"]
                }
                for project in projects
            ]

            return jsonify({
                "id": user.user_id,
                "fname": user.fname,
                "lname": user.lname,
                "email": user.email,
                "team": user.team,
                "role": user.role,
                "profileImage": user.profile_image,
                "current_projects": curr_projects_data
                # "previous_projects": user.previous_projects  # Assuming these fields exist - will likely need to add "completion status" to model.py
            }), 200

    return jsonify({"error": "Unauthorized"}), 401


@app.route("/team_members", methods=['GET'])
def members():
    """Show all team members"""

    # Get the team number from the query parameters
    team = request.args.get('team')

    if not team:
        return jsonify({"error": "Team number is required"}), 400

    # Log the team value
    print(f"Fetching members for team: {team}")

    # Get members from the database based on the team number
    members = crud.get_members_by_team(team)

    # Print members before returning
    print("Members fetched from database:", members)

    # Convert members to a dictionary and return as JSON
    return jsonify({member.user_id: member.to_dict() for member in members})


@app.route('/project', methods=['POST'])
def add_project():
    """Create userproject instance"""

    pname = request.json.get('pname')
    address = request.json.get('address')

    if not pname or not address:
        return jsonify({"error": "pname and address are required"}), 400

    project = crud.create_new_project(pname, address)
    db.session.add(project)
    db.session.commit()

    members = request.json.get('members')
    userprojects = []

    if members:
        for member in members:
            user_id = member.get('user_id')
            if user_id:
                userproject = crud.create_userproject(
                    user_id, project.project_id)
                db.session.add(userproject)
                userprojects.append(userproject)
            else:
                print(f"Member without user_id: {member}")
    # for member in members:
    #     user_id = member.get('user_id')
    #     userproject = crud.create_userproject(user_id, project.project_id)
    #     db.session.add(userproject)
    #     userprojects.append(userproject)

    db.session.commit()

    return jsonify({"project_id": project.project_id}), 201


@app.route('/project/<project_id>', methods=['GET'])
def get_tasks(project_id):
    """Tasks Page"""

    tasks = crud.get_tasks_by_project_id(project_id)
    project_members = crud.get_members_by_project(project_id)

    tasks_list = [{
        "id": task.id,
        "tname": task.tname,
        "date_assigned": task.date_assigned,
        "status": task.status
    } for task in tasks]

    members_list = [{
        "id": user["user_id"],
        "fname": user["fname"],
        "lname": user["lname"],
        "email": user["email"],
        "team": user["team"],
        "role": user["role"]
    } for user in project_members]

    return jsonify({"tasks": tasks_list, "members": members_list}), 200


@app.route('/project/<int:project_id>/tasks', methods=['POST'])
def add_project_tasks(project_id):
    data = request.json

    # Retrieve the project using CRUD function
    project = crud.get_project_by_id(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    tasks_data = data.get('tasks', [])
    tasks_created = []
    try:
        for task_data in tasks_data:
            # Create task object using CRUD function
            task = crud.create_task_object(
                tname=task_data.get('name'),
                status=task_data.get('status', 'Not Started'),
                project_id=project_id
            )
            db.session.add(task)  # Add the task object to the session
            tasks_created.append(task.to_dict())

        # Commit all changes at once
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # Roll back in case of error
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Tasks added successfully", "tasks": tasks_created, "project_id": project_id}), 201


if __name__ == "__main__":
    connect_to_db(app)
    app.run()
