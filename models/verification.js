const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nin: String,
  image: String,
  userId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
});

const verify = mongoose.model("verification", VerificationSchema);

module.exports = verify;
