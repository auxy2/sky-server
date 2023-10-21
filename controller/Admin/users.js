const tx = require("../../models/TransactoinsModel");
const user = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
const User = require("../../models/userModel");
const AppError = require("../../routes/utills/AppError");

exports.usersT = catchAsync(async (req, res, next) => {
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

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user).sort({ createAt: -1 });

  const data = {
    name: user.name,
    phoneNumber: user.phoneNumber,
    role: user.role,
    email: user.email,
  };
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.addUsers = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  user.verify = "verified";
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "sucess",
    message: "you successfully created a new user",
  });
});
