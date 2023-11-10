const mongoose = require("mongoose");

const ratesSchema = new mongoose.Schema(
  {
    randomly: String,
    gitCard_Cartigories: [
      {
        name: String,
        id: Number,
        image: String,
      },
    ],
    referralRate: String,
    refrenceRate: String,
    active: Boolean,
    giftCard_Form: [
      {
        name: String, // physical card
        id: Number,
        value: [], // [Amazon, Itunes, Walmart.....  20 ]
        description: String,
      },
    ],
    giftCardSub_Cartigories: [
      {
        name: String,
        category: String,
        id: Number,
        image: String,
        minimumAmount: String,
        rate: String,
      },
    ],
    highCardRates: [
      {
        amount: String,
        body: String,
        title: String,
        rateType: String,
      },
    ],

    notification: [
      {
        id: String,
        notificationTitle: String,
        notificationBody: String,
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    cryptoRate: [
      {
        image: String,
        product: String,
        priceRange: String,
        rate: String,
      },
    ],
    tutorials: [
      {
        title: String,
        coverImage: String,
        video: String,
        description: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    Admin: {
      type: String,
      default: "Admin",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const rates = mongoose.model("Rates", ratesSchema);

module.exports = rates;
