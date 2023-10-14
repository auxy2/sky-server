const mongoose = require("mongoose");
// const User = require('./usermodule')

const GiftCardSchema = new mongoose.Schema(
  {
    cardType: {
      type: String,
    },
    cardAmount: String,
    cardCode: {
      type: String,
    },
    images: [],
    category: String,
    cardForms: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    subCategory: String,
    selectedRate: String,
    cardCountry: String,
    transactions: {
      type: mongoose.Schema.ObjectId,
      ref: "Transactions",
    },
    userId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comment: String,
    status: {
      type: String,
      enum: ["pending", "reject", "aproved"],
      default: "pending",
    },
    promoCode: String,
    manegements: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GiftCardSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "manegements",
    select: "name accounName",
  }).populate({
    path: "transactions",
  });
});

// GiftCardSchema.pre('save', async function(next){
//     const manegementsPromises = this.manegements.map( async el => await User.findById(el));
//     this.manegements = await Promise.all(manegementsPromises);
//     next()
// })

const GiftCard = mongoose.model("Gift_Card", GiftCardSchema);

module.exports = GiftCard;