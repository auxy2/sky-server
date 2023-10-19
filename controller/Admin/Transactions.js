const trns = require("../../models/TransactoinsModel");
const giftCard = require("../../models/GiftcardModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.viewAllTrns = catchAsync(async (req, res, next) => {
  const trnx = await trns.find().populate({
    path: "userId",
    select: "name email phoneNumber",
  });

  res.status(200).json({
    status: "sucess",
    trnx,
  });
});

exports.userTransation = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const userTransation = await trns.find({ userId: req.query.id }).populate({
    path: "userId",
    select:
      "name email phoneNumber walletBalance accounName accountNumber bankName rateAlart",
  });

  for (const entry of userTransation) {
    const rateAlart = entry.userId[0].rateAlart;
    const userData = entry.userId[0];
    const { accounName, accountNumber, bankName, walletBalance } = userData;

    const bankdetails = {
      accounName,
      accountNumber,
      bankName,
      walletBalance,
    };
    res.status(200).json({
      status: "success",
      rateAlart,
      bankdetails,
      userTransation,
    });
  }
});
