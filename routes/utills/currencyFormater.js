const formattedCurrency = new Intl.NumberFormat({
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
module.exports = formattedCurrency;
