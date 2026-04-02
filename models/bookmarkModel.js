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
const Bookmark = mongoose.model('Bookmark', bookmarkSchema, 'bookmarks');

exports.retrieveAlluserBookmarks = function(userId) {
  return Bookmark.find({userId});
};

exports.findByUserIdandEventId = function(userId,eventId){
    return Bookmark.findOne({userId,eventId});
}

exports.createBookmark = function(userId,eventId){
    return Bookmark.create({userId,eventId,notes:""});
}

exports.editBookmark = async (id, notes) => {
    return Bookmark.updateOne({_id:id},{notes},{ runValidators: true });
};

exports.deleteBookmark = function(id,userId){
    return Bookmark.deleteOne({_id: id,userId});
}

// exports.findByID = function(id){
//   return Bookmark.findOne({_id: id})
// }
