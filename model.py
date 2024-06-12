"""Models for window technician logistics app."""

from collections import UserString
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()


class User(db.Model):
    """User"""

    __tablename__ = "user"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)

    # userproject = db.relationship("UserProject", back_populates="user")
    # usertask = db.relationship("UserTask", back_populates="user")

    def __repr__(self):
        return f'<User user_id={self.user_id} fname={self.fname} lname={self.lname} email={self.email} role={self.role}>'
    
    def to_dict(self):
        return {'user_id': self.user_id,
                'fname': self.fname,
                'lname': self.lname,
                'email': self.email,
                'role': self.role
                }


# UserProject

# UserTask








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