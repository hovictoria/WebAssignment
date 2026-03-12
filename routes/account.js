/*
    Step 1: Create an express Router object (done)

    Step 2: Load async versions of fs methods (in accountModel.js)

    Step 3: Setup a user "database" (in accountModel.js)

    Step 4: Write (async) helper functions to read/write users (in accountModel.js)

    Step 5: Write (async) functions to register/authenticate users (in accountModel.js)

    Step 6: Point the URL endpoints (routes) to methods in accountController.js
*/

// (1)
const express = require('express');
const router = express.Router();

// (6)
const accountController = require("../controllers/accountController");
router.get("/login", accountController.showLogin);
router.post("/login", accountController.handleLogin);

router.get("/register", accountController.showRegister);
router.post("/register", accountController.handleRegister);

module.exports = router;
