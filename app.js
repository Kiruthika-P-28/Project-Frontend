let currentUser = null;
let projects = [];

// Show login form
function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Show register form
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Handle login
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.message === 'Login successful') {
        currentUser = data.user;
        alert('Login successful');
        showMainDashboard();
    } else {
        alert('Invalid credentials');
    }
}

// Handle registration
async function register() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.message === 'User registered successfully') {
        alert('User registered successfully');
        showLoginForm();
    } else {
        alert('Username already taken');
    }
}

// Show main dashboard
function showMainDashboard() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';

    loadProjects();
}

// Load list of projects
async function loadProjects() {
    const response = await fetch('/projects');
    const projects = await response.json();
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    // Iterate over projects and render them
    projects.forEach(project => {
        const projectItem = document.createElement("li");
        projectItem.classList.add("project-item");

        // Display Project Name
        const projectName = document.createElement("span");
        projectName.classList.add("project-name");
        projectName.textContent = project.name;

        // Display Progress
        const projectProgress = document.createElement("span");
        projectProgress.classList.add("project-progress");
        projectProgress.textContent = `Progress: ${project.progress}%`;

        // Progress Bar
        const progressBarContainer = document.createElement("div");
        progressBarContainer.classList.add("progress-bar-container");
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        progressBar.style.width = `${project.progress}%`;
        progressBarContainer.appendChild(progressBar);

        // Input field for updating progress
        const progressInput = document.createElement("input");
        progressInput.classList.add("project-progress-input");
        progressInput.type = "number";
        progressInput.value = project.progress;
        progressInput.max = 100;
        progressInput.min = 0;

        // Event listener to update progress
        progressInput.addEventListener("input", () => {
            const newProgress = parseInt(progressInput.value);
            if (newProgress >= 0 && newProgress <= 100) {
                project.progress = newProgress;
                projectProgress.textContent = `Progress: ${newProgress}%`;
                progressBar.style.width = `${newProgress}%`;

                // Send updated progress to the server
                updateProjectProgress(project.id, newProgress);
            }
        });

        // Append all elements to the list item
        projectItem.appendChild(projectName);
        projectItem.appendChild(projectProgress);
        projectItem.appendChild(progressBarContainer);
        projectItem.appendChild(progressInput);
        projectList.appendChild(projectItem);
    });
}

// Handle creating a project
async function createProject() {
    const name = prompt('Enter project name:');
    const description = prompt('Enter project description:');

    const response = await fetch('/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, progress: 0 })  // Default progress 0
    });

    const data = await response.json();
    if (data.id) {
        alert('Project created successfully');
        loadProjects();
    } else {
        alert('Failed to create project');
    }
}

// Update project progress on the server
async function updateProjectProgress(projectId, progress) {
    const response = await fetch(`/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress })
    });

    const data = await response.json();
    if (data.success) {
        console.log(`Project progress updated to ${progress}%`);
    } else {
        alert('Failed to update project progress');
    }
}
