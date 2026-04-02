
exports.canEdit=async(req,res,next)=>{
    if(!req.session.user){
        return res.redirect('/user/login?errors=Please login first');
    }
    const event = await Event.findById(id);
    let user=req.session.user;
    const today = new Date().toISOString().split('T')[0];
    if (event.date <= today) return false;        
    if (user.role === 'Admin') return true;
    return String(event.organiser) === String(user.id);
}