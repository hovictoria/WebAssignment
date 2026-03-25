
const review = require('../models/reviewModel')

exports.createReview= async(req,res)=>{
    try{
        const rating= req.body.rating
        const comment= req.body.comment
        const eventID= req.body.eventID

        const userID= req.session.userID // ||null (in case user is not logged in)

        const newReview= await review.create({
            user:userID,
            event:eventID,
            rating:rating,
            comment:comment
        })
        res.redirect(`/events`)
    }catch (error){
        res.send("error creating review")
    }
}

exports.getReviewsByEvent = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.send(error.message);
  }
};