const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { domainService } = require("../services");
const _ = require("lodash");

const getAdminDashboard = catchAsync(async (req, res) => {
  const filters = _.pick(req.query, ["tld"]);
  const page = _.get(req.query, "page", 1);
  const limit = _.get(req.query, "limit", 10);
  const domains = await domainService.getDomainsByTldGrouped(
    filters,
    page,
    limit
  );
  return res.render("admin/dashboard", {
    title: "Admin Dashboard",
    data: {
      domains,
    },
  });
});

module.exports = {
  getAdminDashboard,
};
