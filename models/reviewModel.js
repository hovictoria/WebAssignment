const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A review must have a user']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'A review must have an event']
  },
  comment: {
    type: String,
    required: [true, 'A review must have content']
  },
  edited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema, 'reviews');

exports.createReview = function(data) {
    return Review.create(data);
};


exports.findById = function(id) {
    return Review.findOne({ _id: id });
};

exports.findByEvent = function(eventId) {
    return Review.find({ event: eventId }).populate('user', 'name');
};

exports.updateReview = function(id, comment) {
    return Review.updateOne(
        { _id: id },
        { comment: comment, edited: true }
    );
};

exports.deleteReview = function(id) {
    return Review.deleteOne({ _id: id });
};




