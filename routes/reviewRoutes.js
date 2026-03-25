
const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

router.get('/my-comments', (req, res) => {
  res.send("My comments page");
});
router.post('/reviews', reviewController.createReview);

module.exports = router;