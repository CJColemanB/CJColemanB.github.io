// js/main.js (FINAL CORRECTED)

// This class is now *only* responsible for the slider.
class ProjectSlider {
    constructor() {
        this.slider = document.querySelector('.project-slider');
        if (!this.slider) return;

        this.slides = [];
        this.currentSlide = -1;
        this.autoSlideInterval = null;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isMouseDown = false;
        this.mouseStartX = 0;
        this.mouseEndX = 0;
        
        this.init();
    }
    
    init() {
        // 'projects' is now a global variable from project-data.js
        this.projectData = Object.values(projects);
        
        this.createSlides();
        
        if (this.slides.length > 0) {
            this.showSlide(0); // Show first slide *without* animation
            this.setupEventListeners();
            this.startAutoSlide();
            this.enableAnimatedScrollbar();
        }
    }
    
    createSlides() {
        if (!this.slider) return;
        
        this.slider.innerHTML = ''; // Clear any existing slides
        
        this.projectData.forEach((project, index) => {
            const slide = document.createElement('div');
            // All styling is handled by .project-slide class
            slide.className = 'project-slide';
            
            slide.innerHTML = `
                <div class="project-gif-container">
                    <a href="project-template.html?id=${project.id}" aria-label="View project details for ${project.title}">
                        <img src="${project.gif}" alt="${project.title} Demo" class="project-gif">
                    </a>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-meta"> 
                        <div class="meta-item">
                            <h4>Role</h4>
                            <p>${project.role}</p>
                        </div>
                        <div class="meta-item">
                            <h4>Technologies</h4>
                            <div class="meta-tags">
                                ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        <div class="meta-item">
                            <h4>Date</h4>
                            <p>${project.date}</p>
                        </div>
                    </div>
                    <div class="project-links">
                        <a href="${project.demo}" target="_blank" class="project-details-btn">
                            <i class="fas fa-external-link-alt"></i> View Demo
                        </a>
                        <a href="${project.code}" target="_blank" class="project-demo-btn">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    </div>
                </div>
            `;
            this.slider.appendChild(slide);
            this.slides.push(slide);
        });
        
        // Ensure the slider container has the correct positioning
        this.slider.style.position = 'relative';
        this.slider.style.overflow = 'hidden';
        this.slider.style.minHeight = '500px'; // Adjust as needed
    }
    
    showSlide(index, direction = 'left') {
        if (this.isAnimating || !this.slides.length) return;
        
        // Handle wrap-around
        if (index >= this.slides.length) index = 0;
        if (index < 0) index = this.slides.length - 1;
        
        const isInitialLoad = this.currentSlide === -1;
        if (index === this.currentSlide && !isInitialLoad) return;

        this.isAnimating = !isInitialLoad;
        const currentSlide = this.currentSlide >= 0 ? this.slides[this.currentSlide] : null;
        const nextSlide = this.slides[index];
        
        // --- New Animation Logic (Cross-fade) ---

        // 1. Set up the NEXT slide's starting position
        if (!isInitialLoad) {
            nextSlide.style.transition = 'none'; // No animation yet
            nextSlide.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
            nextSlide.style.opacity = '0';
        }
        
        // 2. Make the NEXT slide active (brings z-index to 2)
        nextSlide.classList.add('.active');

        // 3. Animate slides
        setTimeout(() => {
            // Animate OUT the CURRENT slide (if it exists)
            if (!isInitialLoad && currentSlide) {
                currentSlide.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                currentSlide.style.transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
                currentSlide.style.opacity = '0';
                currentSlide.classList.remove('active'); // Sinks z-index to 1
            }

            // Animate IN the NEXT slide
            nextSlide.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            nextSlide.style.transform = 'translateX(0)';
            nextSlide.style.opacity = '1';
            
        }, 50); // 50ms is enough for the browser to catch up

        // 4. Update state and unlock animation
        this.currentSlide = index;
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 550); // 500ms for animation + 50ms buffer
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1, 'left');
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1, 'right');
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 10000); // 10 seconds
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    setupEventListeners() {
        if (!this.slider) return;
        
        const restartSlide = () => this.startAutoSlide();
        
        // Touch events
        this.slider.addEventListener('touchstart', (e) => { this.handleTouchStart(e); this.stopAutoSlide(); }, { passive: true });
        this.slider.addEventListener('touchmove', (e) => { this.handleTouchMove(e); }, { passive: false }); 
        this.slider.addEventListener('touchend', () => { this.handleTouchEnd(); restartSlide(); });
        
        // Mouse events
        this.slider.addEventListener('mousedown', (e) => { this.handleMouseDown(e); this.stopAutoSlide(); });
        this.slider.addEventListener('mousemove', (e) => { this.handleMouseMove(e); }); 
        this.slider.addEventListener('mouseup', () => { this.handleMouseUp(); restartSlide(); });
        this.slider.addEventListener('mouseleave', () => { this.handleMouseUp(); restartSlide(); });
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.slider.addEventListener('mouseleave', () => restartSlide());
    }
    
    // --- Touch Handlers ---
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchEndX = this.touchStartX;
    }
    
    handleTouchMove(e) {
        if (!this.touchStartX) return;
        this.touchEndX = e.touches[0].clientX; 
        
        if (Math.abs(this.touchEndX - this.touchStartX) > 10) {
            e.preventDefault(); // Prevent vertical scroll
        }
    }
    
    handleTouchEnd() {
        if (!this.touchStartX || !this.touchEndX) return;
        const touchDiff = this.touchStartX - this.touchEndX;
        if (touchDiff > 50) this.nextSlide();
        else if (touchDiff < -50) this.prevSlide();
        
        this.touchStartX = 0;
        this.touchEndX = 0;
    }
    
    // --- Mouse Handlers ---
    handleMouseDown(e) {
        this.isMouseDown = true;
        this.mouseStartX = e.clientX;
        this.mouseEndX = e.clientX;
        this.slider.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        this.mouseEndX = e.clientX;
    }
    
    handleMouseUp() {
        if (!this.isMouseDown) return;
        const dragDiff = this.mouseStartX - this.mouseEndX;
        if (dragDiff > 50) this.nextSlide();
        else if (dragDiff < -50) this.prevSlide();
        
        this.isMouseDown = false;
        this.mouseStartX = 0;
        this.mouseEndX = 0;
        this.slider.style.cursor = 'grab';
    } 

    // This logic is specific to the slider, so it lives here
    enableAnimatedScrollbar() {
        const infos = this.slider.querySelectorAll('.project-info');
        infos.forEach(info => {
            let scrollTimeout;
            info.addEventListener('scroll', () => {
                info.classList.add('scrolling');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    info.classList.remove('scrolling');
                }, 400);
            });
        });
    } 

} // <--- ProjectSlider CLASS ENDS HERE


// This function now *only* sets up the home page button.
function setupHomePage() {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        // Clear any existing content and add the container/title
        projectsSection.innerHTML = '<div class="container"><h2 class="section-title">My Projects</h2></div>';
        
        const viewProjectsBtn = document.createElement('a');
        viewProjectsBtn.href = 'projects.html';
        // All styling is now handled by this class in styles.css
        viewProjectsBtn.className = 'btn view-all-projects-btn';
        viewProjectsBtn.textContent = 'View All Projects';
        
        // Add the button inside the container
        projectsSection.querySelector('.container').appendChild(viewProjectsBtn);
    }
}

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', function() {
    
    // Set current year in footer (runs on all pages)
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Mobile menu (runs on all pages)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Page-Specific Logic ---
    if (window.location.pathname.includes('projects.html')) {
        // --- PROJECTS PAGE ---
        new ProjectSlider();
        
    } else if (document.getElementById('projects')) {
        // --- HOME PAGE (index.html) ---
        setupHomePage();

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '#!') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Animation on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < window.innerHeight - 150) {
                    element.classList.add('active');
                }
            });
        };
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    }
});