const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const ADMIN_REGISTER_CODE = "admin123";

exports.home=(req,res)=>{
    let user=req.session.user;
    if(user.role=="Student"){
    res.render("studenthome",{user});}
    else if(user.role=="Admin"){
        res.redirect("/admin");
    }
}


exports.showRegister = (req, res) => {
    delete req.session.pendingAdminRegistration;
    res.render("register", { email: undefined, name: undefined, role: "Student", errors: "", user: "" });
};

exports.handleRegister = async (req, res) => {
    let email = (req.body.email ?? "").trim();
    let name = (req.body.name ?? "").trim();
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let role = (req.body.role ?? "Student").trim();
    let errors = [];
    const allowedRoles = ["Student", "Admin"];

    if (!email || !password || !name || !confirmpassword) {
        errors="All fields are required";
    }
    if (!allowedRoles.includes(role)) {
        errors="Invalid role selected";
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
            password = await bcrypt.hash(password, 10);

            if (role === "Admin") {
                req.session.pendingAdminRegistration = {
                    name,
                    email,
                    password,
                    role,
                    bookmarks: []
                };
                res.redirect("/register/admin-code");
                return;
            }

            const createdUser = await User.addUser({
                name, email, password, role, bookmarks: []
            });

            req.session.user = {
                id: createdUser._id,
                name: createdUser.name,
                role: createdUser.role,
                email: createdUser.email
            };
        } catch (err) {
            errors=err.message;
        }
    }
    if(errors.length === 0){
        if (req.session.user.role === "Admin") {
            res.redirect('/admin');
            return;
        }
        res.redirect('/home');
        return;
    }
    res.render("register", { email, name, role, errors, user:""});
};

exports.showAdminCode = (req, res) => {
    if (!req.session.pendingAdminRegistration) {
        res.redirect("/register");
        return;
    }

    res.render("admin-code", { errors: "", user: "" });
};

exports.handleAdminCode = async (req, res) => {
    const adminCode = (req.body.adminCode ?? "").trim();
    const pendingUser = req.session.pendingAdminRegistration;

    if (!pendingUser) {
        res.redirect("/register");
        return;
    }

    if (!adminCode) {
        res.render("admin-code", { errors: "Admin registration code is required", user: "" });
        return;
    }

    if (adminCode !== ADMIN_REGISTER_CODE) {
        res.render("admin-code", { errors: "Incorrect admin code", user: "" });
        return;
    }

    try {
        const existingUser = await User.findByEmail(pendingUser.email);
        if (existingUser) {
            delete req.session.pendingAdminRegistration;
            res.render("register", {
                email: pendingUser.email,
                name: pendingUser.name,
                role: pendingUser.role,
                errors: "Email already exists",
                user: ""
            });
            return;
        }

        const createdUser = await User.addUser(pendingUser);
        delete req.session.pendingAdminRegistration;

        req.session.user = {
            id: createdUser._id,
            name: createdUser.name,
            role: createdUser.role,
            email: createdUser.email
        };

        res.redirect("/admin");
    } catch (err) {
        res.render("admin-code", { errors: "Something went wrong", user: "" });
    }
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
                    role: users.role,
                    email:users.email
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
        let email=req.query.email;
        let edit=await User.findByEmail(email);
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
    let email=req.body.email;
    let password=req.body.password.trim();
    let role=req.body.role;
    let name=req.body.name.trim();
    let error="";
    let success="";
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
            let result=await User.editUser(email,updateData);
            if(result.modifiedCount==0){
                success="No changes made";
            }else{
                success="Updated successfully";
            }
            
        }catch(error){
            console.log(error);
            error="Something went wrong";
        }
    }
    if(error==""){
        res.redirect(`/admin?success=${success}`)
    }else{
        res.redirect(`/admin?error=${error}&email=${email}`)
    }
}

exports.profileGet = async(req,res)=>{
    try{
        let user=req.session.user;
        let edit=req.query.edit;
        let del=req.query.delete;
        let message=req.query.message;
        res.render("profile",{user,edit,del,message});
    }catch(error){
        console.log(error);
    }
}

exports.profileEdit = async(req,res)=>{
    let name=req.body.name.trim();
    let password=req.body.password;
    let email=req.body.email;
    let message="";
    if(name==""){
        message="Name is required";
    }
    else{
        try{
            let updateData = {
                name: name
            };
            if (password !== "") {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }
            let result=await User.editUser(email,updateData);
            if(result.modifiedCount==0){
                message="No changes made";
            }else{
                message="Updated successfully";
            }
            req.session.user.name = name;
        }catch(error){
            message=error;
            console.log(error);
        }
    }
    res.redirect(`/profile?message=${message}`);
}

exports.profileDelete=async(req,res)=>{
    let email=req.body.email;
    try{
        await User.deleteUser(email);
        req.session.destroy(() => {
            res.redirect("/login?errors=Account deleted");
        });
    }catch(error){
        console.log(error);
        res.redirect("/profile?message=Error deleting");

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
