// Magazine Animations Module

export function initAnimations() {
    // Initialize Intersection Observer for scroll animations
    initScrollAnimations();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize entrance animations
    initEntranceAnimations();
}

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.observe-fade, .observe-slide-up, .observe-slide-left, .observe-slide-right, .observe-scale');
    animatedElements.forEach(el => observer.observe(el));
}

// Parallax scrolling effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Hover effects
function initHoverEffects() {
    // Add hover classes dynamically
    const cards = document.querySelectorAll('.feature-card, .project-card, .book-card');
    cards.forEach(card => {
        if (!card.classList.contains('hover-lift')) {
            card.classList.add('hover-lift');
        }
    });
    
    // Add shine effect to images
    const images = document.querySelectorAll('.feature-image, .project-image, .book-cover');
    images.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'hover-shine';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });
}

// Entrance animations
function initEntranceAnimations() {
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const children = heroContent.children;
        Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            setTimeout(() => {
                child.style.transition = 'all 0.8s ease';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Animate header
    const header = document.querySelector('.magazine-header');
    if (header) {
        header.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            header.style.transition = 'transform 0.5s ease';
            header.style.transform = 'translateY(0)';
        }, 500);
    }
}

// Smooth scroll for navigation links
export function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.magazine-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Progress indicator
export function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10000;
        transition: width 0.3s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Text reveal animation
export function revealText(element) {
    const text = element.textContent;
    element.textContent = '';
    element.classList.add('text-reveal');
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${index * 0.05}s`;
        element.appendChild(span);
    });
}

// Typewriter effect
export function typewriter(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Stagger animation for lists
export function staggerAnimation(container, childSelector = '*') {
    const children = container.querySelectorAll(childSelector);
    
    children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            child.style.transition = 'all 0.5s ease';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
        }, index * 100);
    });
}