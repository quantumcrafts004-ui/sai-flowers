/**
 * Sai Flowers - SPA Router
 * Handles clean URLs using the History API
 */

(function() {
    'use strict';

    const ROUTES = {
        '/': { title: 'Sai Flower - Flower Shop & Event Decorations', section: 'home' },
        '/wedding': { title: 'Wedding Decoration - Sai Flower', section: 'event-wedding' },
        '/welcome': { title: 'Welcome Decoration - Sai Flower', section: 'event-welcome' },
        '/puja': { title: 'Puja & Religious Decoration - Sai Flower', section: 'event-puja' },
        '/car': { title: 'Car Decoration - Sai Flower', section: 'event-car' },
        '/birthday': { title: 'Birthday & Party Decoration - Sai Flower', section: 'event-birthday' },
        '/allevent': { title: 'All Event Decorations - Sai Flower', section: 'event-allevent' }
    };

    let currentSection = 'home';

    function getRoute(path) {
        // Normalize path: remove trailing slash, default to '/'
        let normalized = path.replace(/\/+$/, '') || '/';
        // Remove base path if deployed to subdirectory
        const basePath = getBasePath();
        if (basePath && normalized.startsWith(basePath)) {
            normalized = normalized.slice(basePath.length) || '/';
        }
        return ROUTES[normalized] || null;
    }

    function getBasePath() {
        // For GitHub Pages deployed to /sai-flowers/
        const pathParts = window.location.pathname.split('/');
        // Check if we're in a subdirectory
        if (pathParts.length > 2 && pathParts[1] === 'sai-flowers') {
            return '/sai-flowers';
        }
        return '';
    }

    function navigateTo(url, pushState = true) {
        const basePath = getBasePath();
        let path = url;

        // Handle relative URLs
        if (!url.startsWith('/') && !url.startsWith('http')) {
            path = '/' + url;
        }

        // Extract path from full URL
        try {
            const parsed = new URL(url, window.location.origin);
            path = parsed.pathname;
        } catch (e) {
            // It's a relative or absolute path
        }

        // Remove base path for route matching
        let routePath = path;
        if (basePath && routePath.startsWith(basePath)) {
            routePath = routePath.slice(basePath.length) || '/';
        }

        const route = ROUTES[routePath];
        if (!route) {
            // Unknown route - go home
            routePath = '/';
        }

        if (pushState) {
            const fullPath = basePath + routePath;
            window.history.pushState({ path: routePath }, '', fullPath);
        }

        renderRoute(routePath);
    }

    function renderRoute(path) {
        const route = ROUTES[path] || ROUTES['/'];
        if (!route) return;

        // Hide all sections
        document.querySelectorAll('.page-section').forEach(function(section) {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(route.section);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update document title
        document.title = route.title;

        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(function(link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === path || (path === '/' && href === '/')) {
                link.classList.add('active');
            }
        });

        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        currentSection = route.section;

        // Re-trigger scroll animations for new content
        if (typeof triggerScrollAnimations === 'function') {
            setTimeout(triggerScrollAnimations, 100);
        }
    }

    // Handle browser back/forward
    window.addEventListener('popstate', function(e) {
        const path = e.state ? e.state.path : '/';
        renderRoute(path);
    });

    // Intercept all navigation clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Only handle internal links
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        // Handle hash links
        if (href.startsWith('#')) {
            e.preventDefault();
            if (currentSection === 'home') {
                // Already on home page, just scroll
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Navigate to home page first, then scroll after render
                navigateTo('/');
                setTimeout(function() {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
            return;
        }

        // Handle hash-absolute links like /#contact
        if (href.includes('#') && href.startsWith('/')) {
            const parts = href.split('#');
            const path = parts[0];
            const hash = parts[1];
            if (path === '/' || path === '') {
                e.preventDefault();
                if (currentSection === 'home') {
                    const target = document.getElementById(hash);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    navigateTo('/');
                    setTimeout(function() {
                        const target = document.getElementById(hash);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
                return;
            }
        }

        // Handle internal navigation
        e.preventDefault();
        navigateTo(href);
    });

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Determine initial route from current URL
        const path = window.location.pathname;
        const basePath = getBasePath();
        let routePath = path;
        if (basePath && routePath.startsWith(basePath)) {
            routePath = routePath.slice(basePath.length) || '/';
        }

        // Check if there's a hash (for backward compatibility)
        const hash = window.location.hash;
        if (hash && hash.startsWith('#/')) {
            routePath = hash.slice(1); // Remove #
        } else if (hash && hash.startsWith('#')) {
            // Old-style hash link - keep on home page with scroll
            routePath = '/';
        }

        const route = ROUTES[routePath];
        if (route) {
            window.history.replaceState({ path: routePath }, '', path);
            renderRoute(routePath);
        } else {
            // Unknown route - go home
            window.history.replaceState({ path: '/' }, '', basePath + '/');
            renderRoute('/');
        }
    });

    // Expose navigateTo globally
    window.navigateTo = navigateTo;

})();