const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.static(path.join(__dirname, "public")))
server.use(express.urlencoded({ extended: true }));

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

const secret = process.env.SECRET;
server.use(session({
    secret: secret,
    resave: false, 
    saveUninitialized: false 
}));

server.get('/', (req, res) => {
  let user=req.session.user;
  res.redirect('/index.html',{user});
})

const user = require('./routes/userRoutes')
server.use(user)

const eventRoutes = require("./routes/eventRoutes");
server.use(eventRoutes)

const reportRoutes = require('./routes/reportRoutes');
server.use(reportRoutes)

const rsvpRoutes = require('./routes/rsvpRoutes');
server.use(rsvpRoutes)

const bookmarksRoutes = require('./routes/bookmarksRoutes');
server.use(bookmarksRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
server.use('/review', reviewRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; 
  const port = 8000;
 
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

connectDB().then(startServer);
