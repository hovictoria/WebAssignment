const fs = require('fs/promises');
const Event = require('./../models/eventModel');
const mongoose = require('mongoose');

// ------ SHOW ALL events ------
exports.showEvents = async(req,res) => {
    let error = '';
    try{
        let eventlist = await Event.retriveAll();
        res.render('events', {eventlist, error});
    } catch (err){
        error = 'Error Reading Database.';
        res.render('events', {eventlist : {}, error});
    }
}

// ------ CREATE event ------
exports.getCreateEventForm = async(req,res) => {
    res.render('create-event', {error: '', success:'', title:'', desc:'', date:'', location:'', cat:''})
    
}


exports.handleCreate = async(req,res) => {
    let error = '';
    let success = ''
    // date created
    const createdAt = new Date();       
    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0]             

    //get form input
    const title = req.body.title.trim();
    const desc = req.body.description.trim();
    const date = req.body.date; // yyyy/mm/dd
    const location = req.body.location.trim();
    const cat = req.body.category.trim();

    //input validation
    if (title === '' || desc === '' || location === '' || cat === 'default'){
        error = 'All fields are required'
    }
    //else if event both same event title and date exist: reject
    else if (date <= today){
        error = 'Event date cannot be in the past'
    }
    else{
        //add data to db
        try{
            let newEvent = 
            {
                title: title,
                description: desc,
                date: date,
                location: location,
                category: cat,
                organiser: new mongoose.Types.ObjectId("69bb8aee6f341f93b40a499a")
            };
        let result = await Event.addEvent(newEvent);
        success = 'Event created successfully!'
        }
        catch(err){
            console.error(err);
            // console.log(err)
            error = 'Error adding event!'
        }
    }

    res.render('create-event', {error, success, title, desc, date, location, cat})
}


// ------ EDIT event ------
exports.getEvent = async(req,res) => {
    const id = req.query._id;
    try{
        let result = await Event.findById(id);
        const d = new Date(result.date);
        const ymd = d.toISOString().split('T')[0];
        res.render('update-event', {result, date:ymd, success: '', error: ''});
        // console.log(ymd)
    }
    catch(err){
        console.error(err);
        let error = 'Failed to get Event.'
        res.render('update-event', {result:{}  , date:'', success: '', error});
    }
}

exports.updateBook = async(req,res) => {
    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0]        
    let success = '';
    let error = '';

    const title = req.body.title.trim();
    const desc = req.body.description.trim();
    const date = req.body.date;
    const location = req.body.location.trim();
    const cat = req.body.category.trim();
    const id = req.body._id;

    currentData ={
            _id: id,  
            title: title,
                description: desc,
                date: date,
                location: location,
                category: cat,
        }

    //input validation
    if (title === '' || desc === '' || location === '' || cat === 'default'){
        error = 'All fields are required'
        return res.render('update-event', {result:currentData, date, success: '', error});
    }
    //else if event both same event title and date exist: reject
    else if (date <= today){
        error = 'Event date cannot be in the past'
        return res.render('update-event', {result:currentData, date, success: '', error});
    }
    try{
        let result = await Event.editEvent(id, title, desc, date, location, cat);
        success = 'Event created successfully!';
        res.render('update-event', {result, date, success, error:''})
    }
    catch(err){
        console.error(err);
        let error = 'Failed to update event.'
        res.render('update-event', {result:currentData,date, success: '', error});
        
    }
};


// ------ DELETE event ------
exports.getDelEvent = async(req,res) => {
    const id = req.query._id;
    try{
        let result = await Event.findById(id);
        const d = new Date(result.date);
        const ymd = d.toISOString().split('T')[0];
        res.render('delete-event', {result, date:ymd, success: '', error: ''});
    }
    catch(err){
        console.error(err);
        let error = 'Failed to get Event.'
        res.render('delete-event', {result:{}  , date:'', success: '', error});
    }
}

exports.deleteAnEvent = async(req, res) => {
    let error = '';
    let success = '';
    let result = {};

    const id = req.body._id;

    try{
        let result = await Event.deleteEvent(id);
        success = 'Event deleted!';
    }
    catch(err){
        console.error(err);
        error = 'Failed to Delete';
    }

    res.render('delete-event', {success, error, result})
}