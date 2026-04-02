const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const Report = require('../models/reportModel');

const reportReasons = ['Spam', 'Duplicate event', 'Inappropriate content', 'False information', 'Wrong category', 'Offensive language', 'Other'];

exports.getCreateReportForm = async (req, res) => { 
  //defines and exports a controller function for loading the report form page for a specific event. it reads the event ID from the URL query string, validates it, and loads the event details to display on the form. If any step fails, it redirects back to the events listing page.
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
      userId: req.session.user ? req.session.user.id : null, //Logs the user id if there is a logged-in user, otherwise null
      error: err.message
    });
    res.redirect('/events');
  }
};

exports.handleCreateReport = async (req, res) => { 
  //this function handles the form submission for creating a new report. It validates the input, checks that the event exists, and then creates a new report in the database. If there are validation errors or if the database operation fails, it re-renders the form with appropriate error messages.
  const eventId = req.body.eventId;
  const reason = (req.body.reason || '').trim();
  const details = (req.body.details || '').trim();

  let event = null;
  let error = '';
  let success = '';

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) { //if invalid redirect user to /events.
      return res.redirect('/events');
    }

    event = await Event.findById(eventId);
    if (!event) {
      return res.redirect('/events'); //if event not found redirect user to /events.
    }

    if (!reportReasons.includes(reason)) { //if reason is not in the predefined list of report reasons, set an error message.
      error = 'Please select a reason';
    } else if (reason === 'Other' && details === '') { //if reason is "Other" but details are empty, set an error message indicating that details are required.
      error = 'Details are required when reason is Other';
    } else {
      const existingReport = await Report.findDuplicateReport(eventId, req.session.user.id, reason);
      if (existingReport) {
        error = 'You have already submitted a report for this event with the same reason';
      } else {
        await Report.createReport({ //if validation passes, create a new report in the database with the provided event ID, reporter ID (from the session), reason, details, and a default status of "Pending".
          event: eventId,
          reporter: req.session.user.id,
          reason,
          details,
          status: 'Pending'
        });
        success = 'Report submitted successfully';
      }
    }

    res.render('create-report', {  //re-render the form with the original input values and any error or success messages. This allows the user to correct any issues without losing their input.
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
    if (err.name === 'ValidationError' && err.errors && err.errors.details && err.errors.details.kind === 'maxlength') { //if the error is a Mongoose validation error related to the "details" field exceeding the maximum length, set a specific error message indicating that the character limit was exceeded.
      submitError = 'Failed to submit report. Length exceeds character limit.';
    } else if (err.code === 11000) {
      submitError = 'You have already submitted a report for this event with the same reason';
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
    const reports = await Report.findAllReports(); //this function retrieves all reports from the database and renders them on the "reports" page. It also handles any errors that occur during the retrieval process and logs them with relevant details.
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
