const express = require("express");

const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth-middleware');
const upload = require('../middleware/upload');  

router.get('/', authMiddleware.isLoggedIn,eventController.showEvents);

// view all details
router.get('/event-details',authMiddleware.isLoggedIn, eventController.getDetails);


// create
router.get('/create-event', authMiddleware.isLoggedIn, eventController.getCreateEventForm);
// router.post('/create-event', authMiddleware.isLoggedIn, eventController.handleCreate);
router.post('/create-event', authMiddleware.isLoggedIn, upload.single('image'), eventController.handleCreate);

// edit
router.get('/update-event', authMiddleware.isLoggedIn, eventController.getEvent);
// router.post('/update-event', authMiddleware.isLoggedIn, eventController.updateBook);
router.post('/update-event', authMiddleware.isLoggedIn, upload.single('image'), eventController.updateEvent);

// delete
router.get('/delete-event', authMiddleware.isLoggedIn, eventController.getDelEvent);
router.post('/delete-event', authMiddleware.isLoggedIn, eventController.deleteAnEvent);



module.exports = router;