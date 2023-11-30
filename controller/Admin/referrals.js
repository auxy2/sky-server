const User = require("../../models/userModel");
const Rates = require("../../models/Rates");
const catchAsync = require("../../routes/utills/catchAsync");
const AppError = require("../../routes/utills/AppError");
// const fpPromise = require("../../routes/utills/deviceFingerpint");

exports.getAllReferral = catchAsync(async (req, res, next) => {
  const user = await User.find({});
  let referrals = [];
  user.filter(async (item) => {
    if (item.my_device === item.devices) {
      const ref = await User.findOne({ my_device: item.my_device });
      const refree = await User.findOne({ devices: item.devices });
      referrals.push({
        refer: ref,
        refree: refree,
      });
    }
  });

  res.status(200).json({
    status: "success",
    referrals,
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
    rates.referralRate = "--";
    rates.active = false;
    await rates.save();
    res.status(200).json({
      status: "success",
      refRate: rates.referralRate,
      active: req.query.activate,
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
      active: req.query.activate,
      refRate: rates.referralRate,
      message: "successfully activate refrral Rate",
    });
  }
});

exports.changeRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  if (rates.active === true) {
    rates.referralRate = req.body.rate;
    rates.refrenceRate = req.body.rate;
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
