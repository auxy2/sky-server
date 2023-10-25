const express = require("express");
const DB = require("../controller/Admin/dashBoard");
const rates = require("../controller/Admin/setRates");
const trns = require("../controller/Admin/Transactions");
const CardRequest = require("../controller/Admin/GiftCardRequest");
const rateAlarts = require("../controller/Admin/rateAlarts");
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
const ApiKeys = require("../controller/Admin/setApis");

const uploads = require("./utills/multer");

const router = express.Router();

router.post("/Admin/users", DB.users); // Done
router.post("/dash_Board", DB.dashboard); // Done
router.post("/Admin/set_Rate_Crypto", uploads.single("image"), rates.setRate); // Done /////////////
router.post(
  "/Admin/set_GiftCard_Rates",
  uploads.single("image"),
  rates.setGiftCardRate
); // Done  //////////
router.post("/Admin/set_GiftCardSub_Catigories", rates.setgiftcardSub_Catigory);
router.post("/Admin/set_Card_Form", rates.setCardForm);
router.post("/Admin/post_Notification", notifications.postNotifications); // Done
router.post("/Admin/post_HighCard_rates", cardRates.highCardRate); // Done
router.get("/getNotifications", notifications.getNotifications); // Done
router.delete("/Admin/delete_Notifications", notifications.deleteNotification); // Done
router.get("/getHighCard_rates", cardRates.getHighCardRates); // Done
router.delete("/Admin/delete_HighCard_rates", cardRates.deleteCardRate); // Done
router.post("/Admin/addNewUser", getAllUsers.addUsers);
router.get("/Admin/alarts", rateAlarts.getRateAlarts);
router.post("/Admin/verifications_aprov", authorize.app_Reject_Verification);

router.get("/Admin/allTransactions", trns.viewAllTrns);
router.post("/Admin/setApikey", ApiKeys.setApi); // Done
router.get("/Admin/UserTransaction", trns.userTransation); // Done
router.get("/Admin/giftCard_request", CardRequest.giftCardsRequests); // Done
router.post("/Admin/ChangeRole", getAllUsers.changeUsersRole);
router.post("/usersInfo", getAllUsers.usersTx);
router.get("/getUser", authControler.protect, getAllUsers.getUser);
router.post("/Admin/tutorial", uploads.single("video"), tutorialVideo.Uploads);
router.get("/Admin/verification", authorize.verify);
// router.get("/Admin/dashboar/usersAnalysis", analytics.getUsersAnalysis);
// router.get("salesAnalyis", analytics.getSalesAnalytsis);
router.post("/Admin/login", login.AdminLogin); // Done
router.post("/Admin/UsersAnalysis", analyzeUsr.getUsersAnalysis);
router.post("/Admin/SalaesAnalysis", analyzeSales.getSalesAnalytsis); // Done
router.post("/set_Rate_Catigories", categoriesAndRates.adminGiftCardCategories); // Done
router.post(
  "/set_Rate_Sub_Catigories",
  categoriesAndRates.adminGiftCardSubCategories
); // Done

router.get("/Allapis", ApiKeys.AllapiKeys);

module.exports = router;
