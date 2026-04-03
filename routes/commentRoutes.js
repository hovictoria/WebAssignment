const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');

router.post('/create', authMiddleware.isLoggedIn, commentController.createComment);

router.get('/event/:eventId', authMiddleware.isLoggedIn ,commentController.getCommentsByEvent);

router.post('/update/:id',authMiddleware.isLoggedIn, commentController.updateComment);

router.post('/delete/:id', authMiddleware.isLoggedIn, commentController.deleteComment);

module.exports = router;
