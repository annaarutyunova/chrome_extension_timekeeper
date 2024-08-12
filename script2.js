// This code is for the background script
document.addEventListener('DOMContentLoaded', function () {
    // DOMContentLoaded event fired, indicating that the DOM is fully loaded and ready
    console.log("DOM content loaded");

    // When the page is loaded, fetch all of the existing projects.
   // Retrieve projects from local storage

    chrome.storage.local.get('projects', (result) => {
        const projects = result.projects || [];
        projects.reverse();
        console.log(projects, "Projects")
    })

    // Send a message to the service worker to start the stopwatch when the extension button is clicked
    document.getElementById('button-start').addEventListener('click', () => {
        console.log("Sending start message to service worker");
        chrome.runtime.sendMessage({ action: 'start' });
        
    });

    // Send a message to the service worker to stop the stopwatch when the stop button is clicked
    document.getElementById('button-stop').addEventListener('click', () => {
        console.log("Sending stop message to service worker");
        chrome.runtime.sendMessage({ action: 'stop' });
    });

    // Send a message to the service worker to reset the stopwatch when the reset button is clicked
    document.getElementById('button-reset').addEventListener('click', () => {
        console.log("Sending reset message to service worker");
        chrome.runtime.sendMessage({ action: 'reset' });
    });


    // Listen for messages from the service worker to update the timer display
    chrome.runtime.onMessage.addListener((message) => {
        console.log("Received message from service worker:", message);
        if (message.action === 'updateTime') {
            document.getElementById('seconds').innerText = message.seconds;
            document.getElementById('minutes').innerText = message.minutes;
            document.getElementById('hours').innerText = message.hours;
        }
    });

});




