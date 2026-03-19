// const events = require("../models/eventModel");

exports.showEvents = async(req,res) => {
    res.render('events')
}


exports.getCreateEventForm = async(req,res) => {
    res.render('createEvent', {error: '', success:'', title:'', desc:'', date:'', location:'', cat:'', org:''})
    
}


exports.handleCreate = async(req,res) => {
    let error = '';
    let success = ''
    // date created
    const createdAt = new Date();       
    const today = new Date();              
    today.setHours(0, 0, 0, 0);   

    //get form input
    const title = req.body.title.trim()
    const desc = req.body.description.trim()
    const date = req.body.date
    const location = req.body.location.trim()
    const cat = req.body.category.trim()
    const org = req.body.organise.trim()

    //input validation
    if (title === '' || desc === '' || location === '' || cat === '' || org === ''){
        error = 'All fields are required'
    }
    //else if event both same event title and date exist: reject
    else if (date < today){
        error = 'Event date cannot be in the past'
    }
    else{
        //add data to db
        success = 'Event created successfully!'
    }

    res.render('createEvent', {error, success, title, desc, date, location, cat, org})
}
