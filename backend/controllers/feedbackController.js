const pool = require('../db');

// Add feedback
exports.addFeedback = async (req, res) => {
    const { message } = req.body; 
    try {
        const result = await pool.query(
            `INSERT INTO feedback (comments) VALUES ($1) RETURNING *`, 
            [message]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM feedback');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
