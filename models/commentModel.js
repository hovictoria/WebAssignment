const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have a user']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'A comment must have an event']
  },
  comment: {
    type: String,
    required: [true, 'A comment must have content']
  },
  edited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema, 'comments');

exports.createComment = function(data) {
    return Comment.create(data);
};

exports.findById = function(id) {
    return Comment.findOne({ _id: id });
};

exports.findByEvent = function(eventId) {
    return Comment.find({ event: eventId }).populate('user', 'name');
};

exports.updateComment = function(id, comment) {
    return Comment.updateOne(
        { _id: id },
        { comment: comment, edited: true }
    );
};

exports.deleteComment = function(id) {
    return Comment.deleteOne({ _id: id });
};
