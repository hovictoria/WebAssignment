const RSVP = require('../models/rsvpModel');
const Event = require('../models/eventModel');

const ALLOWED_STATUSES = ['Going', 'Maybe'];

// SHOW RSVP PAGE FOR ONE EVENT
exports.getRsvpPage = async (req, res) => {
  try {
    const eventId = req.query._id;
    const userId = req.session.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.send("Event not found");
    }

    const rsvps = await RSVP.find({ event: eventId }).populate('user');
    const myRsvp = await RSVP.findOne({ user: userId, event: eventId });

    let user = req.session.user || null;

    res.render('rsvp', {
      event,
      rsvps,
      myRsvp,
      error: req.query.error || '',
      success: req.query.success || '',
      user
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading RSVP page");
  }
};

// CREATE RSVP
exports.createRsvp = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.session.user.id;
    const status = ALLOWED_STATUSES.includes(req.body.status) ? req.body.status : 'Going';

    const event = await Event.findById(eventId);
    if (!event) {
      return res.send("Event not found");
    }

    const existing = await RSVP.findOne({ user: userId, event: eventId });

    if (existing) {
      existing.status = status;
      existing.rsvpDate = Date.now();
      await existing.save();
    } else {
      await RSVP.create({
        user: userId,
        event: eventId,
        status
      });
    }

    res.redirect(`/rsvp?_id=${eventId}&success=You have successfully RSVP-ed!`);

  } catch (err) {
    console.log(err);
    res.send("Error saving RSVP");
  }
};

// UPDATE RSVP
exports.updateRsvp = async (req, res) => {
  try {
    const { id, eventId } = req.body;
    const status = (req.body.status || '').trim();
    const userId = req.session.user.id;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.redirect(`/rsvp?_id=${eventId}&error=Invalid RSVP status`);
    }

    const rsvp = await RSVP.findById(id);

    if (!rsvp) {
      return res.redirect(`/rsvp?_id=${eventId}&error=RSVP not found`);
    }

    if (String(rsvp.user) !== String(userId)) {
      return res.redirect(`/rsvp?_id=${eventId}&error=Not authorized`);
    }

    rsvp.status = status;
    rsvp.rsvpDate = Date.now();
    await rsvp.save();

    res.redirect(`/rsvp?_id=${eventId}&success=RSVP updated successfully!`);
  } catch (err) {
    console.log(err);
    res.redirect(`/rsvp?_id=${req.body.eventId}&error=Error updating RSVP`);
  }
};

// SHOW MY RSVPS
exports.showMyRsvps = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const sortBy = req.query.sortBy || 'event-oldest';

    let rsvps = await RSVP.find({ user: userId }).populate('event');
    rsvps = rsvps.filter(r => r.event);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcomingRsvps = [];
    let pastRsvps = [];

    rsvps.forEach(r => {
      const eventDate = new Date(r.event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        pastRsvps.push(r);
      } else {
        upcomingRsvps.push(r);
      }
    });

    const sorter = (a, b) => {
      if (sortBy === 'event-newest') {
        return new Date(b.event.date) - new Date(a.event.date);
      }
      if (sortBy === 'rsvp-oldest') {
        return new Date(a.rsvpDate) - new Date(b.rsvpDate);
      }
      if (sortBy === 'rsvp-newest') {
        return new Date(b.rsvpDate) - new Date(a.rsvpDate);
      }

      // default
      return new Date(a.event.date) - new Date(b.event.date);
    };

    upcomingRsvps.sort(sorter);
    pastRsvps.sort(sorter);

    let user = req.session.user;
    res.render('my-rsvps', {
      upcomingRsvps,
      pastRsvps,
      user,
      sortBy
    });

  } catch (err) {
    console.log(err);
    res.send("Error loading RSVPs");
  }
};

// DELETE RSVP
exports.deleteRsvp = async (req, res) => {
  try {
    const { id, eventId } = req.body;
    const userId = req.session.user.id;

    const rsvp = await RSVP.findById(id);

    if (!rsvp) return res.send("RSVP not found");

    if (String(rsvp.user) !== String(userId)) {
      return res.send("Not authorized");
    }

    await RSVP.findByIdAndDelete(id);

    if (eventId) {
      return res.redirect(`/rsvp?_id=${eventId}&success=Your RSVP was deleted successfully!`);
    }

    res.redirect('/my-rsvps');

  } catch (err) {
    console.log(err);
    res.send("Error deleting RSVP");
  }
};
