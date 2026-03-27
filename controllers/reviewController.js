
const reviewModel = require('../models/reviewModel');

exports.createReview = async (req, res) => {
    try {
        const rating = req.body.rating;
        const comment = req.body.comment;
        const eventID = req.body.eventID;

        const userID = req.session.userID;

        await reviewModel.createReview({user:userID, event:eventID,rating, comment});

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

            if (String(review.user) !== String(req.session.userID)) {
            return res.send('Not authorized');
        }

        await reviewModel.updateReview(
            reviewID,
            req.body.comment,
            req.body.rating
        );

        res.redirect(`/events/${review.event}`); 
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

        if (String(review.user) !== String(req.session.userID)) {
            return res.send('Not authorized');
        }

        await reviewModel.deleteReview(reviewID);

        res.redirect(`/events/${review.event}`); // ✅ better

    } catch (error) {
        res.send(error.message);
    }
};