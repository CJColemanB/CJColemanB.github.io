// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

// Load project data
function loadProject() {
    const project = projects[projectId]; 
    
    if (!project) {
        // Redirect to 404 or home page if project not found
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${project.title} | CJ Coleman-Benjamin`;
    
    // Update header
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-tagline').textContent = project.tagline;
    
    // Update project GIF
    const projectGif = document.getElementById('project-gif');
    if (projectGif) {
        projectGif.src = project.gif;
        projectGif.alt = `${project.title} Demo`;
    }
    
    // Update project meta
    document.getElementById('project-role').textContent = project.role;
    document.getElementById('project-date').textContent = project.date;
    
    // Update technologies
    const techContainer = document.getElementById('project-technologies');
    if (techContainer) {
        techContainer.innerHTML = project.technologies
            .map(tech => `<span class="tag">${tech}</span>`)
            .join('');
    }
    
    // Update links
    document.getElementById('live-demo').href = project.demo;
    document.getElementById('source-code').href = project.code;
    
    // Update content sections
    document.getElementById('project-description').innerHTML = project.description;
    document.getElementById('project-skills').innerHTML = project.skills;
    
    // Hide 'Acknowledgements' section if there is no 'thanks' data
    const thanksSection = document.getElementById('thanks-section');
    const thanksDiv = document.getElementById('project-thanks');
    if (project.thanks && project.thanks.trim() !== '') {
        thanksDiv.innerHTML = project.thanks;
    } else {
        thanksSection.style.display = 'none';
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
        console.error('Project data is missing.');
        document.body.innerHTML = '<h1>Error: Project data could not be loaded. <a href="index.html">Go Home</a></h1>';
    }
});