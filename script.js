// A function to check if key exists in local storage. 
// If it doesn't, create it.
function checkIfInLocalStorage(){
    const allData = localStorage.getItem("Projects");
    try{
        if(allData === null){
            // Create a projects list that will contain objects.
            // Keys for those projects are names of the user's projects.
            const projects = {
                projects: []
            };
            // Convert the object to a JSON string.
            const jsonString = JSON.stringify(projects);
            // Set the JSON string as a value of the "Projects" key in the Local Storage.
            localStorage.setItem("Projects", jsonString);
        }
        console.log(allData);
    } catch(errors){
        console.log(errors);
    }
}

function addNewProject () {
    // localStorage.setItem("")
}

// Pull Projects names from Local Storage and display them on the screen adding them to the output div.
function displayProjectsNames(data){
    // If data is true (not null, undefined, 0, NoN,"", or false) - it parses the string. Otherwise, parseData is assigned an empty object.
    const parsedData = data ? JSON.parse(data) : {projects:[]};
    const allProjectsContainer = document.querySelector(".output");

    parsedData.projects.forEach(project => {
        const projectDiv = createProjectDiv(project);
        allProjectsContainer.appendChild(projectDiv);
    })
}



function createProjectDiv(project) {
    // Create a new div element with the class "projects"
    const div = document.createElement("div");
    div.setAttribute('class', 'projects');
  
    // Create a <p> tag and set its text content to the project name
    const p = document.createElement("p");
    p.textContent = project.name;
  
    // Create a <time> tag, set its class, and text content to the project goalTime
    const time = document.createElement('time');
    time.setAttribute('class', 'time');
    time.textContent = project.goalTime;
  
    // Create a "Clock In" button
    const startButton = document.createElement("button");
    startButton.setAttribute('class', 'start main-btn');
    startButton.textContent = "Clock In";
  
    // Create a "Clock Out" button
    const stopButton = document.createElement("button");
    stopButton.setAttribute('class', 'stop main-btn');
    stopButton.textContent = "Clock Out";
  
    // Append the elements to the div
    div.appendChild(p);
    div.appendChild(time);
    div.appendChild(startButton);
    div.appendChild(stopButton);
  
    return div;
  }
  

checkIfInLocalStorage();