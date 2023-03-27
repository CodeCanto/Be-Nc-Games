const { fetchReview } = require("../models/reviewsModel");

exports.getReview = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchReview(reviewId)
    .then((data) => {
      res.status(200).send({ reviewObj: data });
    })
    .catch((err) => {
      next(err);
    });
};
