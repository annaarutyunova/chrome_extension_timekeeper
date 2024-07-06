
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
}

// Add project to local storage.
function addProject(name) {
    chrome.storage.local.get('projects', (result) => {
        const projects = result.projects || [];
        // Add project to the beginning of the array
        projects.unshift(name);
        chrome.storage.local.set({'projects': projects}, () => {
            displayProject(name);
        })
    })
}

// Remove project from local storage
function removeProjectFromLocalStorage(name) {
    chrome.storage.local.get({ projects: [] }, function(result) {
        let projects = result.projects.filter(project => project !== name);
        chrome.storage.local.set({ projects: projects });
    });
}

// Create a new <li> for each project name and display
function displayProject(name) {
    const div = document.createElement('div');
    div.classList.add('individualProject');
    const img = document.createElement('img');
    img.src = '/images/delete.png';
    img.classList.add('deleteProjectIcon');
    const li = document.createElement('li');
    li.textContent = name;
    div.appendChild(img);
    div.appendChild(li);
    projectList.insertBefore(div, projectList.firstChild);

    // Listen for a click event to delete if needed
    img.addEventListener('click', function() {
        div.remove();
        removeProjectFromLocalStorage(name);
    })
}

// Retrieve projects from local storage
function loadProjects() {
    chrome.storage.local.get('projects', (result) => {
        const projects = result.projects || [];
        projects.reverse();
        projects.forEach((project) => {
            displayProject(project);
        })
    })
}

// When edit projects is clicked, remove icons are added next to each project name.
document.getElementById("editProjects").addEventListener("click", () => {
    // deleteIconds is aNodeList
    const deleteIcons = document.querySelectorAll(".deleteProjectIcon");
    // Iterate through each delete icon and toggle its display style
    deleteIcons.forEach((icon) => {
        if (icon.style.display === "block") {
            icon.style.display = "none";
        } else {
            icon.style.display = "block";
        }
    });
})
