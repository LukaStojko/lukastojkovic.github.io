// Get project ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

// YouTube ID extraction function
function extractYouTubeId(url) {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
        /youtube\.com\/watch\?v=([^&]+)/,           // youtube.com/watch?v=ID
        /youtube\.com\/embed\/([^?]+)/,            // youtube.com/embed/ID
        /youtu\.be\/([^?]+)/,                     // youtu.be/ID
        /youtube\.com\/v\/([^?]+)/                  // youtube.com/v/ID
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

// Load project data
Promise.all([
    fetch("content.json").then(response => response.json()),
    fetch("projects.json").then(response => response.json()),
    fetch("config.json").then(response => response.json())
])
.then(([content, projects, config]) => {
    
    // Find the project by ID
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        document.querySelector('.container').innerHTML = `
            <div class="error-message">
                <h2>Project Not Found</h2>
                <p>The requested project could not be found.</p>
                <a href="index.html" class="back-link">← Back to Portfolio</a>
            </div>
        `;
        return;
    }
    
    // Set page title and favicon
    document.getElementById("page-title").textContent = `${project.title} - ${content.meta.pageTitle}`;
    if (content.meta.favicon) {
        document.getElementById("favicon").href = content.meta.favicon;
    }
    
    // Set project header
    document.getElementById("project-title").textContent = project.title;
    document.getElementById("project-subtitle").textContent = project.subtitle || project.description;
    
    // Set project image
    const projectImage = document.getElementById("project-image");
    if (project.image) {
        projectImage.src = project.image;
        projectImage.alt = project.title;
    } else if (project.thumbnail) {
        projectImage.src = project.thumbnail;
        projectImage.alt = project.title;
    }
    
    // Apply dynamic image sizing from configuration
    // Use project-specific sizing first, then global fallback
    const imageConfig = project.imageSize || content.projectPage?.images?.hero;
    if (imageConfig) {
        if (imageConfig.width) projectImage.style.width = imageConfig.width;
        if (imageConfig.maxWidth) projectImage.style.maxWidth = imageConfig.maxWidth;
        if (imageConfig.height) projectImage.style.height = imageConfig.height;
    }
    
    // Set tech tags
    const techTagsContainer = document.getElementById("project-tech-tags");
    if (project.technologies && project.technologies.length > 0) {
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        techTagsContainer.innerHTML = techTags;
    }
    
    // Set description
    document.getElementById("description-title").textContent = content.projectPage?.descriptionTitle || "About This Project";
    const descriptionText = project.fullDescription || project.description;
    
    // Handle paragraph breaks properly
    const formattedDescription = descriptionText.replace(/\n\n/g, '<br><br>');
    document.getElementById("project-description-content").innerHTML = formattedDescription;
    
    // Set gallery images
    if (project.images && project.images.length > 0) {
        document.getElementById("gallery-title").textContent = content.projectPage?.galleryTitle || "Project Gallery";
        const galleryItems = project.images.map(media => {
            if (media.type === 'youtube' || (media.src && media.src.includes('youtube.com'))) {
                // Extract YouTube video ID
                const videoId = extractYouTubeId(media.src);
                if (videoId) {
                    return `
                        <div class="gallery-item gallery-video">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}" 
                                title="${media.caption || 'Project video'}"
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                loading="lazy">
                            </iframe>
                            <div class="caption">${media.caption || ''}</div>
                        </div>
                    `;
                }
            } else if (media.type === 'video' || media.src.endsWith('.mp4') || media.src.endsWith('.webm') || media.src.endsWith('.ogg')) {
                return `
                    <div class="gallery-item gallery-video">
                        <video src="${media.src}" alt="${media.caption || 'Project video'}" controls loading="lazy">
                            Your browser does not support the video tag.
                        </video>
                        <div class="caption">${media.caption || ''}</div>
                    </div>
                `;
            } else {
                return `
                    <div class="gallery-item">
                        <img src="${media.src}" alt="${media.caption || 'Project image'}" loading="lazy">
                        <div class="caption">${media.caption || ''}</div>
                    </div>
                `;
            }
        }).join('');
        document.getElementById("gallery-container").innerHTML = galleryItems;
    } else {
        document.getElementById("project-gallery").style.display = 'none';
    }
    
    // Set features
    if (project.features && project.features.length > 0) {
        document.getElementById("features-title").textContent = content.projectPage?.featuresTitle || "Key Features";
        const featuresList = project.features.map(feature => `
            <div class="feature-item">
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
            </div>
        `).join('');
        document.getElementById("features-list").innerHTML = featuresList;
    } else {
        document.getElementById("project-features").style.display = 'none';
    }
    
    // Set technologies
    if (project.technologies && project.technologies.length > 0) {
        document.getElementById("technologies-title").textContent = content.projectPage?.technologiesTitle || "Technologies Used";
        const techList = project.technologies.map(tech => `
            <div class="technology-item">
                <h4>${tech}</h4>
            </div>
        `).join('');
        document.getElementById("technologies-list").innerHTML = techList;
    } else {
        document.getElementById("project-technologies").style.display = 'none';
    }
    
    // Set links
    const links = [];
    if (project.link) {
        links.push({
            icon: "🔗",
            text: "View Project",
            description: "Visit the live project or repository",
            url: project.link
        });
    }
    // if (project.demo) {
    //     links.push({
    //         icon: "🎮",
    //         text: "Play Demo",
    //         description: "Try the interactive demo",
    //         url: project.demo
    //     });
    // }
    // if (project.download) {
    //     links.push({
    //         icon: "⬇️",
    //         text: "Download",
    //         description: "Get the latest version",
    //         url: project.download
    //     });
    // }
    // if (project.sourceCode) {
    //     links.push({
    //         icon: "💻",
    //         text: "Source Code",
    //         description: "View the source code on GitHub",
    //         url: project.sourceCode
    //     });
    // }
    
    if (links.length > 0) {
        document.getElementById("links-title").textContent = content.projectPage?.linksTitle || "Project Links";
        const linksList = links.map(link => `
            <a href="${link.url}" target="_blank" class="project-link-item">
                <div class="link-icon">${link.icon}</div>
                <div class="link-text">
                    <div>${link.text}</div>
                    <div class="link-description">${link.description}</div>
                </div>
            </a>
        `).join('');
        document.getElementById("project-links-container").innerHTML = linksList;
    } else {
        document.getElementById("project-links").style.display = 'none';
    }
    
    // Set footer
    const year = new Date().getFullYear();
    document.getElementById("footer").textContent = `© ${year} ${config.name} | ${config.footerTitle}`;
    
})
.catch(error => {
    console.error('Error loading project:', error);
    document.querySelector('.container').innerHTML = `
        <div class="error-message">
            <h2>Error Loading Project</h2>
            <p>There was an error loading the project data.</p>
            <a href="index.html" class="back-link">← Back to Portfolio</a>
        </div>
    `;
});
