const Event = require("../models/eventModel");

//keyword searches title and description, category filters exact category, location filters partial match, date filters events on that exact day, .lean()makes the date easier/faster for EJS rendering
exports.showEvents = async (req, res) => {
    try {
        const keyword = (req.query.keyword || '').trim();
        const category = (req.query.category || '').trim();
        const location = (req.query.location || '').trim();
        const date = (req.query.date || '').trim();

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
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate() + 1);

            filter.date = {
                $gte: selectedDate,
                $lt: nextDate
            };
        }

        const events = await Event.find(filter).sort({ date: 1 }).lean();
        let user=req.session.user;
        res.render('events', {
            events,
            keyword,
            category,
            location,
            date,
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
            user
        });
    }
};


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


    const eventDate = new Date(date);

    //input validation
    if (title === '' || desc === '' || location === '' || cat === '' || org === ''|| date === ''){
        error = 'All fields are required'
    }
    //else if event both same event title and date exist: reject
    else if (eventDate < today){
        error = 'Event date cannot be in the past'
    }
    else{
        try {
            const existingEvent = await Event.findOne({
                title: title,
                date: eventDate
            });

            if (existingEvent) {
                error = 'An event with the same title and date already exists';
            } else {
                await Event.create({
                    title: title,
                    description: desc,
                    date: eventDate,
                    location: location,
                    category: cat,
                    organiser: org
                });

                success = 'Event created successfully!';
            }
        } catch (err) {
            console.log(err);
            error = 'Failed to create event';
        }
    }

    res.render('createEvent', {error, success, title, desc, date, location, cat, org})
}
