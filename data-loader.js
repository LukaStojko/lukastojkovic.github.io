// Load site config
fetch("config.json")
  .then(response => response.json())
  .then(data => {

    document.getElementById("name").textContent = data.name;
    document.getElementById("email").textContent = data.email;
    document.getElementById("title").textContent = data.title;

    // Set profile image
    const profileImage = document.getElementById("profile-image");
    if (data.profileImage) {
      if (typeof data.profileImage === 'string') {
        // Backward compatibility
        profileImage.src = data.profileImage;
      } else {
        // New configuration object
        profileImage.src = data.profileImage.src;
        
        // Apply positioning
        const profileContainer = document.querySelector('.profile-container');
        const headerText = document.querySelector('.header-text');
        
        if (data.profileImage.position === 'right') {
          profileContainer.style.flexDirection = 'row-reverse';
          headerText.style.textAlign = 'right';
        } else if (data.profileImage.position === 'center') {
          profileContainer.style.flexDirection = 'column';
          headerText.style.textAlign = 'center';
        } else {
          // Default: left
          profileContainer.style.flexDirection = 'row';
          headerText.style.textAlign = 'left';
        }
        
        // Apply size
        const sizes = {
          'small': '100px',
          'medium': '150px',
          'large': '200px',
          'xlarge': '250px'
        };
        profileImage.style.width = sizes[data.profileImage.size] || '150px';
        profileImage.style.height = sizes[data.profileImage.size] || '150px';
        
        // Apply border width
        if (data.profileImage.borderWidth) {
          profileImage.style.borderWidth = data.profileImage.borderWidth;
        }
        
        // Apply shadow
        const shadows = {
          'none': 'none',
          'subtle': '0 2px 10px rgba(0,0,0,0.3)',
          'glow': '0 0 20px rgba(255, 107, 107, 0.5)',
          'strong': '0 0 30px rgba(255, 107, 107, 0.8)'
        };
        profileImage.style.boxShadow = shadows[data.profileImage.shadow] || '0 0 20px rgba(255, 107, 107, 0.5)';
        
        // Apply object position (for centering face within circle)
        if (data.profileImage.objectPosition) {
          profileImage.style.objectPosition = data.profileImage.objectPosition;
        }
        
        // Apply scale (for zooming in/out)
        if (data.profileImage.scale) {
          profileImage.style.transform = `scale(${data.profileImage.scale})`;
        }
      }
    }

    const githubLink = document.getElementById("github");
    githubLink.textContent = data.links.github;
    githubLink.href = data.github;

    const linkedinLink = document.getElementById("linkedin");
    linkedinLink.textContent = data.links.linkedin;
    linkedinLink.href = data.linkedin;

    const itchLink = document.getElementById("itchio");
    itchLink.textContent = data.links.itchio;
    itchLink.href = data.itchio;

    const year = new Date().getFullYear();
    document.getElementById("footer").textContent = "©" + " " + year + " " + data.name + " | " + data.footerTitle;

  });


// Load content
fetch("content.json")
  .then(response => response.json())
  .then(content => {

    // Set page title
    document.getElementById("page-title").textContent = content.meta.pageTitle;
    
    // Set favicon with debugging
    if (content.meta.favicon) {
      console.log("Setting favicon to:", content.meta.favicon);
      const faviconElement = document.getElementById("favicon");
      const faviconShortcutElement = document.getElementById("favicon-shortcut");
      
      faviconElement.href = content.meta.favicon;
      faviconShortcutElement.href = content.meta.favicon;
      
      console.log("Favicon element href set to:", faviconElement.href);
      console.log("Favicon shortcut href set to:", faviconShortcutElement.href);
      
      // Force favicon refresh by adding timestamp
      const timestamp = new Date().getTime();
      const faviconWithTimestamp = content.meta.favicon + '?v=' + timestamp;
      faviconElement.href = faviconWithTimestamp;
      faviconShortcutElement.href = faviconWithTimestamp;
      
      console.log("Favicon with timestamp:", faviconWithTimestamp);
    } else {
      console.log("No favicon specified in content.json");
    }

    // Set navigation
    document.getElementById("nav-about").textContent = content.navigation.about;
    document.getElementById("nav-projects").textContent = content.navigation.projects;
    document.getElementById("nav-contact").textContent = content.navigation.contact;

    // Set section titles and content
    document.getElementById("about-title").textContent = content.sections.about.title;
    document.getElementById("about-content").textContent = content.sections.about.content;
    
    document.getElementById("projects-title").textContent = content.sections.projects.title;
    document.getElementById("contact-title").textContent = content.sections.contact.title;

    // Set section alignments
    if (content.sections.about.alignment) {
      document.getElementById("about").style.textAlign = content.sections.about.alignment;
    }
    
    if (content.sections.projects.alignment) {
      document.getElementById("projects").style.textAlign = content.sections.projects.alignment;
    }
    
    if (content.sections.contact.alignment) {
      document.getElementById("contact").style.textAlign = content.sections.contact.alignment;
    }
    
    // Set contact section font size
    if (content.sections.contact.fontSize) {
      const fontSizes = {
        'small': '14px',
        'medium': '16px', 
        'large': '18px',
        'xlarge': '20px',
        'xxlarge': '24px'
      };
      const contactSection = document.getElementById("contact");
      contactSection.style.fontSize = fontSizes[content.sections.contact.fontSize] || '16px';
    }

    // Set contact labels
    document.getElementById("email-label").textContent = content.sections.contact.labels.email;
    document.getElementById("github-label").textContent = content.sections.contact.labels.github;
    document.getElementById("linkedin-label").textContent = content.sections.contact.labels.linkedin;
    document.getElementById("itchio-label").textContent = content.sections.contact.labels.itchio;

  });


// Load projects
fetch("config.json")
  .then(response => response.json())
  .then(config => {
    return fetch("content.json")
      .then(response => response.json())
      .then(content => {
        return fetch("projects.json")
          .then(response => response.json())
          .then(projects => ({ config, content, projects }));
      });
  })
  .then(({ config, content, projects }) => {

    const container = document.getElementById("projects-container");

    projects.forEach(project => {

      const card = document.createElement("div");
      card.className = project.highlight ? "project highlighted" : "project";

      const techTags = project.technologies ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : '';
      const thumbnail = project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail">` : '';
      const highlightBadge = project.highlight ? `<div class="project-highlight"><img src="${config.highlightIcon}" alt="Highlighted Project"></div>` : '';

      card.innerHTML = `
        ${thumbnail}
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          ${techTags ? `<div class="tech-tags">${techTags}</div>` : ''}
          <a href="project.html?id=${project.id || project.title.replace(/\s+/g, '-').toLowerCase()}" class="view-project-btn">${content.projectCard.viewButton}</a>
        </div>
        ${highlightBadge}
      `;

      container.appendChild(card);

    });

  });