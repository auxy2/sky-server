const Card = require("../../models/GiftcardModel");
const AppError = require("../../routes/utills/AppError");
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
    CardRequests.status = "aprooved";
    await CardRequests.save();
    res.status(200).json({
      status: "success",
      message: `You successfully ${req.body.status} a gift card request`,
    });
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
