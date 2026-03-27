const fs = require('fs/promises');
const User = require("../models/userModel");
const Event = require('../models/eventModel');
const mongoose = require('mongoose');
const reviewModel = require('../models/reviewModel');


function canDeleteEvent(user, event) {
    if (!user || !event) {
        return false;
    }

    if (user.role === 'Admin') {
        return true;
    }

    return String(event.organiser) === String(user.id);
}

function canEditEvent(user, event) {
    if (!user || !event) {
        return false;
    }

    if (user.role === 'Admin') {
        return true;
    }

    return String(event.organiser) === String(user.id);
}

// // ------ SHOW ALL events ------
// exports.showEvents = async(req,res) => {
//     let error = '';
//     try{
//         let eventlist = await Event.retriveAll();
//         res.render('events', {eventlist, error});
//     } catch (err){
//         error = 'Error Reading Database.';
//         res.render('events', {eventlist : {}, error});
//     }
// }


//keyword searches title and description, category filters exact category, location filters partial match, date filters events on that exact day, .lean()makes the date easier/faster for EJS rendering
exports.showEvents = async (req, res) => {
    try {
        const keyword = (req.query.keyword || '').trim();
        const category = (req.query.category || '').trim();
        const location = (req.query.location || '').trim();
        const date = (req.query.date || '').trim();
        const sortBy = (req.query.sortBy || 'date').trim();

        let filter = {};

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (date) {
            console.log('Filtering by date:', date);
            filter.date = date;
        }

        let sortOption = { date: 1 };
        if (sortBy === 'title') {
            sortOption = { title: 1 };
        } else if (sortBy === 'titleDesc') {
            sortOption = { title: -1 };
        }

        const events = await Event.find(filter)
            .sort(sortOption)
            .collation({ locale: 'en', strength: 2 })
            .lean();
        console.log('Filter applied:', filter);
        console.log('Events found:', events.length);
        let user=req.session.user;
        res.render('events', {
            events,
            keyword,
            category,
            location,
            date,
            sortBy,
            user
        });
    } catch (err) {
        console.log(err);
        let user=req.session.user;
        res.render('events', {
            events: [],
            keyword: '',
            category: '',
            location: '',
            date: '',
            sortBy: 'date',
            user
        });
    }
};


// ------ VIEW event ------
exports.getDetails = async (req,res) => {
    const user=req.session.user;
    const id = req.query._id;
    let error = '';
    try{
        let event = await Event.findById(id);
        let organiser = await User.findByID(event.organiser);
        const reviews = await reviewModel.findByEvent(id); 
        res.render('event-details', { event, organiser, error: '', user,reviews });
    } catch (err){
        error = 'Error Reading Database.';
        res.render('event-details', {event: {}, error: 'Error getting event details.', user,reviews:[]});
    }

}


// ------ CREATE event ------
exports.getCreateEventForm = async(req,res) => {
    res.render('create-event', {error: '', success:'', title:'', desc:'', date:'', time:'', location:'', cat:''})
    
}


exports.handleCreate = async(req,res) => {
    let error = '';
    let success = ''

    // date created
    const createdAt = new Date();       
    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0]             
    // const today = new Date();              
    // today.setHours(0, 0, 0, 0);   
    // const todayStr = today.toISOString().split('T')[0];

    //get form input
    const title = req.body.title.trim();
    const desc = req.body.description.trim();
    const date = req.body.date; // yyyy/mm/dd
    const time = (req.body.time || '').trim();
    const location = req.body.location.trim();
    const cat = req.body.category.trim();


    const eventDate = date;

    //input validation
    if (title === '' || desc === '' || location === '' || cat === '' || cat === 'default' || date === '' || time === ''){
        error = 'All fields are required (please choose a category)'
    }
    //else if event both same event title and date exist: reject
    else if (date <= today){
    // else if (eventDate < todayStr){
        error = 'Event date cannot be in the past'
    }
    else{
        //add data to db
        try{
            const existingEvent = await Event.checkExisting(title, eventDate)

            if (existingEvent) {
                error = 'An event with the same title and date already exists';
            }
            else{
                let user = req.session.user;
                let newEvent = 
                {
                    title: title,
                    description: desc,
                    date: date,
                    time: time,
                    location: location,
                    category: cat,
                    organiser: user.id
                };
            let result = await Event.addEvent(newEvent);
            success = 'Event created successfully!'
            }
        }
        catch(err){
            console.error(err);
            // console.log(err)
            error = 'Failed to create event.'
        }
    }

    res.render('create-event', {error, success, title, desc, date, time, location, cat})
}


// ------ EDIT event ------
exports.getEvent = async(req,res) => {
    const id = req.query._id;
    try{
        let result = await Event.findById(id);
        if (!canEditEvent(req.session.user, result)) {
            return res.render('update-event', {result:{}, date:'', success: '', error: 'You are not allowed to edit this event.'});
        }
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
    const time = (req.body.time || '').trim();
    const location = req.body.location.trim();
    const cat = req.body.category.trim();
    const id = req.body._id;

    currentData ={
            _id: id,  
            title: title,
                description: desc,
                date: date,
                time: time,
                location: location,
                category: cat,
        }

    //input validation
    if (title === '' || desc === '' || location === '' || cat === 'default' || time === ''){
        error = 'All fields are required'
        return res.render('update-event', {result:currentData, date, success: '', error});
    }
    //else if event both same event title and date exist: reject
    else if (date <= today){
        error = 'Event date cannot be in the past'
        return res.render('update-event', {result:currentData, date, success: '', error});
    }
    try{
        const existingEvent = await Event.findById(id);
        if (!canEditEvent(req.session.user, existingEvent)) {
            return res.render('update-event', {result:currentData, date, success: '', error: 'You are not allowed to edit this event.'});
        }

        let result = await Event.editEvent(id, title, desc, date, time, location, cat);
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
        if (!canDeleteEvent(req.session.user, result)) {
            return res.render('delete-event', {result:{}, date:'', success: '', error: 'You are not allowed to delete this event.'});
        }
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
        const event = await Event.findById(id);
        if (!canDeleteEvent(req.session.user, event)) {
            return res.render('delete-event', {success: '', error: 'You are not allowed to delete this event.', result: event || {}});
        }

        let result = await Event.deleteEvent(id);
        success = 'Event deleted!';
    }
    catch(err){
        console.error(err);
        error = 'Failed to Delete';
    }

    res.render('delete-event', {success, error, result})
}

