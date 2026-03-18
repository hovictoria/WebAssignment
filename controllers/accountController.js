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
            errors.push("Invalid username or password.");
        }
        else{
            res.redirect('/index.html');
        }
    }
    res.render("login", { email, errors });
};

exports.showRegister = (req, res) => {
    res.render("register", { email: undefined, errors: [] })
};

exports.handleRegister = async (req, res) => {
    let email = (req.body.email ?? "").trim();
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let errors = [];
    if (!email) {
        errors.push("Email is required");
    }
    if (!password) {
        errors.push("Password is required");
    }
    if (password !== confirmpassword) {
        errors.push("Passwords don't match");
    }
    if (errors.length === 0) {
        try {
            await Account.registerUser(email, password);
        } catch (err) {
            errors.push(err.message);
        }
    }
    if(errors.length === 0){
        res.redirect('/index.html');
    }
    res.render("register", { email, errors });
};