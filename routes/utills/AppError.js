class AppError extends Error {
  constructor(message, statusCode = 200) {
    super(message);
    this.status = `${statusCode}`.startsWith("2") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
