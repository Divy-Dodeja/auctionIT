const httpStatus = require("http-status");
const { User } = require("../models");
const { userService, tokenService } = require("../services");
const { userMessages } = require("../messages");
const catchAsync = require("../utils/catchAsync");
const response = require("../utils/response");

const getLoginPage = catchAsync(async (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  return res.status(200).render("auth/login", {
    title: "Login Client",
  });
});

const getRegisterPage = catchAsync(async (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  return res.status(200).render("auth/register", {
    title: "Register Client",
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await User.login(body.email, body.password);
  const token = await tokenService.generateUserToken(user);
  res.cookie("token", token);
  return response.successResponse(
    res,
    httpStatus.OK,
    { user, token },
    userMessages.success.USER_LOGIN_SUCCESS
  );
});

const registerUser = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await userService.createUser(body);
  return response.successResponse(
    res,
    httpStatus.CREATED,
    { user },
    userMessages.success.USER_REGISTER_SUCCESS
  );
});

const getCurrentUserProfile = catchAsync(async (req, res) => {
  const { user } = req;
  return response.successResponse(
    res,
    httpStatus.OK,
    { user },
    userMessages.success.USER_PROFILE_FETCH_SUCCESS
  );
});

const authLogoutRender = catchAsync(async (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = {
  loginUser,
  registerUser,
  getCurrentUserProfile,
  getLoginPage,
  getRegisterPage,
  authLogoutRender,
};
