const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'A report must be linked to an event']
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A report must have a reporter']
  },
  reason: {
    type: String,
    required: [true, 'A report must include a reason'],
    trim: true,
    enum: ['Spam', 'Duplicate event', 'Inappropriate content', 'False information', 'Wrong category', 'Offensive language', 'Other']
  },
  details: {
    type: String,
    trim: true,
    maxlength: [500, 'Details cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });

reportSchema.index({ event: 1, reporter: 1, reason: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema, 'reports');

exports.createReport = function (newReport) {
  return Report.create(newReport);
};

exports.findDuplicateReport = function (eventId, reporterId, reason) {
  return Report.findOne({
    event: eventId,
    reporter: reporterId,
    reason
  });
};

exports.findAllReports = function () {
  return Report.find()
    .populate('event')
    .populate('reporter')
    .sort({ createdAt: -1 });
};
// This function retrieves all reports from the database, populates the associated event and reporter details, and sorts the reports in descending order based on their creation date, ensuring that the most recent reports are displayed first.

exports.findReportsByReporter = function (reporterId) {
  return Report.find({ reporter: reporterId })
    .populate('event')
    .populate('reporter')
    .sort({ createdAt: -1 });
};
// This function retrieves all reports by a specific reporter and populates the associated event and reporter details. It sorts the reports in descending order based on their creation date, ensuring that the most recent reports are displayed first.

exports.findById = function (id) {
  return Report.findById(id)
    .populate('event')
    .populate('reporter');
};

exports.updateStatus = function (id, status) {
  return Report.updateOne({ _id: id }, { status });
};
// This function updates the status of a report identified by its ID. It uses the updateOne method to set the new status value for the specified report in the database. returns a result object that indicates whether the update was successful and how many documents were modified. (matchedCount, modifiedCount)

exports.deleteReport = function (id) {
  return Report.deleteOne({ _id: id });
};
// This function deletes a report from the database based on its ID. It uses the deleteOne method to remove the specified report document from the collection. returns a result object that indicates whether the deletion was successful and how many documents were deleted. (deletedCount)