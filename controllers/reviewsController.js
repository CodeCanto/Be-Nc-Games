const {
  fetchReview,
  fetchReviews,
  fetchReviewComments,
  insertComment,
  updateVote,
  deleteComment,
} = require("../models/reviewsModel");

exports.getReview = (req, res, next) => {
  const reviewId = req.params.review_id;
  fetchReview(reviewId)
    .then((data) => {
      res.status(200).send({ review: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const query = req.query;
  fetchReviews(query)
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

exports.postComment = (req, res, next) => {
  const reviewId = req.params.review_id;
  const { username, body } = req.body;

  insertComment(username, body, reviewId)
    .then((commentObject) => {
      res.status(201).send({ comment: commentObject.body });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVote = (req, res, next) => {
  const reviewId = req.params.review_id;
  const { inc_votes } = req.body;
  updateVote(reviewId, inc_votes)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  deleteComment(commentId)
    .then((result) => {
      res.status(204).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
