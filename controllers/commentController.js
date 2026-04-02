const commentModel = require('../models/commentModel');

exports.createComment = async (req, res) => {
    try {
        const comment = req.body.comment;
        const eventID = req.body.eventID;
        const userID = req.session.user.id;
        await commentModel.createComment({ user: userID, event: eventID, comment });

        res.redirect(`/events/event-details?_id=${eventID}`);
    } catch (error) {
        res.send(error);
    }
};

exports.getCommentsByEvent = async (req, res) => {
    try {
        const comments = await commentModel.findByEvent(req.params.eventId);

        res.json(comments);
    } catch (error) {
        res.send(error.message);
    }
};

exports.updateComment = async (req, res) => {
    try {
        const commentID = req.params.id;
        const existingComment = await commentModel.findById(commentID);

        if (!existingComment) {
            return res.send('Comment not found');
        }

        if (!req.session.user || String(existingComment.user) !== String(req.session.user.id)) {
            return res.send('Not authorized');
        }

        await commentModel.updateComment(commentID, req.body.comment);

        res.redirect(`/events/event-details?_id=${existingComment.event}`);
    } catch (error) {
        res.send(error.message);
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentID = req.params.id;
        const existingComment = await commentModel.findById(commentID);

        if (!existingComment) {
            return res.send('Comment not found');
        }

        if (!req.session.user || String(existingComment.user) !== String(req.session.user.id)) {
            return res.send('Not authorized');
        }

        await commentModel.deleteComment(commentID);

        res.redirect(`/events/event-details?_id=${existingComment.event}`);
    } catch (error) {
        res.send(error.message);
    }
};
