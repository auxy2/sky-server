const User = require("../../../models/userModel");
const Rates = require("../../../models/Rates");
const catchAsync = require("../../../routes/utills/catchAsync");

exports.adminGiftCardCategories = catchAsync(async (req, res, next) => {
  const bodyObj = req.body;
  const rates = await Rates.find();

  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;
  const newRate = [...rates.gitCard_Cartigories, bodyObj];

  res.status(200).json({
    status: "success",
    newRate,
  });
});

exports.adminGiftCardSubCategories = catchAsync(async (req, res, next) => {
  const bodyObj = req.body;
  const rates = await Rates.find();

  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;

  const newRate = [...rates.gitCard_Cartigories, bodyObj];
  rates.gitCard_Cartigories = newRate;
  await rates.save();
  res.status(200).json({
    status: "success",
    newRate,
  });
});
