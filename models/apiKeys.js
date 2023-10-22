const { default: mongoose } = require("mongoose");

const ApisSchema = new mongoose.Schema({
  paystack: String,
  blockstream: String,
  coingecko: String,
  blockstream: String,
  blockcypher: String,
  twilio: String,
});
