/*
    Step 1: Create an express server object

    Step 2: Set up the server object: Middleware to handle static files and POST requests

    Step 3: Setup simple routes: GET / redirects to ./public/home.html, /about serves a string

    Step 4: Create more complex routes as express Routers (middleware)

    Step 5: Use ./data in the Routers to persist user info
*/

// (1)
const express = require('express');
const path = require('path');

const server = express();

// (2)
// Serve static files from *./public*
server.use(express.static(path.join(__dirname, "public")))
// This Middleware is used to handle the incoming escaped/encoded data
server.use(express.urlencoded({ extended: true }));
// Set up the views engine
server.set("view engine", "ejs");

// (3)
// Handles GET request: Redirect the GET request to a static file.
server.get('/', (req, res) => {
    res.redirect('/home.html')
})

// First Route: demonstrates how we can create different routes
server.get('/about', (req, res) => {
    res.send("First Route: Hey .... this is an awesome bubble tea")
})

// (4)
// Group the account related routes in a Router object and import it from ./routes/account.js
const account = require('./routes/account.js')
// Any route URL that *begins with* /account will be handled by account object (router)
server.use(account)

// // Order related routes in order Router
// const order = require('./routes/order.js')
// // Any route URL that begins with /order will be handled by order object (router)
// server.use(order)

// launch the web server
const hostname = 'localhost'
const port = 8000
const callback = function () {
    console.log(`Server running at http://${hostname}:${port}`)
}
server.listen(
    port, hostname, callback
)