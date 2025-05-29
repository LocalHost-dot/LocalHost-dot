// Dark mode functionality for Grace Community Church Website

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;
    
    // Function to apply theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
    
    // Function to get theme preference
    function getThemePreference() {
        const savedTheme = localStorage.getItem('church-theme');
        // Default to light mode if no preference is saved
        return savedTheme || 'light';
    }
    
    // Initialize theme - always default to light mode for first-time visitors
    const currentTheme = getThemePreference();
    applyTheme(currentTheme);
    
    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentlyDark = html.classList.contains('dark');
            const newTheme = currentlyDark ? 'light' : 'dark';
            
            // Apply new theme
            applyTheme(newTheme);
            
            // Save user preference
            localStorage.setItem('church-theme', newTheme);
            
            // Add smooth transition effect
            document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
            
            // Optional: Add a subtle animation to the toggle button
            darkModeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                darkModeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Update all dark mode toggles on the page (in case there are multiple)
    const allToggleButtons = document.querySelectorAll('#dark-mode-toggle');
    allToggleButtons.forEach(button => {
        if (button !== darkModeToggle) {
            button.addEventListener('click', function() {
                if (darkModeToggle) {
                    darkModeToggle.click();
                }
            });
        }
    });
});