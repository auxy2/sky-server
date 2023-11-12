const Card = require("../../models/GiftcardModel");
const AppError = require("../../routes/utills/AppError");
const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.giftCardsRequests = catchAsync(async (req, res, next) => {
  const requests = await Card.find({ status: "pending" }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    status: "success",
    requests,
  });
});

exports.Aproove_Rej_cardRequest = catchAsync(async (req, res, next) => {
  const CardRequests = await Card.findOne({ _id: req.body.id });
  if (req.body.status === "Aproove") {
    const user = await User.findOne({ _id: CardRequests.userId });
    const balance = parseFloat(String(user.walletBalance).replace(/,/g, ""));
    const cardAmount = CardRequests.selectedRate * CardRequests.cardAmount;

    if (cardAmount === CardRequests.salesAmount) {
      const newBalance = cardAmount + balance;
      user.walletBalance = newBalance.toLocaleString();
      CardRequests.status = "aprooved";
      CardRequests.salesAmount = cardAmount;

      await user.save({ validateBeforeSave: false });
      await CardRequests.save();

      res.status(200).json({
        status: "success",
        message: `You successfully ${req.body.status} a gift card request`,
      });
    } else {
      return next(new AppError("some thing went wrong", 200));
    }
  } else if (req.body.status === "reject") {
    CardRequests.status = "reject";
    await CardRequests.save();
    res.status(200).json({
      status: "success",
      message: `You successfully ${req.body.status} a gift card request`,
    });
  } else {
    return next(new AppError("Invalid data", 200));
  }
});
