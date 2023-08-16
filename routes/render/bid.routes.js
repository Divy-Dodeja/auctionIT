const express = require("express");
const { domainController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/:domainId", auth, domainController.getDomainByIdRender);

module.exports = router;
