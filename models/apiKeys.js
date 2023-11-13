const mongoose = require("mongoose");
// paystackey: String,
//   paystacSecrete: String,

const ApisSchema = new mongoose.Schema({
  paystackey: String,
  paystacSecrete: String,
  
  paystackApikey: String,
  paystackApiSecrete: String,
  blockcypher: [
    {
      apikey: String,
      apiSecrete: String,
    },
  ],
  blockchain: [
    {
      apikey: String,
      apiSecrete: String,
    },
  ],
  alchemy: [
    {
      apikey: String,
      apiSecrete: String,
    },
  ],
  coingecko: [
    {
      apikey: String,
      apiSecrete: String,
    },
  ],
  blockstream: [
    {
      apikey: String,
      apiSecrete: String,
    },
  ],
  twilio: [
    {
      account_Sid: String,
      authToken: String,
      twillio_phoneNumber: String,
    },
  ],
  cloudinary: [
    {
      cloudname: String,
      apikey: String,
      apiSecrete: String,
    },
  ],
  btcAddress: String,
  ethAddress: String,
  usdtAddress: String,
  Admin: {
    type: String,
    default: "Admin",
  },
});

const Apis = mongoose.model("Apis", ApisSchema);

module.exports = Apis;
