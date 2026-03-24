const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const Report = require('../models/reportModel');

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
      error: '',
      success: '',
      user: req.session.user
    });
  } catch (err) {
    console.log(err);
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

    if (reason === '' || details === '') {
      error = 'All fields are required';
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
      error,
      success,
      user: req.session.user
    });
  } catch (err) {
    console.log(err);
    res.render('create-report', {
      event,
      reason,
      details,
      error: 'Failed to submit report',
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    res.redirect('/reports?error=Failed to update report');
  }
};

exports.deleteReport = async (req, res) => {
  const id = req.query.id;

  try {
    await Report.deleteReport(id);
    res.redirect('/reports?success=Report deleted');
  } catch (err) {
    console.log(err);
    res.redirect('/reports?error=Failed to delete report');
  }
};
