const httpStatus = require("http-status");
const { Domain } = require("../models");
const ApiError = require("../utils/ApiError");
const eventService = require("./event.service");
const whois = require("whois-parsed");
const config = require("../config");
const parser = require("tld-extract");
const { domainMessages } = require("../messages");

const createDomainSell = async (body) => {
  const { url } = body;
  let domain = await Domain.findOne({
    url,
    status: { $nin: ["removed", "created"] },
  });
  if (domain) {
    throw new ApiError(
      domainMessages.error.DOMAIN_EXISTS,
      httpStatus.BAD_REQUEST
    );
  }
  const dObj = parser(`http://${url}`, {
    allowPrivateTLD: true,
    allowUnknownTLD: true,
  });

  body.tld = dObj.tld;
  body.currentBid = body.askAmount;
  domain = await Domain.create(body);
  eventService.emit("domain-create", { domain });
  return domain;
};

const getDomainsPaginated = async (filters = {}, options = {}) => {
  return Domain.paginate(filters, options);
};

const getDomainById = async (id, filters = {}, populate = "") => {
  return Domain.findOne({ _id: id, ...filters }).populate(populate);
};

const updateDomainById = async (id, body, filters = {}) => {
  const domain = await Domain.findOne({ _id: id, ...filters });
  if (!domain) {
    throw new ApiError(
      domainMessages.error.DOMAIN_NOT_FOUND,
      httpStatus.BAD_REQUEST
    );
  }
  if (body.status === "listed" && !domain.isVerified) {
    throw new ApiError(
      domainMessages.error.DOMAIN_VERIFICATION_PENDING,
      httpStatus.BAD_REQUEST
    );
  } else {
    body.transactions.listed = Date.now();
    body.lastDateOfAuction =
      Date.now() + config.domain.auctionLimitDays * 24 * 60 * 60 * 1000;
  }
  if (body.currentBid <= domain.currentBid) {
    throw new ApiError(
      domainMessages.error.DOMAIN_BID_ALREADY_SET,
      httpStatus.BAD_REQUEST
    );
  }
  return Domain.updateOne({ _id: domain._id }, body, { new: true });
};

const domainWhoisValidation = async (domainId) => {
  const domain = await getDomainById(domainId);
  const whoisObj = await whois.lookup(domain.url);
  if (whoisObj.isAvailable) {
    domain.status = "removed";
    domain.valid = false;
    domain.removeReason = domainMessages.other.DOMAIN_REMOVE_REASON_DEFAULT;
    domain.transactions.removed = Date.now();
  } else {
    domain.whois = {
      registrationDate: whoisObj.creationDate,
      expirationDate: whoisObj.expirationDate,
      lastUpdated: whoisObj.updatedDate,
      status: whoisObj.status,
      registrar: whoisObj.registrar,
    };
    domain.valid = true;
    domain.isVerified = true;
    if (domain.isAutoList) {
      domain.status = "listed";
      domain.transactions.listed = Date.now();
      domain.lastDateOfAuction =
        Date.now() + config.domain.auctionLimitDays * 24 * 60 * 60 * 1000;
    } else {
      domain.status = "verified";
    }
    domain.transactions.verified = Date.now();
  }
  return domain.save();
};

const getDomainsByTldGrouped = async (filters = {}, page = 1, limit = 2) => {
  const skip = (parseInt(page) - 1) * limit;
  const current = parseInt(page) * limit;
  return Domain.aggregate([
    { $group: { _id: "$tld", domains: { $push: "$$ROOT" } } },
    { $addFields: { tld: "$_id" } },
    { $unset: "_id" },
    { $match: { ...filters } },
    {
      $project: {
        tld: 1,
        domains: {
          $sortArray: { input: "$domains", sortBy: { lastDateOfAuction: -1 } },
        },
      },
    },
    {
      $project: {
        tld: 1,
        totalDomains: { $size: "$domains" },
        currentPage: page,
        hasPrev: { $cond: { if: skip > 0, then: true, else: false } },
        hasNext: {
          $cond: {
            if: { $gte: [{ $size: "$domains" }, current] },
            then: true,
            else: false,
          },
        },
        nextPage: {
          $cond: {
            if: { hasNext: true },
            then: parseInt(page) + 1,
            else: parseInt(page),
          },
        },
        prevPage: {
          $cond: {
            if: { hasPrev: true },
            then: parseInt(page) - 1,
            else: parseInt(page),
          },
        },
        domains: {
          $cond: {
            if: skip > 0,
            then: { $slice: ["$domains", current, skip] },
            else: { $slice: ["$domains", current] },
          },
        },
      },
    },
  ]);
};

module.exports = {
  getDomainById,
  createDomainSell,
  domainWhoisValidation,
  updateDomainById,
  getDomainsPaginated,
  getDomainsByTldGrouped,
};
