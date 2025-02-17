const express = require('express');
const { addUser, userLogin } = require('../controllers/userController');

const router = express.Router();

// Route for adding a new user
router.post('/', addUser);

// Route for user login
router.post('/login', userLogin);

module.exports = router;
