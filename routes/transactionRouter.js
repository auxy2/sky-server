const express = require("express");
const TxHistory = require("../controller/transactions/transactionHistory");
const alart = require("../notifications/rateAlart");
const Rates = require("../controller/RateController/Rates/getGiftCardRate");
const authController = require("../controller/authController");
const notification = require("../notifications/notify.ng.paystack");

const router = express.Router();

router.get("/TXs", TxHistory.usersTx);
router.post("/transaction/creatTx", TxHistory.createTx);
// router.get("/giftCard_Rate", authController.protect, Rates.adminGiftCardRate);
// router.post('/createCard', authController.protect, TxHistory.createGiftCard)
router.get(
  "/transations_Crypo",
  authController.protect,
  TxHistory.getTransactionsCrypto
);
router.get(
  "/transations_GiftCard",
  authController.protect,
  TxHistory.giftCardHist
);
router.get(
  "/transations_NGN",
  authController.protect,
  TxHistory.withdrawalsNGN
);
router.post("/alert", alart.rateAlart);
router.post("/webHook-payStack", notification.notify);

module.exports = router;
