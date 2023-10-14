const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  nin: String,
  images: String,
  userId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

const verify = mongoose.model("verification", VerificationSchema);

module.exports = verify;
