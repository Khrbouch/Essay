// settings.js
// Load modal from external file
fetch('settings-modal.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('modal-container').innerHTML = html;
    // Now you can attach event listeners to the modal buttons
    // Call initModalElements from index.js (which should be globally available)
    if (typeof initModalElements === 'function') {
      initModalElements();
    }
  })
  .catch(err => console.error('Failed to load modal:', err));