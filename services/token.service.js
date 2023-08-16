const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const userService = require("./user.service");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const { tokenMessages } = require("../messages");

/**
 * Generate jwt signed token for user
 * @param {Object<User>} user
 * @returns {String}
 */
const generateUserToken = async (user) => {
  return jwt.sign({ user: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expires,
  });
};

/**
 * Verify user and return user if valid jwt token
 * @param {String} token jwt token string
 * @returns {Object<User>}
 */
const verifyToken = async (token) => {
  let { user } = jwt.verify(token, config.jwt.secret);
  user = await userService.getUserById(user);
  if (!user) {
    throw new ApiError(
      tokenMessages.error.INVALID_TOKEN,
      httpStatus.BAD_REQUEST
    );
  }
  return user;
};

module.exports = {
  generateUserToken,
  verifyToken,
};
