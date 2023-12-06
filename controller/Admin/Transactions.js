const trns = require("../../models/TransactoinsModel");
const giftCard = require("../../models/GiftcardModel");
const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.viewAllTrns = catchAsync(async (req, res, next) => {
  const trnx = await trns.find().populate({
    path: "userId",
    select: "name email phoneNumber profilePhoto",
  });
  const giftCard_trnx = await giftCard.find().populate({
    path: "userId",
    select: "name email phoneNumber profilePhoto",
  });
  res.status(200).json({
    status: "sucess",
    trnx,
    giftCard_trnx,
  });
});
exports.userTransation = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.query.id });
  const userTransation = await trns.find({ userId: req.query.id });
  const gift_cardTransactions = await giftCard.find({ userId: req.query.id });

  const bankdetails = [
    {
      accounName: user.accounName,
      accountNumber: user.accountNumber,
      bankName: user.bankName,
      walletBalance: user.walletBalance,
      role: user.role,
    },
  ];
  res.status(200).json({
    status: "success",
    userTransation,
    gift_cardTransactions,
    rateAlart: user.rateAlart,
    bankdetails,
  });
});
