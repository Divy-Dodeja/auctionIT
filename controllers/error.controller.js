const { ValidationError } = require("express-validation");
const response = require("../utils/response");
const ApiError = require("../utils/ApiError");

module.exports = async (err, req, res, next) => {
  let message;
  let status;
  if (err instanceof ValidationError) {
    message = err.details.body[0].message;
    status = err.statusCode;
  }
  if (req.body) {
    const { formSubmit } = req.body;
    if (req.method === "POST" && formSubmit) {
      if (!(err instanceof ValidationError)) {
        message = err.message;
        status = err.statusCode;
      }
      await req.flash("error", message);
      return res.redirect(req.url);
    }
  }
  if (err instanceof ApiError) {
    message = err.message;
    status = err.statusCode;
  }
  if (!message) {
    message = err.message;
    status = 500;
  }
  if (req.path.includes("/api/v1")) {
    return response.errorResponse(res, status, {}, message);
  } else {
    if (err.redirects) {
      return res.redirect(err.url);
    }
    return res.render("error", {
      message,
      status,
      error: JSON.stringify(err),
    });
  }
};
