const mongoose = require("mongoose");
// const User = require('./usermodule')

const transactionSchema = new mongoose.Schema(
  {
    userId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
      },
    ],
    accounName: String,
    bankName: String,
    amount: Number,
    txId: String,
    address: String,
    currency: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "reversed"],
      default: "pending",
    },
    script: String,
    access_code: String,
    integration: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tx = mongoose.model("TRXs", transactionSchema);

module.exports = Tx;
