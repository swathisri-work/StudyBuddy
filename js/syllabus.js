// js/syllabus.js

const syllabus = {
    render: function() {
        if (!app.activeProfile) return;
        
        const container = document.getElementById('syllabus-container');
        const sylData = appConfig.syllabus[app.activeProfile];
        
        if (!sylData) {
            container.innerHTML = '<p class="empty-state">No syllabus data found for this profile.</p>';
            return;
        }

        let html = '';
        sylData.forEach((unit, uIdx) => {
            html += `
                <div class="syllabus-unit card">
                    <h4 onclick="syllabus.toggleUnit('unit-${uIdx}')">
                        <i class="fa-solid fa-chevron-down"></i> ${unit.unit}
                    </h4>
                    <ul id="unit-${uIdx}" class="syllabus-topics" style="display: none;">
            `;
            unit.topics.forEach(topic => {
                html += `<li>${topic}</li>`;
            });
            html += `
                    </ul>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },

    toggleUnit: function(unitId) {
        const el = document.getElementById(unitId);
        if (el.style.display === 'none') {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    }
};
