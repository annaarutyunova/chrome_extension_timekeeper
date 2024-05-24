console.log("Service worker loaded");

let seconds = 0;
let minutes = 0;
let hours = 0;
let intervalId;

chrome.runtime.onInstalled.addListener(() => {
    console.log('Service worker installed');
});

chrome.runtime.onMessage.addListener((message) => {
    console.log("Received message from content script:", message);
    if (message.action === 'start') {
        console.log("Starting stopwatch");
        clearInterval(intervalId);
        intervalId = setInterval(updateTime, 1000);
    } else if (message.action === 'stop') {
        console.log("Stopping stopwatch");
        updateTime();
        clearInterval(intervalId);
    } else if (message.action === 'reset') {
        console.log("Resetting stopwatch");
        clearInterval(intervalId);
        seconds = 0;
        minutes = 0;
        hours = 0;
        sendTimeUpdate();
    }
});

function updateTime() {
    console.log("Updating time");
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    sendTimeUpdate();
}

function sendTimeUpdate() {
    console.log("Sending time update");
    chrome.runtime.sendMessage({
        action: 'updateTime',
        seconds: seconds.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0')
    });
}
