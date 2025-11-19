/**
 * A reusable class to create a touch-enabled, auto-playing project slider.
 */
class ProjectSlider {
    /**
     * Creates a new ProjectSlider instance.
     * @param {string} selector - The CSS selector for the slider container (e.g., ".project-slider").
     * @param {object} projectData - The data object to pull projects from (e.g., global 'projects').
     * @param {string} type - The type of project ('coding' or 'non-coding') to determine card layout.
     */
    constructor(selector, projectData, type = 'coding') {
        this.slider = document.querySelector(selector);
        if (!this.slider) {
            console.warn(`Slider element "${selector}" not found. Skipping initialization.`);
            return;
        }

        this.projectData = projectData;
        this.type = type; // 'coding' or 'non-coding'

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
        // Get the values from the provided data object
        const dataValues = Object.values(this.projectData || {});
        
        this.createSlides(dataValues);
        
        if (this.slides.length > 0) {
            this.showSlide(0); // Show first slide *without* animation
            this.setupEventListeners();
            this.startAutoSlide();
            this.enableAnimatedScrollbar();
        } else {
            this.slider.innerHTML = '<p>No projects to display.</p>'; // Fallback message
        }
    }
    
    createSlides(dataValues) {
        if (!this.slider) return;
        
        this.slider.innerHTML = ''; // Clear any existing slides
        
        dataValues.forEach((project) => {
            const slide = document.createElement('div');
            slide.className = 'project-slide';
            
            // --- Dynamically generate meta and links based on type ---
            let metaHTML = '';
            let linksHTML = '';

            if (this.type === 'coding') {
                metaHTML = `
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
                `;
                if (project.code && project.code !== "#") {
                    linksHTML = `
                        <a href="${project.code}" target="_blank" class="project-details-btn">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    `;
                }
            } else if (this.type === 'non-coding') {
                metaHTML = `
                    <div class="meta-item">
                        <h4>Skills</h4>
                        <div class="meta-tags">
                            ${project.skillsUsed.map(skill => `<span class="tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    <div class="meta-item">
                        <h4>Date</h4>
                        <p>${project.date}</p>
                    </div>
                `;
                // linksHTML remains empty
            }
            
            // --- Full slide HTML ---
            slide.innerHTML = `
                <div class="project-gif-container">
                    <a href="project-template.html?id=${project.id}" aria-label="View project details for ${project.title}">
                        <img src="${project.gif}" alt="${project.title} Demo" class="project-gif">
                    </a>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.tagline}</p> <div class="project-meta"> 
                        ${metaHTML}
                    </div>
                    <div class="project-links">
                        ${linksHTML}
                    </div>
                </div>
            `;
            this.slider.appendChild(slide);
            this.slides.push(slide);
        });
        
        // Ensure the slider container has the correct positioning
        this.slider.style.position = 'relative';
        this.slider.style.overflow = 'hidden';
        this.slider.style.minHeight = '650px'; // Adjust as needed
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
        
        // --- Animation Logic (Cross-fade/Slide) ---

        // 1. Set up the NEXT slide's starting position
        if (!isInitialLoad) {
            nextSlide.style.transition = 'none'; // No animation yet
            nextSlide.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
            nextSlide.style.opacity = '0';
        }
        
        // 2. Make the NEXT slide active (brings z-index to 2)
        nextSlide.classList.add('active');

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

// --- HOME PAGE SETUP ---
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
        
        // Initialize the first slider for CODING projects
        // (Check if 'projects' data exists first)
        if (typeof projects !== 'undefined' && Object.keys(projects).length > 0) {
            new ProjectSlider('.project-slider', projects, 'coding');
        }
        
        // Initialize the second slider for NON-CODING projects
        // (Check if 'nonCodingProjects' data exists first)
        if (typeof nonCodingProjects !== 'undefined' && Object.keys(nonCodingProjects).length > 0) {
            new ProjectSlider('.non-coding-project-slider', nonCodingProjects, 'non-coding');
        }
        
    } else if (document.getElementById('experience')) { // <-- **FIXED THIS LINE**
        // --- HOME PAGE (index.html) ---
        // setupHomePage(); // <-- **REMOVED THIS LINE**

        // --- Experience Timeline Dropdown ---
        const experienceCards = document.querySelectorAll('.timeline-content');

        experienceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent card from closing if user clicks a link inside
                if (e.target.tagName === 'A') return;
                
                // Toggle the 'expanded' class on the clicked card
                card.classList.toggle('expanded');
            });
        });

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

/*
=================================
 CV Page Flipper Logic
=================================
*/
// We wrap this in a 'DOMContentLoaded' listener to make sure
// the script runs after the page has loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Check if the CV image element exists on the current page
    const cvImage = document.getElementById('cv-image');
    
    // If it exists, run the CV flipper code
    if (cvImage) {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        // --- CONFIGURE YOUR PAGES HERE ---
        const cvPages = [
            'files/CJ_Coleman_Benjamin_CV-1.png',
            'files/CJ_Coleman_Benjamin_CV-2.png'
            // If you ever have a 3-page CV, just add:
            // 'files/cv-page-3.png'
        ];
        // ---------------------------------

        let currentPage = 0; // 0 is the first page

        function updateCVView() {
            // Update the image source and alt text
            cvImage.src = cvPages[currentPage];
            cvImage.alt = `CV Page ${currentPage + 1}`;
            
            // Show or hide the 'Previous' button
            if (currentPage === 0) {
                prevBtn.style.display = 'none'; // Hide on first page
            } else {
                prevBtn.style.display = 'block';
            }

            // Show or hide the 'Next' button
            if (currentPage === cvPages.length - 1) {
                nextBtn.style.display = 'none'; // Hide on last page
            } else {
                nextBtn.style.display = 'block';
            }
        }

        // Add click listeners
        nextBtn.addEventListener('click', () => {
            if (currentPage < cvPages.length - 1) {
                currentPage++;
                updateCVView();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateCVView();
            }
        });

        // Run the function once on load to set the initial state
        updateCVView();
    }
});