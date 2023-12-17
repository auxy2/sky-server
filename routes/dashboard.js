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
const refer = require("../controller/Admin/referrals");

const uploads = require("./utills/multer");

const router = express.Router();

router.get("/Admin/users", DB.users); // Done
router.post("/dash_Board", DB.dashboard); // Done
router.post("/Admin/set_Rate_Crypto", uploads.single("image"), rates.setRate); // Done /////////////
router.delete("/Admin/deleteCryto_Rate", rates.deleteCyptoRate);
router.get("/Admin/allCryptoRates", rates.getAllCryptoRates); // Done
router.delete("/Admin/deleteGiftCard_Rate", rates.deleteGiftCard_Rate); // Done

router.post(
  "/Admin/set_GiftCard_Rates",
  uploads.single("image"),
  rates.setGiftCardRate
); // Done  //////////
// router.post("/Admin/set_GiftCardSub_Catigories", rates.setgiftcardSub_Catigory);
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
router.post("/Admin/cardRequest_Aprov", CardRequest.Aproove_Rej_cardRequest);

router.get("/Admin/allTransactions", trns.viewAllTrns);
router.post("/Admin/setApikey", ApiKeys.setApi); // Done
router.get("/Admin/UserTransaction", trns.userTransation); // Done
router.patch("/Admin/Enable_Dis_User", getAllUsers.enableAndDisUser); // Done
router.get("/Admin/giftCard_request", CardRequest.giftCardsRequests); // Done
router.post("/Admin/ChangeRole", getAllUsers.changeUsersRole);
router.post("/usersInfo", getAllUsers.usersTx);
router.get("/getUser", authControler.protect, getAllUsers.getUser);
router.post("/Admin/tutorials", uploads.single("video"), tutorialVideo.Uploads); // Done
router.delete("/Admin/deleteTutorial", tutorialVideo.deleteTutorial);
router.get(
  "/Admin/AllTutorial",
  authControler.protect,
  tutorialVideo.getTutorials
); // Done

router.get("/Admin/ReferralRate", refer.getReferralRate); // Done
router.post("/Admin/Act_dis_ReferralRate", refer.activateRefRate); // Done
router.post("/Admin/Change_ReferralRate", refer.changeRate); // Done

router.get("/Admin/referrals", refer.getAllReferral); // Done
router.get("/Admin/verification", authorize.verify); // Done
// router.get("/Admin/dashboar/usersAnalysis", analytics.getUsersAnalysis);
// router.get("salesAnalyis", analytics.getSalesAnalytsis);
router.post("/Admin/login", login.AdminLogin); // Done
router.post("/Admin/UsersAnalysis", analyzeUsr.getUsersAnalysis); // Done
router.post("/Admin/SalaesAnalysis", analyzeSales.getSalesAnalytsis); // Done
router.post("/set_Rate_Catigories", categoriesAndRates.adminGiftCardCategories); // Done
router.post(
  "/set_Rate_Sub_Catigories",
  categoriesAndRates.adminGiftCardSubCategories
); // Done

router.get("/Allapis", ApiKeys.AllapiKeys); // Done

module.exports = router;
