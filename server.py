from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
# from flask_session import Session

from model import connect_to_db, db
import crud
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime, timedelta, timezone
from authlib.jose import jwt, JoseError
from flask_mail import Mail, Message

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

app = Flask(__name__)
app.secret_key = os.getenv("EmmaJane5678")
app.config['DEBUG'] = True

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('GMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('GMAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('GMAIL_USER')

mail = Mail(app)


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


def send_mail(user):
    """Send password reset email."""
    # Generate a token
    payload = {
        'user_id': user.user_id,
        'email': user.email,
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode({'alg': 'HS256'}, payload,
                       os.getenv('JWT_SECRET_KEY')).decode('utf-8')

    # Create the reset URL
    reset_link = f"http://127.0.0.1:5000/reset_password/{token}"
    print(f"**************Reset link: {reset_link}")

    # Prepare email
    msg = Message("Password Reset Request",
                  recipients=[user.email])
    msg.body = f"To reset your password, click the link: {reset_link}. Link will expire in 1 hour."

    # Send the email
    mail.send(msg)


@app.route("/reset_password", methods=['POST'])
def reset_request():
    """Reset Password"""
    email = request.json.get('email')
    user = crud.get_user_by_email(email)
    if not user:
        return jsonify({'error': 'No account found with that email address.'}), 404

    send_mail(user)
    print(f"User found: {user.to_dict()}")
    return jsonify({'message': 'A password reset link has been sent to your email address.'}), 200


@app.route("/verify_token/<token>", methods=['GET'])
def verify_token(token):
    try:

        payload = jwt.decode(token, os.getenv(
            'JWT_SECRET_KEY'), algorithms=['HS256'])
        user_id = payload['user_id']
        user = crud.get_user_by_id(user_id)

        if user:
            return jsonify({'valid': True, 'user_id': user_id})
        else:
            return jsonify({'valid': False, 'error': 'User not found.'}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False, 'error': 'Token has expired.'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'valid': False, 'error': 'Invalid token.'}), 400


@app.route("/reset_password/<token>", methods=['GET', 'POST'])
def reset_password(token):
    """Render the reset password page and handle password reset."""
    try:

        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'))
        user_id = payload['user_id']
        user = crud.get_user_by_id(user_id)

        if not user:
            return jsonify({'error': 'User not found.'}), 404

        if request.method == 'POST':
            new_password = request.json.get('password')

            if not new_password:
                return jsonify({'error': 'Password cannot be empty.'}), 400

            crud.update_user_password(user_id, new_password)
            return jsonify({'success': True, 'message': 'Password has been updated successfully!***********************'}), 200

        return redirect("/reset_password_complete/"+f"{token}")

    except JoseError as e:

        return jsonify({'error': 'Token error: {}'.format(str(e))}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/reset_password_complete/<token>", methods=['GET'])
def reset_password_complete(token):
    return render_template("homepage.html")


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


@app.route('/project/<project_id>/member/<int:member_id>', methods=['DELETE'])
def delete_project_member(project_id, member_id):
    """Delete a member from a project"""
    project_member = crud.get_project_member(project_id, member_id)
    if not project_member:
        return jsonify({"error": "Member not found in project"}), 404

    db.session.delete(project_member)
    db.session.commit()

    return jsonify({"message": "Member removed from project"}), 200


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
    project = crud.get_project_by_id(project_id)

    tasks_list = [{
        "task_id": task["task_id"],
        "tname": task["tname"],
        "date_assigned": task["date_assigned"],
        "status": task["status"],
        "shape_name": task["shape_name"]
    } for task in tasks]

    members_list = [{
        "id": user["user_id"],
        "fname": user["fname"],
        "lname": user["lname"],
        "email": user["email"],
        "team": user["team"],
        "role": user["role"]
    } for user in project_members]

    return jsonify({"tasks": tasks_list, "members": members_list, "project": project.to_dict()}), 200


@app.route('/project/<int:project_id>', methods=['PUT'])
def update_project_api(project_id):
    data = request.json
    pname = data.get('pname')
    address = data.get('address')

    project = crud.update_project(project_id, pname=pname, address=address)
    if project:
        print(f"New pname: {pname}###########################")
        print(f"New address: {address}#############################")
        return jsonify(project.to_dict()), 200
    else:
        return jsonify({'error': 'Project not found'}), 404


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
                project_id=project_id,
                shape_name=task_data.get('shapeName'),
                date_assigned=datetime.now(),
                contact_info=task_data.get('contact_info') or "No contact info"
            )
            db.session.add(task)  # Add the task object to the session
            db.session.commit()
            tasks_created.append(task.to_dict())
            print(f'Task created------------------------: {task.to_dict()}')
            print(project_id)

        # Commit all changes at once

    except Exception as e:
        db.session.rollback()  # Roll back in case of error
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Tasks added successfully", "tasks": tasks_created, "project_id": project_id}), 201


@app.route('/project/<project_id>/tasks/<task_id>', methods=['PUT'])
def update_task_route(project_id, task_id):
    data = request.json
    task = crud.update_task(task_id, tname=data.get(
        'tname'), status=data.get('status'))
    if task:
        return jsonify(task.to_dict()), 200
    return jsonify({"error": "Task not found"}), 404


@app.route('/project/<project_id>/tasks/<task_id>', methods=['DELETE'])
def delete_task_route(project_id, task_id):
    task = crud.delete_task(task_id)
    if task:
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"error": "Task not found"}), 404


# Assign Team Member to Job

@app.route('/assign_job', methods=['POST'])
def assign_member_to_job():
    """Assign a team member to a job"""

    # Get the job_id and the list of member IDs from the request body
    task_id = request.json.get('task_id')
    user_id = request.json.get('member_id')

    if not task_id or not user_id:
        return jsonify({"error": "Job ID and member ID are required"}), 400

    try:
        # Make sure this function handles errors
        crud.assign_member_to_task(user_id, task_id)
        return jsonify({"success": True, "message": "Member assigned to job successfully"}), 200
    except Exception as e:
        # Return error details in case of exception
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    connect_to_db(app)
    app.run()
