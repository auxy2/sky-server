const express = require("express");
const authControler = require("../controller/authController");
const userController = require("../controller/userController");
const testrout = require("../controller/authController");
const transaction = require("../controller/transactions/NGN/ngn");
const BTC = require("../controller/transactions/crypto/btc");
const Ether = require("../controller/transactions/crypto/ether");
const Tether = require("../controller/transactions/crypto/tether");
const cryptoRate = require("../controller/RateController/crpto/cryptoRates");
const getGiftCardRate = require("../controller/RateController/crpto/giftCardRates");
const giftCardRate = require("../controller/RateController/crpto/giftCardRates");
const cat_sub_categories = require("../controller/transactions/giftCard");
const transactionHistory = require("../controller/transactions/transactionHistory");
const GiftCards = require("../controller/transactions/giftCard");
// const Oneuser = require("../controller/users");
// const teherGenrator = require("../controller/tether");
// const progress_bar = require("../controller/progress_Bar");
// const Admin = require("../controller/Admin/dashBoard");

const uploads = require("./utills/multer");

const router = express.Router();

router.post("/signUp", authControler.signUp); //  Done
router.post("/login", authControler.login); // 100% Done
router.post(
  "/sell_Gift_Card",
  authControler.protect,
  uploads.single("image"),
  GiftCards.sellGiftCard
);
router.get(
  "/btc_Wallet_Address",
  authControler.protect,
  BTC.generateBtcAddress
); // Done
router.get(
  "/users_Wallets",
  authControler.protect,
  userController.existingWalletAddress
);
router.get(
  "/get_cryptoRatetes",
  authControler.protect,
  userController.viewCryptoRates
);
// router.get("/check-balance", authControler.checkbalance); // Done ////
router.get("/addBank", authControler.protect, userController.addBank); // Done
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

router.post("/saveBank", authControler.protect, userController.saveUsersBank);
router.delete("/deleteBank", authControler.protect, userController.deleteBank);

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
router.delete("/deleteMe", authControler.protect, userController.deleteMe);
router.get(
  "/generateEtheriumWallet",
  authControler.protect,
  Ether.generateEtheriumAddress
); // Done
router.post(
  "/req_verification",
  authControler.protect,
  uploads.single("image"),
  userController.request_Verification
);
router.get("/savedBank", authControler.protect, userController.userLinkedBank); // Done
router.post("/withdraw", authControler.protect, transaction.withdraw); // Done
router.post("/set_pin", authControler.protect, userController.createPin); // Done
router.post("/reset_pin", authControler.protect, userController.resetPin); // Done
router.post(
  "/updateMe",
  authControler.protect,
  uploads.single("image"),
  userController.updateMe
); // Done
router.post("/reateCalculator_Crypto", cryptoRate.getCurrentRate); // Done
router.get("/ratecalculator_giftCard", giftCardRate.giftCardRate); // Done
router.get("/giftCard_Catigories", cat_sub_categories.GiftCard_Cat_SubCat); // Done
router.get("/listBank", authControler.protect, userController.getBank); // Done
router.get(
  "/getAllUsers",
  authControler.protect,
  authControler.restrictTo("admin", "maneger"),
  userController.getAllUsers
); // Done
// router.get(
//   "/getUser",
//   authControler.protect,
//   authControler.restrictTo("admin", "manger"),
//   Oneuser.getUser
// );
router.get("/getUserInfo-Tx", transactionHistory.usersTx);
router.get(
  "/refarral_link",
  authControler.protect,
  userController.refarralLInk
); // Done
router.get("/refUser", userController.trackedDevice);
router.post("/create-Tx", transactionHistory.createTx);
router.get(
  "/generate-Tether",
  authControler.protect,
  Tether.generateTetherAddress
);
// router.post("/createAdmin", Admin.createAdmin);
// router.get("/webSoket", Oneuser.websocket);
router.get("/users", userController.getAllUsers); // Done

// router.get('/check-Btc-Rate', checkRate.NGNRATE);

// signUp
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/signUp");

// login
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/login");

// forgetpassword
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/forgetpassword");

// resetPassword
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/resetPassword");

// Updatepassword
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/Updatepassword");

// addBank
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/addBank");

//generateBtcWallet
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/generateBtcWallet");

//generateEtheriumWallet
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/generateEtheriumWallet");

//updateMe
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/updateMe");

// deleteMe
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/deleteMe");

//reateCalculator
("https://62b2-102-88-63-117.ngrok-free.app/api/V1/skyshowNG/reateCalculator");

// router.get("/check-status", BTC.checktransactionStatus);
// authControler.protect,

module.exports = router;
