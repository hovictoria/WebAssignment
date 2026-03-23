const express = require("express");

const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/events', authMiddleware.isLoggedIn,eventController.showEvents);

// create
router.get('/create-event', eventController.getCreateEventForm);
router.post('/create-event', eventController.handleCreate);

// edit
router.get('/update-event', eventController.getEvent);
router.post('/update-event', eventController.updateBook);

// delete
router.get('/delete-event', eventController.getDelEvent);
router.post('/delete-event', eventController.deleteAnEvent)
module.exports = router;