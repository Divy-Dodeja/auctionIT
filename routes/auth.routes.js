const express = require("express");
const { validate } = require("express-validation");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");
const router = express.Router();

router.post(
  "/login",
  validate(authValidation.loginValidation),
  authController.loginUser
);

router.post(
  "/register",
  validate(authValidation.registerValidation),
  authController.registerUser
);

module.exports = router;
