// Admin JavaScript - Simplified and Fixed

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    loadAdminData();
    setupAdminEventListeners();
    updateAdminStats();
    showSection('posters');
}

function loadAdminData() {
    renderPostersList();
    renderTemplatesList();
}

function setupAdminEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Item type change
    document.getElementById('itemType').addEventListener('change', function() {
        const formatGroup = document.getElementById('formatGroup');
        const fileUploadText = document.getElementById('fileUploadText');
        
        if (this.value === 'template') {
            formatGroup.style.display = 'block';
            fileUploadText.textContent = 'Click to upload template file (PSD, AI, PNG, etc.)';
        } else {
            formatGroup.style.display = 'none';
            fileUploadText.textContent = 'Click to upload poster file (JPG, PNG)';
        }
    });
    
    // File upload areas
    document.getElementById('imageUpload').addEventListener('click', function() {
        document.getElementById('itemImage').click();
    });
    
    document.getElementById('fileUpload').addEventListener('click', function() {
        document.getElementById('itemFile').click();
    });
    
    // Form submission
    document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);
}

function showSection(section) {
    // Hide all sections
    document.getElementById('postersSection').style.display = 'none';
    document.getElementById('templatesSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'none';
    
    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';
}

function renderPostersList() {
    const container = document.getElementById('postersList');
    const posters = JSON.parse(localStorage.getItem('festivePosters')) || [];
    
    if (posters.length === 0) {
        container.innerHTML = '<p>No posters found. Upload some posters to get started.</p>';
        return;
    }
    
    container.innerHTML = posters.map(poster => `
        <div class="item-card">
            <img src="${poster.imageUrl}" alt="${poster.title}">
            <div class="item-info">
                <h4>${poster.title}</h4>
                <p>Category: ${poster.category} | Downloads: ${poster.downloads}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteItem('poster', ${poster.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function renderTemplatesList() {
    const container = document.getElementById('templatesList');
    const templates = JSON.parse(localStorage.getItem('festiveTemplates')) || [];
    
    if (templates.length === 0) {
        container.innerHTML = '<p>No templates found. Upload some templates to get started.</p>';
        return;
    }
    
    container.innerHTML = templates.map(template => `
        <div class="item-card">
            <img src="${template.imageUrl}" alt="${template.title}">
            <div class="item-info">
                <h4>${template.title}</h4>
                <p>Category: ${template.category} | Format: ${template.format} | Downloads: ${template.downloads}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm" onclick="deleteItem('template', ${template.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const itemType = document.getElementById('itemType').value;
    const title = document.getElementById('itemTitle').value;
    const category = document.getElementById('itemCategory').value;
    const imageFile = document.getElementById('itemImage').files[0];
    const file = document.getElementById('itemFile').files[0];
    if (!itemType || !title || !imageFile || !file) {
        showNotification('Please fill in all fields and select both image and file.');
        return;
    }
    // Read files as Base64 and store in localStorage
    const reader1 = new FileReader();
    const reader2 = new FileReader();
    reader1.onload = function(e1) {
        const imageBase64 = e1.target.result;
        reader2.onload = function(e2) {
            const fileBase64 = e2.target.result;
            const newItem = {
                id: Date.now(),
                title: title,
                category: category,
                imageUrl: imageBase64,
                fileUrl: fileBase64,
                downloads: 0,
                dateAdded: new Date().toISOString().split('T')[0],
                type: itemType
            };
            if (itemType === 'template') {
                newItem.format = document.getElementById('itemFormat').value;
            }
            if (itemType === 'poster') {
                const posters = JSON.parse(localStorage.getItem('festivePosters')) || [];
                posters.push(newItem);
                localStorage.setItem('festivePosters', JSON.stringify(posters));
            } else {
                const templates = JSON.parse(localStorage.getItem('festiveTemplates')) || [];
                templates.push(newItem);
                localStorage.setItem('festiveTemplates', JSON.stringify(templates));
            }
            document.getElementById('uploadForm').reset();
            document.getElementById('formatGroup').style.display = 'none';
            showNotification(`${itemType === 'poster' ? 'Poster' : 'Template'} added successfully!`);
            loadAdminData();
            updateAdminStats();
        };
        reader2.readAsDataURL(file);
    };
    reader1.readAsDataURL(imageFile);
}

// Show notification (copied from main.js for consistency)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success, #22c55e);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
function deleteItem(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
        return;
    }
    
    let items, storageKey;
    
    if (type === 'poster') {
        storageKey = 'festivePosters';
        items = JSON.parse(localStorage.getItem(storageKey)) || [];
    } else {
        storageKey = 'festiveTemplates';
        items = JSON.parse(localStorage.getItem(storageKey)) || [];
    }
    
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filteredItems));
    
    // Reload data
    loadAdminData();
    updateAdminStats();
    
    alert(`${type} deleted successfully!`);
}

function updateAdminStats() {
    const posters = JSON.parse(localStorage.getItem('festivePosters')) || [];
    const templates = JSON.parse(localStorage.getItem('festiveTemplates')) || [];
    
    document.getElementById('postersCount').textContent = posters.length;
    document.getElementById('templatesCount').textContent = templates.length;
    
    const totalDownloads = posters.reduce((sum, poster) => sum + poster.downloads, 0) +
                         templates.reduce((sum, template) => sum + template.downloads, 0);
    document.getElementById('downloadsCount').textContent = totalDownloads;
}