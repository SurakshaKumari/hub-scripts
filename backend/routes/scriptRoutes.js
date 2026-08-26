const express = require('express');
const router = express.Router();
const { getScripts, getTrendingScripts, getFeaturedScripts, getScriptById, createScript, updateScript, deleteScript, getUserScripts, getTopGames } = require('../controllers/scriptController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getScripts);
router.get('/trending', getTrendingScripts);
router.get('/featured', getFeaturedScripts);
router.get('/top-games', getTopGames);
router.get('/my-scripts', protect, getUserScripts);
router.get('/:id', getScriptById);
router.post('/', protect, createScript);
router.put('/:id', protect, updateScript);
router.delete('/:id', protect, deleteScript);

module.exports = router;
