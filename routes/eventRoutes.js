const express = require("express");

const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/events', authMiddleware.isLoggedIn,eventController.showEvents);

router.get('/createEvent', eventController.getCreateEventForm);
router.post('/createEvent', eventController.handleCreate);


module.exports = router;