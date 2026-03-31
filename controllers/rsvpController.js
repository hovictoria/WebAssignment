const RSVP = require('../models/rsvpModel');
const Event = require('../models/eventModel');

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
    const status = 'Going';
    const note = '';

    const event = await Event.findById(eventId);
    if (!event) {
      return res.send("Event not found");
    }

    const existing = await RSVP.findOne({ user: userId, event: eventId });

    if (existing) {
      existing.status = status;
      existing.note = note;
      existing.rsvpDate = Date.now();
      await existing.save();
    } else {
      await RSVP.create({
        user: userId,
        event: eventId,
        status,
        note
      });
    }

    res.redirect(`/rsvp?_id=${eventId}&success=You have successfully RSVP-ed!`);

  } catch (err) {
    console.log(err);
    res.send("Error saving RSVP");
  }
};

// SHOW MY RSVPS
exports.showMyRsvps = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const sortBy = req.query.sortBy || 'oldest';

    let sortOption = { rsvpDate: 1 }; // oldest first
    if (sortBy === 'newest') {
      sortOption = { rsvpDate: -1 };
    }

    let rsvps = await RSVP.find({ user: userId })
      .populate('event')
      .sort(sortOption);

    rsvps = rsvps.filter(r => r.event);

    let user = req.session.user;
    res.render('my-rsvps', { rsvps, user, sortBy });

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
