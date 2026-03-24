const express = require('express');

const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/report-event', authMiddleware.isLoggedIn, reportController.getCreateReportForm);
router.post('/report-event', authMiddleware.isLoggedIn, reportController.handleCreateReport);

router.get('/reports', authMiddleware.isAdmin, reportController.showReports);
router.post('/reports/update-status', authMiddleware.isAdmin, reportController.updateReportStatus);
router.get('/reports/delete', authMiddleware.isAdmin, reportController.deleteReport);

module.exports = router;
