const express = require('express');

const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth-middleware');

// shows report form for a logged-in user
router.get('/report-event', authMiddleware.isLoggedIn, reportController.getCreateReportForm); 
// handles form submission for a logged-in user
router.post('/report-event', authMiddleware.isLoggedIn, reportController.handleCreateReport); 
// shows the current user's submitted reports
router.get('/my-reports', authMiddleware.isLoggedIn, reportController.showMyReports); 

// shows all reports but only to admins
router.get('/', authMiddleware.isLoggedIn, authMiddleware.isAdmin, reportController.showReports); 
//lets admins change a report's status
router.post('/update-status', authMiddleware.isLoggedIn, authMiddleware.isAdmin, reportController.updateReportStatus); 
//lets admins delete a report
router.get('/delete', authMiddleware.isLoggedIn, authMiddleware.isAdmin, reportController.deleteReport); 
module.exports = router;
