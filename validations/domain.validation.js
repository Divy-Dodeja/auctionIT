const { Joi } = require("express-validation");

const createDomain = {
  body: Joi.object().keys({
    url: Joi.string().domain().required(),
    askAmount: Joi.number().min(10).required(),
    isAutoList: Joi.bool(),
  }),
};

const updateDomain = {
  body: Joi.object().keys({
    url: Joi.string().domain(),
    askAmount: Joi.number().min(10),
  }),
};

module.exports = {
  createDomain,
  updateDomain,
};
