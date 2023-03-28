const {
  fetchReview,
  fetchReviews,
  fetchReviewComments,
} = require("../models/reviewsModel");

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

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((data) => {
      res.status(200).send({ reviews: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchReviewComments(reviewId)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
};
