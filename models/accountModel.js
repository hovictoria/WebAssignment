const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a username'],
    unique: true,
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
    enum: ['student', 'admin'],
    default: 'student'
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
});

const user = mongoose.model('User', userSchema, 'users');


async function registerUser(email, password) {
    const users = await readUsers();
    if (users[email]) {
        throw new Error("Email already exists");
    }
    users[email] = {
        password,role: "student",bookmarks:[]
    };
    await writeUsers(users);
}

async function authenticateUser(email, password) {
    const users = await readUsers();

    const user = users[email];

    if (!user) return false;

    return user.password === password;
}

module.exports = {
    registerUser,
    authenticateUser
};
