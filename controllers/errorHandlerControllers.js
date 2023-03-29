exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if ((err.code = "23503")) {
    res.status(404).send({ msg: "Invalid key" });
  } else {
    next(err);
  }
};

exports.handleInternalError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
