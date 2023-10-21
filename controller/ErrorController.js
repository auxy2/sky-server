const AppError = require("../routes/utills/AppError");

const handleduplicateDB = (err) => {
  const value = Object.keys(err.keyValue);
  console.log(value);
  const message = `There is a user with this ${value}. `;
  return new AppError(message, 200);
};

const hadleValitionDB = (err) => {
  const value = Object.values(err.errors).map((el) => el.message);
  console.log(value);
  const message = "Invalid Inpute data: " + value[0];
  console.log(message);
  return new AppError(message, 200);
};

const hadlejwtErr = () => new AppError("Invalid login please try again");

const sendErrdev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    statck: err.statck,
  });
};

const sendErrorprod = (err, res) => {
  // oprational, trusted err : send message to the client
  if (err.isOperational) {
    res.status(200).json({
      status: err.status,
      message: err.message,
    });
    // programming, unknown dont leak details
  } else {
    console.error("Error 💥", err);
    // send generic message
    res.status(500).json({
      status: "fail",
      message: "something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;
  if (process.env.NODE_ENV === "development") {
    sendErrdev(err, res);
  } else {
    // err.statusCode = err.statusCode || 400;

    let error = { ...err };
    if (process.env.NODE_ENV === "production") {
      if (error.code === 11000) err = handleduplicateDB(err);
      if (err.name === "ValidationError") err = hadleValitionDB(err);
      if (err.name === "JsonWebTokenError") err = hadlejwtErr();
      sendErrorprod(err, res);
    }
  }
};
