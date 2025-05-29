// Light mode only functionality for Grace Community Church Website
// Removes all dark mode dependencies and ensures consistent light theme

document.addEventListener('DOMContentLoaded', function() {
    const html = document.documentElement;
    
    // Force light mode and remove any dark mode classes
    html.classList.remove('dark');
    
    // Clear any saved dark mode preferences
    localStorage.removeItem('church-theme');
    
    // Ensure body has proper light mode styling
    document.body.classList.remove('dark');
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    
    // Remove any dark mode toggles that might exist
    const darkModeToggles = document.querySelectorAll('#dark-mode-toggle');
    darkModeToggles.forEach(toggle => {
        if (toggle) {
            toggle.style.display = 'none';
        }
    });
    
    // Apply smooth transitions for enhanced user experience
    document.body.style.transition = 'all 0.3s ease';
    
    console.log('Light mode initialized successfully');
});