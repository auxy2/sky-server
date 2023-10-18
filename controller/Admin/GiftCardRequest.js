const Card = require("../../models/GiftcardModel");
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
