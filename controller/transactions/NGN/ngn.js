const User = require("../../../models/userModel");
const AppError = require("../../../routes/utills/AppError");
const catchAsync = require("../../../routes/utills/catchAsync");
const { transfer, transferRecipient } = require("../../../APIs");
const crypto = require("crypto");
const axios = require("axios");
const trns = require("../../../models/TransactoinsModel");
const paystack = require("../../../models/apiKeys");

exports.withdraw = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  const text = String(req.body.desc || "");
  const ref = crypto.randomBytes(8).toString("hex");
  const balance = parseFloat(String(user.walletBalance).replace(/,/g, ""));
  const amount = `${req.body.amount}00`;
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
    reason: req.body.desc,
    amount: amount,
    recipient: "",
    reference: "",
  };
  const apis = await paystack.findOne({ Admin: "Admin" });
  let PAYSTACK_KEY;
  const Apikey = apis.paystack;
  Apikey.forEach((key) => {
    PAYSTACK_KEY = key.apiSecrete;
  });

  console.log("Pkey", PAYSTACK_KEY);
  // const amount = transferData.amount.toLocaleString().toFixed(2)
  // console.log('amount', amount)

  if (!user.transactionPin) {
    return next(new AppError("You have not set transaction pin yet", 200));
  } else if (user.transactionPin === req.body.pin) {
    console.log("pin Confirmed");
    if (!text.toLowerCase().includes("crypto") && !text.startsWith("cryp")) {
      if (parseFloat(balance) > parseFloat(amount)) {
        console.log(parseFloat(balance), parseFloat(amount));
        const resp = await axios.post(transferRecipient, recipientData, {
          headers: {
            Authorization: `Bearer ${PAYSTACK_KEY}`,
            "Content-Type": "Application/json",
          },
        });

        const recipientCode = resp.data.data.recipient_code;
        const refr = ref.length > 16 ? ref.slice(0, 16) : ref;
        transferData.reference = refr;
        transferData.recipient = recipientCode;

        const response = await axios.post(transfer, transferData, {
          headers: {
            Authorization: `Bearer ${PAYSTACK_KEY}`,
            "Content-Type": "Application/json",
          },
        });
        if (response.data.message === "Transfer has been queued") {
          let newBalance;
          console.log("queue");

          const data = response.data.data;
          // console.log(newAmount);
          const toFormat = data.amount;
          const formatedBallance = (toFormat / 100).toFixed(2);
          const trxObj = {
            amount: formatedBallance,
            txId: data.reference,
            accounName: user.accounName,
            accountNumber: user.accountNumber,
            bankName: user.bankName,
            currency: data.currency,
            access_code: data.transfer_code,
            userId: user.id,
          };
          const balance = parseFloat(
            String(user.walletBalance).replace(/,/g, "")
          );
          const amount = trxObj.amount;
          console.log("amount", amount);

          newBalance = parseFloat(balance - amount).toFixed(2);

          console.log(newBalance);

          const formatedBall = parseFloat(newBalance).toLocaleString();
          user.walletBalance = String(formatedBall);
          await user.save({ validateBeforeSave: false });

          const newTx = await trns.create(trxObj);
          console.log(user.id, newTx);
          res.status(200).json({
            status: "success",
            wallet_Balance: Number(newBalance).toLocaleString(),
          });
        } else {
          return next(new AppError("something went wrong", 400));
        }
      } else {
        console.log(balance, req.body.amount);
        return next(new AppError("Your Balance Is Too Low", 200));
      }
    } else {
      return next(
        new AppError("crypto is not a valid option for description", 400)
      );
    }
  } else {
    return next(new AppError("incorrect pin", 200));
  }
});
