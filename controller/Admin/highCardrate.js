const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");

exports.highCardRate = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const rates = await Rates.findOne({ Admin: "Admin" });
  if (!rates) {
    return next(
      new AppError("you dont have accces to post notifications", 400)
    );
  }

  const newCardRate = [...rates.highCardRates, req.body];
  rates.highCardRates = newCardRate;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "successfully posted a card rate",
  });
});

exports.getHighCardRates = catchAsync(async (req, res, next) => {
  const Rate = await Rates.findOne({ Admin: "Admin" });
  const cardRates = Rate.highCardRates;
  res.status(200).json({
    status: "sucess",
    cardRates,
  });
});

exports.deleteCardRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });
  const allCardRates = rates.highCardRates;

  const newCardRate = allCardRates.filter(
    (cardRates) => cardRates._id.toString() !== req.query.id
  );
  rates.highCardRates = newCardRate;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "card rate successfully deleted",
  });
});
