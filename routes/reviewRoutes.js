
const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

router.post('/create', reviewController.createReview);


router.get('/event/:eventId', reviewController.getReviewsByEvent);

router.post('/update/:id', reviewController.updateReview);

router.post('/delete/:id', reviewController.deleteReview);

module.exports = router;
