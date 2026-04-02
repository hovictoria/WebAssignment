const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  }
});

// Prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);