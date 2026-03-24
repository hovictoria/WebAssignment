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
    trim: true
  },
  details: {
    type: String,
    required: [true, 'A report must include details'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Resolved'],
    default: 'Pending'
  }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema, 'reports');

exports.createReport = function (newReport) {
  return Report.create(newReport);
};

exports.findAllReports = function () {
  return Report.find()
    .populate('event')
    .populate('reporter')
    .sort({ createdAt: -1 });
};

exports.findReportsByReporter = function (reporterId) {
  return Report.find({ reporter: reporterId })
    .populate('event')
    .populate('reporter')
    .sort({ createdAt: -1 });
};

exports.findById = function (id) {
  return Report.findById(id)
    .populate('event')
    .populate('reporter');
};

exports.updateStatus = function (id, status) {
  return Report.updateOne({ _id: id }, { status });
};

exports.deleteReport = function (id) {
  return Report.deleteOne({ _id: id });
};
