const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  amount: Number,
  userId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  ],
});

const Adminnotifications = mongoose.model("notifications", notificationSchema);

module.exports = Adminnotifications;
