const trnx = require("../models/TransactoinsModel");
const gift_card = require("../models/GiftcardModel");
const User = require("../models/userModel");
const catchAsync = require("../routes/utills/catchAsync");
const NGNnot = require("../controller/transactions/NGN/ngn");

exports.allTrnxNotifications = catchAsync(async (req, res, next) => {
  let notification;
  const withdrawal = Promise.all(NGNnot.withdrawalNotification);
  const WTD = await withdrawal;
  WTD ? (notification = WTD) : console.log(notification);
  if (not) {
    res.status(200).json({
      status: "success",
      data: notification,
    });
  }
});
