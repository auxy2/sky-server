const User = require("../../models/userModel");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/asynCatch");

exports.setRate = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user).select("role");
  const admin = await User.findOne({ role: "admin" });
  console.log(user);
  const { btcRate, ethRate, usdtRate } = req.query;

  // if (user.role === "admin" || user.role === "maneger") {
  if (btcRate) {
    await Rates.create({
      btcRate: btcRate,
    });
    res.status(200).json({
      status: "success",
      message: "Btc Rate Set Successfully",
    });
  }

  if (ethRate) {
    await Rates.create({
      ethRate: ethRate,
    });
    res.status(200).json({
      status: "success",
      message: "Rate Set Successfully",
    });
  }

  if (usdtRate) {
    await Rates.create({
      usdtRate: usdtRate,
    });
    res.status(200).json({
      status: "success",
      message: "Rate Set Successfully",
    });
  }
  // } else {
  //   res.status(404).json({
  //     status: "failed",
  //     message: "you dont have access to use this resource",
  //   });
  // }

  // if(!admin || !req.query.password){
  //     return next(new AppError('you are not permited to use this page'))
  // }
  // if(req.query.password){
  //     if(!admin.correctPass(password, admin.password)){
  //         return next(new AppError('Incorrect Password', 403))
  //     }

  //                 }
  //             }
  //         })
  //     })
  // }
});

exports.setgiftcardCatigory = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  const bodyObj = req.body;

  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;

  const newRate = [...rates.gitCard_Cartigories, bodyObj];
  rates.gitCard_Cartigories = newRate;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "Rate successfully set",
  });
});

exports.setgiftcardSub_Catigory = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  const bodyObj = req.body;

  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;

  const newRate = [...rates.giftCardSub_Cartigories, bodyObj];
  rates.giftCardSub_Cartigories = newRate;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "Rate successfully set",
  });
});

exports.setCardForm = catchAsync(async (req, res, next) => {
  const forms = await Rates.findOne({ Admin: "Admin" });
  const bodyObj = req.body;
  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;

  const newRate = [...forms.giftCard_Form, bodyObj];
  forms.giftCard_Form = newRate;
  await forms.save();
  res.status(200).json({
    status: "success",
    message: "Rate successfully set",
  });
});