document.addEventListener('DOMContentLoaded', () => {
    /**
     * Sets up the theme toggler functionality.
     */
    function setupThemeToggler() {
        const themeToggler = document.getElementById('theme-toggler');
        if (!themeToggler) return;

        const body = document.body;
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.setAttribute('data-theme', savedTheme);
        }

        themeToggler.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'light') {
                body.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    /**
     * Sets up single-page-like navigation for anchor links on the main page.
     */
    function setupSpaNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        const sections = document.querySelectorAll('main > section');

        function showSection(targetId) {
            sections.forEach(section => {
                if (section.id === 'overview' || section.id === 'specific') {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === targetId);
            });
        }

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSection(targetId);
                });
            }
        });

        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            if (!window.location.hash) {
                showSection('#specific');
            }
        }
    }

    /**
     * Sets up the form submission for the specific forecast.
     */
    function setupForecastForm() {
        const forecastForm = document.querySelector('#specific form');
        const forecastResultSection = document.getElementById('forecast-result');
        if (!forecastForm || !forecastResultSection) return;

        forecastForm.addEventListener('submit', (e) => {
                e.preventDefault();
            forecastResultSection.classList.remove('hidden');
            forecastResultSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Initialize all functionalities
    setupThemeToggler();
    setupSpaNavigation();
    setupForecastForm();
});
