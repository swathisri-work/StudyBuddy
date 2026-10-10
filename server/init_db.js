const { db, initialize } = require('./database');
const bcrypt = require('bcryptjs');

initialize();

const JAYAKUMAR_PASS = process.env.JAYAKUMAR_PASS || 'afcat_secure_2026';
const SWATHISRI_PASS = process.env.SWATHISRI_PASS || 'tnpsc_secure_2026';

function initUsers() {
    try {
        db.exec(`DELETE FROM users`);
        
        let insertUser = db.prepare(`INSERT INTO users (id, username, password_hash, exam) VALUES (?, ?, ?, ?)`);
        let insertProgress = db.prepare(`INSERT OR IGNORE INTO progress (user_id) VALUES (?)`);
        
        // Jayakumar
        const salt1 = bcrypt.genSaltSync(10);
        const hash1 = bcrypt.hashSync(JAYAKUMAR_PASS, salt1);
        insertUser.run(1, 'jayakumar', hash1, 'afcat');
        insertProgress.run(1);
        console.log("Created user: jayakumar");
        
        // Swathisri
        const salt2 = bcrypt.genSaltSync(10);
        const hash2 = bcrypt.hashSync(SWATHISRI_PASS, salt2);
        insertUser.run(2, 'swathisri', hash2, 'tnpsc');
        insertProgress.run(2);
        console.log("Created user: swathisri");
        
        console.log("Database initialized successfully.");
    } catch(err) {
        console.error("Initialization error:", err);
    }
}

initUsers();
