const User = require("../../../models/userModel");
const wallet = require("ethereumjs-wallet");
const axios = require("axios");
const { options } = require("../../RateController/getRates");
const catchAsync = require("../../../routes/utills/catchAsync");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Rates = require("../../../models/Rates");
const api = require("../../../models/apiKeys");
const web3 = require("web3");
const jwt = require("jsonwebtoken");
const { EthreumNode, getCryptocurencyRate } = require("../../../APIs");

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });

//////// genertae an Etherium wallet Address /////////

exports.generateEtheriumAddress = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  console.log(user);

  // create an etherim wallet
  const EtherWallet = wallet.default.generate();
  const Address = EtherWallet.getAddressString();
  const PrivateKey = EtherWallet.getPrivateKeyString();

  user.EtherWallet = Address;
  user.Etherkey = PrivateKey;
  await user.save({ validateBeforeSave: false });

  setInterval(
    // connect to the Ethereum node and initiate transaction

    async () => {
      const url = EthreumNode + process.env.Alchemy_API_KEY;
      const CounterObj = {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [user.EtherWallet, "latest"],
      };

      const headers = {
        "Content-Type": "Application/json",
      };

      try {
        const getbalance = await axios.post(url, CounterObj, { headers });
        CounterObj.method = "eth_gasPrice";
        CounterObj.params = [];
        const getGasPrice = await axios.post(url, CounterObj, { headers });

        const currentGasRate = getGasPrice.data.result;
        const balance = getbalance.data.result;

        // const banlanceWei = web3.utils.fromWei(balance, 'ether')

        const value = parseInt(currentGasRate, 16);
        const multipliedValue = value * 130;
        const multipliedHexVal = "0x" + multipliedValue.toString(16);
        const banlanceWei = web3.utils.fromWei(balance, "ether");

        const EthereumRate = await axios.get(getCryptocurencyRate, {
          params: {
            ids: "ethereum",
            vs_currencies: "usd",
          },
        });

        const Rate = EthereumRate.data.ethereum.usd;
        const EtherToUsd = banlanceWei * Rate;
        const offStringBalance = parseFloat(
          String(user.walletBalance).replace(/,/g, "")
        );
        console.log(offStringBalance, user.walletBalance);

        async function UpdateBalance() {
          const rates = await Rates.findOne({ Admin: "Admin" });

          rates.cryptoRate.filter(async (item) => {
            if (item.product.includes("eth")) {
              const newRate = item.rate * EtherToUsd;

              const newBalance = newRate + offStringBalance;
              console.log(`newUserBalace: ${newBalance}`);
              user.walletBalance = newBalance.toLocaleString();
              await user.save({ validateBeforeSave: false });
              console.log("walletBalnce: ", user.walletBalance);
            }
          });
        }

        // create a transaction to transfer Ethereum

        CounterObj.method = "eth_getBlockByNumber";
        CounterObj.params = ["latest", false];
        const getGasLimit = await axios.post(url, CounterObj, { headers });

        CounterObj.method = "eth_getTransactionCount";
        CounterObj.params = [user.EtherWallet, "latest"];
        const getTransactionCount = await axios.post(url, CounterObj, {
          headers,
        });

        const currentGasLimiRate = getGasLimit.data.result.gasLimit;
        const nonce = getTransactionCount.data.result;
        const address = await api.findOne({ Admin: "Admin" });
        const admin = address.ethAddress;

        if (currentGasLimiRate + currentGasRate > balance) {
          const txParams = {
            nonce: nonce,
            gasPrice: multipliedHexVal,
            gasLimit: currentGasLimiRate,
            to: admin,
            value: balance,
          };

          // sign the transaction with the wallet's private key

          const tx = new EthereumTx(txParams, { chain: "mainnet" });
          const privakey = Buffer.from(user.Etherkey.slice(2), "hex");

          tx.sign(privakey);

          const serializedTx = "0x" + tx.serialize().toString("hex");

          // broadcast the signed transaction
          CounterObj.method = "eth_sendRawTransaction";
          CounterObj.params = [serializedTx];
          const hash = await axios.post(url, CounterObj, { headers });
          console.log(hash.data.error);

          if (hash.data.result) {
            const txHash = hash.data.result;
            const newtrnx = {
              txId: txHash,
              address: user.EtherWallet,
              amount: balance,
              status: "success",
              currency: "ethereum",
              userId: user._id,
            };

            await user.createTx(newtrnx);
          }

          const updatedBalance = await UpdateBalance();
        }
      } catch (err) {
        res.status(400).send("something went wrong");
      }
    },
    10000
  );
  const jwtToken = signToken(user._id);
  res.status(200).json({
    status: "sucess",
    data: {
      jwtToken,
      EtherAddress: user.EtherWallet,
    },
  });
});
