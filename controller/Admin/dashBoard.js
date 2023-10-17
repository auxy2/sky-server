const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
const trns = require("../../models/TransactoinsModel");
const gift_card = require("../../models/GiftcardModel");

async function dashboard() {
  const trnx = await trns.find();
  const user = await User.find();
  const gift_Cards = await gift_card.find();
  const results = gift_Cards.length + trnx.length;

  return {
    orders: results,
    users: user.length,
  };
}

exports.dashboard = catchAsync(async (req, res, next) => {
  const trnx = await trns.find().populate({
    path: "userId",
    select: "name",
  });

  const results = await dashboard();

  res.status(200).json({
    status: "success",
    data: {
      users: results.users,
      transactions: results.orders,
      earnings: results.users,
    },
  });

  //   const data = {
  //     results,
  //     trnx,
  //   };
});

exports.users = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const data = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    number: user.phoneNumber,
    username: user.username,
  }));
  res.status(200).json({
    status: "success",
    users: data,
  });
});

exports.createAdmin = catchAsync(async (req, res, nexty) => {
  const admin = await Admin.create(req.body);
  res.status(200).json({
    status: "success",
    message: "Admin created",
    data: {
      admin,
    },
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const transactions = await trns.find();
  const giftCardTrns = await gift_card.find();

  res.status(200).json({
    status: "success",
    data: {
      giftCardTrns,
      transactions,
    },
  });
});
