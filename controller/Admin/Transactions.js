const trns = require("../../models/TransactoinsModel");
const giftCard = require("../../models/GiftcardModel");
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
  console.log(req.query);
  const userTransation = await trns.find({ userId: req.query.id }).populate({
    path: "userId",
    select:
      "name email phoneNumber walletBalance accounName accountNumber bankName rateAlart role",
  });
  console.log("!", userTransation);
  for (const entry of userTransation) {
    const rateAlart = entry.userId[0].rateAlart;
    const userData = entry.userId[0];
    const { accounName, accountNumber, bankName, walletBalance, role } =
      userData;
    console.log("2");
    const bankdetails = {
      accounName,
      accountNumber,
      bankName,
      walletBalance,
      role,
    };
    console.log("3");
    res.status(200).json({
      status: "success",
      rateAlart,
      bankdetails,
      userTransation,
    });
  }
});
