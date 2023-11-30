const tx = require("../../models/TransactoinsModel");
const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
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
      select:
        "name phoneNumber accounName role email walletBalance profilePhoto",
    })
    .sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    data: {
      transactions,
    },
    users: transactions,
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

exports.enableAndDisUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.query.id });
  console.log(user);
  if (req.query.status === "true") {
    await User.findByIdAndUpdate(req.query.id, {
      activity: true,
    });
    res.status(200).json({
      status: "success",
      message: "user successfully enabled",
    });
  }

  if (req.query.status === "false") {
    await User.findByIdAndUpdate(req.query.id, {
      activity: false,
    });
    res.status(200).json({
      status: "success",
      message: "user successfully disabled",
    });
  }
});

exports.usersTx = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .select("username", "name", "email", "phoneNumber", "role", "profilePhoto")
    .sort({ createdAt: -1 });
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
    profilePhoto: user.profilePhoto,
    id: user._id,
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

exports.changeUsersRole = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No user Found", 200));
  }

  user.role = req.body.role;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "user role has been changed",
  });
});
