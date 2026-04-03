const express = require('express');
const router = express.Router();
const bookmarksController = require('../controllers/bookmarksController');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/bookmarks', authMiddleware.isLoggedIn, bookmarksController.showBookmarksPage);
router.get('/bookmarks/add/:eventId', authMiddleware.isLoggedIn, bookmarksController.addBookmark);
router.post('/bookmarks/:_id/update', authMiddleware.isLoggedIn, bookmarksController.updateBookmark);
router.post('/bookmarks/:_id/delete', authMiddleware.isLoggedIn, bookmarksController.deleteBookmark);

module.exports = router;