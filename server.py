from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
# from flask_session import Session

from model import connect_to_db, db
import crud
import datetime
import os
from dotenv import load_dotenv


load_dotenv()

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


@app.route("/dashboard", methods=['GET'])
def profile():
    """Profile"""

    user_id = session.get('user')
    if user_id:
        user = crud.get_user_by_id(user_id)
        if user:
            return jsonify({
                "id": user.user_id,
                "fname": user.fname,
                "lname": user.lname,
                "email": user.email,
                "team": user.team,
                "role": user.role
                # "current_projects": user.current_projects,  # Assuming these fields exist
                # "previous_projects": user.previous_projects  # Assuming these fields exist
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
                userproject = crud.create_userproject(user_id, project.project_id)
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
def tasks_page():
    """Tasks Page"""

    return jsonify({"Page accessed!"}), 201


if __name__ == "__main__":
    connect_to_db(app)
    app.run()
