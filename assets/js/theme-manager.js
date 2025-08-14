// Theme Manager - Synced with michaelborck.dev
(function() {
    'use strict';
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme on load
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            // Set initial button state
            updateThemeButton(currentTheme);
            
            // Add click handler
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Add header class to body for spacing
        document.body.classList.add('with-header');
    });
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update DOM
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save preference
        localStorage.setItem('theme', newTheme);
        
        // Update button
        updateThemeButton(newTheme);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }
    
    function updateThemeButton(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = theme === 'dark' ? '☀️' : '🌙';
            const text = theme === 'dark' ? 'Light' : 'Dark';
            themeToggle.innerHTML = `${icon} ${text}`;
        }
    }
    
    // Sync with other tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'theme' && e.newValue) {
            document.documentElement.setAttribute('data-theme', e.newValue);
            updateThemeButton(e.newValue);
        }
    });
})();