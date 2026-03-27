
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

exports.updateReview = async (req,res) =>{
  try{
    const reviewID= req.params.id;
    const review= await Review.findOne({_id:reviewID})
    if(!review){
      return res.send('Review not found')
    }
    if (!req.user || String(review.user) !== String(req.session.id)){ //!req.user checks if user is logged in anot...need?
      return res.send('Not authorized');
    }

    review.comment= req.body.comment;
    review.rating=req.body.rating
    review.edited=true
    
    await review.save()

    res.redirect('/events')

  } catch (error){
    res.send(error.message)
  }
}

exports.deleteReview = async (req,res) =>{
  try{
  const reviewID= req.params.id
  const review= await Review.findOne({_id:reviewID})

  if (!review){
    return res.send('Review not found')
  }
 if(!req.user || String(review.user) !== String(req.session.id)){ 
      return res.send('Not authorized');
    }

    await review.deleteOne();
    res.redirect('/events')

} catch(error){
  res.send(error.message)
}}