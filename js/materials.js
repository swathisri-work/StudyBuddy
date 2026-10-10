// js/materials.js

const materials = {
    render: function() {
        if (!app.activeProfile) return;
        
        const container = document.getElementById('materials-container');
        const mats = appConfig.materials[app.activeProfile];
        
        if (!mats || mats.length === 0) {
            container.innerHTML = '<p class="empty-state">No study materials available for this examination yet.</p>';
            return;
        }

        let html = '';
        mats.forEach(m => {
            // Check if valid reference
            html += `
                <a href="${m.path}" target="_blank" class="material-card">
                    <i class="fa-solid fa-file-pdf"></i>
                    <div>
                        <h4>${m.title}</h4>
                        <span class="text-muted" style="font-size:14px">Click to open</span>
                    </div>
                </a>
            `;
        });
        
        container.innerHTML = html;
    }
};
