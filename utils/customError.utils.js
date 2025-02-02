class CustomError extends Error {
  constructor(status, message, success) {
    super();
    this.status = status;
    this.message = message;
    success = false;
  }
}

module.exports = CustomError;
