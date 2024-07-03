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

admin_users = [1,2,3]
admins_in_db = []

team_users = [4,5,6]
teams_in_db = []

# Create Admin Users
for user in admin_users:
    fname = f'{user}'
    lname = f'{user}'
    email = f'user{user}@test.com'
    password = f'test{user}'
    team = f'{user}'
    role = 'Admin'
    admins_in_db.append(crud.create_user(fname, lname, email, password, team, role))

# Create Team Users
for user in team_users:
    fname = f'{user}'
    lname = f'{user}'
    email = f'user{user}@test.com'
    password = f'test{user}'
    team = 1
    role = 'Technician'
    teams_in_db.append(crud.create_user(fname, lname, email, password, team, role))


model.db.session.add_all(admins_in_db)
model.db.session.add_all(teams_in_db)
model.db.session.commit()