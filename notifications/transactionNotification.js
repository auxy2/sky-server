const trnx = require("../models/TransactoinsModel");
const gift_card = require("../models/GiftcardModel");
const User = require("../models/userModel");
const catchAsync = require("../routes/utills/catchAsync");

exports.allTrnxNotifications = catchAsync(async (req, res, next) => {
  const user = User.findOne(req.user);
  if (user.notification()) {
    const notification = user.notification();
    res.status(200).json({
      status: "success",
      message: `${user.username} wants to sell ${notification.cardType} of ${notification.cardAmount} amount`,
    });
  }
});
