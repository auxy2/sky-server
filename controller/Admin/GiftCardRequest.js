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

exports.Aproove_Rej_cardRequest = catchAsync(async (req, res, next) => {
  const CardRequests = await Card.findOne({ _id: req.body.id });
  if (req.body.status === "Aproove") {
    CardRequests.status = "success";
    await CardRequests.save();
    res.status(200).json({
      status: "success",
      message: `You successfully ${req.body.status} a gift card request`,
    });
  } else if (req.body.status === "reject") {
    CardRequests.status = "failed";
    await CardRequests.save();
    res.status(200).json({
      status: "success",
      message: `You successfully ${req.body.status} a gift card request`,
    });
  }
});
