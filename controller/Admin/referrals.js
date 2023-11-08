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
  res.status(200).json({
    status: "success",
    refRate: rates.referralRate,
    active: rates.active,
    id: rates._id,
  });
});

exports.activateRefRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });
  if (req.query.activate === "false") {
    const disRate = {
      active: false,
      rate: "--",
    };

    rates.referralRate = disRate;
    await rates.save();
    res.status(200).json({
      status: "success",
      refRate: rates.referralRate,
      message: "successfully disabled refrral Rate",
    });
  }
  if (req.query.activate === "true") {
    // async function (){
    rates.referralRate = rates.refrenceRate;
    rates.active = true;
    await rates.save();
    res.status(200).json({
      status: "success",
      refRate: rates.referralRate,
      message: "successfully activate refrral Rate",
    });
  }
});

exports.changeRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  if (rates.referralRate.active === true) {
    const obj = {
      rate: req.body.rate,
      refrenceRate: req.body.rate,
    };

    rates.referralRate = obj;
    await rates.save();
    res.status(200).json({
      status: "success",
      refRate: rates.referralRate,
      message: "successfully change refrral Rate price",
    });
  } else {
    return next(new AppError("Invalid request", 200));
  }
});
