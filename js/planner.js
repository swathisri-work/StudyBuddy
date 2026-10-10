// js/planner.js

const planner = {
    render: function() {
        if (!app.activeProfile) return;
        
        const tasks = storage.getTasks();
        // Sort by date sort of (very basic)
        tasks.sort((a,b) => new Date(a.date) - new Date(b.date));
        
        const container = document.getElementById('planner-tasks-container');
        if (tasks.length === 0) {
            container.innerHTML = '<li class="empty-state">No upcoming tasks. Add one!</li>';
            return;
        }

        let html = '';
        tasks.forEach((t, idx) => {
            html += `
                <li style="display:flex; justify-content:space-between; align-items:center;">
                    <label style="text-decoration: ${t.completed ? 'line-through' : 'none'}; cursor:pointer; color: ${t.completed ? 'var(--clr-gray-600)' : 'inherit'}">
                        <input type="checkbox" onchange="planner.toggleTask(${idx})" ${t.completed ? 'checked' : ''}>
                        <span style="margin-left:10px;">${t.desc}</span>
                        <br>
                        <span style="font-size:12px; margin-left:30px;" class="text-muted"><i class="fa-regular fa-calendar"></i> ${t.date}</span>
                    </label>
                    <button class="btn btn-sm" onclick="planner.deleteTask(${idx})" style="background:none; color:var(--clr-danger);"><i class="fa-solid fa-trash"></i></button>
                </li>
            `;
        });
        container.innerHTML = html;
        
        // Also update dashboard tasks if we are actively modifying them
        if (document.getElementById('view-dashboard').style.display !== 'none') {
            dashboard.render();
        }
    },

    addTask: function() {
        const descInput = document.getElementById('planner-task-desc');
        const dateInput = document.getElementById('planner-task-date');
        
        if (!descInput.value.trim() || !dateInput.value) {
            alert('Please enter task description and select a date.');
            return;
        }

        const tasks = storage.getTasks();
        tasks.push({
            desc: descInput.value.trim(),
            date: dateInput.value,
            completed: false
        });
        
        storage.saveTasks(tasks);
        descInput.value = '';
        dateInput.value = '';
        
        this.render();
    },

    toggleTask: function(idx) {
        const tasks = storage.getTasks();
        if (tasks[idx]) {
            tasks[idx].completed = !tasks[idx].completed;
            storage.saveTasks(tasks);
            this.render();
        }
    },

    deleteTask: function(idx) {
        if(confirm('Delete this task?')) {
            const tasks = storage.getTasks();
            tasks.splice(idx, 1);
            storage.saveTasks(tasks);
            this.render();
        }
    }
};
