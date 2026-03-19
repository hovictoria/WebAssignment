const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

const server = express();

server.use(express.static(path.join(__dirname, "public")))
server.use(express.urlencoded({ extended: true }));

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.get('/', (req, res) => {
    res.redirect('/index.html');
})

const user = require('./routes/user')
server.use(user)

const eventRoutes = require("./routes/eventRoutes");
server.use(eventRoutes)

// Specify the path to the environment variablef file 'config.env'
dotenv.config({ path: './config.env' });

// async function to connect to DB
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; // Define server hostname
  const port = 8000;// Define port number
 
  // Start the server and listen on the specified hostname and port
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);