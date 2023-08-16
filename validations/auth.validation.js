const { Joi } = require("express-validation");

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const registerValidation = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  loginValidation,
  registerValidation,
};
