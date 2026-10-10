// js/dashboard.js

const dashboard = {
    render: async function() {
        if (!app.activeProfile) return;

        let prog = storage.getProgress();
        let partner = {};
        try {
            const data = await api.getDashboard();
            partner = data.partner || {};
            this.checkReminders();
        } catch (e) { /* The local study tools remain usable without the optional API. */ }
        document.getElementById('stat-streak').innerText = `${prog.streak || 0} Days`;
        const accuracy = prog.attempted ? Math.round(prog.correct / prog.attempted * 100) : 0;
        document.getElementById('stat-accuracy').innerText = `${accuracy}%`;
        document.getElementById('stat-questions').innerText = `${prog.attempted || 0} Attempted`;
        this.renderTasks();
        this.renderActivity(prog);
        this.renderPartnerStats(partner);
    },

    renderTasks: function() {
        // We haven't migrated tasks to DB, keep local storage for tasks
        const tasksList = document.getElementById('dash-tasks-list');
        const tasks = storage.getTasks();
        const today = new Date().toISOString().split('T')[0];
        
        const todayTasks = tasks.filter(t => t.date === today);
        
        if (todayTasks.length === 0) {
            tasksList.innerHTML = '<li class="empty-state">No tasks for today. Add one in the planner!</li>';
            return;
        }

        tasksList.innerHTML = '';
        todayTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="task-desc ${task.completed ? 'completed' : ''}">
                    <i class="fa-${task.completed ? 'solid' : 'regular'} fa-circle-check"></i>
                    ${task.desc}
                </div>
            `;
            tasksList.appendChild(li);
        });
    },

    renderActivity: function(prog) {
        const activityList = document.getElementById('dash-activity-list');
        
        if (prog.attempted === 0) {
            activityList.innerHTML = '<li class="empty-state">Start your first practice session to see your progress.</li>';
            return;
        }

        activityList.innerHTML = `
            <li>
                <div class="activity-icon"><i class="fa-solid fa-pen"></i></div>
                <div class="activity-details">
                    <p><strong>Practice Session Completed</strong></p>
                    <p class="activity-meta">Tests Taken: ${prog.tests_taken || 0}</p>
                </div>
            </li>
            <li>
                <div class="activity-icon"><i class="fa-solid fa-calendar-check"></i></div>
                <div class="activity-details">
                    <p><strong>Last Active</strong></p>
                    <p class="activity-meta">${prog.last_activity || 'Today'}</p>
                </div>
            </li>
        `;
    },

    renderPartnerStats: function(partner) {
        const container = document.getElementById('partner-stats-container');
        if (!container) return;
        
        const partnerName = app.activeProfile === 'afcat' ? 'Swathisri (TNPSC)' : 'Jayakumar (AFCAT)';
        
        container.innerHTML = `
            <div style="background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom:10px;">
                <p style="margin: 0 0 10px 0; font-size:14px;"><strong>${partnerName}</strong></p>
                <div style="display: flex; gap: 10px; font-size: 13px;">
                    <div style="flex: 1; text-align: center;">
                        <span style="display:block; font-size: 16px; font-weight:bold; color: #ff6b6b;">${partner.streak || 0}</span>
                        Days Streak
                    </div>
                    <div style="flex: 1; text-align: center; border-left: 1px solid #ddd;">
                        <span style="display:block; font-size: 16px; font-weight:bold; color: #1dd1a1;">${partner.attempted || 0}</span>
                        Questions
                    </div>
                </div>
                <p style="margin: 10px 0 0 0; font-size:12px; color: #777; text-align: center;">
                    Last Active: ${partner.last_activity || 'No activity yet'}
                </p>
            </div>
        `;
    },

    checkReminders: async function() {
        try {
            const data = await api.getReminders();
            if (data.reminders && data.reminders.length > 0) {
                const unread = data.reminders.filter(r => !r.is_read);
                if (unread.length > 0) {
                    alert(`You have ${unread.length} new study reminder(s) from your partner!\n\nLatest: "${unread[0].message}"`);
                    // Mark as read
                    await api.request('/reminders/read', 'POST');
                }
            }
        } catch(e) { /* Reminders require the optional backend. */ }
    }
};
