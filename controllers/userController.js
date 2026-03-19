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
    res.render("register", { email: undefined, name:undefined, errors: [] })
};

exports.handleRegister = async (req, res) => {
    let email = (req.body.email ?? "").trim();
    let name = req.body.name.trim();
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let errors = [];
    if (!email || !password) {
        errors="All fields are required";
    }
    if (password !== confirmpassword) {
        errors="Passwords don't match";
    }
    if (errors.length === 0) {
        try {
            let users = await User.findByEmail(email);
            if (users) {
                throw new Error("Email already exists");
            }
            let newuser = {
                name,email,password,role: "student",bookmarks:[]
            };
            await User.addUser(newuser);
        } catch (err) {
            errors=err.message;
        }
    }
    if(errors.length === 0){
        res.redirect('/index.html');
        return;
    }
    res.render("register", { email, name, errors});
};

exports.admin = async(req,res)=>{
    let data=await User.retrieveAll();
    res.render("admin",{data});
}