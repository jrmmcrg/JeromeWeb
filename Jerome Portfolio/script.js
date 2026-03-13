/**
 * Portfolio - Modern JavaScript
 * Enhanced interactivity and user experience
 */

// =====================================================
// UTILITIES & HELPERS
// =====================================================

const DOM = {
    navbar: document.querySelector('.navbar'),
    navMenu: document.getElementById('navMenu'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinks: document.querySelectorAll('.nav-link'),
    galleries: document.querySelectorAll('.project-gallery'),
    contactForm: document.getElementById('contactForm'),
    projectModal: document.getElementById('projectModal'),
    modalClose: document.getElementById('modalClose'),
    projectButtons: document.querySelectorAll('.project-btn'),
    formMessage: document.getElementById('formMessage')
};

/**
 * Utility to add/remove classes
 */
const toggleClass = (element, className, force) => {
    if (force !== undefined) {
        element.classList.toggle(className, force);
    } else {
        element.classList.toggle(className);
    }
};

/**
 * Utility to debounce functions
 */
const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Utility to throttle functions
 */
const throttle = (func, delay = 300) => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func(...args);
            lastCall = now;
        }
    };
};

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================

const initMobileMenu = () => {
    if (!DOM.mobileMenuBtn) return;

    DOM.mobileMenuBtn.addEventListener('click', () => {
        toggleClass(DOM.mobileMenuBtn, 'active');
        toggleClass(DOM.navMenu, 'active');
    });

    // Close menu when a link is clicked
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            DOM.mobileMenuBtn.classList.remove('active');
            DOM.navMenu.classList.remove('active');
        });
    });
};

// =====================================================
// NAVBAR SCROLL BEHAVIOR
// =====================================================

const initNavbarScroll = () => {
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            DOM.navbar?.classList.add('scrolled');
        } else {
            DOM.navbar?.classList.remove('scrolled');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);
};

// =====================================================
// SMOOTH SCROLL & ACTIVE NAV LINK
// =====================================================

const initSmoothScroll = () => {
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
};

/**
 * Update active nav link based on scroll position
 */
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section, header');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

// =====================================================
// IMAGE GALLERY
// =====================================================

const initGallery = () => {
    DOM.galleries.forEach(gallery => {
        const container = gallery.querySelector('.gallery-container');
        const images = container.querySelectorAll('.gallery-image');
        const counter = gallery.querySelector('.gallery-counter');
        const prevBtn = gallery.querySelector('.gallery-prev');
        const nextBtn = gallery.querySelector('.gallery-next');

        if (images.length === 0) return;

        let currentIndex = 0;
        const totalImages = images.length;

        // Show only first image initially
        images.forEach((img, index) => {
            img.style.display = index === 0 ? 'block' : 'none';
        });

        const updateGallery = () => {
            images.forEach((img, index) => {
                img.style.display = index === currentIndex ? 'block' : 'none';
            });
            
            counter.textContent = `${currentIndex + 1}/${totalImages}`;
            counter.setAttribute('aria-live', 'polite');
        };

        const goToPrevious = () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateGallery();
        };

        const goToNext = () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateGallery();
        };

        prevBtn?.addEventListener('click', goToPrevious);
        nextBtn?.addEventListener('click', goToNext);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.activeElement === container || container.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft') goToPrevious();
                if (e.key === 'ArrowRight') goToNext();
            }
        });

        // Initialize
        updateGallery();
    });
};

// =====================================================
// CONTACT FORM HANDLING
// =====================================================

const initContactForm = () => {
    if (!DOM.contactForm) return;

    const validateForm = () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return false;
        }

        return { name, email, message };
    };

    const showFormMessage = (message, type) => {
        if (!DOM.formMessage) return;
        
        DOM.formMessage.textContent = message;
        DOM.formMessage.className = `form-message ${type}`;
        DOM.formMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                DOM.formMessage.style.display = 'none';
            }, 5000);
        }
    };

    DOM.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = validateForm();
        if (!formData) return;

        try {
            // In a real scenario, you would send this to a backend service
            // For now, we'll just simulate success
            console.log('Form submitted:', formData);

            // Simulate successful submission
            await new Promise(resolve => setTimeout(resolve, 500));

            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            DOM.contactForm.reset();
        } catch (error) {
            showFormMessage('An error occurred. Please try again.', 'error');
            console.error('Form submission error:', error);
        }
    });
};

// =====================================================
// PROJECT MODAL
// =====================================================

const initProjectModal = () => {
    if (!DOM.projectModal) return;

    const projectDetails = {
        'Patient Management System': {
            title: 'Patient Management System',
            description: 'MedicAI is a web-based patient management system that gives clinics and hospitals AI-aided diagnostic reports to enhance faster and more convenient healthcare services.',
            details: 'This Web-Based application provides real-time inventory tracking, customer management, and sales reporting features.',
            technologies: ['Python', 'Django'],
            features: [ ]
        },

        'HEED: Attention Span Game System': {
            title: 'HEED: Attention Span Game System',
            description: 'A collection of psychological games designed to improve attention span and reduce excessive screen time through engaging mental exercises.',
            technologies: [],
            features: []
        },
      
    };

    const openModal = (projectTitle) => {
        const project = projectDetails[projectTitle];
        if (!project) return;

        let html = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <h4>Overview</h4>
            <p>${project.details}</p>
            <h4>Technologies</h4>
            <div class="tag" style="margin: 10px 5px 10px 0;">
                ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
            <h4>Key Features</h4>
            <ul style="color: var(--color-text-secondary);">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;

        document.getElementById('modalBody').innerHTML = html;
        DOM.projectModal.classList.add('active');
    };

    const closeModal = () => {
        DOM.projectModal.classList.remove('active');
    };

    // Open modal on project button click
    DOM.projectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectCard = btn.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-title').textContent;
            openModal(projectTitle);
        });
    });

    // Close modal
    DOM.modalClose?.addEventListener('click', closeModal);

    // Close modal on outside click
    DOM.projectModal?.addEventListener('click', (e) => {
        if (e.target === DOM.projectModal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.projectModal.classList.contains('active')) {
            closeModal();
        }
    });
};

// =====================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =====================================================

const initIntersectionObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe skill items and project cards
    document.querySelectorAll('.skill-item, .project-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
};

// =====================================================
// SCROLL TO TOP BUTTON (Optional Enhancement)
// =====================================================

const initScrollToTop = () => {
    const scrollThreshold = 300;
    let scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Create button if it doesn't exist
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scrollToTopBtn';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
            display: none;
        `;
        document.body.appendChild(scrollToTopBtn);
    }

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > scrollThreshold) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                scrollToTopBtn.style.display = 'none';
            }, 300);
        }
    }, 100));

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// =====================================================
// PERFORMANCE TRACKING & ANALYTICS (Optional)
// =====================================================

const logPerformance = () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
};

// =====================================================
// INITIALIZATION
// =====================================================

const init = () => {
    console.log('🚀 Initializing portfolio...');

    // Initialize all features
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initGallery();
    initContactForm();
    initProjectModal();
    initScrollToTop();
    initIntersectionObserver();

    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLink, 250));

    // Set initial active link
    updateActiveNavLink();

    console.log('✅ Portfolio initialized successfully!');
    logPerformance();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}