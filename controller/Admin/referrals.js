const User = require("../../models/userModel");
const Rates = require("../../models/Rates");
const catchAsync = require("../../routes/utills/catchAsync");

exports.getAllReferral = catchAsync(async (req, res, next) => {
  const user = await User.find({});
  res.status(200).json({
    status: "success",
    referrals: user,
  });
});

exports.getReferralRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.find({ Admin: "Admin" });
  const referralRate = rates.referralRate;
  res.status(200).json({
    status: "success",
    referralRate,
  });
});
