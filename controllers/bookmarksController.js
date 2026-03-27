const Bookmark = require('../models/bookmarkModel');
const Event = require('../models/eventModel');

exports.showBookmarksPage = (req, res) => {
    res.render('bookmarks', { user: req.session.user });
};

exports.addBookmark = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.session.user.id;

        if (!eventId) {
            return res.redirect('/events');
        }

        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
            return res.redirect('/events');
        }

        const existingBookmark = await Bookmark.findOne({
            userId,
            eventId
        });

        if (!existingBookmark) {
            await Bookmark.create({
                userId,
                eventId,
                notes: ''
            });
        }

        res.redirect('/events');
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.redirect('/events');
    }
};
