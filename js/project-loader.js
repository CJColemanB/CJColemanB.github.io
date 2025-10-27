// Set current year in footer
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

// Load project data
function loadProject() {
    // 'projects' is loaded from project-data.js
    const project = projects[projectId]; 
    
    if (!project) {
        // Redirect if project ID is invalid
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${project.title} | CJ Coleman-Benjamin`;
    
    // --- Update Header ---
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-tagline').textContent = project.tagline;
    
    // Update project GIF
    const projectGif = document.getElementById('project-gif');
    if (projectGif) {
        projectGif.src = project.gif;
        projectGif.alt = `${project.title} Demo`;
    }
    
    // --- Update project meta ---
    document.getElementById('project-role').textContent = project.role;
    document.getElementById('project-date').textContent = project.date;
    
    // Update technologies
    const techContainer = document.getElementById('project-technologies');
    if (techContainer) {
        techContainer.innerHTML = project.technologies
            .map(tech => `<span class="tag">${tech}</span>`)
            .join('');
    }
    
    // Safely update *only* the 'source-code' button
    const codeLink = document.getElementById('source-code');
    if (codeLink) {
        if (project.code && project.code !== "#") {
            codeLink.href = project.code;
            codeLink.style.display = 'inline-flex'; // Show it
        } else {
            codeLink.style.display = 'none'; // Hide if no link
        }
    }

    // Update content sections
    const descriptionEl = document.getElementById('project-description');
    if (descriptionEl && project.description) {
        descriptionEl.innerHTML = project.description;
    }

    const skillsEl = document.getElementById('project-skills');
    if (skillsEl && project.skills) {
        skillsEl.innerHTML = project.skills;
    }
    
    // Hide 'Acknowledgements' section if there is no 'thanks' data
    const thanksSection = document.getElementById('thanks-section');
    const thanksDiv = document.getElementById('project-thanks');
    
    if (thanksSection && thanksDiv) {
        if (project.thanks && project.thanks.trim() !== '') {
            thanksDiv.innerHTML = project.thanks;
        } else {
            thanksSection.style.display = 'none';
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    if (projectId && typeof projects !== 'undefined') {
        loadProject();
    } else if (!projectId) {
        // Redirect to home if no project ID is provided
        window.location.href = 'index.html';
    } else {
        // Data failed to load
        console.error('Project data is missing. Make sure project-data.js is loaded.');
        document.body.innerHTML = '<h1>Error: Project data could not be loaded. <a href="index.html">Go Home</a></h1>';
    }
});