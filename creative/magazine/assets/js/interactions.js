// Magazine Interactions Module

import { initSmoothScroll, initProgressIndicator } from './animations.js';

export function initInteractions() {
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize progress indicator
    initProgressIndicator();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize sidebar
    initSidebar();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Initialize sticky header
    initStickyHeader();
    
    // Initialize back to top button
    initBackToTop();
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    // Create mobile menu overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 998;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    
    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.cssText = `
        position: fixed;
        top: 60px;
        right: -300px;
        width: 300px;
        height: calc(100% - 60px);
        background: white;
        z-index: 999;
        transition: right 0.3s ease;
        padding: 20px;
        overflow-y: auto;
    `;
    
    // Clone navigation items
    const navItems = navMenu.cloneNode(true);
    navItems.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 20px;
    `;
    navItems.querySelectorAll('a').forEach(link => {
        link.style.cssText = `
            color: #333;
            font-size: 1.1rem;
            padding: 10px;
            border-bottom: 1px solid #eee;
        `;
    });
    
    mobileMenu.appendChild(navItems);
    document.body.appendChild(mobileMenu);
    
    // Toggle menu
    let isOpen = false;
    
    menuToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        
        if (isOpen) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.opacity = '1';
                mobileMenu.style.right = '0';
            }, 10);
        } else {
            overlay.style.opacity = '0';
            mobileMenu.style.right = '-300px';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    });
    
    // Close on overlay click
    overlay.addEventListener('click', () => {
        isOpen = false;
        overlay.style.opacity = '0';
        mobileMenu.style.right = '-300px';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    });
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            overlay.style.opacity = '0';
            mobileMenu.style.right = '-300px';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        });
    });
}

// Sidebar functionality
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (!sidebar || !sidebarToggle) return;
    
    let isOpen = false;
    
    sidebarToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        sidebar.classList.toggle('active');
        sidebarToggle.querySelector('span').textContent = isOpen ? '→' : '←';
    });
    
    // Auto-open on large screens
    if (window.innerWidth > 1200) {
        setTimeout(() => {
            sidebar.classList.add('active');
            sidebarToggle.querySelector('span').textContent = '→';
            isOpen = true;
        }, 2000);
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Sticky header with hide/show on scroll
function initStickyHeader() {
    const header = document.querySelector('.magazine-header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            if (currentScroll > lastScroll && currentScroll > 300) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Back to top button
function initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 900;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    
    document.body.appendChild(button);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
}

// Image gallery lightbox
export function initLightbox() {
    const images = document.querySelectorAll('.feature-image, .project-image, .book-cover');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: zoom-out;
                animation: fadeIn 0.3s ease;
            `;
            
            const fullImage = document.createElement('img');
            fullImage.src = img.src;
            fullImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                animation: scaleIn 0.3s ease;
            `;
            
            lightbox.appendChild(fullImage);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(lightbox);
                }, 300);
            });
        });
    });
}

// Copy to clipboard for contact info
export function initCopyToClipboard() {
    const contactItems = document.querySelectorAll('.contact-value');
    
    contactItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.title = 'Click to copy';
        
        item.addEventListener('click', () => {
            const text = item.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const feedback = document.createElement('div');
                feedback.textContent = 'Copied!';
                feedback.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #667eea;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 10000;
                    animation: fadeInOut 2s ease;
                `;
                
                document.body.appendChild(feedback);
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 2000);
            });
        });
    });
}

// Keyboard navigation
export function initKeyboardNav() {
    const sections = document.querySelectorAll('section, article');
    let currentSection = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'j') {
            e.preventDefault();
            currentSection = Math.min(currentSection + 1, sections.length - 1);
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
            e.preventDefault();
            currentSection = Math.max(currentSection - 1, 0);
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        }
    });
}