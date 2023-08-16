class ApiError extends Error {
  constructor(message, statusCode, redirects = false, url = "") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.redirects = redirects;
    this.url = url;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
