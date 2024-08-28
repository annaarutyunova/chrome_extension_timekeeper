// Store timers for each project
const projectTimers = {};
let intervalIds = {}; // Object to hold interval IDs for each project

chrome.runtime.onMessage.addListener((message) => {
    console.log("Received message from content script:", message);

    const projectId = message.projectId; // Get the project ID from the message
    if (message.action === 'start') {
        console.log("Starting stopwatch for project:", projectId);
        
        // Clear any existing interval for this project
        if (intervalIds[projectId]) {
            clearInterval(intervalIds[projectId]);
        }
        
        // Load timer from local storage if not already in memory
        if (!projectTimers[projectId]) {
            chrome.storage.local.get({ projects: [] }, function(result) {
                const projects = result.projects;
                const project = projects.find(p => p.id === projectId);
                if (project) {
                    projectTimers[projectId] = {
                        seconds: parseInt(project.seconds, 10),
                        minutes: parseInt(project.minutes, 10),
                        hours: parseInt(project.hours, 10)
                    };
                } else {
                    // If the project doesn't exist, initialize to zero
                    projectTimers[projectId] = { seconds: 0, minutes: 0, hours: 0 };
                }
                
                // Start the interval after loading the correct time
                intervalIds[projectId] = setInterval(() => updateTime(projectId), 1000);
            });
        } else {
            // Start the interval if timer is already in memory
            intervalIds[projectId] = setInterval(() => updateTime(projectId), 1000);
        }
        
    } else if (message.action === 'stop') {
        console.log("Stopping stopwatch for project:", projectId);
        clearInterval(intervalIds[projectId]);
        if (message.projectId !== 'deleted') {
            sendTimeUpdate(projectId);
        }
        
    } else if (message.action === 'reset') {
        console.log("Resetting stopwatch for project:", projectId);
        clearInterval(intervalIds[projectId]);
        
        // Reset timer for the project
        projectTimers[projectId] = { seconds: 0, minutes: 0, hours: 0 };
        sendTimeUpdate(projectId);
    } else if (message.action === 'delete') {
        console.log("Deleting stopwatch for project:", projectId);
        clearInterval(intervalIds[projectId]);
    }
});

function updateTime(projectId) {
    console.log("Updating time for project:", projectId);

    let timer = projectTimers[projectId];
    if (timer) {
        timer.seconds++;
        if (timer.seconds >= 60) {
            timer.seconds = 0;
            timer.minutes++;
            if (timer.minutes >= 60) {
                timer.minutes = 0;
                timer.hours++;
            }
        }
        chrome.storage.local.get({ projects: [] }, function(result) {
            let projects = result.projects;
        
            // Assuming `projectId` is the ID of the project you want to update
            const projectIndex = projects.findIndex(project => project.id === projectId);
        
            if (projectIndex !== -1) {
                // Update the properties
                projects[projectIndex].seconds = timer.seconds.toString().padStart(2, '0');
                projects[projectIndex].minutes = timer.minutes.toString().padStart(2, '0');
                projects[projectIndex].hours = timer.hours.toString().padStart(2, '0');

                // Save the updated projects array back to storage
                chrome.storage.local.set({ projects }, () => {
                    console.log("Time updated in local storage.");
                });
            } else {
                console.error("Project not found.");
            }
        });
        
        sendTimeUpdate(projectId);
    }  
}

function sendTimeUpdate(projectId) {
    console.log("Sending time update for project:", projectId);

    const timer = projectTimers[projectId] || { seconds: '00', minutes: '00', hours: '00' };
        chrome.runtime.sendMessage({
            action: 'updateTime',
            projectId: projectId,
            seconds: timer.seconds.toString().padStart(2, '0'),
            minutes: timer.minutes.toString().padStart(2, '0'),
            hours: timer.hours.toString().padStart(2, '0')
        });
}
