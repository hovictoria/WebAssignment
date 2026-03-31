const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');

router.post('/create', commentController.createComment);

router.get('/event/:eventId', commentController.getCommentsByEvent);

router.post('/update/:id', commentController.updateComment);

router.post('/delete/:id', commentController.deleteComment);

module.exports = router;
