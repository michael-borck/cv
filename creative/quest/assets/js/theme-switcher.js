// Theme Switcher for CV Quest
(function() {
    const THEME_KEY = 'cv-quest-theme';
    const THEMES = {
        retro: 'assets/css/styles.css',
        professional: 'assets/css/styles-professional.css'
    };
    
    // Get saved theme or default to retro
    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY) || 'retro';
        } catch (e) {
            console.warn('localStorage not available, defaulting to retro theme');
            return 'retro';
        }
    }
    
    // Save theme preference
    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            console.warn('Could not save theme preference');
        }
    }
    
    // Apply theme
    function applyTheme(theme) {
        const stylesheet = document.getElementById('theme-stylesheet');
        if (stylesheet) {
            // Ensure valid theme
            const validTheme = THEMES[theme] ? theme : 'retro';
            stylesheet.href = THEMES[validTheme];
            
            // Update toggle button appearance
            const toggleBtn = document.getElementById('themeToggle');
            if (toggleBtn) {
                toggleBtn.textContent = validTheme === 'retro' ? '💼' : '🕹️';
                toggleBtn.title = validTheme === 'retro' ? 'Switch to Professional' : 'Switch to Retro';
            }
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === 'retro' ? 'professional' : 'retro';
        saveTheme(newTheme);
        applyTheme(newTheme);
    }
    
    // Reset to default theme
    function resetTheme() {
        saveTheme('retro');
        applyTheme('retro');
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Apply saved theme
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Add toggle button listener
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
        }
    });
    
    // Export for use in other scripts if needed
    window.themeManager = {
        toggle: toggleTheme,
        apply: applyTheme,
        reset: resetTheme,
        getCurrentTheme: getSavedTheme
    };
})();