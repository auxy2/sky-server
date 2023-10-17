const express = require("express");
const DB = require("../controller/Admin/dashBoard");
const rates = require("../controller/Admin/setRates");
const trns = require("../controller/Admin/Transactions");
const getAllUsers = require("../controller/Admin/users");
const tutorialVideo = require("../controller/Admin/tutorials");
const authorize = require("../controller/Admin/verifications");
const notifications = require("../controller/Admin/notifications");
const cardRates = require("../controller/Admin/highCardrate");
// const analytics = require("../controller/Admin/analytics");
const analyzeUsr = require("../controller/Admin/Analysis/usersAnalysis");
const analyzeSales = require("../controller/Admin/Analysis/salesAnalysis");
const login = require("../controller/Admin/login");
const authControler = require("../controller/authController");
const categoriesAndRates = require("../controller/RateController/Rates/getGiftCardRate");

const router = express.Router();

router.post("/Admin/users", DB.users); // Done
router.post("/dash_Board", DB.dashboard); // Done
router.post("/Admin/set_Rate_Crypto", rates.setRate); /////////////
router.post("/Admin/set_GiftCard_Rates", rates.setGiftCardRate); //////////
router.post("/Admin/set_GiftCardSub_Catigories", rates.setgiftcardSub_Catigory);
router.post("/Admin/set_Card_Form", rates.setCardForm);
router.post("/Admin/post_Notification", notifications.postNotifications); // Done
router.post("/Admin/HighCard_rates", cardRates.highCardRate); // Done
router.get("/getNotifications", notifications.getNotifications);
router.get("/getHighCard_rates", cardRates.getHighCardRates);

router.get("/Admin/allTransactions", trns.viewAllTrns);
router.post("/usersInfo", getAllUsers.usersTx);
router.post("/tutorial", tutorialVideo.Uploads);
router.post("/verification", authorize.verify);
// router.get("/Admin/dashboar/usersAnalysis", analytics.getUsersAnalysis);
// router.get("salesAnalyis", analytics.getSalesAnalytsis);
router.post("/Admin/login", login.AdminLogin);
router.post("/Admin/UsersAnalysis", analyzeUsr.getUsersAnalysis);
router.post("/Admin/SalaesAnalysis", analyzeSales.getSalesAnalytsis);
router.post("/set_Rate_Catigories", categoriesAndRates.adminGiftCardCategories);
router.post(
  "/set_Rate_Sub_Catigories",
  categoriesAndRates.adminGiftCardSubCategories
);

module.exports = router;
