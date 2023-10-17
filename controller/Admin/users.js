const tx = require("../../models/TransactoinsModel");
const user = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
const User = require("../../models/userModel");
const AppError = require("../../routes/utills/AppError");

exports.usersTx = catchAsync(async (req, res, next) => {
  let activator = false;

  // const Operator = await User.findOne(req.user);
  // console.log(Operator);

  // if (!Operator) {
  //   next(new AppError("Something went wrong", 403));
  // }
  // if (Operator.role === "admin" || "maneger") {
  const selectedUser = await User.findOne({ email: req.query.view });
  const transactions = await tx
    .findById({ userId: selectedUser._id })
    .populate({
      path: "userId",
      select: "name phoneNumber accounName role email walletBalance",
    });
  res.status(200).json({
    status: "success",
    data: {
      transactions,
    },
  });
  async () => {
    activator
      ? await User.findByIdAndUpdate(req.query, {
          active: false,
        })
      : await User.findByIdAndUpdate(req.query, {
          active: true,
        });
  };
  // }
});

exports.usersTx = catchAsync(async (req, res, next) => {
  //   const admin = await User.find({ role: "admin" });
  //   if (!admin) {
  //     res.status(400).json({
  //       status: "fail",
  //       message: "you dont have access",
  //     });
  //   }
  const users = await User.find().select(
    "username",
    "name",
    "email",
    "phoneNumber"
  );
  res.status(200).json({
    status: "success",
    users,
  });
});
