// === CODING PROJECTS ===
const projects = {
    'project1': {
        id: 'project1',
        title: "My Personal Website",
        tagline: "A responsive personal portfolio website built with HTML, CSS, and JavaScript.",
        description: "<p>A responsive personal portfolio website built with HTML, CSS, and JavaScript. Currently shows all my projects, skills and hobbies.</p>",
        gif: "Images/Projects/HomePage.png", 
        demo: "#",
        code: "https://github.com/CJColemanB/CJColemanB.github.io",
        technologies: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
        role: "Full Stack Developer",
        date: "September 2025",
        skills: `<h3>Key Features</h3>
                 <ul>
                    <li>Fully responsive design for mobile, tablet, and desktop.</li>
                    <li>JavaScript-powered animations and project slider.</li>
                    <li>Dynamic project loading from a central data source.</li>
                 </ul>`,
        thanks: `<p>Thanks to various online tutorials and resources for inspiration.</p>`
    },
    'project2': {
        id: 'project2',
        title: "Auction Website",
        tagline: "A full-stack flask-based Auction website.",
        description: "<p>A full-stack flask-based Auction website with user authentication, fully functioning management system, clean and responsive UI, and payment integration.</p>",
        gif: "Images/Projects/AuctionPage.png",
        demo: "#",
        code: "https://github.com/ne-njaravani/Car-Auction-Web-App",
        technologies: ["Python", "Flask", "SQLite", "Stripe API", "HTML5", "CSS3", "JavaScript"],
        role: "Full Stack Developer",
        date: "July 2025",
        skills: `<h3>Key Features</h3>
                 <ul>
                    <li>Teamwork-based project using Agile methodologies.</li>
                    <li>Responsive UI built with HTML, CSS, and JavaScript.</li>
                    <li>User authentication (register, login, logout).</li>
                    <li>Stripe API integration for payments.</li>
                    <li>Full CRUD (Create, Read, Update, Delete) functionality for auction listings.</li>
                    <li>Employee/Manager admin panels.</li>
                 </ul>`,
        thanks: `<p>Many thanks to my team members (Ali Khairy, Eben Njaravani, Ho Chun Wong, Hodo Hasan and Rameesah Farooqui)</p>
                 <p>I'd also like to acknowledge the University of Leeds for providing this project opportunity.</p>`
    },
    'project3': {
        id: 'project3',
        title: "Language-Based Data Visualizer",
        tagline: "Python programs to analyze and visualize language data.",
        description: "<p>A set of python programs that analyze and visualize data from various sources based on language patterns between English and Japanese.</p>",
        gif: "https://i.imgur.com/YKY28eT.png",
        demo: "#",
        code: "https://github.com/CJ-Coleman/COMP2121",
        technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "nltk", "wordcloud"],
        role: "Data Analyst",
        date: "June 2025",
        skills: `<h3>Technical Skills</h3>
                 <ul>
                    <li>Data cleaning and preprocessing with Pandas.</li>
                    <li>Natural Language Processing (NLP) with NLTK.</li>
                    <li>Data visualization with Matplotlib and Seaborn.</li>
                    <li>Generating word clouds from text data.</li>
                 </ul>`,
        thanks: `<p>Thanks to the module leader for the opportunity to explore my interests in a productive way.</p>`
    },
    'project4': {
        id: 'project4',
        title: "Device Logging Tool",
        tagline: "Flask-based web app for logging devices",
        description: "<p>A full-Stack Flask-based web application used to log devices being lended by Streatham and Clapham High School.</p>",
        gif: "Images/Projects/DeviceLoggerPage.png",
        demo: "#",
        code: "https://github.com/CJ-Coleman/COMP2121",
        technologies: ["Python", "Pandas", "OpenPyXL", "Flask", "HTML", "CSS", "JavaScript", "SQLite"],
        role: "Full Stack Developer",
        date: "October 2025",
        skills: `<h3>Technical Skills</h3>
                 <ul>
                    <li>Flask Integration with a web application</li>
                    <li>SQLite utilisation to store devices, as well as OpenPyXL to enable ease of downloading into Excel Spreadsheets</li>
                    <li>Clean UI for ease of use for all users</li>
                    <li>Secure administrator access areas with forced logouts, automatically generated passwords, etc.</li>
                 </ul>`,
        thanks: `<p>Thanks to Streatham & Clapham High School for the opportunity to implement this.</p>`
    }
};

// === NON-CODING PROJECTS ===
const nonCodingProjects = {
    'ncProject1': {
        id: 'ncProject1',
        title: "RRS40MUN Conference",
        tagline: "Hosted Royal Russell's 40th Model United Nations Conference.",
        description: "<p>Built my own computer with a few friends during my first year at university This inclded all the normal parts of a computer, such as CPU, GPU, HDD, SSD, etc. This also included the startup software, such as setting up Windows 11.</p>",
        gif: "Images/Projects/rrsmun.png", 
        skillsUsed: ["Public Speaking", "Research", "Leadership", "Team Management", "Politics", "Event Planning", "Event Planning"], 
        date: "October 2022",
        skills: `<h3>Key Responsibilities & Achievements</h3>
                 <ul>
                    <li>Acted as a President of General Assembly, working with over a dozen other students to host hundreds of students from international origins over the course of 5 days.</li>
                    <li>Extensive research regarding topics, team management, as well as other administrative tasks were the bulk of my responsibilities.</li>
                 </ul>`,
    },
    'ncProject2': {
        id: 'ncProject2',
        title: "Custom Computer",
        tagline: "Built my own computer from home with typical parts.",
        description: "<p>Built my own computer with a few friends during my first year at university This inclded all the normal parts of a computer, such as CPU, GPU, HDD, SSD, etc. This also included the startup software, such as setting up Windows 11.</p>",
        gif: "Images/Projects/placeholder.png", 
        skillsUsed: ["Teamwork", "Research", "Hardware Development"], 
        date: "February 2024",
        skills: `<h3>Key Responsibilities & Achievements</h3>
                 <ul>
                    <li>Worked with a few friends to create my own computer from scratch.</li>
                    <li>Conducted research regarding what parts worked well effectively, what parts were worth their price, etc.</li>
                 </ul>`,
    },
    'ncProject3': {
        id: 'ncProject3',
        title: "Second Custom Computer",
        tagline: "Built my own computer from home with high-end parts.",
        description: "<p>Built a second computer, this time solo, as well as with high-end parts to allow for gaming and video editing.</p>",
        gif: "Images/Projects/placeholder.png",
        skillsUsed: ["Research", "Hardware Development"],
        date: "November 2025",
        skills: `<h3>Key Responsibilities & Achievements</h3>
                    <ul>
                        <li>Researched high-end parts to ensure compatibility and performance for gaming and video editing.</li>
                        <li>Successfully assembled the computer solo, demonstrating technical proficiency and problem-solving skills.</li>
                    </ul>`,
    }
    // Add new non-coding projects here
};