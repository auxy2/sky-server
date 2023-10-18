const trns = require("../../../models/TransactoinsModel");
const Users = require("../../../models/userModel");
const AppError = require("../../../routes/utills/AppError");
const trrns = require("../../../models/TransactoinsModel");
const gitfCard = require("../../../models/GiftcardModel");
const catchAsync = require("../../../routes/utills/catchAsync");
const { getCryptoToNairaRate } = require("../../RateController/getRates");
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
      if (currencyTotals[currency]) {
        currencyTotals[currency] = amount;
      } else {
        currencyTotals[currency] = amount + amount;
      }
    }

    const cryptoCurrency = await toDate(trns);
    const gift_Card = await toDate(gitfCard);

    const BTCrate = await getCryptoToNairaRate("bitcoin");
    const ETHrate = await getCryptoToNairaRate("ethereum");
    console.log(BTCrate.USD_TO_NGN);

    //    const NGN = currencyTotals*Rate;
    // const arr = ["1234", "1234"];

    // const newString = [...new Set(arr)];

    // console.log(newString);

    const cryptoAmount = currencyTotals.USDT / BTCrate.CRYPTO_TO_USD;
    const nairaAmount = cryptoAmount * BTCrate.USD_TO_NGN;

    const BTCtoNGN = currencyTotals.BTC * BTCrate.USD_TO_NGN;
    const EthtoNGN = currencyTotals.ETH * ETHrate.USD_TO_NGN;

    console.log(currencyTotals);
    res.status(200).json({
      status: "success",
      Bitcoint: {
        currency: currencyTotals.BTC,
        NGN: BTCtoNGN.toLocaleString(),
        percentage: "40",
      },
      Ethereum: {
        currency: currencyTotals.ETH,
        NGN: EthtoNGN.toLocaleString(),
        percentage: "15",
      },
      USDT: {
        currency: currencyTotals.USDT,
        NGN: nairaAmount.toLocaleString(),
        percentage: "38",
      },
      GIFTCARD: {
        currency: EthtoNGN.toLocaleString(),
        percentage: "5",
      },

      CHARTS: {
        currencyTotals,
        cryptoCurrency,
        gift_Card,
      },
    });
  }
});
