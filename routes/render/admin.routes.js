const express = require("express");
const { adminController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/", auth, adminController.getAdminDashboard);

module.exports = router;
