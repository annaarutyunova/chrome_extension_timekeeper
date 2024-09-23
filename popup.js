
// Load projects initially
document.addEventListener('DOMContentLoaded', () => {
    // chrome.storage.local.clear(function(){
    //     console.log("local storage.cleared")
    // })
    loadProjects()
});
// Used in 2+ functions, so make it a variable?
const form = document.querySelector('.formContainer');
const projectList = document.getElementById('projects');

// Display add project form when add button is clicked.
document.getElementById('formOpener').addEventListener('click', () => 
    {
        if (form.style.display === "none") {
            form.style.display = 'flex';
            form.addEventListener('submit', handleFormSubmit);
            document.getElementById('projectName').focus();
        } else {
            // removeEventListener can go after display is set to none
            // because it is ok if "form" can't be found in this case
            // it won't error out
            form.style.display = 'none';
            form.removeEventListener('submit', handleFormSubmit);
        }
}); 

// Handle form submission and add project to local storage
function handleFormSubmit(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the project name from the input field
    const projectName = document.getElementById('projectName').value.trim();

    // Only proceed if the project name is not empty
    if (projectName) {
        // Fetch existing projects from local storage
        chrome.storage.local.get('projects', (result) => {
            const projects = result.projects || [];

            // Create the new project object
            const newProject = {
                id: crypto.randomUUID(),
                name: projectName,
                seconds: '00',
                minutes: '00',
                hours: '00',
            };

            // Add the new project to the projects array
            projects.unshift(newProject);

            // Save the updated project list back to local storage
            chrome.storage.local.set({ projects: projects }, () => {
                // Update the UI to display the new project
                displayProject(newProject);
            });

            // Clear the form
            form.reset();
            // Hide the form
            form.style.display = 'none';
        });
    }
}

// Remove project from local storage and clear associated timers
function removeProjectFromLocalStorage(projectToRemove) {
    chrome.storage.local.get({ projects: [] }, function(result) {

        // Filter out the project to remove it completely
        let projects = result.projects.filter(project => project.id !== projectToRemove.id);
        
        // Save the updated projects array back to local storage
        chrome.storage.local.set({ projects: projects }, () => {
            // console.log(`Project ${projectToRemove.name} was deleted.`);
        });
        chrome.runtime.sendMessage({ action: 'delete', projectId: projectToRemove.id });

        // Clear any associated timer data
        clearInterval(intervalIds[projectToRemove.id]);
        delete intervalIds[projectToRemove.id];
        delete projectTimers[projectToRemove.id];
    });
}

// Create a new <div> for each project and display
function displayProject(project) {
    // console.log("Name", project.name , "ID: " , project.id) // This works
    // console.log(project.seconds)
    const li = document.createElement('li');
    li.classList.add('individualProject');
    li.classList.add('df')
    li.classList.add('jcsb')

    const img = document.createElement('img');
    img.src = '/images/delete.png';
    img.classList.add('deleteProjectIcon');

    const projectName = document.createElement('p');
    projectName.classList.add('nameOfProject')
    projectName.textContent = project.name;

    const timeContainer = document.createElement('div');
    timeContainer.classList.add('wrapper');
    timeContainer.classList.add('tac');
    timeContainer.classList.add('timeDisplay');

    timeContainer.innerHTML = `
        <p><span id="hours-${project.id}">${project.hours}</span>:
        <span id="minutes-${project.id}">${project.minutes}</span>:
        <span id="seconds-${project.id}">${project.seconds}</span></p>
        <img id="button-start-${project.id}" src="/images/play.png" alt="Start Icon" style="width:25px; height:25px; object-fit:cover; cursor:pointer;">
        <img id="button-stop-${project.id}" src="/images/stop.png" alt="Stop Icon" style="width:25px; height:25px; object-fit:cover; cursor:pointer;">
        <img id="button-reset-${project.id}" src="/images/reset.png" alt="Reset Icon" style="width:25px; height:25px; object-fit:cover; cursor:pointer;">
    `;

    li.appendChild(img);
    li.appendChild(projectName);
    li.appendChild(timeContainer);
    projectList.insertBefore(li, projectList.firstChild);

    // Listen for a click event to delete if needed
    img.addEventListener('click', function() {
        li.remove();
        // console.log(project.name)
        removeProjectFromLocalStorage(project);
    });
    // Attach event listeners for start, stop, and reset buttons
    document.getElementById(`button-start-${project.id}`).addEventListener('click', () => {
        // console.log("Start button clicked");
        let message = { action: 'start', projectId: project.id }
        chrome.runtime.sendMessage(message);
    });

    document.getElementById(`button-stop-${project.id}`).addEventListener('click', () => {
        // console.log("Stop button clicked");
        chrome.runtime.sendMessage({ action: 'stop', projectId: project.id });
    });

    document.getElementById(`button-reset-${project.id}`).addEventListener('click', () => {
        // console.log("Reset button clicked");
        chrome.runtime.sendMessage({ action: 'reset', projectId: project.id });
    });
    // Listen for messages from the service worker to update the timer display
    chrome.runtime.onMessage.addListener((message) => {
        // console.log("Received message from service worker:", message);
        // console.log("message.projectId", message.projectId)
        if (message.action === 'updateTime') {
            const projectId = message.projectId;
            if(projectId){
                document.getElementById(`seconds-${projectId}`).innerText = message.seconds;
                document.getElementById(`minutes-${projectId}`).innerText = message.minutes;
                document.getElementById(`hours-${projectId}`).innerText = message.hours;
            } else {
                console.error("Project ID is missing in the updateTime message.")
            }
        }
    });
}

// Retrieve projects from local storage
function loadProjects() {
    chrome.storage.local.get('projects', (result) => {
        // console.log("result", result)
        const projects = Array.isArray(result.projects) ? result.projects : [];
        // console.log("projects variable is: ", projects)
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
