const express = require('express');
const router = express.Router();
const { getAllScripts, approveScript, rejectScript, toggleVerified, toggleBumped, getAllUsers, toggleBanUser, updateUserRole, getAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/scripts', getAllScripts);
router.put('/scripts/:id/approve', approveScript);
router.put('/scripts/:id/reject', rejectScript);
router.put('/scripts/:id/verify', toggleVerified);
router.put('/scripts/:id/bump', toggleBumped);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
