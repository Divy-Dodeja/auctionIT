const httpStatus = require("http-status");
const { domainService } = require(".");
const { Bid, Domain } = require("../models");
const ApiError = require("../utils/ApiError");
const { bidMessages } = require("../messages");

const createBid = async (body) => {
  const domain = await domainService.getDomainById(
    body.domain,
    {
      status: { $in: ["listed"] },
    },
    ""
  );
  if (!domain) {
    throw new ApiError(
      bidMessages.error.BID_DOMAIN_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  let bid = await Bid.find({
    domain: domain._id,
  })
    .sort({ _id: -1 })
    .limit(1);

  if (bid.length > 0) {
    bid = bid[0];
    if (bid.amount >= body.amount) {
      throw new ApiError(bidMessages.error.BID_TOO_LOW, httpStatus.BAD_REQUEST);
    } else if (bid.user.toString() === body.user.toString()) {
      throw new ApiError(
        bidMessages.error.BID_SELF_PLACE,
        httpStatus.BAD_REQUEST
      );
    }
  }
  if (domain.currentBid >= body.amount) {
    throw new ApiError(bidMessages.error.BID_TOO_LOW, httpStatus.BAD_REQUEST);
  }
  if (domain.user.toString() === body.user.toString()) {
    throw new ApiError(
      bidMessages.error.BID_SELF_PLACE,
      httpStatus.BAD_REQUEST
    );
  }
  await Domain.updateOne({ _id: domain._id }, { currentBid: body.amount });
  return Bid.create(body);
};

const getBids = async (filters = {}, populate = {}) => {
  return Bid.find(filters).populate(populate);
};

const getBid = async (filters = {}, populate = {}) => {
  return Bid.findOne(filters).populate(populate);
};

const getBidsPaginated = async (filters = {}, options = {}) => {
  return Bid.paginate(filters, options);
};

module.exports = {
  createBid,
  getBids,
  getBid,
  getBidsPaginated,
};
