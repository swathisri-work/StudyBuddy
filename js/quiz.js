// js/quiz.js
const quiz = {
    currentQuestions: [],
    currentIndex: 0,
    userAnswers: {},
    checkedAnswers: {},
    markedForReview: new Set(),
    isMockTest: false,
    timerInterval: null,
    timeRemaining: 0,
    startedAt: null,

    questionsForProfile: function() {
        const exam = String(app.activeProfile || '').toLowerCase();
        return (Array.isArray(app.questionsDatabase) ? app.questionsDatabase : []).filter(q =>
            String(q.exam || '').toLowerCase() === exam && Array.isArray(q.options) && q.options.length > 1 && Number.isInteger(Number(q.correctAnswer)) && Number(q.correctAnswer) >= 0 && Number(q.correctAnswer) < q.options.length && q.verification !== 'needs-review'
        );
    },

    setupSubjectPracticeDropdown: function() {
        if (!app.activeProfile) return;
        const subjects = appConfig.profiles[app.activeProfile].subjects;
        const daily = document.getElementById('practice-subject-select');
        const targeted = document.getElementById('subject-practice-subject-select');
        daily.innerHTML = '<option value="all">All Subjects</option>' + subjects.map(s => `<option value="${s}">${this.subjectLabel(s)}</option>`).join('');
        targeted.innerHTML = subjects.map(s => `<option value="${s}">${this.subjectLabel(s)}</option>`).join('');
        this.refreshFilters();
        const years = [...new Set(this.questionsForProfile().map(q => q.year).filter(Boolean))].sort((a, b) => String(b).localeCompare(String(a), undefined, { numeric: true }));
        const yearSelect = document.getElementById('practice-year-select');
        if (yearSelect) yearSelect.innerHTML = '<option value="all">All years</option>' + years.map(year => `<option value="${this.escapeHtml(year)}">${this.escapeHtml(year)}</option>`).join('');
        this.updateAvailability();
        this.renderAttemptHistory();
    },

    subjectLabel: function(subject) {
        return subject.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    },

    refreshFilters: function() {
        const all = this.questionsForProfile();
        const subject = document.getElementById('subject-practice-subject-select').value;
        const subjectQuestions = all.filter(q => q.subject === subject);
        const topicSelect = document.getElementById('subject-practice-topic-select');
        const difficultySelect = document.getElementById('subject-practice-difficulty-select');
        if (!topicSelect || !difficultySelect) return;
        const previousTopic = topicSelect.value;
        const previousDifficulty = difficultySelect.value;
        const topics = [...new Set(subjectQuestions.map(q => q.topic).filter(Boolean))];
        const difficulties = [...new Set(subjectQuestions.map(q => q.difficulty).filter(Boolean))];
        topicSelect.innerHTML = '<option value="all">All topics</option>' + topics.map(t => `<option value="${this.escapeHtml(t)}">${this.escapeHtml(t)}</option>`).join('');
        difficultySelect.innerHTML = '<option value="all">All difficulties</option>' + difficulties.map(d => `<option value="${this.escapeHtml(d)}">${this.escapeHtml(d)}</option>`).join('');
        if (topics.includes(previousTopic)) topicSelect.value = previousTopic;
        if (difficulties.includes(previousDifficulty)) difficultySelect.value = previousDifficulty;
        this.updateAvailability();
    },

    updateAvailability: function() {
        const all = this.questionsForProfile();
        const dailySubject = document.getElementById('practice-subject-select').value;
        const dailyType = document.getElementById('practice-type-select')?.value || 'all';
        const dailyYear = document.getElementById('practice-year-select')?.value || 'all';
        const matchesDaily = q => (dailySubject === 'all' || q.subject === dailySubject) && (dailyType === 'all' || (dailyType === 'previous-year' ? q.type === 'previous-year' : q.type === 'practice')) && (dailyYear === 'all' || String(q.year || '').toLowerCase() === dailyYear);
        const dailyCount = all.filter(matchesDaily).length;
        const subject = document.getElementById('subject-practice-subject-select').value;
        const topic = document.getElementById('subject-practice-topic-select').value;
        const difficulty = document.getElementById('subject-practice-difficulty-select').value;
        const targetedCount = all.filter(q => q.subject === subject && (topic === 'all' || q.topic === topic) && (difficulty === 'all' || q.difficulty === difficulty)).length;
        const dailyStatus = document.getElementById('practice-availability');
        const targetedStatus = document.getElementById('subject-practice-availability');
        if (dailyStatus) dailyStatus.textContent = `${dailyCount} matching validated question${dailyCount === 1 ? '' : 's'} available. Unverified or incomplete extractions are held for review.`;
        if (targetedStatus) targetedStatus.textContent = `${targetedCount} matching question${targetedCount === 1 ? '' : 's'} available.`;
        const dailyStart = document.querySelector('#view-practice button[onclick="quiz.startPractice(false)"]');
        const targetedStart = document.querySelector('#view-subject-practice button[onclick="quiz.startPractice(true)"]');
        if (dailyStart) dailyStart.disabled = dailyCount === 0;
        if (targetedStart) targetedStart.disabled = targetedCount === 0;
        document.querySelectorAll('.question-count-select').forEach(select => {
            const count = select.id === 'practice-count-select' ? dailyCount : targetedCount;
            Array.from(select.options).forEach(option => {
                const requested = Number(option.value);
                option.disabled = requested > count;
                option.textContent = `${requested} Questions${requested > count ? ` (only ${count} available)` : ''}`;
            });
            const enabled = Array.from(select.options).find(option => !option.disabled);
            if (enabled && select.selectedOptions[0] && select.selectedOptions[0].disabled) select.value = enabled.value;
        });
    },

    startPractice: function(isSubject) {
        if (!app.activeProfile) return;
        const all = this.questionsForProfile();
        const subject = isSubject ? document.getElementById('subject-practice-subject-select').value : document.getElementById('practice-subject-select').value;
        const topic = isSubject ? document.getElementById('subject-practice-topic-select').value : 'all';
        const difficulty = isSubject ? document.getElementById('subject-practice-difficulty-select').value : 'all';
        const countId = isSubject ? 'subject-practice-count-select' : 'practice-count-select';
        const count = Number(document.getElementById(countId).value);
        const type = isSubject ? 'all' : (document.getElementById('practice-type-select')?.value || 'all');
        const year = isSubject ? 'all' : (document.getElementById('practice-year-select')?.value || 'all');
        const pool = all.filter(q => (subject === 'all' || q.subject === subject) && (topic === 'all' || q.topic === topic) && (difficulty === 'all' || q.difficulty === difficulty) && (type === 'all' || (type === 'previous-year' ? q.type === 'previous-year' : q.type === 'practice')) && (year === 'all' || String(q.year || '').toLowerCase() === year));
        if (!pool.length) {
            this.showQuestionBankMessage('No questions match these filters. Check that the question bank contains questions for this exam, subject, topic, and difficulty.');
            return;
        }
        this.initQuizParams(this.shuffleArray(pool).slice(0, count), false, pool.length < count ? 'Practice' : 'Daily Practice');
    },

    startMockTest: function() {
        if (!app.activeProfile) return;
        const profile = appConfig.profiles[app.activeProfile];
        const validated = this.questionsForProfile();
        const pool = this.shuffleArray(validated);
        const target = app.activeProfile === 'afcat' ? 100 : 200;
        if (!pool.length) {
            this.showQuestionBankMessage('No validated questions are available for this exam yet. Unverified paper extractions are excluded until their answers and text are checked.');
            return;
        }
        const isPartial = pool.length < target;
        document.getElementById('mock-test-size').textContent = isPartial
            ? `Partial mock test: ${pool.length} available question${pool.length === 1 ? '' : 's'} of ${target} exam questions.`
            : `Full mock test: ${target} questions.`;
        this.initQuizParams(pool.slice(0, target), true, isPartial ? 'Partial Mock Test' : `${profile.exam} Mock Test`);
        this.timeRemaining = app.activeProfile === 'afcat' ? 120 * 60 : 180 * 60;
        this.updateTimer();
        this.startTimer();
    },

    showQuestionBankMessage: function(message) {
        const container = document.getElementById('question-container');
        if (container) container.innerHTML = `<p class="empty-state">${this.escapeHtml(message)}</p>`;
        alert(message);
    },

    initQuizParams: function(questions, isMock, title) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.currentQuestions = questions;
        this.currentIndex = 0;
        this.userAnswers = {};
        this.checkedAnswers = {};
        this.markedForReview = new Set();
        this.isMockTest = isMock;
        this.startedAt = new Date().toISOString();
        document.getElementById('quiz-title').textContent = `${title} · ${questions.length} question${questions.length === 1 ? '' : 's'}`;
        document.getElementById('quiz-timer').style.display = isMock ? 'block' : 'none';
        document.getElementById('finish-quiz-btn').textContent = 'Finish attempt…';
        document.getElementById('check-answer-btn').style.display = isMock ? 'none' : 'inline-block';
        app.navigate('quiz-active');
        this.renderQuestion();
        this.renderPalette();
    },

    renderQuestion: function() {
        const q = this.currentQuestions[this.currentIndex];
        if (!q) return;
        const container = document.getElementById('question-container');
        const checked = this.checkedAnswers[this.currentIndex];
        let html = `<div class="question-header"><span class="badge">Question ${this.currentIndex + 1} of ${this.currentQuestions.length}</span><span class="badge">${this.escapeHtml(q.topic || this.subjectLabel(q.subject || 'Question'))}</span>${q.difficulty ? `<span class="badge">${this.escapeHtml(q.difficulty)}</span>` : ''}</div><h3>${this.escapeHtml(q.question)}</h3><div class="options-container">`;
        q.options.forEach((opt, idx) => {
            const selected = this.userAnswers[this.currentIndex] === idx;
            let state = selected ? 'selected' : '';
            if (checked !== undefined && idx === Number(q.correctAnswer)) state += ' correct-option';
            else if (checked !== undefined && selected) state += ' incorrect-option';
            html += `<label class="option-label ${state}" onclick="quiz.selectOption(${idx})"><input type="radio" name="opt" ${selected ? 'checked' : ''} ${checked !== undefined ? 'disabled' : ''}>${String.fromCharCode(65 + idx)}. ${this.escapeHtml(opt)}</label>`;
        });
        html += '</div>';
        if (checked !== undefined) html += `<div class="answer-feedback ${checked ? 'text-success' : 'text-danger'}"><strong>${checked ? 'Correct.' : 'Not quite.'}</strong> ${this.escapeHtml(q.explanation || 'No explanation is available for this question.')}</div>`;
        container.innerHTML = html;
        const markButton = document.getElementById('mark-review-btn');
        markButton.textContent = this.markedForReview.has(this.currentIndex) ? 'Remove Review Mark' : 'Mark for Review';
        const bookmarked = storage.getBookmarks().some(item => item.id === q.id);
        document.getElementById('bookmark-question-btn').textContent = bookmarked ? 'Remove Bookmark' : 'Bookmark Question';
        document.getElementById('check-answer-btn').disabled = this.userAnswers[this.currentIndex] === undefined || checked !== undefined;
        document.getElementById('check-answer-btn').textContent = checked !== undefined ? 'Answer Checked' : 'Check Answer';
        this.updatePaletteCurrent();
    },

    selectOption: function(optIdx) {
        if (this.checkedAnswers[this.currentIndex] !== undefined) return;
        this.userAnswers[this.currentIndex] = optIdx;
        this.renderQuestion();
        this.renderPalette();
    },

    checkAnswer: function() {
        const q = this.currentQuestions[this.currentIndex];
        if (!q || this.userAnswers[this.currentIndex] === undefined) return;
        this.checkedAnswers[this.currentIndex] = this.userAnswers[this.currentIndex] === Number(q.correctAnswer);
        this.renderQuestion();
    },

    nextQuestion: function() {
        if (this.currentIndex < this.currentQuestions.length - 1) {
            this.currentIndex++;
            this.renderQuestion();
            this.renderPalette();
        }
    },

    prevQuestion: function() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
            this.renderPalette();
        }
    },

    goToQuestion: function(idx) {
        if (idx >= 0 && idx < this.currentQuestions.length) {
            this.currentIndex = idx;
            this.renderQuestion();
            this.renderPalette();
        }
    },

    toggleMarkForReview: function() {
        if (this.markedForReview.has(this.currentIndex)) this.markedForReview.delete(this.currentIndex);
        else this.markedForReview.add(this.currentIndex);
        this.renderQuestion();
        this.renderPalette();
    },

    toggleBookmark: function() {
        const q = this.currentQuestions[this.currentIndex];
        if (!q) return;
        let bookmarks = storage.getBookmarks();
        if (bookmarks.some(item => item.id === q.id)) bookmarks = bookmarks.filter(item => item.id !== q.id);
        else bookmarks.push({ id: q.id, title: q.question, exam: app.activeProfile, subject: q.subject, topic: q.topic, questionId: q.id });
        storage.saveBookmarks(bookmarks);
        notes.renderBookmarksList();
        this.renderQuestion();
    },

    renderPalette: function() {
        const container = document.getElementById('question-palette');
        const panel = container.closest('.quiz-sidebar');
        if (!this.currentQuestions.length) {
            container.replaceChildren();
            if (panel) panel.hidden = true;
            return;
        }
        if (panel) panel.hidden = false;
        container.innerHTML = this.currentQuestions.map((_, idx) => {
            const answered = this.userAnswers[idx] !== undefined;
            const marked = this.markedForReview.has(idx);
            const current = this.currentIndex === idx;
            const state = answered && marked ? 'answered-marked' : marked ? 'marked' : answered ? 'answered' : 'unanswered';
            const stateLabel = answered && marked ? 'answered and marked for review' : marked ? 'marked for review' : answered ? 'answered' : 'not answered';
            return `<button type="button" class="palette-btn ${state}${current ? ' current' : ''}" aria-label="Question ${idx + 1}, ${stateLabel}${current ? ', current question' : ''}" aria-current="${current ? 'true' : 'false'}" aria-pressed="${current}" title="Question ${idx + 1}: ${stateLabel}${current ? ' (current)' : ''}" onclick="quiz.goToQuestion(${idx})">${idx + 1}</button>`;
        }).join('');
        const activeButton = container.querySelector('.palette-btn.current');
        if (activeButton) activeButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    },

    updatePaletteCurrent: function() {
        this.renderPalette();
    },

    updateTimer: function() {
        const h = Math.floor(this.timeRemaining / 3600);
        const m = Math.floor((this.timeRemaining % 3600) / 60);
        const s = this.timeRemaining % 60;
        document.getElementById('quiz-timer').textContent = `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    startTimer: function() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            if (this.timeRemaining <= 0) this.submitQuiz(true);
        }, 1000);
    },

    showFinishAttempt: function() {
        if (!this.currentQuestions.length) return;
        this.finishAttemptTrigger = document.activeElement;
        const answered = Object.keys(this.userAnswers).filter(index => Number(index) >= 0 && Number(index) < this.currentQuestions.length).length;
        document.getElementById('finish-answered-count').textContent = answered;
        document.getElementById('finish-unanswered-count').textContent = this.currentQuestions.length - answered;
        document.getElementById('finish-marked-count').textContent = this.markedForReview.size;
        document.getElementById('finish-attempt-modal').hidden = false;
        document.querySelector('#finish-attempt-modal button')?.focus();
    },

    cancelFinishAttempt: function() {
        document.getElementById('finish-attempt-modal').hidden = true;
        this.finishAttemptTrigger?.focus();
    },

    confirmFinishAttempt: function() {
        document.getElementById('finish-attempt-modal').hidden = true;
        this.submitQuiz(true);
    },

    submitQuiz: function(confirmed = false) {
        if (!this.currentQuestions.length) return;
        if (!confirmed) {
            this.showFinishAttempt();
            return;
        }
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.calculateResults();
        app.navigate('quiz-results');
    },

    calculateResults: function() {
        let correct = 0;
        let incorrect = 0;
        let attempted = 0;
        let marks = 0;
        const incorrectQuestions = [];
        const reviewHtml = this.currentQuestions.map((q, idx) => {
            const userAns = this.userAnswers[idx];
            const isAttempted = userAns !== undefined;
            const isCorrect = isAttempted && userAns === Number(q.correctAnswer);
            if (isAttempted) {
                attempted++;
                if (isCorrect) {
                    correct++;
                    if (app.activeProfile === 'afcat') marks += 3;
                    if (app.activeProfile === 'tnpsc') marks += 1.5;
                } else {
                    incorrect++;
                    incorrectQuestions.push(q);
                    if (app.activeProfile === 'afcat') marks -= 1;
                }
            }
            const border = isAttempted ? (isCorrect ? 'var(--clr-success)' : 'var(--clr-danger)') : 'var(--clr-gray-300)';
            return `<article class="question-review" style="border-left:5px solid ${border}"><h4>Q${idx + 1}. ${this.escapeHtml(q.question)}</h4><p><strong>Correct answer:</strong> ${this.escapeHtml(q.options[Number(q.correctAnswer)])}</p>${isAttempted ? `<p><strong>Your answer:</strong> ${this.escapeHtml(q.options[userAns])}</p>` : '<p class="text-muted">Unanswered</p>'}<p><strong>Explanation:</strong> ${this.escapeHtml(q.explanation || 'No explanation available.')}</p></article>`;
        }).join('');
        const total = this.currentQuestions.length;
        document.getElementById('result-score').textContent = `${correct}/${total}`;
        document.getElementById('res-correct').textContent = correct;
        document.getElementById('res-incorrect').textContent = incorrect;
        document.getElementById('res-unanswered').textContent = total - attempted;
        document.getElementById('res-accuracy').textContent = attempted ? `${Math.round(correct / attempted * 100)}%` : '0%';
        document.getElementById('res-marks-container').style.display = this.isMockTest ? 'block' : 'none';
        document.getElementById('res-marks').textContent = marks;
        document.getElementById('results-review-container').innerHTML = `<h3>Detailed Review</h3>${reviewHtml}`;

        const progress = storage.getProgress();
        progress.attempted += attempted;
        progress.correct += correct;
        progress.incorrect += incorrect;
        if (this.isMockTest) progress.testsTaken++;
        storage.saveProgress(progress);
        storage.updateStreak();
        const history = storage.load('attemptHistory', []);
        history.unshift({ date: new Date().toISOString(), exam: app.activeProfile, mode: this.isMockTest ? 'mock' : 'practice', total, attempted, correct, incorrect, unanswered: total - attempted, questionIds: this.currentQuestions.map(q => q.id) });
        storage.save('attemptHistory', history.slice(0, 50));
        storage.save('incorrectQuestionIds', [...new Set([...storage.load('incorrectQuestionIds', []), ...incorrectQuestions.map(q => q.id)])]);
        this.renderAttemptHistory();
        this.renderRevision();
    },

    renderAttemptHistory: function() {
        const container = document.getElementById('attempt-history');
        if (!container || !app.activeProfile) return;
        const history = storage.load('attemptHistory', []);
        container.innerHTML = `<h3>Recent Attempts</h3>${history.length ? `<ul>${history.slice(0, 10).map(item => `<li>${new Date(item.date).toLocaleString()} — ${item.mode === 'mock' ? 'Mock test' : 'Practice'}: ${item.correct}/${item.total} correct (${item.unanswered} unanswered)</li>`).join('')}</ul>` : '<p class="text-muted">Completed practice and mock attempts will appear here.</p>'}`;
    },

    renderRevision: function() {
        const container = document.getElementById('revision-list');
        if (!container || !app.activeProfile) return;
        const ids = new Set(storage.load('incorrectQuestionIds', []));
        const questions = this.questionsForProfile().filter(q => ids.has(q.id));
        container.innerHTML = `<h3>Incorrect Answers to Review</h3>${questions.length ? questions.map(q => `<article class="question-review"><h4>${this.escapeHtml(q.question)}</h4><p><strong>Answer:</strong> ${this.escapeHtml(q.options[Number(q.correctAnswer)])}</p><p><strong>Explanation:</strong> ${this.escapeHtml(q.explanation || 'No explanation available.')}</p></article>`).join('') : '<p class="text-muted">Incorrect answers from completed sessions will be collected here.</p>'}`;
    },

    escapeHtml: function(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    },

    shuffleArray: function(array) {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};
