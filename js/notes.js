// js/notes.js

const notes = {
    render: function() {
        if (!app.activeProfile) return;
        this.renderNotesList();
        // Since bookmarks are mostly a placeholder list for this demo, just render an empty state or basic list
        this.renderBookmarksList();
    },

    switchTab: function(tab) {
        document.getElementById('notes-tab').style.display = tab === 'notes' ? 'block' : 'none';
        document.getElementById('bookmarks-tab').style.display = tab === 'bookmarks' ? 'block' : 'none';
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        const btns = document.querySelectorAll('.tab-btn');
        if (tab === 'notes') btns[0].classList.add('active');
        if (tab === 'bookmarks') btns[1].classList.add('active');
    },

    addNote: function() {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        
        if (!titleInput.value.trim() || !contentInput.value.trim()) {
            alert('Please enter both title and content.');
            return;
        }

        const myNotes = storage.getNotes();
        myNotes.push({
            id: Date.now(),
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            date: new Date().toLocaleDateString()
        });
        
        storage.saveNotes(myNotes);
        titleInput.value = '';
        contentInput.value = '';
        
        this.renderNotesList();
    },

    deleteNote: function(id) {
        if(confirm('Delete this note?')) {
            let myNotes = storage.getNotes();
            myNotes = myNotes.filter(n => n.id !== id);
            storage.saveNotes(myNotes);
            this.renderNotesList();
        }
    },

    renderNotesList: function() {
        const container = document.getElementById('notes-list');
        const myNotes = storage.getNotes();
        
        if (myNotes.length === 0) {
            container.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No notes saved yet.</p>';
            return;
        }

        let html = '';
        myNotes.forEach(n => {
            html += `
                <div class="card" style="margin-bottom:0">
                    <div style="display:flex; justify-content:space-between; align-items:start">
                        <h4 style="margin-bottom:10px">${n.title}</h4>
                        <button onclick="notes.deleteNote(${n.id})" style="background:none; border:none; color:var(--clr-danger); cursor:pointer"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <p style="font-size:14px; white-space:pre-wrap; margin-bottom:10px">${n.content}</p>
                    <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${n.date}</small>
                </div>
            `;
        });
        container.innerHTML = html;
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        container.style.gap = '20px';
    },

    renderBookmarksList: function() {
        // Just mock placeholder for now since bookmarks integration requires deep linking
        const container = document.getElementById('bookmarks-list');
        const bms = storage.getBookmarks();
        if(bms.length === 0) {
           container.innerHTML = '<p class="text-muted">You have no bookmarked questions or facts yet.</p>';
        } else {
           // render actual bookmarks
           let html = '<ul>';
           bms.forEach(b => {
               html += `<li style="padding:10px 0; border-bottom:1px solid #eee">${b.title}</li>`;
           });
           html += '</ul>';
           container.innerHTML = html;
        }
    }
};
