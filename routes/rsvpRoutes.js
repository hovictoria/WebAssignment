const RSVP = require('../models/rsvpModel');
const Event = require('../models/eventModel');

// CREATE RSVP
exports.createRsvp = async (req, res) => {
  try {
    const { eventId, status, note } = req.body;
    const userId = req.session.user.id;

    if (!status) {
      return res.send("Status is required");
    }

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.send("Event not found");
    }

    // Prevent duplicate RSVP
    const existing = await RSVP.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.send("You already RSVP'd");
    }

    await RSVP.create({
      user: userId,
      event: eventId,
      status,
      note
    });

    res.redirect(`/event-details?_id=${eventId}`);

  } catch (err) {
    console.log(err);
    res.send("Error creating RSVP");
  }
};

// SHOW MY RSVPS
exports.showMyRsvps = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const rsvps = await RSVP.find({ user: userId }).populate('event');

    res.render('my-rsvps', { rsvps });

  } catch (err) {
    console.log(err);
    res.send("Error loading RSVPs");
  }
};

// DELETE RSVP
exports.deleteRsvp = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.session.user.id;

    const rsvp = await RSVP.findById(id);

    if (!rsvp) return res.send("RSVP not found");

    if (String(rsvp.user) !== String(userId)) {
      return res.send("Not authorized");
    }

    await RSVP.findByIdAndDelete(id);

    res.redirect('/my-rsvps');

  } catch (err) {
    console.log(err);
    res.send("Error deleting RSVP");
  }
};