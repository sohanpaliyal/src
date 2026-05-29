const express = require('express');

const router = express.Router();

const {
  connectLinkedIn,
  linkedInCallback
} = require('../controllers/linkedinController');

const protect = require('../middleware/authMiddleware');

router.get('/connect', protect, connectLinkedIn);

router.get('/callback', linkedInCallback);

module.exports = router;