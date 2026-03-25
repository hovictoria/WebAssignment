const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const Report = require('../models/reportModel');

const reportReasons = ['Spam', 'Duplicate event', 'Inappropriate content', 'False information', 'Wrong category', 'Offensive language', 'Other'];

exports.getCreateReportForm = async (req, res) => {
  const eventId = req.query._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.redirect('/events');
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.redirect('/events');
    }

    res.render('create-report', {
      event,
      reason: '',
      details: '',
      reportReasons,
      error: '',
      success: '',
      user: req.session.user
    });
  } catch (err) {
    console.error('Failed to load report form', {
      eventId,
      userId: req.session.user ? req.session.user.id : null,
      error: err.message
    });
    res.redirect('/events');
  }
};

exports.handleCreateReport = async (req, res) => {
  const eventId = req.body.eventId;
  const reason = (req.body.reason || '').trim();
  const details = (req.body.details || '').trim();

  let event = null;
  let error = '';
  let success = '';

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.redirect('/events');
    }

    event = await Event.findById(eventId);
    if (!event) {
      return res.redirect('/events');
    }

    if (!reportReasons.includes(reason)) {
      error = 'Please select a reason';
    } else if (reason === 'Other' && details === '') {
      error = 'Details are required when reason is Other';
    } else {
      await Report.createReport({
        event: eventId,
        reporter: req.session.user.id,
        reason,
        details,
        status: 'Pending'
      });
      success = 'Report submitted successfully';
    }

    res.render('create-report', {
      event,
      reason,
      details,
      reportReasons,
      error,
      success,
      user: req.session.user
    });
  } catch (err) {
    console.error('Failed to submit report', {
      eventId,
      userId: req.session.user ? req.session.user.id : null,
      reason,
      error: err.message
    });

    let submitError = 'Failed to submit report';
    if (err.name === 'ValidationError' && err.errors && err.errors.details && err.errors.details.kind === 'maxlength') {
      submitError = 'Failed to submit report. Length exceeds character limit.';
    }

    res.render('create-report', {
      event,
      reason,
      details,
      reportReasons,
      error: submitError,
      success,
      user: req.session.user
    });
  }
};

exports.showReports = async (req, res) => {
  try {
    const reports = await Report.findAllReports();
    res.render('reports', {
      reports,
      user: req.session.user,
      error: req.query.error || '',
      success: req.query.success || ''
    });
  } catch (err) {
    console.error('Failed to load all reports', {
      userId: req.session.user ? req.session.user.id : null,
      error: err.message
    });
    res.render('reports', {
      reports: [],
      user: req.session.user,
      error: 'Failed to load reports',
      success: ''
    });
  }
};

exports.showMyReports = async (req, res) => {
  try {
    const reports = await Report.findReportsByReporter(req.session.user.id);
    res.render('my-reports', {
      reports,
      user: req.session.user,
      error: '',
      success: ''
    });
  } catch (err) {
    console.error('Failed to load user reports', {
      userId: req.session.user ? req.session.user.id : null,
      error: err.message
    });
    res.render('my-reports', {
      reports: [],
      user: req.session.user,
      error: 'Failed to load your reports',
      success: ''
    });
  }
};

exports.updateReportStatus = async (req, res) => {
  const id = req.body.id;
  const status = (req.body.status || '').trim();
  const allowedStatuses = ['Pending', 'Reviewed', 'Resolved'];

  if (!allowedStatuses.includes(status)) {
    return res.redirect('/reports?error=Invalid report status');
  }

  try {
    await Report.updateStatus(id, status);
    res.redirect('/reports?success=Report status updated');
  } catch (err) {
    console.error('Failed to update report status', {
      reportId: id,
      status,
      userId: req.session.user ? req.session.user.id : null,
      error: err.message
    });
    res.redirect('/reports?error=Failed to update report');
  }
};

exports.deleteReport = async (req, res) => {
  const id = req.query.id;

  try {
    await Report.deleteReport(id);
    res.redirect('/reports?success=Report deleted');
  } catch (err) {
    console.error('Failed to delete report', {
      reportId: id,
      userId: req.session.user ? req.session.user.id : null,
      error: err.message
    });
    res.redirect('/reports?error=Failed to delete report');
  }
};
