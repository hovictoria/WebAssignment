const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'An event must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'An event must have a description']
  },
  date: {
    type: Date,
    required: [true, 'An event must have a date']
  },
  location: {
    type: String,
    required: [true, 'An event must have a location']
  },
  category: {
    type: String,
    required: [true, 'An event must have a category'],
    enum: ['Academic', 'Social', 'Sports', 'Workshop', 'Other']
  },
  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An event must have an organiser']
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;
