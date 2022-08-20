// Setting initial state to track active run of current pomodoro study session
global.breakStatus = false;
global.pomoStatus = false;
global.noSession = false;

global.lastSession;
global.timer;
global.timerStart;
var elapsedTime;

// Get current status of the study session.
function getStatus(msg, session, telegram) {
    if (noSession) {
      telegram.sendMessage(msg.chat.id, "No active pomodoro sessions at the moment.");
    }
    else if (pomoStatus) {
        // Calculates elapsed time from start of pomodoro session, and translates the time to a string (rounded by hundredth)
      elapsedTime = Number((25 - ((Date.now() - timerStart) / 1000) / 60).toFixed(1));
      telegram.sendMessage(msg.chat.id, `Study session "${session}" is currently active. You have ${elapsedTime} minute(s) left!`);
    }
    else if (breakStatus) {
      elapsedTime = Number((5 - ((Date.now() - timerStart) / 1000) / 60).toFixed(1));
      telegram.sendMessage(msg.chat.id, `You are currently on break from "${session}"! You have ${elapsedTime} minute(s) left before work.`);
    }
  }


// Starts the timer for 5 minute break time, sets up a new timer to record the elapsed break time
function pomoSession(msg, telegram) {
    telegram.sendMessage(msg.chat.id, "Your 25 minutes are up! Take a 5 minute break.");
    pomoStatus = false;
    breakStatus = true;
    timer = setTimeout(breakSession, 5 * 60 * 1000, msg, telegram); // set break to 5 minutes = 300,000 milliseconds
    timer;
    timerStart = Date.now();
}


// Starts the timer for 25 minute pomodoro study session
function breakSession(msg, telegram) {
    noSession = true;
    breakStatus = false;
    timerStart = Date.now();
    telegram.sendMessage(msg.chat.id, "5 minutes done. Back to work!");
  }

// Clears all active pomodoro study sessions
function clearPomoSession(msg, telegram) {
    telegram.sendMessage(msg.chat.id, "Got it, all sessions have been cleared.");
    clearTimeout(timer);
  }

  module.exports = {
    clear: clearPomoSession,
    pomoSession: pomoSession,
    break: breakSession,
    status: getStatus,
  };
