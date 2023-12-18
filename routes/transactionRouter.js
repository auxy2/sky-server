const express = require("express");
const TxHistory = require("../controller/transactions/transactionHistory");
const notification = require("../notifications/notify.ng.paystack");
const transactionNotification = require("../notifications/transactionNotification");
const parser = require("../controller/transactions/NGN/ngn");

const router = express.Router();

router.get("/TXs", TxHistory.usersTx); // Done
router.get(
  "/Admin/allTrnxNotifications",
  transactionNotification.allTrnxNotifications
);
// router.post("/alert", alart.rateAlart);
router.post("/webHook-payStack", notification.notify); // Done

module.exports = router;
