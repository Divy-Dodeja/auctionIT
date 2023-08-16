const express = require("express");
const { userController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.get("/dashboard", auth, userController.getUserDataDashboard);

module.exports = router;
