const express = require("express");
const { domainController } = require("../../controllers");
const bidRoutes = require("./bid.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const domainRoutes = require("./domain.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

router.route("/").get(domainController.getDomainListRender);
router.use("/auth", authRoutes);
router.use("/bid", bidRoutes);
router.use("/users", userRoutes);
router.use("/domains", domainRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
