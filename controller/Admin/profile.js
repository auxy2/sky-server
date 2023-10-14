const User = require("../../models/userModel");
const trns = require("../../models/TransactoinsModel");
const gitfCard = require("../../models/GiftcardModel");
const catchAsync = require("../../routes/utills/catchAsync");
const AppError = require("../../routes/utills/AppError");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);

  if (!user.role.includes("admin") || !user.role.includes("maneger")) {
    return next(new AppError("you dont have access to this page", 403));
  }
});
