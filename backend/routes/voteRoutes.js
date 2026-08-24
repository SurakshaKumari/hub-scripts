const express = require('express');
const router = express.Router({ mergeParams: true });
const { voteScript } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, voteScript);

module.exports = router;
