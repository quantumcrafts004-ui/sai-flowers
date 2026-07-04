/**
 * Sai Flowers - Main JavaScript
 * Handles navigation, animations, scroll effects, and contact form.
 */

(function() {
    'use strict';

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isActive);
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Header scroll effect
    var header = document.querySelector('header');
    if (header) {
        var ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Smooth scroll animation on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Only run observer if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            document.querySelectorAll('.service-card, .contact-item, .feature').forEach(function(el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe service cards
        document.querySelectorAll('.service-card').forEach(function(card) {
            observer.observe(card);
        });

        // Observe gallery items (if they exist)
        document.querySelectorAll('.gallery-item').forEach(function(item, index) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease ' + (index * 0.1) + 's';
            observer.observe(item);
        });

        // Observe contact items
        document.querySelectorAll('.contact-item').forEach(function(item, index) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
            observer.observe(item);
        });

        // Observe about section features
        document.querySelectorAll('.feature').forEach(function(item, index) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
            observer.observe(item);
        });
    });

    // Contact form submission
    var contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple validation
            var isValid = true;
            var inputs = contactForm.querySelectorAll('input, select, textarea');

            inputs.forEach(function(input) {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff0000';
                } else {
                    input.style.borderColor = '#eee';
                }
            });

            if (isValid) {
                var btn = contactForm.querySelector('button');
                if (btn) {
                    var originalText = btn.textContent;
                    btn.textContent = 'Message Sent! ✓';
                    btn.style.background = '#4CAF50';
                    btn.disabled = true;

                    contactForm.reset();

                    setTimeout(function() {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                }
            }
        });
    }

})();