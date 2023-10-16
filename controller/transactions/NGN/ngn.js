const User = require("../../../models/userModel");
const AppError = require("../../../routes/utills/AppError");
const catchAsync = require("../../../routes/utills/catchAsync");
const { transfer, transferRecipient } = require("../../../APIs");
const crypto = require("crypto");
const axios = require("axios");
const trns = require("../../../models/TransactoinsModel");

exports.withdraw = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  const text = String(req.query.desc || "");
  const ref = crypto.randomBytes(8).toString("hex");
  const balance = parseFloat(String(user.walletBalance).replace(/,/g, ""));
  const amount = `${req.query.amount}00`;
  //   console.log("new", amount);

  if (!user) {
    return next(new AppError("you are not permited to use this page", 400));
  }

  const recipientData = {
    type: "nuban",
    name: user.bankName,
    account_number: user.accountNumber,
    bank_code: user.bankCode,
    currency: "NGN",
  };

  const transferData = {
    source: "balance",
    reason: req.query.desc,
    amount: amount,
    recipient: "",
    reference: "",
  };

  // const amount = transferData.amount.toLocaleString().toFixed(2)
  // console.log('amount', amount)

  if (!text.toLowerCase().includes("crypto") && !text.startsWith("cryp")) {
    if (parseFloat(balance) < parseFloat(amount)) {
      console.log(parseFloat(balance), parseFloat(amount));
      const resp = await axios.post(transferRecipient, recipientData, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
          "Content-Type": "Application/json",
        },
      });

      const recipientCode = resp.data.data.recipient_code;
      const refr = ref.length > 16 ? ref.slice(0, 16) : ref;
      transferData.reference = refr;
      transferData.recipient = recipientCode;

      const response = await axios.post(transfer, transferData, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
          "Content-Type": "Application/json",
        },
      });
      console.log(response.data.message);
      if (response.data.message === "Transfer has been queued") {
        let newBalance;
        console.log("queue");

        const data = response.data.data;
        // console.log(newAmount);
        const trxObj = {
          amount: data.amount,
          txId: data.reference,
          currency: data.currency,
          access_code: data.transfer_code,
          userId: user.id,
        };
        const balance = parseFloat(
          String(user.walletBalance).replace(/,/g, "")
        );
        const amount = (trxObj.amount / 100).toFixed(2);
        console.log("amount", amount);

        newBalance = parseFloat(balance - amount).toFixed(2);

        console.log(newBalance);

        user.walletBalance = Number(newBalance).toLocaleString();
        await user.save({ validateBeforeSave: false });

        const newTx = await trns.create(trxObj);
        console.log(user.id, newTx);
        res.status(200).json({
          status: "success",
          wallet_Balance: newBalance.toLocaleString(),
        });
      } else {
        return next(new AppError("something went wrong", 400));
      }
    } else {
      console.log(balance, req.query.amount);
      res.send("Your Balance Is Too Low");
    }
  } else {
    return next(
      new AppError("crypto is not a valid option for description", 400)
    );
  }
});
