const User = require("../../models/userModel");
const trns = require("../../models/TransactoinsModel");
const gift_card = require("../../models/GiftcardModel");
const { getCryptoToNairaRate } = require("../RateController/getRates");

async function dashboards() {
  const trnx = await trns.find({ status: "success" });
  const user = await User.find();
  const gift_Cards = await gift_card.find({ status: "aprooved" });

  let currencyTotals = {};
  let totalAmout = 0;
  let EthtoNGN;
  let BTCtoNGN;
  let nairaAmount;

  for (const transation of trnx) {
    const { amount, currency } = transation;
    if (!currencyTotals[currency]) {
      currencyTotals[currency] = amount;
    }
    currencyTotals[currency] += parseFloat(amount);
  }

  const BTCrate = await getCryptoToNairaRate("bitcoin");
  const ETHrate = await getCryptoToNairaRate("ethereum");

  const cryptoAmount = currencyTotals.USDT / BTCrate.CRYPTO_TO_USD;

  if (currencyTotals.BTC) {
    BTCtoNGN = currencyTotals.BTC * BTCrate.USD_TO_NGN;
  } else {
    currencyTotals.BTC = 0;
    BTCtoNGN = 0;
  }
  if (currencyTotals.ETH) {
    EthtoNGN = currencyTotals.ETH * ETHrate.USD_TO_NGN;
  } else {
    currencyTotals.ETH = 0;
    EthtoNGN = 0;
  }
  if (currencyTotals.USDT) {
    nairaAmount = cryptoAmount * BTCrate.USD_TO_NGN;
  } else {
    currencyTotals = 0;
    nairaAmount = 0;
  }

  gift_Cards.forEach((item) => {
    const { cardAmount } = item;
    if (cardAmount) {
      totalAmout += parseFloat(cardAmount);
    } else {
      totalAmout = 0.0;
    }
  });

  const earnings = EthtoNGN + nairaAmount + BTCtoNGN + totalAmout;

  const Cards = await gift_card.find();
  const Trns = await trns.find();
  const results = Cards.length + Trns.length;

  return {
    orders: results,
    users: user.length,
    earnings,
    Ethereum: {
      currency: currencyTotals.ETH,
      NGN: EthtoNGN.toLocaleString(),
      percentage: "40",
    },
    Bitcoint: {
      currency: currencyTotals.BTC,
      NGN: BTCtoNGN.toLocaleString(),
      percentage: "15",
    },
    USDT: {
      currency: currencyTotals.USDT,
      NGN: nairaAmount.toLocaleString(),
      percentage: "38",
    },
    GIFTCARD: {
      currency: totalAmout.toLocaleString(),
      percentage: "5",
    },
  };
}

module.exports = {
  dashboards,
};
