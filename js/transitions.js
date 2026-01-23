/**
 * Smooth Page Transitions
 * Handles smooth transitions between pages
 */

(function() {
    // Don't run transitions on the home page splash screen
    const hasSplash = document.getElementById('splash');

    // Skip initial animation if splash screen exists (it handles its own timing)
    if (hasSplash) {
        document.body.style.opacity = '1';
        document.body.style.animation = 'none';
    }

    // Handle all internal link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');

        // Check if it's a valid internal link
        if (!link) return;
        if (link.target === '_blank') return;
        if (link.hostname !== window.location.hostname) return;
        if (link.href.includes('#') && link.pathname === window.location.pathname) return;
        if (link.href === window.location.href) return;

        // Prevent default navigation
        e.preventDefault();

        // Add leaving class for exit animation
        document.body.classList.add('page-leaving');

        // Navigate after animation completes
        setTimeout(function() {
            window.location.href = link.href;
        }, 300);
    });

    // Handle browser back/forward buttons
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            // Page was restored from cache (back/forward)
            document.body.classList.remove('page-leaving');
            document.body.style.opacity = '1';
        }
    });
})();
