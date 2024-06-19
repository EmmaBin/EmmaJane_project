"""
Seed the Database for Testing
"""

import os
import json
from random import choice, randint
import datetime

import crud
import model
import server

os.system("dropdb windows")
os.system("createdb windows")

model.connect_to_db(server.app)
model.db.create_all()

teams = [1,2,3]

teams_in_db = []

for i, studio in enumerate(teams):
    fname = f'{i}'
    lname = f'{i}'
    email = f'user{i}@test.com'
    password = f'test{i}'
    team = f'{i}'
    role = 'Admin'
    teams_in_db.append(crud.create_user(fname, lname, email, password, team, role))


model.db.session.add_all(teams_in_db)
model.db.session.commit()