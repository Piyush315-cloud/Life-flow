const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lifeflow'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to the LifeFlow MySQL Database!');
});

// ==========================================
// API ROUTES
// ==========================================
app.get('/api/donors', (req, res) => {
    db.query('SELECT * FROM donors ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/inventory', (req, res) => {
    db.query('SELECT * FROM inventory', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔥 THE NEW API ROUTES ARE OFFICIALLY LOADED! 🔥`);
});
