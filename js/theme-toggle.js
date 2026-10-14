(function () {
    var html = document.documentElement;
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

    function applyTheme(t) {
        html.setAttribute('data-theme', t);
        try { localStorage.setItem('theme', t); } catch (e) { /* private mode */ }
    }

    function pulse() {
        toggle.classList.remove('is-pulsing');
        void toggle.offsetWidth; // restart the animation
        toggle.classList.add('is-pulsing');
    }

    toggle.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

        // Bloom the new theme out of the button the user just clicked
        var rect = toggle.getBoundingClientRect();
        html.style.setProperty(
            '--theme-origin',
            (rect.left + rect.width / 2) + 'px ' + (rect.top + rect.height / 2) + 'px'
        );

        pulse();

        if (document.startViewTransition && !calm.matches) {
            document.startViewTransition(function () { applyTheme(next); })
                .finished.finally(function () { toggle.classList.remove('is-pulsing'); })
                .catch(function () { /* skipped by rapid toggling */ });
        } else {
            applyTheme(next);
            setTimeout(function () { toggle.classList.remove('is-pulsing'); }, 600);
        }
    });

    // Keep other open tabs in sync
    window.addEventListener('storage', function (e) {
        if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
            html.setAttribute('data-theme', e.newValue);
        }
    });
})();
