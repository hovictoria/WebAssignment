const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An RSVP must have a user']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'An RSVP must have an event']
  },
  status: {
    type: String,
    enum: ['Going', 'Maybe'],
    default: 'Going'
  },
  rsvpDate: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

const RSVP = mongoose.model('RSVP', rsvpSchema, 'rsvps');

exports.findByEvent = function (eventId) {
  return RSVP.find({ event: eventId }).populate('user');
};

exports.findARSVP = function (userId, eventId) {
  return RSVP.findOne({ user: userId, event: eventId });
};

exports.findRSVPById = function (id) {
  return RSVP.findById(id);
};

exports.findByUser = function (userId) {
  return RSVP.find({ user: userId }).populate('event');
};

exports.createRSVP = function (userId, eventId, status) {
  return RSVP.create({ user: userId, event: eventId, status });
};

exports.updateRSVP = function (rsvp, status) {
  rsvp.status = status;
  rsvp.rsvpDate = Date.now();
  return rsvp.save();
};

exports.deleteRSVP = function (id) {
  return RSVP.findByIdAndDelete(id);
};