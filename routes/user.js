
const express = require('express');
const router = express.Router();

const accountController = require("../controllers/userController");
router.get("/login", accountController.showLogin);
router.post("/login", accountController.handleLogin);

router.get("/register", accountController.showRegister);
router.post("/register", accountController.handleRegister);
router.get("/admin", accountController.admin);

module.exports = router;
