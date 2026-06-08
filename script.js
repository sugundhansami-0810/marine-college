/**
 * ST. ROSELINE'S SENIOR SECONDARY SCHOOL (SRSS) MARIAN
 * Front-End Interaction & UX Core Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAchievementCounters();
    initFormValidation();
});

/**
 * 1. RESPONSIVE NAVIGATION ENGINE
 * Manages mobile drawer toggle states, barrier clicks, and ARIA visibility bindings.
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');
    const body = document.body;

    if (!hamburger || !navbar) return;

    // Toggle menu state
    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navbar.classList.toggle('active');
        
        // Prevent background scrolling when menu is fully open on mobile
        body.style.overflow = !isExpanded ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile layout automatically upon executing a cross-link target jump
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/**
 * 2. SCROLL ADAPTATION & ACCESSIBLE TRANSITIONS
 * Adds deep drop-shadows on active tracking, updates nav links using IntersectionObserver,
 * and fixes target offsets to account for the sticky header height.
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    const headerHeight = header ? header.offsetHeight : 80;

    // A. Transparent-to-Solid Header Color Shift on Downscroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
            header.style.boxShadow = '0 4px 20px rgba(11, 37, 69, 0.15)';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.classList.remove('header-scrolled');
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // B. Smart Navigation Link Highlighting on Scroll
    const observerOptions = {
        root: null,
        rootMargin: `-${headerHeight}px 0px -40% 0px`,
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active-link');
                        link.style.color = 'var(--marian-gold)';
                    } else {
                        link.style.color = ''; // Inherits from root CSS system
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // C. Precise Dynamic Section Jump Offset Calculations
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 3. ACHIEVEMENT COUNT-UP ANIMATION MATRIX
 * Uses the IntersectionObserver API to safely trigger a smooth numeric tick animation 
 * precisely when the milestones container enters the viewport.
 */
function initAchievementCounters() {
    const statsSection = document.getElementById('achievements');
    const counters = document.querySelectorAll('.stat-item h2');
    if (!statsSection || counters.length === 0) return;

    let animated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const text = counter.innerText;
            const targetValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
            const explicitSuffix = text.replace(/[0-9]/g, ''); // Preserves '+' and '%' characters
            
            let startValue = 0;
            const totalDuration = 2000; // 2 seconds total animation time
            const stepTime = Math.max(Math.floor(totalDuration / targetValue), 15);
            
            const timer = setInterval(() => {
                startValue += Math.ceil(targetValue / 100); // Dynamic fractional step sizing
                if (startValue >= targetValue) {
                    counter.innerText = targetValue + explicitSuffix;
                    clearInterval(timer);
                } else {
                    counter.innerText = startValue + explicitSuffix;
                }
            }, stepTime);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true; // Prevent multiple execution triggers
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
}

/**
 * 4. SECURE INQUIRY INPUT CORRECTION VALVE
 * Standardizes sanitization vectors, filters scripts, and ensures proper field formats.
 */
function initFormValidation() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const messageInput = form.querySelector('textarea');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Simple validation checks
        if (!nameInput.value.trim() || !messageInput.value.trim()) {
            alert('Please ensure all required textual parameter inputs are correctly stated.');
            return;
        }

        // Clean values to prevent script injections
        const sanitizedData = {
            name: nameInput.value.replace(/<\/?[^>]+(>|$)/g, "").trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.replace(/[^0-9+ ]/g, ""),
            message: messageInput.value.replace(/<\/?[^>]+(>|$)/g, "").trim()
        };

        // Simulated asynchronous API payload dispatch tracking
        submitBtn.disabled = true;
        submitBtn.innerText = 'Transmitting Data...';

        setTimeout(() => {
            alert(`Thank you, ${sanitizedData.name}. Your secure registration profile has been recorded.`);
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = 'Submit Secure Inquiry';
        }, 1200);
    });
}