const tx = require("../../models/TransactoinsModel");
const user = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
const User = require("../../models/userModel");
const AppError = require("../../routes/utills/AppError");
const Card = require("../../models/GiftcardModel");

exports.usersTx = catchAsync(async (req, res, next) => {
  let activator = false;

  const Operator = await User.findOne(req.user);
  console.log(Operator);

  if (!Operator) {
    next(new AppError("Something went wrong", 403));
  }
  if (Operator.role === "admin" || "maneger") {
    const selectedUser = await User.findOne({ email: req.query.view });
    const transactions = await tx.find({ userId: selectedUser._id }).populate({
      path: "userId",
      select: "name phoneNumber accounName role email walletBalance",
    });
    res.status(200).json({
      status: "success",
      data: {
        transactions,
      },
    });
  }

  activator
    ? await User.findByIdAndUpdate(req.query, {
        active: false,
      })
    : await User.findByIdAndUpdate(req.query, {
        active: true,
      });
});

exports.getTransactionsCrypto = catchAsync(async (req, res, next) => {
  const transactions = await tx
    .find({ userId: req.user._id })
    .sort({ createdAt: 1 });

  const trns = transactions.filter((Obj) => Obj.currency !== "NGN");

  console.log(user);
  res.status(200).json({
    status: "success",
    trns,
  });
});

exports.giftCardHist = catchAsync(async (req, res, next) => {
  const trns = await Card.find({ userId: req.user._id }).sort({ createdAt: -1 });
  console.log(user);
  res.status(200).json({
    status: "success",
    trns,
  });
});

//////////.     sort NgN out ///////////////
exports.withdrawalsNGN = catchAsync(async (req, res, next) => {
  const transactions = await tx
    .find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  let trns = [];

  for (const trnx of transactions) {
    if (trnx.currency.includes("NGN")) {
      trns.push(trnx);
      console.log(trns);
    }
  }
  res.status(200).json({
    status: "success",
    trns,
  });
});

exports.createTx = catchAsync(async (req, res, next) => {
  const Tx = await tx.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      Tx,
    },
  });
});
