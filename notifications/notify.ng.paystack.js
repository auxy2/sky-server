const catchAsync = require("../routes/utills/catchAsync");
const crypto = require("crypto");
const trns = require("../models/TransactoinsModel");
const AppError = require("../routes/utills/AppError");
const User = require("../models/userModel");

const getTransaction = async (ref, ref_code, data, id) => {
  const trnx = await trns.findOneAndUpdate(
    { txId: ref, access_code: ref_code },
    { $set: { status: data } },
    { new: true }
  );

  if (!trnx || data === "pending") {
    return null;
  } else if (trnx && data === "success") {
    id.sendStatus(200);
  } else if (data === "failed" || "reversed") {
    const user = await User.findById(trnx.userId);
    const balance = parseFloat(String(user.walletBalance).replace(/,/g, ""));
    const newBalance = balance + trnx.amount;

    user.walletBalance = newBalance.toLocaleString();
    await user.save({ validateBeforeSave: false });
    id.sendStatus(200);
  }
  return trnx;
};

exports.notify = catchAsync(async (req, res, next) => {
  const secrete = process.env.PAYSTACK_KEY;

  const hash = crypto
    .createHmac("sha512", secrete)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    const data = { ...req.body };
    const ref = data.data.reference;
    const ref_code = data.data.transfer_code;
    const newData = data.event.split(".")[1];

    if (data.event) {
      console.log("paystact response", data);
      const unique = await getTransaction(ref, ref_code, newData, res);
    }
  }
});

exports.initialized = async (data) => {};
