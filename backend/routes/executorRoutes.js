const express = require('express');
const router = express.Router();
const { getExecutors, getExecutorById, createExecutor, updateExecutor, deleteExecutor } = require('../controllers/executorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getExecutors);
router.get('/:id', getExecutorById);
router.post('/', protect, adminOnly, createExecutor);
router.put('/:id', protect, adminOnly, updateExecutor);
router.delete('/:id', protect, adminOnly, deleteExecutor);

module.exports = router;
