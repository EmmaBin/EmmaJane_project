from flask import (Flask, render_template, request, flash, session,
                   redirect, jsonify)
from model import connect_to_db, db
import crud
import datetime
import os

app = Flask(__name__)
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
            
            # session['user'] = user.user_id
            # return redirect("/")
            return jsonify({
                "id": user.user_id,
                "fname": user.fname,
                "lname": user.lname,
                "email": user.email
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
        return jsonify({'error': 'Sorry, that email is already being used. Please try again with a different email.' }), 401
    else:
        user = crud.create_user(fname, lname, email, password, team, role)
        db.session.add(user)
        db.session.commit()
        return jsonify({
                "id": user.user_id,
                "email": user.email
            })


if __name__ == "__main__":
    connect_to_db(app)
    app.run()