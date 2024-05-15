// Wait for the DOM content to be fully loaded
$(document).ready(function() {
    // Get the theme toggle button and body element
    const $themeToggleButton = $('#theme-toggle');
    const $body = $('body');

    // Check for saved theme in localStorage and apply it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        $body.addClass(savedTheme);
        if (savedTheme === 'light-mode') {
            $themeToggleButton.prop('checked', true);
        }
    }

    // Add event listener for theme toggle button
    $themeToggleButton.on('change', function() {
        if ($themeToggleButton.is(':checked')) {
            // Switch to light mode
            $body.addClass('light-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            // Switch to dark mode
            $body.removeClass('light-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    });
});
