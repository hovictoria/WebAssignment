const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'A user must have a password']
  },
  role: {
    type: String,
    enum: ['Student', 'Admin'],
    default: 'Student'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
});

const User = mongoose.model('User', userSchema, 'user');

exports.retrieveAll = function() {
  return User.find();
};

exports.findByEmail = function(email){
    return User.findOne({email});
}

exports.findByID = function(id){
    return User.findOne({_id:id});
}

exports.addUser = function(user){
    return User.create(user);
}

exports.editUser = async (id, updateData) => {
    return User.updateOne({_id:id},updateData);
};

exports.deleteUser = function(email){
    return User.deleteOne({email});
}


