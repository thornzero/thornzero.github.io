---
---
// Auto-reload for GitHub Pages
(function() {
  'use strict';
  
  // Only run in production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }
  
  const CHECK_INTERVAL = 30000; // 30 seconds
  const BUILD_TIMESTAMP_URL = '/build-timestamp.txt';
  
  let lastBuildTime = null;
  let checkInterval = null;
  
  function getCurrentBuildTime() {
    return fetch(BUILD_TIMESTAMP_URL + '?v=' + Date.now())
      .then(response => response.text())
      .catch(() => null);
  }
  
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      ">
        🔄 Site updated! Reloading in 2 seconds...
      </div>
    `;
    document.body.appendChild(notification);
  }
  
  function checkForUpdates() {
    getCurrentBuildTime().then(currentTime => {
      if (currentTime && lastBuildTime && currentTime !== lastBuildTime) {
        console.log('Site updated! Reloading...');
        showUpdateNotification();
        setTimeout(() => window.location.reload(), 2000);
      } else if (currentTime && !lastBuildTime) {
        lastBuildTime = currentTime;
        console.log('Auto-reload initialized');
      }
    });
  }
  
  function initAutoReload() {
    getCurrentBuildTime().then(time => {
      if (time) {
        lastBuildTime = time;
        checkInterval = setInterval(checkForUpdates, CHECK_INTERVAL);
        console.log('Auto-reload active - checking every', CHECK_INTERVAL / 1000, 'seconds');
      }
    });
  }
  
  // Start when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoReload);
  } else {
    initAutoReload();
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
  });
})(); 