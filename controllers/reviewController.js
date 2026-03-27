const reviewModel = require('../models/reviewModel');

exports.createReview = async (req, res) => {
    try {
        const comment = req.body.comment;
        const eventID = req.body.eventID;

        const userID = req.session.user.id;
        const existingReview = await reviewModel.findByUserAndEvent(userID, eventID);

        if (existingReview) {
            await reviewModel.updateReview(existingReview._id, comment);
        } else {
            await reviewModel.createReview({ user: userID, event: eventID, comment });
        }

        res.redirect(`/event-details?_id=${eventID}`);
    } catch (error) {
        res.send(error);
    }
};

exports.getReviewsByEvent = async (req, res) => {
    try {
        const reviews = await reviewModel.findByEvent(req.params.eventId);

        res.json(reviews);
    } catch (error) {
        res.send(error.message);
    }
};

exports.updateReview = async (req, res) => {
    try {
        const reviewID = req.params.id;
        const review = await reviewModel.findById(reviewID);

        if (!review) {
            return res.send('Review not found');
        }

        if (!req.session.user || String(review.user) !== String(req.session.user.id)) {
            return res.send('Not authorized');
        }

        await reviewModel.updateReview(reviewID, req.body.comment);

        res.redirect(`/event-details?_id=${review.event}`);
    } catch (error) {
        res.send(error.message);
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const reviewID = req.params.id;
        const review = await reviewModel.findById(reviewID);

        if (!review) {
            return res.send('Review not found');
        }

        if (!req.session.user || String(review.user) !== String(req.session.user.id)) {
            return res.send('Not authorized');
        }

        await reviewModel.deleteReview(reviewID);

        res.redirect(`/event-details?_id=${review.event}`);
    } catch (error) {
        res.send(error.message);
    }
};
