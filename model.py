"""Models for window technician logistics app."""

from collections import UserString
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()


class User(db.Model):
    """User"""

    __tablename__ = "User"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    team = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    profile_image = db.Column(db.String(200), nullable=True)

    user_projects = db.relationship("UserProject", back_populates="user")
    user_task = db.relationship("UserTask", back_populates="user")

    def __repr__(self):
        return f'<User user_id={self.user_id} fname={self.fname} lname={self.lname} email={self.email} team={self.team} role={self.role}>'
    
    def to_dict(self):
        return {'user_id': self.user_id,
                'fname': self.fname,
                'lname': self.lname,
                'email': self.email,
                'team': self.team,
                'role': self.role
                }


class Project(db.Model):
    """Project"""

    __tablename__ = "Project"

    project_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    pname = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)

    user_projects = db.relationship("UserProject", back_populates="project")
    tasks = db.relationship("Task", back_populates="project")

    def __repr__(self):
        return f'<Project project_id={self.project_id} pname={self.pname} address={self.address}>'
    
    def to_dict(self):
        return {'project_id': self.project_id,
                'pname': self.pname,
                'address': self.address
                }


class UserProject(db.Model):
    """UserProject"""

    __tablename__ = "UserProject"

    user_id = db.Column(db.Integer, db.ForeignKey("User.user_id"), primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("Project.project_id"), primary_key=True)
    __table_args__ = (db.PrimaryKeyConstraint('user_id', 'project_id'),)

    user = db.relationship("User", back_populates="user_projects")
    project = db.relationship("Project", back_populates="user_projects")

    def __repr__(self):
        return f'<UserProject user_id={self.user_id} project_id={self.project_id}>'
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'project_id': self.project_id
        }

class Task(db.Model):
    """Task"""

    __tablename__ = "Task"

    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    tname = db.Column(db.String, nullable=False)
    date_assigned = db.Column(db.DateTime, nullable=False)
    date_completed = db.Column(db.DateTime, nullable=True)
    contact_info = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)

    project_id = db.Column(db.Integer, db.ForeignKey('Project.project_id'), nullable=False) 

    project = db.relationship("Project", back_populates="tasks")
    user_task = db.relationship("UserTask", back_populates="task")

    def __repr__(self):
        return f'<Task task_id={self.task_id} tname={self.tname} date_assigned={self.date_assigned} status={self.status}>'
    
    def to_dict(self):
        return {
            'task_id': self.task_id,
            'tname': self.tname,
            'date_assigned': self.date_assigned,
            'date_completed': self.date_completed,
            'contact_info': self.contact_info,
            'status': self.status,
            'project_id': self.project_id
        }

class UserTask(db.Model):
    """UserTask"""

    __tablename__ = "UserTask"

    user_id = db.Column(db.Integer, db.ForeignKey("User.user_id"), primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("Task.task_id"), primary_key=True)
    __table_args__ = (db.PrimaryKeyConstraint('user_id', 'task_id'),)

    user = db.relationship("User", back_populates="user_task")
    task = db.relationship("Task", back_populates="user_task")

    def __repr__(self):
        return f'<UserTask user_id={self.user_id} task_id={self.task_id}>'
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'task_id': self.task_id
        }


def connect_to_db(flask_app, db_uri="postgresql:///windows", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

     
    connect_to_db(app)