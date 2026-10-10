// js/app.js

const app = {
    activeProfile: null,
    questionsDatabase: [],
    currentGkIndex: 0,
    currentGkFacts: [],
    
    init: async function() {
        window.addEventListener('popstate', event => {
            const view = event.state && event.state.studymate ? event.state.view : 'dashboard';
            if (this.history && this.history.length > 1) this.history.pop();
            this.navigate(view, true);
        });
        // Load combined question banks and gk facts from separated files
        try {
            const responses = await Promise.all([
                fetch('data/afcat-previous.json'),
                fetch('data/afcat-practice.json'),
                fetch('data/tnpsc-previous.json'),
                fetch('data/tnpsc-practice.json'),
                fetch('data/question-review.json'),
                fetch('data/gk-facts.json')
            ]);
            
            let allValid = true;
            for (const r of responses) { if (!r.ok) allValid = false; }
            
            if (allValid) {
                const data = await Promise.all(responses.map(r => r.json()));
                this.questionsDatabase = [...data[0], ...data[1], ...data[2], ...data[3], ...data[4]];
                appConfig.gkFacts = data[5];
            } else {
                console.warn('Some new JSON files missing, falling back to legacy/aggregated state temporarily.');
                // minimal fallback
                this.questionsDatabase = [];
                appConfig.gkFacts = [];
            }
        } catch (e) {
            console.error("Failed to load data files", e);
            this.questionsDatabase = [];
            appConfig.gkFacts = [];
        }

        // Check valid session with backend
        try {
            const session = await api.me();
            if (session && session.user) {
                // Initialize active profile based on user's assigned exam
                this.selectProfile(session.user.exam, session.user);
            } else {
                this.showLandingPage();
            }
        } catch (e) {
            // Backend login is optional for the local profile dashboards.
            this.showLandingPage();
        }

        this.initGkFacts();
    },

    login: async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        const errEl = document.getElementById('login-error');
        errEl.style.display = 'none';
        
        try {
            const res = await api.login(username, pass);
            if(res.success) {
                document.getElementById('login-username').value = '';
                document.getElementById('login-password').value = '';
                // Setup dashboard
                this.selectProfile(res.user.exam, res.user);
            }
        } catch (e) {
            errEl.innerText = e.message || "Invalid credentials.";
            errEl.style.display = 'block';
        }
    },

    logout: async function(silent = false) {
        if (!silent) {
            try {
                await api.logout();
            } catch(e) {}
        }
        this.activeProfile = null;
        document.getElementById('landing-page').classList.add('active');
        document.getElementById('app-container').classList.remove('active');
    },

    showLandingPage: function() {
        this.activeProfile = null;
        document.getElementById('landing-page').classList.add('active');
        document.getElementById('app-container').classList.remove('active');
    },

    selectProfile: function(profileId, userData = null) {
        this.activeProfile = profileId;
        const profile = appConfig.profiles[profileId];
        
        // Dynamically set name from the backend user object if provided
        const studentName = userData ? 
            (userData.username.charAt(0).toUpperCase() + userData.username.slice(1)) : 
            profile.name;
        
        // Update UI Text
        document.getElementById('dash-student-name').innerText = studentName;
        document.getElementById('dash-exam-name').innerText = profile.exam;
        document.getElementById('sidebar-student-name').innerText = studentName;
        document.getElementById('sidebar-exam-name').innerText = profile.exam;
        
        // Update Settings Texts if they exist
        const stName = document.getElementById('settings-student-name');
        if(stName) stName.innerText = studentName;
        const stExam = document.getElementById('settings-exam-name');
        if(stExam) stExam.innerText = profile.exam;
        
        const mockInfo = document.getElementById('mock-test-info');
        if (mockInfo) {
            if (profileId === 'afcat') {
                mockInfo.innerText = "AFCAT scoring: +3 for a correct answer and −1 for an incorrect answer. Timer: 120 minutes.";
            } else {
                mockInfo.innerText = "TNPSC Group 4 timer: 3 hours. Part A: Tamil; Part B: General Studies and Aptitude. Correct answers are worth 1.5 marks; no penalty for incorrect answers.";
            }
        }
        const mockSize = document.getElementById('mock-test-size');
        if (mockSize) {
            const available = quiz.questionsForProfile().length;
            const expected = profileId === 'afcat' ? 100 : 200;
            mockSize.textContent = available < expected
                ? `Partial mock: ${available} sample bank question${available === 1 ? '' : 's'} currently available of ${expected}.`
                : `Full mock: ${expected} questions available.`;
        }
        
        // Setup Views
        dashboard.render();
        syllabus.render();
        materials.render();
        quiz.setupSubjectPracticeDropdown();
        this.navigate('dashboard');

        // Transition
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('app-container').classList.add('active');
        document.body.className = profile.theme; // apply theme colors
    },

    navigate: function(viewId, isBack = false) {
        // Enforce Authentication
        if (!this.activeProfile && viewId !== 'landing-page') {
            return this.showLandingPage();
        }

        // Prevent accidental exit from quiz
        const currentView = Array.from(document.querySelectorAll('.page-view')).find(el => el.style.display === 'block');
        if (currentView && currentView.id === 'view-quiz-active' && !['quiz-active', 'quiz-results'].includes(viewId)) {
            if (quiz.timerInterval || quiz.currentQuestions.length > 0) {
                if (!confirm("Are you sure you want to abandon the active session? Your answers will be lost.")) {
                    return;
                }
                // Cleanup quiz state
                if (quiz.timerInterval) clearInterval(quiz.timerInterval);
                quiz.currentQuestions = [];
            }
        }

        // Hide all views
        document.querySelectorAll('.page-view').forEach(el => el.style.display = 'none');
        
        // Show target view
        const target = document.getElementById(`view-${viewId}`);
        if(target) target.style.display = 'block';

        // Update History
        if (!this.history) this.history = [];
        if (!isBack && viewId !== 'quiz-active' && (this.history.length === 0 || this.history[this.history.length - 1] !== viewId)) {
            // Dashboard resets history
            if (viewId === 'dashboard') this.history = ['dashboard'];
            else this.history.push(viewId);
        }
        if (!isBack && viewId !== 'quiz-active') {
            history.pushState({ studymate: true, view: viewId }, '', `#${viewId}`);
        }

        // Update active nav link
        document.querySelectorAll('.nav-links li').forEach(el => el.classList.remove('active'));
        const activeLink = Array.from(document.querySelectorAll('.nav-links li')).find(el => {
            const attr = el.getAttribute('onclick');
            return attr && attr.includes(`'${viewId}'`);
        });
        if(activeLink) activeLink.classList.add('active');
        
        // Specific view tasks
        if(viewId === 'planner') planner.render();
        if(viewId === 'notes') notes.render();
        if(viewId === 'progress') this.renderProgressPage();
        if(viewId === 'dashboard') dashboard.render();
        if(viewId === 'revision') quiz.renderRevision();
        
        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    },

    goBack: function() {
        if (!this.history || this.history.length <= 1) {
            this.navigate('dashboard', true);
            return;
        }
        
        // Pop current
        const current = this.history.pop();
        // Check if we are currently in an active quiz and abandoning it
        if (document.getElementById('view-quiz-active').style.display === 'block') {
            if (quiz.timerInterval || quiz.currentQuestions.length > 0) {
                if (!confirm("Are you sure you want to abandon the active session? Your answers will be lost.")) {
                    this.history.push(current); // restore
                    return;
                }
                if (quiz.timerInterval) clearInterval(quiz.timerInterval);
                quiz.currentQuestions = [];
            }
        }
        
        const previous = this.history[this.history.length - 1];
        this.navigate(previous, true);
        history.replaceState({ studymate: true, view: previous }, '', `#${previous}`);
    },

    toggleSidebar: function() {
        document.querySelector('.sidebar').classList.toggle('open');
    },

    renderProgressPage: async function() {
        const prog = storage.getProgress();
        document.getElementById('prog-total').innerText = prog.attempted;
        document.getElementById('prog-correct').innerText = prog.correct;
        document.getElementById('prog-incorrect').innerText = prog.incorrect;
        const acc = prog.attempted ? Math.round(prog.correct / prog.attempted * 100) : 0;
        document.getElementById('prog-accuracy').innerText = `${acc}%`;
    },

    sendReminder: async function() {
        const input = document.getElementById('reminder-msg');
        const msg = input.value.trim();
        if(!msg) return;
        
        try {
            await api.sendReminder(msg);
            input.value = '';
            alert("Reminder sent successfully!");
        } catch(e) {
            alert("Failed to send reminder");
        }
    },

    initGkFacts: function() {
        this.currentGkIndex = 0;
        if(appConfig && appConfig.gkFacts && appConfig.gkFacts.length > 0) {
            const categories = [...new Set(appConfig.gkFacts.map(f => f.category).filter(Boolean))].sort();
            const select = document.getElementById('gk-category-filter');
            if (select) select.innerHTML = '<option value="all">All categories</option>' + categories.map(c => `<option value="${this.escapeHtml(c)}">${this.escapeHtml(c)}</option>`).join('');
            this.renderGkFacts();
        }
    },

    escapeHtml: function(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    },

    renderGkFacts: function() {
        const facts = Array.isArray(appConfig.gkFacts) ? appConfig.gkFacts.filter(f => (f.exams || [f.exam]).filter(Boolean).includes(this.activeProfile)) : [];
        const query = (document.getElementById('gk-search')?.value || '').trim().toLocaleLowerCase();
        const category = document.getElementById('gk-category-filter')?.value || 'all';
        this.currentGkFacts = facts.filter(f => (category === 'all' || f.category === category) && (!query || `${f.fact || ''} ${f.explanation || ''} ${f.topic || ''}`.toLocaleLowerCase().includes(query)));
        this.currentGkIndex = Math.min(this.currentGkIndex, Math.max(0, this.currentGkFacts.length - 1));
        this.displayGkFact();
    },

    displayGkFact: function() {
        const fact = this.currentGkFacts[this.currentGkIndex];
        const catEl = document.getElementById('gk-fact-category');
        const contentEl = document.getElementById('gk-fact-content');
        const counterEl = document.getElementById('gk-fact-counter');
        if (!fact) {
            if(catEl) catEl.innerText = 'No matching facts';
            if(contentEl) contentEl.innerText = 'No facts match your search and category filters.';
            if(counterEl) counterEl.innerText = '';
            document.getElementById('gk-fact-context').innerText = '';
            document.getElementById('gk-fact-source').innerText = '';
            document.getElementById('gk-prev-btn').disabled = true;
            document.getElementById('gk-next-btn').disabled = true;
            return;
        }
        if(catEl) catEl.innerText = fact.category;
        if(contentEl) contentEl.innerText = fact.fact;
        if(counterEl) counterEl.innerText = `Fact ${this.currentGkIndex + 1} of ${this.currentGkFacts.length}`;
        document.getElementById('gk-fact-context').innerText = fact.explanation || '';
        document.getElementById('gk-fact-source').innerText = fact.source ? `Source: ${fact.source}${fact.status ? ` · ${fact.status}` : ''}` : '';
        document.getElementById('gk-prev-btn').disabled = this.currentGkIndex === 0;
        document.getElementById('gk-next-btn').disabled = this.currentGkIndex >= this.currentGkFacts.length - 1;
    },

    nextGkFact: function() {
        if (this.currentGkIndex >= this.currentGkFacts.length - 1) return;
        this.currentGkIndex++;
        this.displayGkFact();
    },

    prevGkFact: function() {
        if (this.currentGkIndex <= 0) return;
        this.currentGkIndex--;
        this.displayGkFact();
    }
};

window.onload = () => app.init();
