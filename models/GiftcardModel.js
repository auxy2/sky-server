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
    image: String,
    public_id: String,
    category: String,
    cardForm: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    subCatigory: String,
    selectedRate: String,
    cardCountary: String,
    transactions: {
      type: mongoose.Schema.ObjectId,
      ref: "Transactions",
    },
    userId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
      },
    ],
    salesAmount: Number,
    comment: String,
    status: {
      type: String,
      enum: ["pending", "reject", "aprooved"],
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

GiftCardSchema.method.notification = function () {
  if (this.isNew) {
    return this;
  }
};

// GiftCardSchema.pre('save', async function(next){
//     const manegementsPromises = this.manegements.map( async el => await User.findById(el));
//     this.manegements = await Promise.all(manegementsPromises);
//     next()
// })

const GiftCard = mongoose.model("Gift_Card", GiftCardSchema);

module.exports = GiftCard;
