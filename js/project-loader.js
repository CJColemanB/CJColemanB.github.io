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
    // 'projects' and 'nonCodingProjects' are loaded from project-data.js
    let project = projects[projectId];
    
    if (!project && typeof nonCodingProjects !== 'undefined') {
        project = nonCodingProjects[projectId];
    }
    
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

    // Update Role (and hide if it doesn't exist)
    const metaRole = document.getElementById('meta-role');
    if (metaRole) {
        if (project.role) {
            document.getElementById('project-role').textContent = project.role;
        } else {
            metaRole.style.display = 'none'; // Hide role meta item
        }
    }

    document.getElementById('project-date').textContent = project.date;
    
    // Update technologies or skills used
    const metaTech = document.getElementById('meta-technologies');
    if (metaTech) {
        const techContainer = document.getElementById('project-technologies');
        const techLabel = document.getElementById('technologies-label');

        if (project.technologies && project.technologies.length > 0) {
            // This is a coding project with technologies
            techLabel.textContent = 'Technologies';
            techContainer.innerHTML = project.technologies
                .map(tech => `<span class="tag">${tech}</span>`)
                .join('');
        } else if (project.skillsUsed && project.skillsUsed.length > 0) {
            // This is a non-coding project with skillsUsed
            techLabel.textContent = 'Skills'; // Changed label as requested
            techContainer.innerHTML = project.skillsUsed
                .map(skill => `<span class="tag">${skill}</span>`)
                .join('');
        } else {
            // No technologies or skillsUsed, hide the whole section
            metaTech.style.display = 'none';
        }
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
    // Check if either project data object has loaded
    const dataLoaded = typeof projects !== 'undefined' || typeof nonCodingProjects !== 'undefined';

    if (projectId && dataLoaded) {
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