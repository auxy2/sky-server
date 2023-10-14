const express = require("express");
const authControler = require("../controller/authController");
const userController = require("../controller/userController");

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

//////////////    user controller /////////////

// router.get(
//   "/addBank",
//   authControler.protect,
//   userController.addBank,
//   progress_bar.progress
// ); // Done
router.post(
  "/setRateAlart",
  authControler.protect,
  userController.setRateAlart
); // Done
router.get("/listAlart", authControler.protect, userController.rateAlartList);
router.delete(
  "/deleteAlart",
  authControler.protect,
  userController.deleteAlart
); // Done
router.delete("/deleteMe", authControler.protect, userController.deleteMe);

router.post(
  "/req_verification",
  authControler.protect,
  userController.request_Verification
);
router.get("/savedBank", authControler.protect, userController.userLinkedBank); // Done
router.post("/set_pin", authControler.protect, userController.createPin); // Done
router.post("/reset_pin", authControler.protect, userController.resetPin); // Done
router.patch("/updateMe", authControler.protect, userController.updateMe); // Done
router.get("/listBank", authControler.protect, userController.getBank); // Done
router.get(
  "/getAllUsers",
  authControler.protect,
  authControler.restrictTo("admin", "maneger"),
  userController.getAllUsers
);
router.get(
  "/refarral_link",
  authControler.protect,
  userController.refarralLInk
); // Done
router.get("/refUser", userController.trackedDevice);
router.get("/users", userController.getAllUsers);

module.exports = router;
