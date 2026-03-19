const User = require("../models/userModel");

exports.showLogin = (req, res) => {
    res.render("login", { email: undefined, errors: [] });
};

exports.handleLogin = async (req, res) => {
    let email = (req.body.email ?? "").trim();
    let password = req.body.password;
    let errors = "";
    if(email=="admin@admin.com" && password=="admin"){
        res.redirect("/admin");
        return;
    }
    if (!email || !password) {
        errors="All fields are required";
    }
    else{
        const users = await User.findByEmail(email);
        if (!users) {
            errors="Account does not exist";
        }
        else if(password!=users.password){
            errors="Invalid password";
        }
        else{
            res.redirect('/');
            return;
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
            const users = await User.retrieveAll();
            if (users[email]) {
                throw new Error("Email already exists");
            }
            users = {
                email,password,role: "student",bookmarks:[]
            };
            await User.writeUsers(users);
        } catch (err) {
            errors.push(err.message);
        }
    }
    if(errors.length === 0){
        res.redirect('/index.html');
    }
    res.render("register", { email, errors });
};

exports.admin = async(req,res)=>{
    let data=await User.retrieveAll();
    res.render("admin",{data});
}