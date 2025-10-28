// Main JavaScript for user-facing page

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize data if not exists
    if (!localStorage.getItem('festivePosters')) {
        loadSampleData();
    }
    
    renderPosters();
    renderTemplates();
    setupEventListeners();
}

// Load sample data
function loadSampleData() {
    const samplePosters = [
        {
            id: 1,
            title: "Christmas Celebration",
            category: "christmas",
            imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            fileUrl: "#",
            downloads: 124,
            dateAdded: "2023-11-15",
            type: "poster"
        },
        {
            id: 2,
            title: "Diwali Lights",
            category: "diwali",
            imageUrl: "https://images.unsplash.com/photo-1603398938373-e54da0c5dfde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            fileUrl: "#",
            downloads: 98,
            dateAdded: "2023-10-20",
            type: "poster"
        },
        {
            id: 3,
            title: "Eid Mubarak",
            category: "eid",
            imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            fileUrl: "#",
            downloads: 87,
            dateAdded: "2023-04-10",
            type: "poster"
        }
    ];

    const sampleTemplates = [
        {
            id: 1,
            title: "Christmas Poster Template",
            category: "christmas",
            format: "psd",
            imageUrl: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            fileUrl: "#",
            downloads: 76,
            dateAdded: "2023-11-10",
            type: "template"
        },
        {
            id: 2,
            title: "New Year Template",
            category: "newyear",
            format: "png",
            imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            fileUrl: "#",
            downloads: 65,
            dateAdded: "2023-12-20",
            type: "template"
        },
        {
            id: 3,
            title: "Eid Celebration Template",
            category: "eid",
            format: "psd",
            imageUrl: "https://images.unsplash.com/photo-1516475429286-46512e87b832?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            fileUrl: "#",
            downloads: 54,
            dateAdded: "2023-04-05",
            type: "template"
        }
    ];

    localStorage.setItem('festivePosters', JSON.stringify(samplePosters));
    localStorage.setItem('festiveTemplates', JSON.stringify(sampleTemplates));
}

// Render posters to the gallery
function renderPosters(filter = 'all') {
    const gallery = document.getElementById('postersGallery');
    const posters = JSON.parse(localStorage.getItem('festivePosters')) || [];
    
    const filteredPosters = filter === 'all' 
        ? posters 
        : posters.filter(poster => poster.category === filter);
    
    if (filteredPosters.length === 0) {
        gallery.innerHTML = '<div class="no-items"><p>No posters found</p></div>';
        return;
    }
    
    gallery.innerHTML = filteredPosters.map(poster => {
        let imgSrc = poster.imageUrl;
        let imgType = 'JPG';
        if (imgSrc && imgSrc.startsWith('data:')) {
            const match = imgSrc.match(/^data:([^;]+);/);
            if (match) {
                const mime = match[1];
                if (mime.includes('png')) imgType = 'PNG';
                else if (mime.includes('jpeg')) imgType = 'JPG';
                else if (mime.includes('psd')) imgType = 'PSD';
                else if (mime.includes('ai')) imgType = 'AI';
            }
        }
        return `
        <div class="card" data-id="${poster.id}">
            <img src="${imgSrc}" alt="${poster.title}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${poster.title}</h3>
                <div class="card-meta">
                    <span><i class="far fa-file-image"></i> ${imgType}</span>
                    <span><i class="far fa-calendar"></i> ${formatDate(poster.dateAdded)}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary download-btn" data-type="poster" data-id="${poster.id}">
                        <i class="fas fa-download"></i> Download (${poster.downloads})
                    </button>
                    <button class="btn btn-secondary favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Render templates to the gallery
function renderTemplates(filter = 'all') {
    const gallery = document.getElementById('templatesGallery');
    const templates = JSON.parse(localStorage.getItem('festiveTemplates')) || [];
    
    const filteredTemplates = filter === 'all' 
        ? templates 
        : templates.filter(template => 
            filter === 'psd' || filter === 'ai' || filter === 'canva' 
            ? template.format === filter 
            : template.category === filter
        );
    
    if (filteredTemplates.length === 0) {
        gallery.innerHTML = '<div class="no-items"><p>No templates found</p></div>';
        return;
    }
    
    gallery.innerHTML = filteredTemplates.map(template => {
        let imgSrc = template.imageUrl;
        let imgType = template.format ? template.format.toUpperCase() : 'FILE';
        if (imgSrc && imgSrc.startsWith('data:')) {
            const match = imgSrc.match(/^data:([^;]+);/);
            if (match) {
                const mime = match[1];
                if (mime.includes('png')) imgType = 'PNG';
                else if (mime.includes('jpeg')) imgType = 'JPG';
                else if (mime.includes('psd')) imgType = 'PSD';
                else if (mime.includes('ai')) imgType = 'AI';
            }
        }
        return `
        <div class="card" data-id="${template.id}">
            <img src="${imgSrc}" alt="${template.title}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${template.title}</h3>
                <div class="card-meta">
                    <span><i class="far fa-file-alt"></i> ${imgType}</span>
                    <span><i class="far fa-calendar"></i> ${formatDate(template.dateAdded)}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary download-btn" data-type="template" data-id="${template.id}">
                        <i class="fas fa-download"></i> Download (${template.downloads})
                    </button>
                    <button class="btn btn-secondary favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const section = this.closest('.container').id;
            
            // Update active state
            document.querySelectorAll(`.${section} .filter-btn`).forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            if (section === 'posters') {
                renderPosters(filter);
            } else if (section === 'templates') {
                renderTemplates(filter);
            }
        });
    });
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    // Download buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.download-btn')) {
            const btn = e.target.closest('.download-btn');
            const type = btn.getAttribute('data-type');
            const id = parseInt(btn.getAttribute('data-id'));
            initiateDownload(type, id);
        }
        
        // Favorite buttons
        if (e.target.closest('.favorite-btn')) {
            const btn = e.target.closest('.favorite-btn');
            toggleFavorite(btn);
        }
        
        // Category links in footer
        if (e.target.closest('.footer-links a[data-filter]')) {
            e.preventDefault();
            const filter = e.target.closest('a').getAttribute('data-filter');
            // Find and click the corresponding filter button
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
            if (filterBtn) {
                filterBtn.click();
                // Scroll to the section
                document.getElementById('posters').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Modal controls
    const modal = document.getElementById('downloadModal');
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    document.getElementById('confirmDownload').addEventListener('click', confirmDownload);
    document.getElementById('cancelDownload').addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Perform search
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (query === '') {
        renderPosters();
        renderTemplates();
        return;
    }
    
    const posters = JSON.parse(localStorage.getItem('festivePosters')) || [];
    const templates = JSON.parse(localStorage.getItem('festiveTemplates')) || [];
    
    // Filter posters
    const filteredPosters = posters.filter(poster => 
        poster.title.toLowerCase().includes(query) || 
        poster.category.toLowerCase().includes(query)
    );
    
    // Filter templates
    const filteredTemplates = templates.filter(template => 
        template.title.toLowerCase().includes(query) || 
        template.category.toLowerCase().includes(query) ||
        template.format.toLowerCase().includes(query)
    );
    
    // Update galleries
    renderSearchResults('postersGallery', filteredPosters, 'poster');
    renderSearchResults('templatesGallery', filteredTemplates, 'template');
}

function renderSearchResults(galleryId, items, type) {
    const gallery = document.getElementById(galleryId);
    
    if (items.length === 0) {
        gallery.innerHTML = `<div class="no-items"><p>No ${type}s found matching your search</p></div>`;
        return;
    }
    
    gallery.innerHTML = items.map(item => `
        <div class="card" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.title}" class="card-img">
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta">
                    <span><i class="far fa-file-${type === 'poster' ? 'image' : 'alt'}"></i> ${type === 'poster' ? 'JPG' : item.format.toUpperCase()}</span>
                    <span><i class="far fa-calendar"></i> ${formatDate(item.dateAdded)}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary download-btn" data-type="${type}" data-id="${item.id}">
                        <i class="fas fa-download"></i> Download (${item.downloads})
                    </button>
                    <button class="btn btn-secondary favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initiate download process
function initiateDownload(type, id) {
    const modal = document.getElementById('downloadModal');
    const items = type === 'poster' 
        ? JSON.parse(localStorage.getItem('festivePosters')) || []
        : JSON.parse(localStorage.getItem('festiveTemplates')) || [];
    
    const item = items.find(item => item.id === id);
    
    if (item) {
        document.getElementById('modalMessage').textContent = 
            `You are about to download "${item.title}".`;
        
        // Store the download info for confirmation
        modal.setAttribute('data-download-type', type);
        modal.setAttribute('data-download-id', id);
        
        modal.classList.add('active');
    }
}

// Confirm and process download
function confirmDownload() {
    const modal = document.getElementById('downloadModal');
    const type = modal.getAttribute('data-download-type');
    const id = parseInt(modal.getAttribute('data-download-id'));
    
    if (type && id) {
        let items, storageKey;
        if (type === 'poster') {
            storageKey = 'festivePosters';
            items = JSON.parse(localStorage.getItem(storageKey)) || [];
        } else {
            storageKey = 'festiveTemplates';
            items = JSON.parse(localStorage.getItem(storageKey)) || [];
        }
        const itemIndex = items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            // Update download count
            items[itemIndex].downloads++;
            localStorage.setItem(storageKey, JSON.stringify(items));
            // Update the button text
            updateDownloadButton(type, id, items[itemIndex].downloads);
            // Actually trigger file download if fileUrl exists
            const fileUrl = items[itemIndex].fileUrl;
            if (fileUrl && fileUrl !== "#") {
                // If base64, try to get file extension from data URL
                let ext = 'file';
                if (fileUrl.startsWith('data:')) {
                    const match = fileUrl.match(/^data:([^;]+);/);
                    if (match) {
                        const mime = match[1];
                        if (mime.includes('png')) ext = 'png';
                        else if (mime.includes('jpeg')) ext = 'jpg';
                        else if (mime.includes('pdf')) ext = 'pdf';
                        else if (mime.includes('psd')) ext = 'psd';
                        else if (mime.includes('ai')) ext = 'ai';
                        else if (mime.includes('svg')) ext = 'svg';
                        else if (mime.includes('zip')) ext = 'zip';
                        else ext = mime.split('/')[1] || 'file';
                    }
                }
                const a = document.createElement('a');
                a.href = fileUrl;
                a.download = (items[itemIndex].title || 'download') + '.' + ext;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showNotification('Download started!');
            } else {
                showNotification('No file available for download.');
            }
            modal.classList.remove('active');
            document.getElementById('modalMessage').textContent = 'Your download will start shortly...';
        }
    }
}

// Update download button count
function updateDownloadButton(type, id, count) {
    const btn = document.querySelector(`.download-btn[data-type="${type}"][data-id="${id}"]`);
    if (btn) {
        btn.innerHTML = `<i class="fas fa-download"></i> Download (${count})`;
    }
}

// Toggle favorite state
function toggleFavorite(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#ec4899';
        showNotification('Added to favorites!');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
        showNotification('Removed from favorites!');
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for no-items
const style = document.createElement('style');
style.textContent = `
    .no-items {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--gray);
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);