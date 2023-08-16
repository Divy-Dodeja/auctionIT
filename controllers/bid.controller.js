const { bidService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const response = require("../utils/response");
const { bidMessages } = require("../messages");

const createBid = catchAsync(async (req, res) => {
  const { body, params, user } = req;
  body.domain = params.domainId;
  body.user = user._id;

  const bid = await bidService.createBid(body);
  return response.successResponse(
    res,
    httpStatus.CREATED,
    { bid },
    bidMessages.success.BID_PLACED_SUCCESS
  );
});

module.exports = {
  createBid,
};
