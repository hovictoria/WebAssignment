const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

exports.home=(req,res)=>{
    let user=req.session.user;
    if(user.role=="Student"){
    res.render("studenthome",{user});}
    else{
        res.redirect("/admin");
    }
}


exports.showRegister = (req, res) => {
    res.render("register", { email: undefined, name:undefined, errors: [],user:"" });
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
            password=await bcrypt.hash(password,10);
            let newuser = {
                name,email,password,role: "Student",bookmarks:[]
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
            else if(!await bcrypt.compare(password,users.password)){
                errors="Invalid password";
            }
            else{
                req.session.user = {
                    id: users._id,
                    name: users.name,
                    role: users.role
                }
                if(users.role=="Admin"){
                    res.redirect("/admin");
                    return;
                }
                else{
                    res.redirect("/home");
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

exports.adminGet = async(req,res)=>{
    try{
        let user=req.session.user;
        let data=await User.retrieveAll();
        let editemail=req.query.email;
        let edit=await User.findByEmail(editemail);
        let error=req.query.error;
        let success=req.query.success;
        res.render("admin",{data,user,edit,error,success});
    }
    catch(error){
        console.log(error);
        res.redirect("/login");
    }
    
}

exports.editUser = async(req,res)=>{
    let email=req.body.email.trim();
    let password=req.body.password.trim();
    let role=req.body.role;
    let name=req.body.name.trim();
    let error="";
    if(email==""||role==""||name==""){
        error="All fields are required";
    }
    else{
        try{
            let updateData = {
                name: name,
                role: role
            };
            if (password !== "") {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }
            await User.editUser(email,updateData);
        }catch(error){
            console.log(error);
            error="Something went wrong";
        }
    }
    if(error==""){
        res.redirect("/admin?success=Updated successfully")
    }else{
        res.redirect(`/admin?error=${error}&email=${email}`)
    }
}

exports.deleteUser=async(req,res)=>{
    let email=req.query.email;
    try{
        await User.deleteUser(email);
        res.redirect("/admin?success=Deleted successfully");
    }catch(error){
        console.log(error);
        res.redirect("/admin?error=Error deleting");

    }
    
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}