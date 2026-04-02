const Bookmark = require('../models/bookmarkModel');
const Event = require('../models/eventModel');

async function getBookmarksWithDetails(userId) {
    const bookmarks = await Bookmark.find({ userId }).sort({ savedAt: -1 }).lean();

    return Promise.all(
        bookmarks.map(async (bookmark) => {
            const eventDetails = await Event.findById(bookmark.eventId).lean();
            return {
                ...bookmark,
                eventDetails
            };
        })
    );
}

exports.showBookmarksPage = async (req, res) => {
    try {
        const bookmarks = await getBookmarksWithDetails(req.session.user.id);

        res.render('bookmarks', {
            user: req.session.user,
            bookmarks,
            error: req.query.error || '',
            success: req.query.success || ''
        });
    } catch (error) {
        console.error('Error loading bookmarks page:', error);
        res.render('bookmarks', {
            user: req.session.user,
            bookmarks: [],
            error: 'Failed to load bookmarks.',
            success: ''
        });
    }
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

            return res.redirect('/bookmarks?success=Event bookmarked successfully');
        }

        res.redirect('/bookmarks?error=Event already bookmarked');
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.redirect('/bookmarks?error=Failed to bookmark event');
    }
};

exports.updateBookmark = async (req, res) => {
    try {
        const notes = (req.body.notes || '').trim();

        if (notes.length > 500) {
            return res.redirect('/bookmarks?error=Notes cannot exceed 500 characters');
        }

        await Bookmark.findOneAndUpdate(
            {
                _id: req.params._id
            },
            { notes },
            { runValidators: true }
        );

        res.redirect('/bookmarks?success=Bookmark updated successfully');
    } catch (error) {
        console.error('Error updating bookmark:', error);
        res.redirect('/bookmarks?error=Failed to update bookmark');
    }
};

exports.deleteBookmark = async (req, res) => {
    try {
        await Bookmark.findOneAndDelete({
            bookmarkId: req.params._id,
            userId: req.session.user.id
        });

        res.redirect('/bookmarks?success=Bookmark removed successfully');
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        res.redirect('/bookmarks?error=Failed to remove bookmark');
    }
};
