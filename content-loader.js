// Content Loader - Dynamically loads page content after authentication
// This prevents content from being visible in page source (Ctrl+U)

function loadContent(pageName) {
    const mainContent = document.getElementById("main-content");
    
    // Define content based on page
    let contentHTML = '';
    
    switch(pageName) {
        case 'index':
            // Load index content from external file
            fetch('/content-index.html')
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    // Reinitialize scripts after content is loaded
                    initializeIndexScripts();
                })
                .catch(error => {
                    console.error('Error loading content:', error);
                    mainContent.innerHTML = '<p style="text-align: center; padding: 2rem;">Error loading content. Please refresh the page.</p>';
                });
            break;
            
        case 'about-me':
            if (window.aboutMeContent) {
                mainContent.innerHTML = window.aboutMeContent;
            }
            break;
            
        case 'contact':
            if (window.contactContent) {
                mainContent.innerHTML = window.contactContent;
            }
            break;
            
        case 'past-works':
            if (window.pastWorksContent) {
                mainContent.innerHTML = window.pastWorksContent;
            }
            break;
            
        default:
            mainContent.innerHTML = '<p>Content not found</p>';
    }
}

// Initialize scripts for index page after dynamic load
function initializeIndexScripts() {
    // This function will be populated with necessary script initializations
    // for the index page's interactive features
}

// Make loadContent available globally
window.loadContent = loadContent;
