const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  amount: Number,
  userId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  ],
  currency: String,
  category: String,
  cardCode: {
    type: String,
  },
  cardAmount: String,
  salesAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Adminnotifications = mongoose.model("notifications", notificationSchema);

module.exports = Adminnotifications;
