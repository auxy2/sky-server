const express = require("express");
const authControler = require("../controller/authController");
// const Oneuser = require("../controller/users");

const router = express.Router();

router.post("/signUp", authControler.signUp); // Done
router.post("/login", authControler.login); // Done

router.get("/forgetpassword", authControler.forgetPassword);
router.get(
  "/verity_otp",
  authControler.protect,
  authControler.everifyUpdatePassOTP
); // Done
router.patch(
  "/resetPassword",
  authControler.protect,
  authControler.resetpassword
);
router.patch(
  "/Updatepassword",
  authControler.protect,
  authControler.UpdatePassword
); // Done
// router.get(
//   "/getUser",
//   authControler.protect,
//   authControler.restrictTo("admin", "manger"),
//   Oneuser.getUser
// );

module.exports = router;
