const express = require("express");
const authRoutes = require("./auth.routes");
const domainRoutes = require("./domain.routes");
const bidRoutes = require("./bid.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/domains", domainRoutes);
router.use("/bids", bidRoutes);

module.exports = router;
