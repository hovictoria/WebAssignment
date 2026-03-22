const express = require('express');
const router = express.Router();
const accountController = require("../controllers/userController");
const authMiddleware = require('../middleware/auth-middleware');

router.get("/login", accountController.showLogin);
router.post("/login", accountController.handleLogin);

router.get("/register", accountController.showRegister);
router.post("/register", accountController.handleRegister);

router.get("/admin", authMiddleware.isAdmin,accountController.adminGet);
router.post("/edit-user",accountController.editUser);
module.exports = router;
