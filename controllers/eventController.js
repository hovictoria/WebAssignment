const fs = require('fs/promises');
const User = require("../models/userModel");
const Event = require('../models/eventModel');
const mongoose = require('mongoose');
const commentModel = require('../models/commentModel');

function canDeleteEvent(user, event) {
    if (!user || !event) return false;
    const today = new Date().toISOString().split('T')[0];
    if (event.date <= today) return false;        // ADD THIS
    if (user.role === 'Admin') return true;
    return String(event.organiser) === String(user.id);
}

function canEditEvent(user, event) {
    if (!user || !event) return false;
    const today = new Date().toISOString().split('T')[0];
    if (event.date <= today) return false;        // ADD THIS
    if (user.role === 'Admin') return true;
    return String(event.organiser) === String(user.id);
}

// ------ SHOW ALL events ------
exports.showEvents = async (req, res) => {
    try {
        const keyword = (req.query.keyword || '').trim();
        const category = (req.query.category || '').trim();
        const location = (req.query.location || '').trim();
        const date = (req.query.date || '').trim();
        const sortBy = (req.query.sortBy || 'dateDesc').trim();

        let filter = {};

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (category) filter.category = category;

        if (location) filter.location = { $regex: location, $options: 'i' };

        if (date) {
            console.log('Filtering by date:', date);
            filter.date = date;
        }

        let sortOption = { date: -1 };
        if (sortBy === 'dateAsc') sortOption = { date: 1 };
        else if (sortBy === 'title') sortOption = { title: 1 };
        else if (sortBy === 'titleDesc') sortOption = { title: -1 };

        const events = await Event.find(filter)
            .sort(sortOption)
            .collation({ locale: 'en', strength: 2 })
            .lean();

        // check status of event
        const today = new Date().toISOString().split('T')[0];
        events.forEach(event => {
            if (event.date > today) event.status = 'Upcoming';
            else if (event.date === today) event.status = 'Ongoing';
            else event.status = 'Past';
        });

        console.log('Filter applied:', filter);
        console.log('Events found:', events.length);

        const user = req.session.user;
        res.render('events', { events, keyword, category, location, date, sortBy, user });
    } catch (err) {
        console.log(err);
        const user = req.session.user;
        res.render('events', { events: [], keyword: '', category: '', location: '', date: '', sortBy: 'dateDesc', user });
    }
};

// ------ VIEW event ------
exports.getDetails = async (req, res) => {
    const user = req.session.user;
    const id = req.query._id;
    try {
        const event = await Event.findById(id);
        const organiser = await User.findByID(event.organiser);
        const comments = await commentModel.findByEvent(id);
        res.render('event-details', { event, organiser, error: '', user, comments });
    } catch (err) {
        console.error(err);
        res.render('event-details', { event: {}, error: 'Error getting event details.', user, comments: [] });
    }
};

// ------ CREATE event ------
exports.getCreateEventForm = async (req, res) => {
    res.render('create-event', { error: '', success: '', title: '', desc: '', date: '', time: '', location: '', cat: '', user: req.session.user });
};

exports.handleCreate = async (req, res) => {
    let error = '';
    let success = '';

    const todayDate = new Date();
    const today = todayDate.toISOString().split('T')[0];

    const title = req.body.title.trim();
    const desc = req.body.description.trim();
    const date = req.body.date;
    const time = (req.body.time || '').trim();
    const location = req.body.location.trim();
    const cat = req.body.category.trim();
    const eventDate = date;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

    if (title === '' || desc === '' || location === '' || cat === '' || cat === 'default' || date === '' || time === '') {
        error = 'All fields are required (please choose a category)';
    } else if (date <= today) {
        error = 'Event date cannot be in the past';
    } else {
        try {
            const existingEvent = await Event.checkExisting(title, eventDate);
            if (existingEvent) {
                error = 'An event with the same title and date already exists';
            } else {
                const user = req.session.user;
                const newEvent = {
                    title,
                    description: desc,
                    date,
                    time,
                    location,
                    category: cat,
                    imageUrl, 
                    organiser: user.id
                };
                await Event.addEvent(newEvent);
                success = 'Event created successfully!';
            }
        } catch (err) {
            console.error(err);
            error = 'Failed to create event.';
        }
    }

    res.render('create-event', { error, success, title, desc, date, time, location, cat, user: req.session.user });
};

// ------ EDIT event ------
exports.getEvent = async (req, res) => {
    const id = req.query._id;
    try {
        const result = await Event.findById(id);
        if (!canEditEvent(req.session.user, result)) {
            return res.render('update-event', { result: {}, date: '', success: '', error: 'You are not allowed to edit this event.', user: req.session.user });
        }
        const ymd = new Date(result.date).toISOString().split('T')[0];
        res.render('update-event', { result, date: ymd, success: '', error: '', user: req.session.user });
    } catch (err) {
        console.error(err);
        res.render('update-event', { result: {}, date: '', success: '', error: 'Failed to get Event.', user: req.session.user });
    }
};

exports.updateEvent = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    let success = '';
    let error = '';

    const title = req.body.title.trim();
    const desc = req.body.description.trim();
    const date = req.body.date;
    const time = (req.body.time || '').trim();
    const location = req.body.location.trim();
    const cat = req.body.category.trim();
    const id = req.body._id;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

    const currentData = { _id: id, title, description: desc, date, time, location, category: cat };

    if (title === '' || desc === '' || location === '' || cat === 'default' || time === '') {
        error = 'All fields are required';
        return res.render('update-event', { result: currentData, date, success: '', error, user: req.session.user });
    } else if (date <= today) {
        error = 'Event date cannot be in the past';
        return res.render('update-event', { result: currentData, date, success: '', error, user: req.session.user });
    }

    try {
        const existingEvent = await Event.findById(id);
        if (!canEditEvent(req.session.user, existingEvent)) {
            return res.render('update-event', { result: currentData, date, success: '', error: 'You are not allowed to edit this event.', user: req.session.user });
        }
        // const result = await Event.editEvent(id, title, desc, date, time, location, cat);
        const result = await Event.editEvent(id, title, desc, date, time, location, cat, imageUrl);
        success = 'Event updated successfully!';
        res.render('update-event', { result, date, success, error: '', user: req.session.user });
    } catch (err) {
        console.error(err);
        res.render('update-event', { result: currentData, date, success: '', error: 'Failed to update event.', user: req.session.user });
    }
};

// ------ DELETE event ------
exports.getDelEvent = async (req, res) => {
    const id = req.query._id;
    try {
        const result = await Event.findById(id);
        if (!canDeleteEvent(req.session.user, result)) {
            return res.render('delete-event', { result: {}, date: '', success: '', error: 'You are not allowed to delete this event.' });
        }
        const ymd = new Date(result.date).toISOString().split('T')[0];
        res.render('delete-event', { result, date: ymd, success: '', error: '' });
    } catch (err) {
        console.error(err);
        res.render('delete-event', { result: {}, date: '', success: '', error: 'Failed to get Event.' });
    }
};

exports.deleteAnEvent = async (req, res) => {
    let error = '';
    let success = '';
    let result = {};

    const id = req.body._id;
    

    try {
        const event = await Event.findById(id);
        if (!canDeleteEvent(req.session.user, event)) {
            return res.render('delete-event', { success: '', error: 'You are not allowed to delete this event.', result: event || {} });
        }
        result = await Event.deleteEvent(id);
        success = 'Event deleted!';
    } catch (err) {
        console.error(err);
        error = 'Failed to Delete';
    }

    res.render('delete-event', { success, error, result });
};
