document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

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

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Project Slider
    class ProjectSlider {
        constructor() {
            this.slider = document.querySelector('.project-slider');
            if (!this.slider) {
                console.error('Project slider element not found');
                return;
            }
            
            this.slides = [];
            this.currentSlide = 0;
            this.autoSlideInterval = null;
            this.autoSlideDelay = 8000; // 8 seconds
            this.isAnimating = false;
            
            this.init();
        }
        
        init() {
            // My Projects
            this.projects = [
                {
                    id: 'project1',
                    title: "My Personal Website",
                    description: "A responsive personal portfolio website built with HTML, CSS, and JavaScript. Features a modern UI with smooth animations and a project showcase.",
                    gif: "https://i.imgur.com/YKY28eT.png",
                    demo: "https://cjcolemanb.github.io/personal-website/",
                    code: "https://github.com/CJColemanB/personal-website",
                    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
                    role: "Frontend Developer",
                    date: "September 2025"
                },
                {
                    id: 'project2',
                    title: "E-commerce Platform",
                    description: "A full-stack e-commerce platform with user authentication, product catalog, and payment integration.",
                    gif: "https://i.imgur.com/YKY28eT.png",
                    demo: "#",
                    code: "#",
                    technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
                    role: "Full Stack Developer",
                    date: "July 2025"
                },
                {
                    id: 'project3',
                    title: "Task Management App",
                    description: "A productivity application for managing tasks and projects with team collaboration features.",
                    gif: "https://i.imgur.com/YKY28eT.png",
                    demo: "#",
                    code: "#",
                    technologies: ["Vue.js", "Firebase", "Vuex", "Vuetify"],
                    role: "Frontend Developer",
                    date: "May 2025"
                }
            ];
            
            this.createSlides();
            this.showSlide(0);
            this.setupEventListeners();
            this.startAutoSlide();
        }
        
        createSlides() {
            this.projects.forEach((project, index) => {
                const slide = document.createElement('div');
                slide.className = 'project-slide';
                slide.innerHTML = `
                    <div class="project-slide-inner">
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
                            </div>
                            <div class="project-links">
                                <a href="project-template.html?id=${project.id}" class="project-details-btn">
                                    View Details <i class="fas fa-arrow-right"></i>
                                </a>
                                ${project.demo !== '#' ? `<a href="${project.demo}" target="_blank" class="project-demo-btn">
                                    Live Demo <i class="fas fa-external-link-alt"></i>
                                </a>` : ''}
                                ${project.code !== '#' ? `<a href="${project.code}" target="_blank" class="project-demo-btn">
                                    View Code <i class="fab fa-github"></i>
                                </a>` : ''}
                            </div>
                        </div>
                    </div>`;
                this.slider.appendChild(slide);
                this.slides.push(slide);
            });
        }
        
        showSlide(index, direction = 'next') {
            if (this.isAnimating || !this.slides.length) return;
            this.isAnimating = true;
            
            const totalSlides = this.slides.length;
            const currentActive = this.slides[this.currentSlide];
            const newIndex = (index + totalSlides) % totalSlides;
            const newActive = this.slides[newIndex];
            
            // Set initial states
            newActive.style.display = 'block';
            newActive.style.opacity = '0';
            newActive.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
            
            // Force reflow
            newActive.offsetHeight;
            
            // Start animation
            currentActive.style.transition = 'all 0.6s ease-in-out';
            newActive.style.transition = 'all 0.6s ease-in-out';
            
            currentActive.style.opacity = '0';
            currentActive.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
            
            newActive.style.opacity = '1';
            newActive.style.transform = 'translateX(0)';
            
            // Update current slide after animation
            setTimeout(() => {
                currentActive.style.display = 'none';
                currentActive.style.transform = '';
                currentActive.style.opacity = '';
                newActive.style.transform = '';
                this.currentSlide = newIndex;
                this.isAnimating = false;
            }, 600);
        }
        
        nextSlide() {
            this.showSlide(this.currentSlide + 1, 'next');
        }
        
        prevSlide() {
            this.showSlide(this.currentSlide - 1, 'prev');
        }
        
        startAutoSlide() {
            this.autoSlideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
        }
        
        resetAutoSlide() {
            clearInterval(this.autoSlideInterval);
            this.startAutoSlide();
        }
        
        setupEventListeners() {
            const leftArrow = document.querySelector('.left-arrow');
            const rightArrow = document.querySelector('.right-arrow');
            
            if (!leftArrow || !rightArrow) return;
            
            const handleArrowClick = (direction) => {
                if (this.isAnimating) return;
                if (direction === 'prev') {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
                this.resetAutoSlide();
            };
            
            leftArrow.addEventListener('click', () => handleArrowClick('prev'));
            rightArrow.addEventListener('click', () => handleArrowClick('next'));
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    handleArrowClick('prev');
                } else if (e.key === 'ArrowRight') {
                    handleArrowClick('next');
                }
            });
            
            // Touch events for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            const minSwipeDistance = 50;
            
            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            this.slider.addEventListener('touchmove', (e) => {
                touchEndX = e.touches[0].clientX;
            }, { passive: true });
            
            this.slider.addEventListener('touchend', () => {
                const distance = touchStartX - touchEndX;
                if (Math.abs(distance) > minSwipeDistance) {
                    if (distance > 0) {
                        handleArrowClick('next');
                    } else {
                        handleArrowClick('prev');
                    }
                }
            }, { passive: true });
            
            // Pause auto-slide on hover
            this.slider.addEventListener('mouseenter', () => {
                clearInterval(this.autoSlideInterval);
            });
            
            this.slider.addEventListener('mouseleave', () => {
                this.resetAutoSlide();
            });
        }
    }

    // Initialize the project slider
    const projectSlider = new ProjectSlider();

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section, .hobby-card, .timeline-item, .project-slide');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.querySelectorAll('.section, .hobby-card, .timeline-item, .project-slide').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Highlight active navigation
    const highlightNavigation = () => {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Run once on load
});
