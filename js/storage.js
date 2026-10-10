// js/storage.js

const storage = {
    getKey: function(key) {
        if (!app.activeProfile) return null;
        return `studymate_${app.activeProfile}_${key}`;
    },

    save: function(key, data) {
        const fullKey = this.getKey(key);
        if (fullKey) {
            localStorage.setItem(fullKey, JSON.stringify(data));
        }
    },

    load: function(key, defaultValue = null) {
        const fullKey = this.getKey(key);
        if (fullKey) {
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : defaultValue;
        }
        return defaultValue;
    },

    saveGlobal: function(key, data) {
        localStorage.setItem(`studymate_global_${key}`, JSON.stringify(data));
    },

    loadGlobal: function(key, defaultValue = null) {
        const data = localStorage.getItem(`studymate_global_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    },
    
    // Specific Helpers
    getNotes: function() { return this.load('notes', []); },
    saveNotes: function(notes) { this.save('notes', notes); },
    getBookmarks: function() { return this.load('bookmarks', []); },
    saveBookmarks: function(bookmarks) { this.save('bookmarks', bookmarks); },
    
    getTasks: function() { return this.load('tasks', []); },
    saveTasks: function(tasks) { this.save('tasks', tasks); },
    
    getProgress: function() {
        return this.load('progress', {
            attempted: 0,
            correct: 0,
            incorrect: 0,
            testsTaken: 0,
            lastActivity: null,
            streak: 0
        });
    },
    saveProgress: function(progress) { this.save('progress', progress); },
    
    updateStreak: function() {
        let prog = this.getProgress();
        const today = new Date().toDateString();
        
        if (prog.lastActivity !== today) {
            prog.streak += 1;
            prog.lastActivity = today;
            this.saveProgress(prog);
        }
    }
};
