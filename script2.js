// Display form when "+" button is clicked.
function displayAddProjectForm () {
     form = document.querySelector(".formContainer")
     form.style.display = "block"
}

const formOpener = document.getElementById("formOpener")
formOpener.addEventListener("click", displayAddProjectForm)

// Add project to local storage when "Add Project" is clicked
function addNewProjectToLocalStorage () {

}

window.onload = function () {
  
    let seconds = 0o0; 
    let minutes = 0o0; 
    let hours = 0o0;
    let appendSeconds = document.getElementById("seconds")
    let appendMinutes = document.getElementById("minutes")
    let appendHours = document.getElementById("hours")
    let buttonStart = document.getElementById('button-start');
    let buttonStop = document.getElementById('button-stop');
    let buttonReset = document.getElementById('button-reset');
    let Interval ;
  
    buttonStart.onclick = function() {
      
      clearInterval(Interval);
       Interval = setInterval(startTimer, 1000);
    }
    
      buttonStop.onclick = function() {
         clearInterval(Interval);
    }
    
  
    buttonReset.onclick = function() {
        clearInterval(Interval);
        hours = "00";
        minutes = "00";
        seconds = "00";
        appendHours.innerHTML = hours;
        appendMinutes.innerHTML = minutes;
        appendSeconds.innerHTML = seconds;
    }
    
    
    function startTimer () {
      seconds++; 
      
      if(seconds <= 9){
        appendSeconds.innerHTML = "0" + seconds;
      }
      
      if (seconds > 9){
        appendSeconds.innerHTML = seconds; 
      } 
      
      if (seconds > 59) {
        console.log("seconds");
        minutes++;
        appendMinutes.innerHTML = "0" + 0;
        seconds = 0;
        appendSeconds.innerHTML = "0" + 0;
      }
      
      if(seconds <= 9){
        appendMinutes.innerHTML = "0" + minutes;
      }

      if (minutes > 9){
        appendMinutes.innerHTML = minutes;
      }

      if (minutes > 59) {
        console.log("minutes");
        hours++;
        appendHours.innerHTML = "0" + hours;
        minutes = 0;
        seconds = 0;
        appendMinutes.innerHTML = "0" + 0;
        appendSeconds.innerHTML = "0" + 0

      }
    
    }
    
  
  }