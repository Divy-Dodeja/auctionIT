const express = require("express");
const { authController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.route("/login").get(authController.getLoginPage);
router.route("/register").get(authController.getRegisterPage);
router.route("/logout").post(auth, authController.authLogoutRender);

module.exports = router;
