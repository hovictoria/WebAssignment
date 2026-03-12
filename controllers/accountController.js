const Account = require("../models/accountModel");

exports.showLogin = (req, res) => {
    res.render("login", { email: undefined, errors: [] });
};

exports.handleLogin = async (req, res) => {
    let email = (req.body.email ?? "").trim();
    let password = req.body.password;
    let errors = [];
    if (!email) {
        errors.push("Email is required");
    }
    if (!password) {
        errors.push("Password is required");
    }
    if (errors.length === 0) {
        const isLoggedIn = await Account.authenticateUser(email, password);
        if (!isLoggedIn) {
            errors.push("Invalid username or password. <br> Try <a href='/register'>registering</a> first.");
        }
    }
    res.render("login", { userName, errors });
};

exports.showRegister = (req, res) => {
    res.render("register", { userName: undefined, fullName: undefined, showForm: true, errors: [] })
};

exports.handleRegister = async (req, res) => {
    let email = (req.body.email ?? "").trim();
    let password = req.body.password;
    let password2 = req.body.password2;
    let errors = [];
    if (!email) {
        errors.push("Email is required");
    }
    if (!password) {
        errors.push("Password is required");
    }
    if (password !== password2) {
        errors.push("Passwords don't match");
    }
    if (errors.length === 0) {
        try {
            await Account.registerUser(email, password);
        } catch (err) {
            errors.push(err.message);
        }
    }
    res.render("register", { email, errors });
};