const mongoose = require("mongoose");

const ApisSchema = new mongoose.Schema({
  paystack: {
    apikey: String,
    apiSecrete: String,
  },
  blockcypher: {
    apikey: String,
    apiSecrete: String,
  },
  blockchain: {
    apikey: String,
    apiSecrete: String,
  },
  alchemy: {
    apikey: String,
    apiSecrete: String,
  },
  coingecko: {
    apikey: String,
    apiSecrete: String,
  },
  blockstream: {
    apikey: String,
    apiSecrete: String,
  },
  twilio: {
    apikey: String,
    apiSecrete: String,
  },
  cloudinary: {
    apikey: String,
    apiSecrete: String,
  },
});

const Apis = mongoose.model("Apis", ApisSchema);

module.exports = Apis;
