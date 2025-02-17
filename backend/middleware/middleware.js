const axios = require('axios');

// User Authentication Middleware
async function UserAuth(req, res, next) {
    const idToken = req.query.idToken; // Extract the idToken from query parameters

    if (idToken==null || !idToken) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }

    try {
        // Verify the idToken with Firebase API
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.USER_API}`,
            { idToken }
        );

        if (response.data && response.data.users && response.data.users.length > 0) {
            req.user = response.data.users[0]; // Attach user info to request object
            return next(); // Proceed to the next middleware/route
        } else {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

// Admin Authentication Middleware
async function adminAuth(req, res, next) {
    const idToken = req.query.idToken; // Extract the idToken from query parameters

    if (idToken==null || !idToken) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }

    try {
        // Verify the idToken with Firebase API
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.ADMIN_API}`,
            { idToken }
        );

        if (response.data && response.data.users && response.data.users.length > 0) {
            req.user = response.data.users[0]; // Attach user info to request object
            return next(); // Proceed to the next middleware/route
        } else {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

module.exports = { UserAuth, adminAuth };
