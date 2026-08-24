const express = require('express');
const router = express.Router();
const { getPublicProfile, updateAvatar, getNotifications, markNotificationsRead } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.put('/profile', protect, updateAvatar);
router.get('/:username', getPublicProfile);

module.exports = router;
