const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const getUserDataDashboard = catchAsync(async (req, res) => {
  const user = req.user._id;
  const data = await userService.getUserDashboardData(user);
  return res.render("user/dashboard", {
    title: "Dashboard",
    data,
  });
});

module.exports = {
  getUserDataDashboard,
};
