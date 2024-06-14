<h3>EnJambment (<em>Work In Progress</em>)</h3>
<p>
EnJambment is a web app that simplifies the process for window technician companies to manage their portfolio of projects and tasks. The goal of the app is to provide an easy-to-use interface for the window technician companies to assign projects and tasks, for technicians to conveniently provide updates on their assignments, and for clients to view the status of their projects.
</p>
<h3>Contents</h3>
<ul>
<li><a href="#tech">Tech Stack</a></li>
<li><a href="#feat">Features</a></li>
<li><a href="#install">Installation</a></li>
</ul>

<hr>

<h3 id="tech">Tech Stack</h3>
<ul>
<li>Python</li>
<li>Flask</li>
<li>React</li>
<li>PostgreSQL</li>
<li>SQLAlchemy ORM</li>
<li>HTML</li>
<li>CSS</li>
</ul>

<hr>

<h3 id="feat">Features</h3>
<h4>Overview</h4>
<p>
EnJambment serves as a portal to view and manage the projects between window technician companies and technicians as well as their clients. The purpose of the app is to provide a more straightforward means of communicating the progress and completion of windows (tasks) within a building (project).
<h4>Create A User</h4>
<p>
When creating an account, a new user can be one of three roles: an Administrator (window technician company), Technician, or Client.
</p>
<h4>Administrator</h4>
<p>
Administrators will have the ability to not only create projects and tasks, but assign them to technicians. For example, if the administrator adds a building (project), they can add which windows (tasks) need to be worked on. Then, for each window, the administrator can assign it to one or more technicians. The administrator can add a note to each window to specify its location (e.g. Upstairs Window #1) and add a photo for reference.
</p>
<h4>Technician</h4>
<p>
Technicians can view which tasks are assigned to them, and must mark whether the assigned window is in progress or completed. The progress of the windows are denoted by color: gray for assigned but not started, yellow for in progress, and green for completed. While working on the window, the technician will need to provide photos for reference.
</p>
<h4>Client</h4>
<p>
Clients will be able to log into the portal and view the progress on their projects. Each project will include tasks that show the color of their progress - gray, yellow, or green. The clients will also have access to the photos uploaded by the technician while working on the tasks.
</p>

<hr>


<h3 id="install">Installation</h3>
<h4>To run EnJambment:</h4>
Clone or fork this repository:

```
https://github.com/EmmaBin/EmmaJane_project
```

Create and activate a virtual environment:
```
virtualenv env
source env/bin/activate
```
Install the dependencies:
```
pip install -r requirements.txt
```
Create and seed the database:
```
python3 seed_database.py
```
Run the app:
```
python3 server.py
```
Navigate to http://localhost:5000/

