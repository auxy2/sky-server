const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
const trns = require("../../models/TransactoinsModel");
const { dashboards } = require("./getDetails");

exports.dashboard = catchAsync(async (req, res, next) => {
  const trnx = await trns.find().populate({
    path: "userId",
    select: "name",
  });

  const results = await dashboards();

  res.status(200).json({
    status: "success",
    data: {
      users: results.users,
      transactions: results.orders,
      earnings: results.earnings.toLocaleString(),
    },
  });
});

exports.users = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const data = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    number: user.phoneNumber,
    username: user.username,
    role: user.role,
  }));
  res.status(200).json({
    status: "success",
    users: data,
  });
});

// exports.createAdmin = catchAsync(async (req, res, nexty) => {
//   res.status(200).json({
//     status: "success",
//     message: "Admin created",
//     data: {
//       admin,
//     },
//   });
// });
