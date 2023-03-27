const { fetchCategories } = require("../models/categoriesModel");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((data) => {
      res.status(200).send({ categoryObj: data });
    })
    .catch((err) => {
      next(err);
    });
};
