const trnx = require("../models/TransactoinsModel");
const gift_card = require("../models/GiftcardModel");
const User = require("../models/userModel");
const notification = require("../models/notificationsModel");
const catchAsync = require("../routes/utills/catchAsync");
const NGNnot = require("../controller/transactions/NGN/ngn");
const AppError = require("../routes/utills/AppError");

exports.allTrnxNotifications = catchAsync(async (req, res, next) => {
  let notification;
  const ntf = notification
    .find({})
    .populate({
      path: "userId",
      select: "name",
    })
    .sort(-1);
  if (ntf) {
    res.status(200).json({
      status: "success",
      notification: ntf,
    });
  }
  next(new AppError("Something went wrong", 200));
});
