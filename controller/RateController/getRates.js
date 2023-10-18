const { nextTick } = require("process");
const { getCryptocurencyRate } = require("../../APIs");
const axios = require("axios");

const options = {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

async function getCryptoToNairaRate(cryptoSymbol) {
  try {
    const params = {
      ids: cryptoSymbol,
      vs_currencies: "usd,ngn",
    };

    const cryptoToUsdResponse = await axios.get(getCryptocurencyRate, {
      params,
    });

    if (cryptoSymbol === "bitcoin") {
      console.log("bitcoin");

      const CRYPTO_TO_USD = cryptoToUsdResponse.data.bitcoin.usd;
      const USD_TO_NGN = cryptoToUsdResponse.data.bitcoin.ngn;

      return { CRYPTO_TO_USD, USD_TO_NGN };
    }

    if (cryptoSymbol === "ethereum") {
      console.log("ethereum");

      const CRYPTO_TO_USD = cryptoToUsdResponse.data.ethereum.usd;
      const USD_TO_NGN = cryptoToUsdResponse.data.ethereum.ngn;

      return { CRYPTO_TO_USD, USD_TO_NGN };
    }
  } catch (err) {
    return null;
  }
}
module.exports = {
  getCryptoToNairaRate,
};
