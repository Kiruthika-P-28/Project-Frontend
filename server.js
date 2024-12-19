// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data (in-memory store for simplicity)
let users = [];
let projects = [];
let tasks = [];

// Routes for handling user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple user validation (just for demo purposes)
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Routes for handling user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Add user to the users array
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = { username, password };
    users.push(newUser);
    res.json({ message: 'User registered successfully', user: newUser });
});

// Routes to handle CRUD operations on Projects
app.post('/projects', (req, res) => {
    const { name, description } = req.body;
    const newProject = {
        id: projects.length + 1,
        name,
        description,
        progress: 0
    };
    projects.push(newProject);
    res.json(newProject);
});

app.get('/projects', (req, res) => {
    res.json(projects);
});

app.delete('/projects/:id', (req, res) => {
    const projectId = parseInt(req.params.id, 10);
    projects = projects.filter(project => project.id !== projectId);
    res.json({ message: 'Project deleted' });
});

// Routes to handle CRUD operations on Tasks
app.post('/tasks', (req, res) => {
    const { projectId, title, description, status, progress } = req.body;
    const newTask = {
        id: tasks.length + 1,
        projectId,
        title,
        description,
        status,
        progress
    };
    tasks.push(newTask);
    res.json(newTask);
});

app.get('/tasks/:projectId', (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    res.json(projectTasks);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
