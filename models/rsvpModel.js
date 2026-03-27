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
    enum: ['Going', 'Maybe', 'Not going'],
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

module.exports = RSVP;
