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
  const rates = await Rates.findOne({ Admin: "Admin" });
  const refRate = rates.referralRate;
  res.status(200).json({
    status: "success",
    refRate,
  });
});

exports.activateRefRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });
  if (req.query.activate === false) {
    const disRate = {
      active: false,
      rate: "--",
    };

    rates.referralRate = disRate;
    await rates.save();
    res.status(200).json({
      status: "success",
      message: "successfully disabled refrral Rate",
    });
  }
  if (req.query.activate === true) {
    // async function (){
    const refRate = rates.referralRate;
    refRate.find(async (item) => {
      const actRate = {
        active: true,
        rate: item.refrenceRate,
        refrenceRate: item.refrenceRate,
      };

      rates.referralRate = actRate;
      await rates.save();
      res.status(200).json({
        status: "success",
        message: "successfully activate refrral Rate",
      });
    });
  }
});
