const express = require('express');
const router = express.Router();

const rsvpController = require('../controllers/rsvpController');
const authMiddleware = require('../middleware/auth-middleware');

// SHOW RSVP PAGE
router.get('/', authMiddleware.isLoggedIn, rsvpController.getRsvpPage);

// CREATE RSVP
router.post('/create-rsvp', authMiddleware.isLoggedIn, rsvpController.createRsvp);

// UPDATE RSVP
router.post('/update-rsvp', authMiddleware.isLoggedIn, rsvpController.updateRsvp);

// VIEW MY RSVPS
router.get('/my-rsvps', authMiddleware.isLoggedIn, rsvpController.showMyRsvps);

// DELETE RSVP
router.post('/delete-rsvp', authMiddleware.isLoggedIn, rsvpController.deleteRsvp);

module.exports = router;
