// js/chatbot.js

const chatbot = {
    toggle: function() {
        const panel = document.getElementById('chatbot-panel');
        if (panel.style.display === 'none' || !panel.style.display) {
            panel.style.display = 'flex';
        } else {
            panel.style.display = 'none';
        }
    },

    handleEnter: function(e) {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    },

    sendMessage: function() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        input.value = '';
        
        // Simulate thinking delay
        setTimeout(() => {
            const reply = this.getBotReply(text.toLowerCase());
            this.appendMessage('bot', reply);
        }, 600);
    },

    appendMessage: function(sender, text) {
        const container = document.getElementById('chatbot-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'msg-user' : 'msg-bot';
        msgDiv.innerText = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    getBotReply: function(query) {
        if (!app.activeProfile) {
            return "Please select a profile first on the landing page!";
        }

        const isAfcat = app.activeProfile === 'afcat';
        
        if (query.includes('hello') || query.includes('hi')) {
            return `Hello! Ready to study for ${isAfcat ? 'AFCAT' : 'TNPSC Group 4'}?`;
        }
        
        if (query.includes('syllabus') || query.includes('topics')) {
            return "You can find your full syllabus in the 'Syllabus' tab on the left sidebar.";
        }
        
        if (query.includes('mock test') || query.includes('exam pattern')) {
            if (isAfcat) {
                return "The AFCAT written exam has 100 questions, 120 minutes, 300 marks. +3 for correct, -1 for incorrect.";
            } else {
                return "TNPSC Group 4 has 200 questions, 3 hours, 300 marks. Part A: Tamil, Part B: General Studies & Aptitude.";
            }
        }
        
        if (query.includes('book') || query.includes('material') || query.includes('pdf')) {
            return "Check the 'Study Materials' section! I have linked the available PDFs for your exam there.";
        }
        
        if (query.includes('score') || query.includes('progress') || query.includes('accuracy')) {
            return "You can track your accuracy and streaks in the 'Progress' and 'Dashboard' pages.";
        }

        return "I am a basic study assistant. You can ask me about your exam pattern, syllabus, materials, or mock tests!";
    }
};
