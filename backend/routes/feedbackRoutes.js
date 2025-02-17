const express = require('express');
const { addFeedback, getAllFeedback } = require('../controllers/feedbackController');

const router = express.Router();

router.post('/', addFeedback);
router.get('/', getAllFeedback);

module.exports = router;
