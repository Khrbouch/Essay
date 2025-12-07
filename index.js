// Timer variables
let timer;
let isRunning = false;
let currentTime = 25 * 60; // 1 minute in seconds (default for testing)
let currentMode = 'pomodoro';
let sessionCount = 1;

// Timer presets (in seconds) - with default values
let modes = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

// DOM elements
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const sessionCounter = document.getElementById('session-counter');
const settingsBtn = document.getElementById('Para');
const btnContainer = document.querySelector('.Btn');
const modeElements = {
  pomodoro: document.getElementById('pomodoro-mode'),
  shortBreak: document.getElementById('short-break-mode'),
  longBreak: document.getElementById('long-break-mode')
};

// Modal elements
const settingsModal = document.getElementById('settings-modal');
const pomodoroTimeInput = document.getElementById('pomodoro-time');
const shortBreakTimeInput = document.getElementById('short-break-time');
const longBreakTimeInput = document.getElementById('long-break-time');
const saveSettingsBtn = document.getElementById('save-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');

// Format time as MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer display
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(currentTime);
}

// Show only start button, hide pause and reset
function showStartOnly() {
  btnContainer.classList.remove('started');
  startBtn.style.display = 'block';
  pauseBtn.style.display = 'none';
  resetBtn.style.display = 'none';
}

// Show pause and reset buttons, hide start
function showPauseResetOnly() {
  btnContainer.classList.add('started');
  startBtn.style.display = 'none';
  pauseBtn.style.display = 'block';
  resetBtn.style.display = 'block';
}

// Start timer
function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  showPauseResetOnly();
  
  timer = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      showStartOnly();
      
      // Play notification sound
      playNotification();
      
      // Auto-advance to next mode
      autoAdvanceMode();
    }
  }, 1000);
}

// Pause timer
function pauseTimer() {
  if (!isRunning) return;
  
  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Reset timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  currentTime = modes[currentMode];
  updateTimerDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  showStartOnly();
}

// Set timer mode
function setMode(mode) {
  if (isRunning) {
    if (!confirm("Timer is running. Switch mode and reset?")) {
      return;
    }
    pauseTimer();
    showStartOnly();
  }
  
  currentMode = mode;
  currentTime = modes[mode];
  updateTimerDisplay();
  
  // Update active mode indicator
  Object.keys(modeElements).forEach(key => {
    modeElements[key].classList.remove('active');
  });
  modeElements[mode].classList.add('active');
}

// Auto-advance to next mode
function autoAdvanceMode() {
  if (currentMode === 'pomodoro') {
    sessionCount++;
    sessionCounter.textContent = `#${sessionCount} Session`;
    
    // Every 4 sessions, take a long break
    if (sessionCount % 4 === 0) {
      setMode('longBreak');
    } else {
      setMode('shortBreak');
    }
  } else {
    setMode('pomodoro');
  }
}

// Play notification sound
function playNotification() {
  // Create a simple beep sound
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log("Audio context not supported");
  }
}

// Open settings modal
function openSettingsModal() {
  // Load current values
  pomodoroTimeInput.value = modes.pomodoro / 60;
  shortBreakTimeInput.value = modes.shortBreak / 60;
  longBreakTimeInput.value = modes.longBreak / 60;
  
  settingsModal.style.display = 'flex';
}

// Close settings modal
function closeSettingsModal() {
  settingsModal.style.display = 'none';
}

// Save settings
function saveSettings() {
  // Convert minutes to seconds
  modes = {
    pomodoro: parseInt(pomodoroTimeInput.value) * 60,
    shortBreak: parseInt(shortBreakTimeInput.value) * 60,
    longBreak: parseInt(longBreakTimeInput.value) * 60
  };
  
  // Update current time if we're in that mode
  currentTime = modes[currentMode];
  updateTimerDisplay();
  
  closeSettingsModal();
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeElements.pomodoro.addEventListener('click', () => setMode('pomodoro'));
modeElements.shortBreak.addEventListener('click', () => setMode('shortBreak'));
modeElements.longBreak.addEventListener('click', () => setMode('longBreak'));

// Settings modal events
settingsBtn.addEventListener('click', openSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
cancelSettingsBtn.addEventListener('click', closeSettingsModal);

// Close modal when clicking outside
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    closeSettingsModal();
  }
});

// Initialize timer
updateTimerDisplay();
showStartOnly(); // Initially show only the start button