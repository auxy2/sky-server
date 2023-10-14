const Rates = require("../../../models/Rates");
const catchAsync = require("../../../routes/utills/catchAsync");

exports.giftCardRate = catchAsync(async (req, res, next) => {
  const rates = await Rates.find();
  //   const cardCategory = rates[0].gitCard_Cartigories;
  //   const subcategories = rates[0].gitCardSub_Cartigories;
  res.status(200).json({
    status: "success",
    rates,
  });
});
