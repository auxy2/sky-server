const { options, getCryptoToNairaRate } = require("../getRates");
const catchAsync = require("../../../routes/utills/catchAsync");
const AppError = require("../../../routes/utills/AppError");

exports.getCurrentRate = catchAsync(async (req, res, next) => {
  const { currency, usdAmount } = req.body;

  console.log(currency, usdAmount);

  // for routes looking like this `/products?page=1&pageSize=50`
  // app.get('/products', function(req, res) {
  //   const page = req.query.page;
  //   const pageSize = req.query.pageSize;
  //   res.send(`Filter with parameters ${page} and ${pageSize});`
  // });;

  if (currency && usdAmount) {
    try {
      const calcUsdToNaira = await getCryptoToNairaRate(currency);

      const cryptoAmount = usdAmount / calcUsdToNaira.CRYPTO_TO_USD;
      const nairaAmount = cryptoAmount * calcUsdToNaira.USD_TO_NGN;

      if (nairaAmount != null) {
        const locale = nairaAmount.toLocaleString();
        console.log(cryptoAmount, nairaAmount, locale);

        res.status(200).json({
          status: "success",
          naira: locale,
          crypto: cryptoAmount,
        });
      }
    } catch (err) {
      return next(new AppError("something went wrong", 500));
    }
  }
  res.status(400).json({
    status: "fail",
    message: "Invalid Inpute date",
  });
});
