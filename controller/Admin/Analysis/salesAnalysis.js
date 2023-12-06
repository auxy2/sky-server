const trns = require("../../../models/TransactoinsModel");
const Users = require("../../../models/userModel");
const gitfCard = require("../../../models/GiftcardModel");
const catchAsync = require("../../../routes/utills/catchAsync");
const axios = require("axios");
const { dashboards } = require("../getDetails");

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
  const crypto = await trns.find({ status: "success" });
  const gift_card = await gitfCard.find({ status: "aprooved" });

  toString(crypto);
  toString(gift_card);

  const cryptoCurrency = await toDate(trns);
  const gift_Card = await toDate(gitfCard);

  const data = await dashboards();

  res.status(200).json({
    status: "success",

    Bitcoint: data.Bitcoint,
    Ethereum: data.Ethereum,
    USDT: data.USDT,
    GIFTCARD: data.GIFTCARD,
    CHARTS: {
      cryptoCurrency,
      gift_Card,
    },
  });
});

// {
//   currency: currencyTotals.BTC,
//   NGN: BTCtoNGN.toLocaleString(),
//   percentage: "40",
// },
// Ethereum: {
//   currency: currencyTotals.ETH,
//   NGN: EthtoNGN.toLocaleString(),
//   percentage: "15",
// },
// USDT: {
//   currency: currencyTotals.USDT,
//   NGN: nairaAmount.toLocaleString(),
//   percentage: "38",
// },
// GIFTCARD: {
//   currency: totalAmout.toLocaleString(),
//   percentage: "5",
// },
