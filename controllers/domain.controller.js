const { domainService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");
const httpStatus = require("http-status");
const { domainMessages } = require("../messages");
const _ = require("lodash");
const ApiError = require("../utils/ApiError");

const getDomainList = async (req) => {
  let options = _.pick(req.query, ["page", "limit", "sort"]);
  let filters = _.pick(req.query, ["search"]);
  if (filters.search) {
    filters.url = { $regex: filters.search };
    delete filters.search;
  }
  filters = {
    ...filters,
    status: "listed",
    isVerified: true,
  };

  options.select =
    "url user askAmount currentBid status lastDateOfAuction transactions.listed whois createdAt";
  options.populate = { path: "user", select: "firstName lastName" };
  options.customLabels = { docs: "domains" };
  return domainService.getDomainsPaginated(filters, options);
};

const getDomainByIdRender = catchAsync(async (req, res) => {
  const { domainId } = req.params;
  const domain = await domainService.getDomainById(
    domainId,
    {},
    {
      path: "bids",
      options: { sort: { _id: -1 } },
      populate: { path: "user", select: "firstName lastName" },
    }
  );
  if (!domain) {
    throw new ApiError("No Domain Found with this id!", httpStatus.NOT_FOUND);
  }
  return res.status(httpStatus.OK).render("bid/domain-details", {
    title: `${domain.url} Details`,
    data: {
      domain,
    },
  });
});

const getDomainCreateForm = catchAsync(async (req, res) => {
  return res.render("domains/create", {
    title: "Sell your domain",
  });
});

const getDomainListRender = catchAsync(async (req, res) => {
  const domains = await getDomainList(req);
  return res.render("index", {
    title: "AuctionIt - Home",
    data: domains,
  });
});

const getListedDomain = catchAsync(async (req, res) => {
  const domains = await getDomainList(req);
  return response.successResponse(
    res,
    httpStatus.OK,
    domains,
    domainMessages.success.DOMAIN_LIST_FETCHED
  );
});

const createDomain = catchAsync(async (req, res) => {
  const { body, user } = req;
  body.user = user._id;
  const domain = await domainService.createDomainSell(body);
  return response.successResponse(
    res,
    httpStatus.CREATED,
    { domain },
    domainMessages.success.DOMAIN_CREATED
  );
});

const updateDomainStatusList = catchAsync(async (req, res) => {
  const { user, params } = req;
  const { domainId } = params;
  const domain = await domainService.updateDomainById(
    domainId,
    { status: "listed" },
    { user: user._id }
  );
  return response.successResponse(
    res,
    httpStatus.OK,
    { domain },
    domainMessages.success.DOMAIN_UPDATE
  );
});

const getDomainsTldByGroup = catchAsync(async (req, res) => {
  const filters = _.pick(req.query, ["tld"]);
  const options = _.pick(req.query, ["page", "limit"]);
  const domains = await domainService.getDomainsByTldGrouped(
    filters,
    options.page,
    options.limit
  );
  return response.successResponse(
    res,
    httpStatus.OK,
    { tlds: domains },
    domainMessages.success.DOMAIN_GROUPBY
  );
});

module.exports = {
  createDomain,
  updateDomainStatusList,
  getListedDomain,
  getDomainListRender,
  getDomainsTldByGroup,
  getDomainByIdRender,
  getDomainCreateForm,
};
