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





if __name__ == "__main__":
    connect_to_db(app)
    app.run()