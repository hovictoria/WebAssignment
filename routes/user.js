const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/auth-middleware');

router.get("/home",authMiddleware.isLoggedIn,userController.home)
router.get("/login", userController.showLogin);
router.post("/login", userController.handleLogin);
router.get("/logout",userController.logout);

router.get("/register", userController.showRegister);
router.post("/register", userController.handleRegister);

router.get("/admin", authMiddleware.isAdmin,userController.adminGet);
router.post("/edit-user",userController.editUser);
router.get("/delete-user",userController.deleteUser);

module.exports = router;
