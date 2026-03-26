const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/auth-middleware');

router.get("/home",authMiddleware.isLoggedIn,userController.home)
router.get("/login", authMiddleware.hasLoggedIn,userController.showLogin);
router.post("/login", userController.handleLogin);
router.get("/logout",userController.logout);

router.get("/register", authMiddleware.hasLoggedIn,userController.showRegister);
router.post("/register", authMiddleware.hasLoggedIn, userController.handleRegister);

router.get("/profile",authMiddleware.isLoggedIn,userController.profileGet);
router.post("/profileedit",userController.profileEdit);
router.post("/profiledelete",userController.profileDelete);

router.get("/admin", authMiddleware.isLoggedIn,authMiddleware.isAdmin,userController.adminGet);
router.post("/edit-user",userController.editUser);
router.get("/delete-user",authMiddleware.isLoggedIn,authMiddleware.isAdmin,userController.deleteUser);

module.exports = router;
