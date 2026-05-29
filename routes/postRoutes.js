const express = require('express');

const router = express.Router();

const protect = require('../middleware/authMiddleware');

const {
  createLinkedInPost,
  scheduleLinkedInPost
} = require('../controllers/postController');

router.post(
  '/linkedin',
  protect,
  createLinkedInPost
);
router.post(
  '/linkedin/schedule',
  protect,
  scheduleLinkedInPost
);

module.exports = router;