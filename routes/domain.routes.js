const express = require("express");
const { validate } = require("express-validation");

const { domainController } = require("../controllers");
const auth = require("../middlewares/auth");
const { domainValidation } = require("../validations");

const router = express.Router();

router
  .route("/")
  .get(domainController.getListedDomain)
  .post(
    auth,
    validate(domainValidation.createDomain),
    domainController.createDomain
  );
router.route("/tld-group").get(domainController.getDomainsTldByGroup);

module.exports = router;
