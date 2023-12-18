const User = require("../../../models/userModel");
const AppError = require("../../../routes/utills/AppError");
const catchAsync = require("../../../routes/utills/catchAsync");
const { transfer, transferRecipient } = require("../../../APIs");
const crypto = require("crypto");
const axios = require("axios");
const notifications = require("../../../models/TransactoinsModel");
const trns = require("../../../models/TransactoinsModel");
const paystack = require("../../../models/apiKeys");
const createWebSocketServer = require("../../../notifications/transactionNotification");
const formattedCurrency = require("../../../routes/utills/currencyFormater");

let notificationObj = {};

exports.withdraw = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  const text = String(req.body.desc || "");
  const ref = crypto.randomBytes(8).toString("hex");
  const balance = parseFloat(String(user.walletBalance).replace(/,/g, ""));
  const amount = `${req.body.amount}00`;
  // const { wss, sendEventToAll } = createWebSocketServer({
  // port: process.env.SERVER_PORT,
  // });

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
  const Apikey = apis.paystackApiSecrete;
  const PAYSTACK_KEY = Apikey;

  if (!user.transactionPin) {
    return next(new AppError("You have not set transaction pin yet", 200));
  } else if (user.transactionPin === req.body.pin) {
    if (!text.toLowerCase().includes("crypto") && !text.startsWith("cryp")) {
      if (balance > parseFloat(req.body.amount)) {
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

          const data = response.data.data;
          const toFormat = data.amount;
          const formatedAmount = parseFloat(toFormat / 100).toFixed(2);
          const trxObj = {
            amount: formatedAmount,
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

          newBalance = parseFloat(balance - amount);

          const formatedBallance = formattedCurrency.format(newBalance);
          user.walletBalance = formatedBallance;
          await user.save({ validateBeforeSave: false });

          const newTx = await trns.create(trxObj);
          const newNot = await notifications.create(trxObj);

          // sendEventToAll(`${user.username} withdraw`, {
          //   amount: trxObj.amount,
          // });
          res.status(200).json({
            status: "success",
            wallet_Balance: Number(newBalance).toLocaleString(),
          });
        } else {
          return next(new AppError("something went wrong", 400));
        }
      } else {
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
