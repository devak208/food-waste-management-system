const pool = require('../db');

// Add a new user
exports.addUser = async (req, res) => {
    const { username: name, email, phone: phone_number } = req.body; // Access directly from req.body

    try {
        // Check if email already exists
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert the new user if email is unique
        const result = await pool.query(
            'INSERT INTO users (name, email, phone_number) VALUES ($1, $2, $3) RETURNING user_id, name, email, phone_number',
            [name, email, phone_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding user:', err.message || err);
        res.status(500).json({ error: 'Failed to add user' });
    }
};


exports.userLogin = async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user_id: result.rows[0].user_id });
    } catch (err) {
        console.error('Error logging in:', err.message || err);
        res.status(500).json({ error: 'Failed to login' });
    }
};
