const User = require("../models/userModel");

exports.showLogin = (req, res) => {
    let errors=req.query.errors;
    res.render("login", { email: undefined, errors,user:"" });
};

exports.handleLogin = async (req, res) => {
    try{
        let email = (req.body.email ?? "").trim();
        let password = req.body.password;
        let errors = "";
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
                req.session.user = {
                    id: users._id,
                    name: users.name,
                    role: users.role
                }
                if(users.role=="admin"){
                    res.redirect("/admin");
                    return;
                }
                else{
                    res.redirect("/events");
                    return;
                }
                
            }
        }
        res.render("login", { email, errors,user:"" });
    }catch(err){
        console.log(err);
        res.redirect("/login");
    }
};

exports.showRegister = (req, res) => {
    res.render("register", { email: undefined, name:undefined, errors: [],user:"" })
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
        res.redirect('/login');
        return;
    }
    res.render("register", { email, name, errors,user:""});
};

exports.adminGet = async(req,res)=>{
    let user=req.session.user;
    let data=await User.retrieveAll();
    let editemail=req.query.email;
    let edit=await User.findByEmail(editemail);
    res.render("admin",{data,user,edit});
}

exports.editUser = async(req,res)=>{
    let email=req.body.email.trim();
    let password=req.body.password.trim();
    let role=req.body.role;
    let name=req.body.name.trim();
    let error="";
    if(email==""||password==""||role==""||name==""){
        error="All fields are required";
    }
}