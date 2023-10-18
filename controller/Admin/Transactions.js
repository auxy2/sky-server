const trns = require("../../models/TransactoinsModel");
const giftCard = require("../../models/GiftcardModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.viewAllTrns = catchAsync(async (req, res, next) => {
  const trnx = await trns.find().populate({
    path: "userId",
    select: "name email phoneNumber",
  });
  // const gift_card = await giftCard.find().populate({
  //     path: 'userId',
  //     selct: "name"
  // })
  res.status(200).json({
    status: "sucess",
    trnx,
  });
});

exports.userTransation = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const userTransation = await trns.find({ userId: req.query.id });
  res.status(200).json({
    ststua: "success",
    userTransation,
  });
});
