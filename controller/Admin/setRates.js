const User = require("../../models/userModel");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");

exports.setRate = catchAsync(async (req, res, next) => {
  // const user = await User.findOne(req.user).select("role");
  // const admin = await User.findOne({ role: "admin" });
  // console.log(user);
  // const { btcRate, ethRate, usdtRate } = req.query;

  // const rates = await Rates.findOne({ Admin: "Admin" });

  // // if (user.role === "admin" || user.role === "maneger") {
  // if (!rates.btcRate) {
  //   await Rates.create({
  //     btcRate: btcRate,
  //   });
  //   res.status(200).json({
  //     status: "success",
  //     message: "Btc Rate Set Successfully",
  //   });
  // }
  // if (ethRate) {
  //   await Rates.create({
  //     ethRate: ethRate,
  //   });
  //   res.status(200).json({
  //     status: "success",
  //     message: "Rate Set Successfully",
  //   });
  // }

  // if (usdtRate) {
  //   await Rates.create({
  //     usdtRate: usdtRate,
  //   });
  //   res.status(200).json({
  //     status: "success",
  //     message: "Rate Set Successfully",
  //   });
  // }
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

  const rate = await Rates.findOne({ Admin: "Admin" });

  const newRate = [...rate.cryptoRate, req.body];
  rate.cryptoRate = newRate;
  await rate.save();
  console.log(req.body);
  res.status(200).json({
    status: "success",
    message: `you seccessfully set ${req.body.product} rate`,
  });
});
exports.setGiftCardRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  let Cat_SubBodyObj = req.body;

  let id = Math.random() * Date.now();
  id = Math.floor(id);
  Cat_SubBodyObj.id = id;

  if (Cat_SubBodyObj.type === "catigory") {
    const catNewRate = [...rates.gitCard_Cartigories, Cat_SubBodyObj];
    rates.gitCard_Cartigories = catNewRate;
    await rates.save();
    res.status(200).json({
      status: "success",
      message: `Rate successfully set ${Cat_SubBodyObj.type} `,
    });
  }
  if (Cat_SubBodyObj.type === "SubCatigory") {
    const SubCatNewRate = [...rates.giftCardSub_Cartigories, Cat_SubBodyObj];
    rates.giftCardSub_Cartigories = SubCatNewRate;
    await rates.save();
    res.status(200).json({
      status: "success",
      message: `Rate successfully set ${Cat_SubBodyObj.type} Rate`,
    });
  }
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
