const User = require("../../models/userModel");
const trns = require("../../models/TransactoinsModel");
const gift_card = require("../../models/GiftcardModel");
const { getCryptoToNairaRate } = require("../RateController/getRates");

async function dashboards() {
  const trnx = await trns.find({ status: "success" });
  const user = await User.find();
  const gift_Cards = await gift_card.find({ status: "aprooved" });
  const results = gift_Cards.length + trnx.length;

  let currencyTotals = {};
  let totalAmout = 0;
  let EthtoNGN;
  let BTCtoNGN;

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
  const nairaAmount = cryptoAmount * BTCrate.USD_TO_NGN;

  if (currencyTotals.BTC !== "NaN") {
    BTCtoNGN = currencyTotals.BTC * BTCrate.USD_TO_NGN;
    console.log("1 BTCtoNGN", BTCtoNGN);
  }
  if (!currencyTotals.ETH) {
    EthtoNGN = currencyTotals.ETH * ETHrate.USD_TO_NGN;
    console.log("2 BTCtoNGN", BTCtoNGN);
  }

  gift_Cards.forEach((item) => {
    const { cardAmount } = item;
    totalAmout += parseFloat(cardAmount);
  });

  const earnings = EthtoNGN + nairaAmount + BTCtoNGN + totalAmout;

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
