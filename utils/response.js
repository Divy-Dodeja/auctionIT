module.exports = {
  successResponse(res, status, data, message) {
    return res.status(status).send({
      status,
      message,
      data,
      error: false,
    });
  },
  errorResponse(res, status, data, message) {
    return res.status(status).send({
      status,
      message,
      data,
      error: true,
    });
  },
};
