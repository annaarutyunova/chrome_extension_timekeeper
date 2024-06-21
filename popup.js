
// Load projects initially
document.addEventListener('DOMContentLoaded', () => loadProjects());
// Used in 2+ functions, so make it a variable?
const form = document.querySelector('.formContainer');
const projectList = document.getElementById('projects');

// Display add project form when add button is clicked.
document.getElementById('formOpener').addEventListener('click', () => 
    {
        form.style.display = 'block';
        form.addEventListener('submit', handleFormSubmit);
}); 

// Store an add project button in a variable.
function handleFormSubmit(event) {
    // Prevent the default form submission behavior
    console.log("Triggered")
    event.preventDefault();
    const projectName = document.getElementById('projectName').value.trim();
    if(projectName) {
        addProject(projectName);
        // Clear Form
        form.reset();
        // Hide form
        form.style.display = 'none';
    }
    // const projectName = document.getElementById('projectName');
    // console.log({projectName})
    // const projectNameHolder = document.createElement('p');
    // projectNameHolder.innerText = projectName.value;
    // const projectName = document.getElementById('projectName');
    // console.log({projectName})
    // const projectNameHolder = document.createElement('p');
    // projectNameHolder.innerText = projectName.value;
}

// Add project to local storage.
function addProject(name) {
    chrome.storage.local.get('projects', (result) => {
        const projects = result.projects || [];
        projects.push(name);
        chrome.storage.local.set({'projects': projects}, () => {
            displayProject(name);
        })
    })
}

// Create a new <li> for each project name and display
function displayProject(name) {
    const li = document.createElement('li');
    li.textContent = name;
    projectList.appendChild(li);
}

// Retrieve projects from local storage
function loadProjects() {
    chrome.storage.local.get('projects', (result) => {
        const projects = result.projects || [];
        projects.forEach((project) => {
            displayProject(project);
        })
    })
}

// When edit projects is clicked, remove icons are added next to each project name.
document.getElementById("editProjects").addEventListener("click", () => {

})

function allowProjectDelete() {
    const liElements = projectList.children;
    liElements.forEach((liElement) => {
        
    })
}