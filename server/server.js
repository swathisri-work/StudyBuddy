const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db, initialize } = require('./database');

// Ensure db is initialized
initialize();

const app = express();

app.use(cors({
    origin: 'http://localhost:8000', // Our frontend origin
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'studymate_super_secure_secret_2026';

// Middleware to verify JWT cookie
function authMiddleware(req, res, next) {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthenticated: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthenticated: Invalid token' });
    }
}

// Login authentication
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username);
        
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isValid = bcrypt.compareSync(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const payload = {
            id: user.id,
            username: user.username,
            exam: user.exam
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
        
        // Set secure httponly cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        res.json({ success: true, user: payload });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Logout invalidation
app.post('/api/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
});

// Get currently logged-in user details
app.get('/api/me', authMiddleware, (req, res) => {
    try {
        const stmt = db.prepare('SELECT id, username, exam FROM users WHERE id = ?');
        const user = stmt.get(req.user.id);
        if(!user) return res.status(401).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Retrieve dashboard stats (Own and Partner's shared stats)
app.get('/api/dashboard', authMiddleware, (req, res) => {
    const userId = req.user.id;
    
    try {
        const myProgressStmt = db.prepare('SELECT * FROM progress WHERE user_id = ?');
        const myProgress = myProgressStmt.get(userId) || { attempted: 0, correct: 0, incorrect: 0, streak: 0, tests_taken: 0, last_activity: null };
        
        const partnerId = userId === 1 ? 2 : 1; 
        const partnerProgressStmt = db.prepare('SELECT streak, last_activity, tests_taken, attempted FROM progress WHERE user_id = ?');
        const partnerProgress = partnerProgressStmt.get(partnerId) || { streak: 0, last_activity: null, tests_taken: 0, attempted: 0 };
        
        // Hide private quiz details from partner (like answers), only share higher level stats
        res.json({
            mine: myProgress,
            partner: partnerProgress
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update own progress
app.post('/api/progress', authMiddleware, (req, res) => {
    const { attempted, correct, incorrect, tests_taken, streak, last_activity } = req.body;
    const userId = req.user.id;

    try {
        const stmt = db.prepare(
            `UPDATE progress SET 
                attempted = ?, correct = ?, incorrect = ?, tests_taken = ?, streak = ?, last_activity = ? 
             WHERE user_id = ?`
        );
        stmt.run(attempted || 0, correct || 0, incorrect || 0, tests_taken || 0, streak || 0, last_activity || null, userId);
        res.json({ success: true });
    } catch (err) {
        console.error("Progress update error", err);
        res.status(500).json({ error: 'Could not update progress' });
    }
});

// Get unread reminders
app.get('/api/reminders', authMiddleware, (req, res) => {
    const userId = req.user.id;
    try {
        const stmt = db.prepare('SELECT * FROM reminders WHERE receiver_id = ? ORDER BY created_at DESC LIMIT 20');
        const reminders = stmt.all(userId);
        res.json({ reminders });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Send a reminder
app.post('/api/reminders', authMiddleware, (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const senderId = req.user.id;
    const receiverId = senderId === 1 ? 2 : 1;

    try {
        const stmt = db.prepare(`INSERT INTO reminders (sender_id, receiver_id, message) VALUES (?, ?, ?)`);
        stmt.run(senderId, receiverId, message);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Could not send reminder' });
    }
});

// Mark reminders as read
app.post('/api/reminders/read', authMiddleware, (req, res) => {
    const userId = req.user.id;
    try {
        const stmt = db.prepare(`UPDATE reminders SET is_read = 1 WHERE receiver_id = ?`);
        stmt.run(userId);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Could not update reminders' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`StudyMate backend running on http://localhost:${PORT}`);
});
