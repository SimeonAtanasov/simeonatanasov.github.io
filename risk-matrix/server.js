import express from 'express';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (optional, if you have frontend files)
app.use(express.static('public'));

// Example route
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the Risk Matrix back-end!' });
});

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Heroku provides this
    ssl: { rejectUnauthorized: false },
});

// Database route
app.get('/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
