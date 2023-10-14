const trns = require("../../modules/TransactoinsModel");
const Users = require("../../modules/usermodule");
const AppError = require("../../routs/util/AppError");
const trrns = require("../../modules/TransactoinsModel");
const gitfCard = require("../../modules/GiftcardModel");
const catchAsync = require("../../routs/util/asynCatch");
const { Server, cll } = require("../../modules/webSocket");
const { getCryptoToNairaRate } = require("../RateController/getRates");
const axios = require("axios");

const toString = async (obj) => {
  for (const user of obj) {
    const createdAt = user.createdAt.toISOString();
    await Users.updateMany(
      { _id: user._id },
      {
        $set: { createdAt: createdAt },
      }
    );
  }
};
const toDate = async (obj) => {
  const getUsersByDate = await obj.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);

  const result = getUsersByDate.map((el) => {
    const date = el._id.date;
    const count = el.count;

    return { date, count };
  });

  return result;
};
exports.getUsersAnalysis = catchAsync(async (req, res, next) => {
  const user = await Users.findOne(req.user).select("role");
  const users = await Users.find({});

  toString(users);

  if ((user && user.role === "admin") || "maneger") {
    const result = await toDate(Users);
    console.log(result);

    res.status(200).json({
      status: "success",
      result,
    });
  } else {
    return next(new AppError("You Dont Have Access To Use This Page"));
  }
});

exports.getSalesAnalytsis = catchAsync(async (req, res, next) => {
  const user = await Users.findOne(req.user).select("role");
  const crypto = await trns.find({});
  const gift_card = await gitfCard.find({});
  const trnx = await trns.find().select("amount currency");

  let currencyTotals = {};

  toString(crypto);
  toString(gift_card);

  if ((user && user.role === "admin") || "manager") {
    for (const transation of trnx) {
      const { amount, currency } = transation;
      if (!currencyTotals[currency]) {
        currencyTotals[currency] = amount;
      } else {
        currencyTotals[currency] += amount;
      }
    }

    const cryptoCurrency = await toDate(trns);
    const gift_Card = await toDate(gitfCard);
    const rate = await getCryptoToNairaRate("bitcoin");
    console.log(rate);

    //    const NGN = currencyTotals*Rate;

    console.log(currencyTotals);
    res.status(200).json({
      status: "success",
      currencyTotals,
      cryptoCurrency,
      gift_Card,
    });
  }
});
