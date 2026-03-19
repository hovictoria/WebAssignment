const express = require("express");

const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/events', eventController.showEvents);

router.get('/createEvent', eventController.getCreateEventForm);
router.post('/createEvent', eventController.handleCreate);


module.exports = router;