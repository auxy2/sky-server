const user = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");

exports.getRateAlarts = catchAsync(async (req, res, next) => {
  const alarts = await user.findOne({});
  res.status(200).json({
    status: "success",
    alarts,
  });
});
