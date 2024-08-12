
// Load projects initially
document.addEventListener('DOMContentLoaded', () => loadProjects());
// Used in 2+ functions, so make it a variable?
const form = document.querySelector('.formContainer');
const projectList = document.getElementById('projects');

// Display add project form when add button is clicked.
document.getElementById('formOpener').addEventListener('click', () => 
    {
        if (form.style.display === "none") {
            form.style.display = 'flex';
            form.addEventListener('submit', handleFormSubmit);
        } else {
            // removeEventListener can go after display is set to none
            // because it is ok if "form" can't be found in this case
            // it won't error out
            form.style.display = 'none';
            form.removeEventListener('submit', handleFormSubmit);
        }
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
function addProject(name, time = "00:00:00") {
    chrome.storage.local.get('projects', (result) => {
        const projects = result.projects || [];
        const lastId = projects.length > 0 ? Math.max(projects.map(project => project.id)) : 0;
        
        const newProject = {
            id: lastId + 1,
            name: name,
            time: time
        };

        projects.unshift(newProject);
        chrome.storage.local.set({ 'projects': projects }, () => {
            displayProject(newProject);
        });
    });
}


// Remove project from local storage
function removeProjectFromLocalStorage(name) {
    chrome.storage.local.get({ projects: [] }, function(result) {
        let projects = result.projects.filter(project => project.name !== name);
        chrome.storage.local.set({ projects: projects });
    });
}

// Create a new <div> for each project and display
function displayProject(project) {
    const div = document.createElement('div');
    div.classList.add('individualProject');

    const img = document.createElement('img');
    img.src = '/images/delete.png';
    img.classList.add('deleteProjectIcon');

    const li = document.createElement('li');
    li.textContent = project.name;

    const timeContainer = document.createElement('div');
    timeContainer.classList.add('wrapper');
    timeContainer.classList.add('tac');
    timeContainer.classList.add('timeDisplay');
    timeContainer.innerHTML = `
        <p><span id="hours-${project.name + project.time}">${project.time.split(':')[0]}</span>:
        <span id="minutes-${project.name + project.time}">${project.time.split(':')[1]}</span>:
        <span id="seconds-${project.name + project.time}">${project.time.split(':')[2]}</span></p>
        <img id="button-start-${project.name + project.time}" class="button-start" src="/images/play.png" alt="Start Icon" style="width:25px; height:25px; object-fit:cover; cursor:pointer;">
        <img id="button-stop-${project.name + project.time}" class="button-stop" src="/images/stop.png" alt="Stop Icon" style="width:25px; height:25px; object-fit:cover; cursor:pointer;">
        <img id="button-reset-${project.name + project.time}" class="button-reset" src="/images/reset.png" alt="Reset Icon" style="width:25px; height:25px; object-fit:cover; cursor:pointer;">
    `;

    div.appendChild(img);
    div.appendChild(li);
    div.appendChild(timeContainer);
    projectList.insertBefore(div, projectList.firstChild);

    // Listen for a click event to delete if needed
    img.addEventListener('click', function() {
        div.remove();
        console.log(project.name)
        removeProjectFromLocalStorage(project.name);
    });
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
