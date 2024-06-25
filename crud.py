from model import (db,
    User, Project, Task,
    UserProject, UserTask, 
    connect_to_db)

import datetime


# USER-RELATED

def create_user(fname, lname, email, password, team, role):
    """Create and return a new user."""

    return User(fname=fname, lname=lname, email=email, password=password, team=team, role=role)
    
def get_user_by_id(user_id):
    """Return user info by id"""

    return User.query.get(user_id)

    # user = User.query.get(user_id)
    # if user:
    #     print(f"User found: {user}")
    # else:
    #     print("User not found")
    # return user

def get_user_by_email(email):
    """Return a user with inputted email"""

    return User.query.filter(User.email == email).first()

def get_members_by_team(team):
    """Return a list of users on a specific team"""

    return User.query.filter(User.team == team).all()


# USERPROJECT-RELATED

def get_projects_by_user_id(user_id):
    """Return all projects of a user id"""

    user_projects = UserProject.query.filter(UserProject.user_id==user_id).all()
#need tests
    return {user_project.project_id: user_project.to_dict() for user_project in user_projects}


# USERTASK-RELATED

def get_tasks_by_project_id(project_id):
    """Return all tasks of a project id for Admin Use"""

    tasks = Task.query.filter(Task.project_id==project_id).all()

    return {task.task_id: task.to_dict() for task in tasks}


if __name__ == '__main__':
    from server import app
    connect_to_db(app)