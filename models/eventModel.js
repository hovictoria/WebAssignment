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
    type: String,
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
    required: [true, 'An event must have an organiser'],
    trim: true
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema, 'events');

exports.find = function (filter) {
  return Event.find(filter);
}

exports.checkExisting = function(title, date){
  return Event.findOne({title: title,
                date: date});
}
exports.retriveAll = function() {
    return Event.find();
}

exports.addEvent = function(newEvent) {
    return Event.create(newEvent);
}

exports.findById = function(id){
    return Event.findOne({_id:id});
}

exports.editEvent = function(id, title, description, date, location, category) {
    return Event.updateOne({_id:id}, {title:title, description:description, date: date, location:location, category:category});
}

exports.deleteEvent = function(id){
    return Event.deleteOne({_id:id})
}

// module.exports = Event;