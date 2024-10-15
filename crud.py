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

    return User.query.filter(User.team == str(team)).all()


def get_members_by_project(project_id):
    """Return a list of users on a specific project"""
    user_projects = UserProject.query.filter_by(project_id=project_id).all()
    user_ids = [up.user_id for up in user_projects]
    users = User.query.filter(User.user_id.in_(user_ids)).all()
    return [user.to_dict() for user in users]


def get_project_member(project_id, user_id):
    """Return a specific member in a project"""
    return UserProject.query.filter_by(project_id=project_id, user_id=user_id).first()

# PROJECT-RELATED


def create_new_project(pname, address):
    """Create new project"""

    return Project(pname=pname, address=address)


def update_project(project_id, pname=None, address=None):
    """Update project details."""
    project = get_project_by_id(project_id)
    if project:
        if pname is not None:
            project.pname = pname
        if address is not None:
            project.address = address
        db.session.commit()
        return project
    return None


# USERPROJECT-RELATED

def create_userproject(user_id, project_id):
    """Create userproject"""

    return UserProject(user_id=user_id, project_id=project_id)


def get_projects_by_user_id(user_id):
    """Return all projects of a user id"""

    user_projects = UserProject.query.filter(
        UserProject.user_id == user_id).all()
    projects = [user_project.project for user_project in user_projects]

    return [project.to_dict() for project in projects]


# USERTASK-RELATED

def get_tasks_by_project_id(project_id):
    """Return all tasks of a project id for Admin Use"""

    tasks = Task.query.filter(Task.project_id == project_id).all()

    # return {task.task_id: task.to_dict() for task in tasks}
    return [task.to_dict() for task in tasks]


def assign_member_to_task(user_id, task_id):
    """Assign a member (user) to a task."""

    # Check if the user is already assigned to the task
    # existing_assignment = UserTask.query.filter_by(user_id=user_id, task_id=task_id).first()

    # if existing_assignment:
    #     return {'error': 'User is already assigned to this task'}

    # Create a new assignment
    user_task = UserTask(user_id=user_id, task_id=task_id)

    db.session.add(user_task)
    db.session.commit()

    return user_task

# Task-related


def get_project_by_id(project_id):
    """Retrieve a project by its ID."""
    return Project.query.get(project_id)


def create_task_object(tname, status, project_id, shape_name, date_assigned=None, contact_info=None):
    """Create a new task object associated with a project."""
    return Task(
        tname=tname,
        status=status,
        project_id=project_id,
        shape_name=shape_name,
        date_assigned=date_assigned or datetime.now(),
        contact_info=contact_info or "No contact info"
    )


def get_task_by_id(task_id):
    """Retrieve a task by its ID."""
    return Task.query.get(task_id)


def update_task(task_id, tname=None, status=None):
    """Update task details."""
    task = get_task_by_id(task_id)
    if task:
        if tname is not None:
            task.tname = tname
        if status is not None:
            task.status = status
        db.session.commit()
        return task
    return None


def delete_task(task_id):
    """Delete a task by its ID."""
    task = get_task_by_id(task_id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return task
    return None


def update_user_password(user_id, new_password):
    """Update the password for a specific user."""
    user = get_user_by_id(user_id)
    if user:
        user.password = new_password
        db.session.commit()
        return user
    return None


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
