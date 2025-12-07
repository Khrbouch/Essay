// login.js - Combined file that loads login form and handles login functionality

// Global variable to track login state
let isUserLoggedIn = false;
let currentUsername = '';

// Function to load and initialize the login form
function loadAndInitLogin() {
  // Check if login form already exists
  if (document.getElementById('login-form')) {
    initLogin();
    return;
  }

  // Load the login form from login.html
  fetch('login.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load login form');
      }
      return response.text();
    })
    .then(html => {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Try multiple ways to extract the login content
      let loginContent = '';
      
      // Method 1: Look for .login div
      const loginDiv = tempDiv.querySelector('.login');
      
      if (loginDiv) {
        loginContent = loginDiv.innerHTML;
      } 
      // Method 2: Look for form content inside body
      else {
        const body = tempDiv.querySelector('body');
        if (body) {
          loginContent = body.innerHTML;
        } else {
          // Method 3: Use the whole HTML
          loginContent = html;
        }
      }
      
      // Create the login container structure
      const loginContainer = document.createElement('div');
      loginContainer.className = 'login-container';
      loginContainer.id = 'login-form';
      loginContainer.style.display = 'none';
      
      const loginBox = document.createElement('div');
      loginBox.className = 'login-box';
      
      // Clean up the content - remove duplicate body tags if any
      let cleanContent = loginContent.replace(/<body[^>]*>|<\/body>/gi, '');
      
      loginBox.innerHTML = cleanContent;
      
      loginContainer.appendChild(loginBox);
      
      // Insert into the container or directly into body
      const container = document.getElementById('login-form-container');
      if (container) {
        container.appendChild(loginContainer);
      } else {
        // Fallback: append to body
        document.body.appendChild(loginContainer);
      }
      
      // Initialize login functionality
      setTimeout(() => initLogin(), 100);
    })
    .catch(error => {
      console.error('Error loading login form:', error);
      // Create a fallback login form with all required elements
      createFallbackLoginForm();
      initLogin();
    });
}

// Create fallback login form if fetch fails
function createFallbackLoginForm() {
  const loginContainer = document.createElement('div');
  loginContainer.className = 'login-container';
  loginContainer.id = 'login-form';
  loginContainer.style.display = 'none';
  
  const loginBox = document.createElement('div');
  loginBox.className = 'login-box';
  loginBox.innerHTML = `
    <h3>Login</h3>
    <div class="input-group">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
    </div>
    <div class="input-group">
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
    </div>
    <button id="login-button">Login</button>
    <button id="close-login">Close</button>
  `;
  
  loginContainer.appendChild(loginBox);
  
  const container = document.getElementById('login-form-container');
  if (container) {
    container.appendChild(loginContainer);
  } else {
    document.body.appendChild(loginContainer);
  }
}

// Update login button appearance
function updateLoginButtonAppearance() {
  const loginBtn = document.getElementById('login-btn');
  if (!loginBtn) return;
  
  if (isUserLoggedIn && currentUsername) {
    // Change to user icon when logged in
    loginBtn.innerHTML = '<img src="user.png" alt="User" class="acces">';
    loginBtn.title = `Logged in as ${currentUsername}`;
    loginBtn.setAttribute('data-logged-in', 'true');
  } else {
    // Change back to login icon
    loginBtn.innerHTML = '<img src="login.png" alt="Login" class="acces">';
    loginBtn.title = 'Login';
    loginBtn.removeAttribute('data-logged-in');
  }
}

// Check login status from localStorage
function checkLoginStatus() {
  const savedLogin = localStorage.getItem('studyFocusLogin');
  if (savedLogin) {
    try {
      const loginData = JSON.parse(savedLogin);
      if (loginData.isLoggedIn && loginData.username) {
        isUserLoggedIn = true;
        currentUsername = loginData.username;
        console.log('User is logged in as:', currentUsername);
        return true;
      }
    } catch (e) {
      console.error('Error parsing login data:', e);
      localStorage.removeItem('studyFocusLogin');
    }
  }
  return false;
}

// Save login status to localStorage
function saveLoginStatus(username) {
  isUserLoggedIn = true;
  currentUsername = username;
  
  const loginData = {
    isLoggedIn: true,
    username: username,
    loginTime: new Date().toISOString()
  };
  
  localStorage.setItem('studyFocusLogin', JSON.stringify(loginData));
  console.log('Login saved for user:', username);
}

// Clear login status
function clearLoginStatus() {
  isUserLoggedIn = false;
  currentUsername = '';
  localStorage.removeItem('studyFocusLogin');
  console.log('Login cleared');
}

// Initialize login functionality
function initLogin() {
  console.log('Attempting to initialize login...');
  
  // Check if user is already logged in
  checkLoginStatus();
  
  // DOM elements
  const loginBtn = document.getElementById('login-btn');
  
  if (!loginBtn) {
    console.error('Login button (#login-btn) not found in index.html!');
    return;
  }
  
  const loginForm = document.getElementById('login-form');
  const loginSubmitBtn = document.getElementById('login-button');
  const closeLoginBtn = document.getElementById('close-login');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  // Debug: Log which elements were found
  console.log('Login elements found:', {
    loginBtn: !!loginBtn,
    loginForm: !!loginForm,
    loginSubmitBtn: !!loginSubmitBtn,
    closeLoginBtn: !!closeLoginBtn,
    usernameInput: !!usernameInput,
    passwordInput: !!passwordInput
  });

  // Check if essential elements exist
  if (!loginForm) {
    console.error('Login form (#login-form) not found! The form may not have loaded.');
    return;
  }
  
  if (!loginSubmitBtn) {
    console.warn('Login submit button (#login-button) not found. Waiting 500ms...');
    setTimeout(initLogin, 500);
    return;
  }

  console.log('All login elements found, setting up event listeners...');
  
  // Update login button appearance based on current status
  updateLoginButtonAppearance();

  // Function to show login form
  function showLoginForm() {
    console.log('Showing login form');
    loginForm.style.display = 'flex';
    // Reset form
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    // Focus on username field if it exists
    if (usernameInput) {
      setTimeout(() => {
        usernameInput.focus();
      }, 100);
    }
  }

  // Function to hide login form
  function hideLoginForm() {
    console.log('Hiding login form');
    loginForm.style.display = 'none';
  }

  // Function to handle login
  function handleLogin() {
    console.log('Login attempt');
    if (!usernameInput || !passwordInput) {
      alert('Login form not properly loaded. Please refresh the page.');
      return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
    
    // Show loading state on button
    const originalText = loginSubmitBtn.textContent;
    loginSubmitBtn.textContent = 'Logging in...';
    loginSubmitBtn.disabled = true;
    
    // Simulate login process (replace with actual API call)
    setTimeout(() => {
      // Simple validation (you can replace this with actual authentication)
      if (username === 'admin' && password === 'password') {
        // Save login status
        saveLoginStatus(username);
        
        // Update UI
        updateLoginButtonAppearance();
        
        alert(`Login successful! Welcome ${username}`);
        hideLoginForm();
      } else {
        alert('Invalid username or password');
        // Shake animation for wrong credentials
        if (loginForm.classList) {
          loginForm.classList.add('shake');
          setTimeout(() => {
            loginForm.classList.remove('shake');
          }, 500);
        }
      }
      
      // Reset button
      loginSubmitBtn.textContent = originalText;
      loginSubmitBtn.disabled = false;
    }, 500); // Simulate network delay
  }

  // Logout function
  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      clearLoginStatus();
      updateLoginButtonAppearance();
      alert('Logged out successfully');
    }
  }

  // Add event listeners for login functionality
  loginBtn.addEventListener('click', function(e) {
    console.log('Login button clicked, current state:', isUserLoggedIn);
    
    if (isUserLoggedIn) {
      // If logged in, show logout option
      handleLogout();
    } else {
      // If not logged in, show login form
      showLoginForm();
    }
  });

  // Add close button listener if it exists
  if (closeLoginBtn) {
    console.log('Adding close button listener');
    closeLoginBtn.addEventListener('click', hideLoginForm);
  } else {
    console.warn('Close button (#close-login) not found in login form');
  }
  
  console.log('Adding login button listener');
  loginSubmitBtn.addEventListener('click', handleLogin);

  // Close login form when clicking outside
  loginForm.addEventListener('click', (e) => {
    if (e.target === loginForm) {
      hideLoginForm();
    }
  });

  // Also close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginForm.style.display === 'flex') {
      hideLoginForm();
    }
    
    // Submit on Enter key when in login form
    if (e.key === 'Enter' && loginForm.style.display === 'flex') {
      if (usernameInput && document.activeElement === usernameInput) {
        handleLogin();
      }
      if (passwordInput && document.activeElement === passwordInput) {
        handleLogin();
      }
    }
  });
  
  console.log('Login functionality initialized successfully');
}

// Start loading and initializing login when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing login...');
  // Start loading the login form
  loadAndInitLogin();
});

// Make functions available globally if needed
window.loadAndInitLogin = loadAndInitLogin;
window.initLogin = initLogin;

// Fallback: if DOMContentLoaded already fired, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    if (!document.getElementById('login-form')) {
      loadAndInitLogin();
    }
  }, 100);
}

// Also, check if we're already on the page and need to initialize
setTimeout(() => {
  if (!document.getElementById('login-form') && document.getElementById('login-btn')) {
    console.log('Late initialization...');
    loadAndInitLogin();
  }
}, 1000);