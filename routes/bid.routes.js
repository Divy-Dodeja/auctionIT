const express = require("express");
const { bidController } = require("../controllers");
const auth = require("../middlewares/auth");
const router = express.Router();

router.route("/:domainId").post(auth, bidController.createBid);

module.exports = router;
