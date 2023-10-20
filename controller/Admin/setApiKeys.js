const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");

exports.Apikeys = catchAsync(async (req, res, next) => {
  const admin = User.find({ Admin: "admin" });
  if (!admin) {
    return next(new AppError("you dont have acess to this page", 200));
  }

  if (product === "paystack") {
    process.env.paystack_Apikey = req.body.apikey;
    process.env.paystack_secrete = req.body.secrete;
  } else if (product === "blockcypher") {
    process.env.paystack_Apikey = req.body.apikey;
    process.env.paystack_secrete = req.body.secrete;
  }
});
