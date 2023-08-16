const express = require("express");
const { domainController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/new").get(auth, domainController.getDomainCreateForm);

module.exports = router;
