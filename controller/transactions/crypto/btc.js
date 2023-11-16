const catchAsync = require("../../../routes/utills/catchAsync");
const User = require("../../../models/userModel");
const Rates = require("../../../models/Rates");
const axios = require("axios");
const bitcore = require("bitcore-lib");
const { broadcastUrl, ngnRate, unspent, status } = require("../../../APIs");
const AppError = require("../../../routes/utills/AppError");
const jwt = require("jsonwebtoken");
const trns = require("../../../models/TransactoinsModel");
const crypto = require("crypto");
// const { sendToAll } = require("../");
const api = require("../../../models/apiKeys");

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });

// Generate Btc Wallet Address
exports.generateBtcAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("You have not login yet please try again", 404));
  }
  const prvKey = bitcore.PrivateKey();
  const pbKey = prvKey.toPublicKey();
  let address = new bitcore.Address(pbKey, bitcore.Networks.mainnet);
  address = address.toString();

  user.btcWalletAddress = address;
  user.btckey = prvKey.toString();
  await user.save({ validateBeforeSave: false });

  // Initiate Btc to Admin

  setInterval(async () => {
    const broadcast = broadcastUrl;
    const rateUrl = ngnRate;
    const addressInfo = unspent + user.btcWalletAddress;
    const key = user.btckey;

    const address = await api.findOne({ Admin: "Admin" });
    const admin = address.btcAddress;
    try {
      const utxoResponse = await axios.get(addressInfo);
      const Rate = await axios.get(rateUrl);
      let fee;
      const utxos = utxoResponse.data.unspent_outputs;
      const currentRate = Rate.data.market_data.current_price.usd;

      // transaction size will be inputCount * 189 + outputCount * 34 + 10 - outputCount = 266
      const transactionSize = 1 * 189 + 2 * 34 + 10 - 2;
      //  wish to pay 20 satoshi per bite
      const satoshiPerBit = 20;
      fee = satoshiPerBit * transactionSize;
      console.log(fee);

      for (const i of utxos) {
        const transaction = new bitcore.Transaction();
        if (i.value - fee > 0) {
          const satoshiToBtc = i.value / 10 ** 8;
          const btcToUsd = satoshiToBtc * currentRate;
          const balance = parseFloat(
            String(user.walletBalance).replace(/,/g, "")
          );

          // Update Btc And Wallet balance if its a sucessfull transaction
          async function UpdateBalance() {
            const rates = await Rates.findOne({ Admin: "Admin" });
            rates.cryptoRate.filter(async (item) => {
              if (item.product.includes("btc")) {
                const newRate = item.rate * btcToUsd;
                const ngnAmount = balance + newRate;
                const newBalance = ngnAmount.toLocaleString();

                user.walletBalance = newBalance;
                user.BtcBalance = satoshiToBtc;
                await user.save({ validateBeforeSave: false });
              }
            });
          }

          transaction
            .from({
              txid: i.tx_hash_big_endian,
              vout: i.tx_output_n,
              satoshis: i.value,
              scriptPubKey: i.script,
              network: "mainnet",
            })
            .to(admin, i.value - fee)
            .change(user.wallet)
            .fee(fee)
            .sign(key);

          const transactionHex = transaction.serialize();
          const payload = { tx: transactionHex };
          axios
            .post(broadcast, payload)
            .then(async (response) => {
              const newTx = {
                txId: response.data,
                address: user.btcWalletAddress,
                script: i.script,
                amount: i.value / 10 ** 8,
                status: "success",
                currency: "bitcoin",
                userId: user._id,
              };
              await user.createTx(newTx);
            })
            .catch((error) => {
              return next(new AppError("there was an error ", 500));
            });
          const UpdatedBalance = await UpdateBalance();
        }
      }
    } catch (err) {
      return next(new AppError("something went wrong", 500));
    }
  }, 5000);

  const token = signToken(user._id);
  res.status(201).json({
    status: "sucessfull",
    jwtToken: token,
    address,
  });
});

exports.checktransactionStatus = catchAsync(async (req, res, next) => {
  const txid =
    "77ba7f4813ab34bf4b54704b58ba79801e69140891b2d505320b07cecdb9cd15";
  const newT = "76a914d49d60952e3519d67736b9f44640f48be6d4098188ac";
  const url = `https://blockstream.info/api/tx/${txid}`;
  const satoshiToBtc = 5320 / 10 ** 8;
  const response = await fetch(url)
    .then((data) => data.json())
    .then((res) => {
      return res;
    });
  const secrete = process.env.REF_SECRETRE;
  const clientIp = req.clientIp;
  const ref = crypto.randomBytes(10).toString("hex");

  const refr = ref.length > 16 ? ref.slice(0, 16) : "error";

  res.status(200).json({
    status: "success",
    data: {
      refr,
      response,
      satoshiToBtc,
      clientIp,
    },
  });
});
