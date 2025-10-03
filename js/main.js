// Animation utility functions
function setupAnimationStyles() {
    // Add styles for animations if they don't exist
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .project-slide {
                transition: transform 0.5s ease, opacity 0.5s ease;
                opacity: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
            .project-slide.active {
                opacity: 1;
                transform: translateX(0);
            }
            .slide-out-left {
                transform: translateX(-100%);
                opacity: 0;
            }
            .slide-out-right {
                transform: translateX(100%);
                opacity: 0;
            }
            .slide-in-left {
                transform: translateX(-100%);
            }
            .slide-in-right {
                transform: translateX(100%);
            }
            .fade-in {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            .fade-in.active {
                opacity: 1;
            }
            .slide-in-up {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .slide-in-up.active {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Project Slider Class
class ProjectSlider {
    constructor() {
        console.log('Initializing ProjectSlider...');
        this.slider = document.querySelector('.project-slider');
        this.slides = [];
        this.currentSlide = -1;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 8000;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Only initialize slider if we're on the projects page and slider exists
        if (this.slider && window.location.pathname.includes('projects.html')) {
            this.init();
        } else {
            this.addViewProjectsButton();
        }
    }
    
    init() {
        console.log('Initializing projects...');
        this.projects = [
            {
                id: 'project1',
                title: "My Personal Website",
                description: "A responsive personal portfolio website built with HTML, CSS, and JavaScript. Currently shows all my projects, skills and hobbies.",
                gif: "https://i.imgur.com/YKY28eT.png",
                demo: "https://github.com/CJColemanB/CJColemanB.github.io",
                code: "https://github.com/CJColemanB/CJColemanB.github.io",
                technologies: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
                role: "Full Stack Developer",
                date: "September 2025"
            },
            {
                id: 'project2',
                title:  "Auction Website",
                description: "A full-stack flask-based Auction website with user authentication, fully functioning management system, clean and responsive UI, and payment integration.",
                gif: "https://i.imgur.com/YKY28eT.png",
                demo: "#",
                code: "#",
                technologies: ["Python", "Flask", "SQLite", "Stripe API", "HTML5", "CSS3", "JavaScript"],
                role: "Full Stack Developer",
                date: "July 2025",
            },
            {
                id: 'project3',
                title: "Language-Based Data Visualizer",
                description: "A set of python programs that analyze and visualize data from various sources based on language patterns between English and Japanese.",
                gif: "https://i.imgur.com/YKY28eT.png",
                demo: "#",
                code: "https://github.com/CJ-Coleman/COMP2121",
                technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "nltk", "wordcloud"],
                role: "Data Analyst",
                date: "June 2025"
            }
        ];
        
        console.log('Creating slides...');
        this.createSlides();
        console.log(`Created ${this.slides.length} slides`);
        
        if (this.slides.length > 0) {
            console.log('Showing first slide...');
            this.showSlide(0);
            this.setupEventListeners();
            this.startAutoSlide();
        } else {
            console.error('❌ No slides were created. Check the projects array and createSlides method.');
        }
    }
    
    createSlides() {
        const slider = this.slider;
        if (!slider) return;
        
        slider.innerHTML = ''; // Clear any existing slides
        
        this.projects.forEach((project, index) => {
            const slide = document.createElement('div');
            slide.className = 'project-slide';
            slide.style.opacity = '0';
            slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            slide.style.position = 'absolute';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.top = '0';
            slide.style.left = '0';
            
            // Hide all slides except the first one initially
            if (index !== 0) {
                slide.style.display = 'none';
            }
            
            slide.innerHTML = `
                <div class="project-gif-container">
                    <img src="${project.gif}" alt="${project.title} Demo" class="project-gif">
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
                    <div class="github-section">
                        <h4><i class="fab fa-github"></i> Repository</h4>
                        <p>Check out the source code and contribute to this project:</p>
                        <a href="${project.code}" target="_blank" class="github-link">
                            <i class="fab fa-github"></i> ${project.code.includes('github.com') ? project.code.split('/').pop() : 'View Repository'}
                        </a>
                    </div>
                </div>
            `;
            slider.appendChild(slide);
            this.slides.push(slide);
        });
        
        // Ensure the slider container has the correct positioning
        slider.style.position = 'relative';
        slider.style.overflow = 'hidden';
        slider.style.minHeight = '500px'; // Adjust based on your needs
    }
    
    showSlide(index, direction = 'left') {
        if (this.isAnimating || !this.slides.length) return;
        
        // Handle wrap-around for infinite sliding
        if (index >= this.slides.length) {
            index = 0;
        } else if (index < 0) {
            index = this.slides.length - 1;
        }
        
        // If it's the first slide and we're initializing, just show it without animation
        const isInitialLoad = this.currentSlide === -1;
        
        this.isAnimating = !isInitialLoad;
        const currentSlide = this.currentSlide >= 0 ? this.slides[this.currentSlide] : null;
        const nextSlide = this.slides[index];
        
        // Hide all slides first
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
        });
        
        // If not initial load, animate out current slide
        if (!isInitialLoad && currentSlide) {
            currentSlide.style.display = 'flex';
            currentSlide.style.opacity = '1';
            currentSlide.style.transform = 'translateX(0)';
            currentSlide.classList.remove('active');
            if (direction === 'left') {
                currentSlide.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                currentSlide.style.transform = 'translateX(-100%)';
            } else {
                currentSlide.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                currentSlide.style.transform = 'translateX(100%)';
            }
            setTimeout(() => {
                currentSlide.style.opacity = '0';
                currentSlide.style.display = 'none';
            }, 500);
        }
        
        // Show the target slide
        nextSlide.style.display = 'flex';
        nextSlide.classList.add('active');
        nextSlide.style.opacity = '0';
        nextSlide.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        if (!isInitialLoad) {
            if (direction === 'left') {
                nextSlide.style.transform = 'translateX(100%)';
            } else {
                nextSlide.style.transform = 'translateX(-100%)';
            }
            setTimeout(() => {
                nextSlide.style.opacity = '1';
                nextSlide.style.transform = 'translateX(0)';
            }, 50);
        } else {
            nextSlide.style.opacity = '1';
            nextSlide.style.transform = 'translateX(0)';
        }
        
        // Update current slide index
        this.currentSlide = index;
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1, 'left');
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1, 'right');
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = setInterval(() => this.nextSlide('left'), 10000); // 10 seconds
    }
    resetAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    setupEventListeners() {
        if (!this.slider) return;
        // Touch events for mobile
        this.slider.addEventListener('touchstart', (e) => { this.handleTouchStart(e); this.resetAutoSlide(); }, { passive: true });
        this.slider.addEventListener('touchmove', (e) => { this.handleTouchMove(e); this.resetAutoSlide(); }, { passive: false });
        this.slider.addEventListener('touchend', (e) => { this.handleTouchEnd(e); this.startAutoSlide(); }, { passive: true });
        // Mouse drag events for desktop
        this.slider.addEventListener('mousedown', (e) => { this.handleMouseDown(e); this.resetAutoSlide(); });
        this.slider.addEventListener('mousemove', (e) => { this.handleMouseMove(e); this.resetAutoSlide(); });
        this.slider.addEventListener('mouseup', (e) => { this.handleMouseUp(); this.startAutoSlide(); });
        this.slider.addEventListener('mouseleave', (e) => { this.handleMouseUp(); this.startAutoSlide(); });
        // Pause auto-slide on hover
        this.slider.addEventListener('mouseenter', () => this.resetAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    handleArrowClick(direction) {
        const arrow = direction === 'prev' ? document.querySelector('.left-arrow') : document.querySelector('.right-arrow');
        if (arrow) {
            arrow.classList.add('arrow-clicked');
            setTimeout(() => arrow.classList.remove('arrow-clicked'), 200);
        }
        
        if (direction === 'prev') {
            this.prevSlide();
        } else {
            this.nextSlide();
        }
        
        this.resetAutoSlide();
        this.startAutoSlide();
    }
    
    // Touch start handler
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchEndX = this.touchStartX;
    }
    
    // Touch move handler
    handleTouchMove(e) {
        if (!this.touchStartX) return;
        this.touchEndX = e.touches[0].clientX;
        
        // Prevent vertical scroll when swiping horizontally
        if (Math.abs(this.touchEndX - this.touchStartX) > 10) {
            e.preventDefault();
        }
    }
    
    // Touch end handler
    handleTouchEnd() {
        if (!this.touchStartX || !this.touchEndX) return;
        const touchDiff = this.touchStartX - this.touchEndX;
        const minSwipeDistance = 50;
        if (touchDiff > minSwipeDistance) {
            // Swipe left - go to next slide
            this.nextSlide('left');
        } else if (touchDiff < -minSwipeDistance) {
            // Swipe right - go to previous slide
            this.prevSlide('right');
        }
        // Reset touch values
        this.touchStartX = null;
        this.touchEndX = null;
        // Reset auto slide timer
        this.resetAutoSlide();
        this.startAutoSlide();
    }
    // Mouse drag handlers
    handleMouseDown(e) {
        this.isMouseDown = true;
        this.mouseStartX = e.clientX;
        this.mouseEndX = e.clientX;
    }
    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        this.mouseEndX = e.clientX;
    }
    handleMouseUp() {
        if (!this.isMouseDown) return;
        const dragDiff = this.mouseStartX - this.mouseEndX;
        const minDragDistance = 50;
        if (dragDiff > minDragDistance) {
            this.nextSlide('left');
        } else if (dragDiff < -minDragDistance) {
            this.prevSlide('right');
        }
        this.isMouseDown = false;
        this.mouseStartX = null;
        this.mouseEndX = null;
        this.resetAutoSlide();
        this.startAutoSlide();
    }
    
    // Add View Projects button to the main page
    addViewProjectsButton() {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            // Clear any existing content
            projectsSection.innerHTML = '<h2 class="section-title">My Projects</h2>';
            
            // Add a button to navigate to the projects page
            const viewProjectsBtn = document.createElement('a');
            viewProjectsBtn.href = 'projects.html';
            viewProjectsBtn.className = 'btn';
            viewProjectsBtn.textContent = 'View All Projects';
            
            // Add some styling to the button
            viewProjectsBtn.style.display = 'inline-block';
            viewProjectsBtn.style.marginTop = '20px';
            viewProjectsBtn.style.padding = '10px 20px';
            viewProjectsBtn.style.backgroundColor = '#4CAF50';
            viewProjectsBtn.style.color = 'white';
            viewProjectsBtn.style.textDecoration = 'none';
            viewProjectsBtn.style.borderRadius = '4px';
            viewProjectsBtn.style.transition = 'background-color 0.3s';
            
            // Add hover effect
            viewProjectsBtn.addEventListener('mouseover', () => {
                viewProjectsBtn.style.backgroundColor = '#45a049';
            });
            
            viewProjectsBtn.addEventListener('mouseout', () => {
                viewProjectsBtn.style.backgroundColor = '#4CAF50';
            });
            
            projectsSection.appendChild(viewProjectsBtn);
        }
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links (only on index.html)
    if (!window.location.pathname.includes('projects.html')) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '#!' || targetId.startsWith('http')) return;
                
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
    }

    // Initialize project slider
    const projectSlider = new ProjectSlider();

        // Animated scrollbar for mobile portrait mode
        function enableAnimatedScrollbar() {
            const infos = document.querySelectorAll('.project-info');
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
        enableAnimatedScrollbar();

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-up');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Run once on page load
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});
