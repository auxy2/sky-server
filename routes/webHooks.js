const express = require("express");
const notification = require("../notifications/notify.ng.paystack");
const alart = require("../notifications/rateAlart");

const router = express.Router();

router.post("/webHook-payStack", notification.notify);
// router.post('/alarts', alart.rateAlart);

module.exports = router;
