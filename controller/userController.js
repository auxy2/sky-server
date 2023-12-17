const User = require("../models/userModel");
const verification = require("../models/verification");
const Rates = require("../models/Rates");
const catchAsync = require("../routes/utills/catchAsync");
const AppError = require("../routes/utills/AppError");
const axios = require("axios");
const APIs = require("../APIs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fingerPrint = require("fingerprintjs2");
const Mail = require("../routes/utills/email");
const twilio = require("twilio");
const cloudinary = require("../routes/utills/cloudinary");
const formattedCurrency = require("../routes/utills/currencyFormater");

const fpPromise = fingerPrint.getPromise().then((components) => {
  const fingerprint = fingerPrint.x64hash128(
    components.map((pair) => pair.value).join(),
    31
  );
  return fingerprint;
});

function sortByCreatedAtDesc(alarts) {
  return alarts.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
}

async function checkRate(cryptoSymbol, user, subject, message) {
  if (cryptoSymbol === "bitcoin") {
    Mail.sendEmail({
      email: user.email,
      subject,
      message: message + cryptoSymbol,
    });
  }
}

const ref_code = async () => {
  const hash = crypto.randomBytes(8).toString("hex");
  console.log(hash);

  return hash;
};

function removeAlartFromList(alarts) {
  const indexToRemove = alarts.filter(
    (alart) => alart.selectedRate < alart.enteredAmount
  );
  if (indexToRemove > 0) {
    return indexToRemove;
  }
  return false;
}

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });
const sendCookie = (token, res) => {
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXP * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;
  res.cookie("jwt", token, cookieOption);
};
const filteredObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.userLinkedBank = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);

  if (!user) {
    console.log("not Authorized");
    res.status(400).json({
      message: "You dont have acess to this page",
      status: "success",
    });
  }

  if (user.accountNumber === undefined) {
    res.send("null");
  } else {
    res.status(200).json({
      bank: {
        BankName: user.bankName,
        AccountNumber: user.accountNumber,
        AccountName: user.accounName,
      },
    });
  }
});

exports.deleteBank = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    return next(
      new AppError("you dont have access to perform this action", 200)
    );
  }
  user.accounName = undefined;
  user.accountNumber = undefined;
  user.bankName = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "you successfuly deleted your account details",
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const jwtToken = signToken(users._id);
  res.status(200).json({
    status: "success",
    data: {
      jwtToken,
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  let UpdatedUser;
  let Body = req.body;

  const filterdBody = filteredObj(
    req.body,
    "name",
    "email",
    "phoneNumber",
    "username",
    "profilePhoto"
  );
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, (err, ImageResult) => {
      if (err) {
        return next(new AppError("Error Uploading video", 200));
      }
      Body.profilePhoto = ImageResult.url;
    });
  }

  filterdBody?.email === "" ? delete filterdBody.email : filterdBody;

  UpdatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  if (!UpdatedUser) {
    res.send("invalid credentials");
  }

  const reUpdateUser = {
    name: UpdatedUser.name,
    email: UpdatedUser.email,
    phoneNumber: UpdatedUser.phoneNumber,
    username: UpdatedUser.username,
    profilePhoto: UpdatedUser.profilePhoto,
    wallet_Balance: UpdatedUser.walletBalance,
  };

  const jwtToken = signToken(UpdatedUser.id);
  sendCookie(jwtToken, res);

  res.status(200).json({
    status: "success",
    jwtToken,
    updatedUser: reUpdateUser,
  });
});

exports.createPin = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  const { newpin, confirmPin } = req.body;

  if (!user) {
    return next(new AppError("you dont have access to this page", 200));
  }

  if (newpin === confirmPin) {
    user.transactionPin = newpin;
    await user.save({ validateBeforeSave: false });
    res.send("confirmed");
  } else {
    res.status(400).json({
      status: "failed",
      message: "pin deos not match",
    });
  }
});

exports.existingWalletAddress = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  res.status(200).json({
    status: "success",
    btc: user.btcWalletAddress,
    eth: user.EtherWallet,
    usdt: user.usdtWalletAddress,
  });
});

exports.viewCryptoRates = catchAsync(async (req, res, next) => {
  const rates = await Rates.find({ Admin: "Admin" });
  // const btcRates = rates.filter((rate) => rate.cryptoRate.product === "btc");
  // const ethRates = rates.filter((rate) => rate.cryptoRate.product === "eth");
  // const usdtRates = rates.filter((rate) => rate.cryptoRate.product === "Usdt");

  const categorizedProducts = {
    btcRates: [],
    ethRates: [],
    usdtRates: [],
  };

  for (const rate of rates) {
    rate.cryptoRate.forEach((cryptoRate) => {
      if (cryptoRate.product) {
        const product = cryptoRate.product.toLowerCase();
        if (product.includes("btc")) {
          categorizedProducts.btcRates.push(cryptoRate);
        } else if (product.includes("eth")) {
          categorizedProducts.ethRates.push(cryptoRate);
        } else if (product.includes("usdt")) {
          categorizedProducts.usdtRates.push(cryptoRate);
        }
      }
    });
  }
  res.status(200).json({
    status: "success",
    btcRates: categorizedProducts.btcRates,
    ethRates: categorizedProducts.ethRates,
    usdtRates: categorizedProducts.usdtRates,
  });
});

exports.resetPin = catchAsync(async (req, res, next) => {
  const { oldPin, newPin, confirmPin } = req.body;
  const user = await User.findOne(req.user);
  if (!user) {
    return next();
  }

  if (oldPin === user.transactionPin) {
    user.transactionPin = newPin;
    await user.save({ validateBeforeSave: false });
    res.send("confirmed");
  } else {
    res.status(400).json({
      status: "failed",
      message: "pin deos not match",
    });
  }
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
    verify: undefined,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getBank = catchAsync(async (req, res, next) => {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
      },
    });

    if (response.status === 200) {
      let bank = [];

      const banksList = response.data.data;

      for (const banks of banksList) {
        bank.push({
          id: banks.id,
          name: banks.name,
        });
      }

      const sortedBank = bank.sort((a, b) => a.id - b.id);

      res.status(200).json({
        status: "success",
        bank: sortedBank,
      });
    }
  } catch (err) {}
});
exports.addBank = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);

  if (!user) {
    return next(new AppError("Something went wrong", 403));
  }

  try {
    if (req.query.AccountNumber && req.query.bankName) {
      const bankName = req.query.bankName;
      const response = await axios.get(APIs.getBankCode, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
        },
      });
      const data = response.data.data;
      const bank = data.find(
        (el) => el.name.toLowerCase() === bankName.toLowerCase()
      );
      const get_Account_Holder_Name = async () => {
        try {
          const account = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${req.query.AccountNumber}&bank_code=${bank.code}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
              },
            }
          );
          return account.data;
        } catch (err) {
          return next(new AppError("Invalid Account Number", 400));
        }
      };

      const Details = await get_Account_Holder_Name()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return next(new AppError("Error while fetching data", 400));
        });
      if (Details.status === true) {
        user.bankCode = bank.code;
        await user.save({ validateBeforeSave: false });

        const token = signToken(user._id);
        res.status(200).json({
          status: "success",
          jwtToken: token,
          data: {
            AccountName: Details.data.account_name,
            AccountNumber: Details.data.account_number,
            BankName: bank.name,
          },
        });
      } else return next(new AppError("invalid accountNumber", 200));
    }
  } catch (err) {
    return next(new AppError("Error while fetching data", 200));
  }
});

exports.saveUsersBank = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    return next(new AppError("You dont have access to this page", 200));
  }
  user.bankName = req.body.BankName;
  user.accountNumber = req.body.AccountNumber;
  user.accounName = req.body.AccountName;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "bank details successfully saved ",
  });
});

exports.request_Verification = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    return next(new AppError("user not found", 404));
  }

  if (req.file) {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        return next(new AppError("Error"));
      }

      const datails = req.body;
      datails.userId = user._id;
      datails.userId = user._id;
      datails.image = result.url;
      await verification.create(datails);
      res.status(201).json({
        status: "success",
        message: "you verification request is successfull",
      });
    });
  } else {
    const datails = req.body;
    datails.userId = user._id;
    datails.userId = user._id;
    await verification.create(datails);
    res.status(201).json({
      status: "success",
      message: "you verification request is successfull",
    });
  }
});

exports.setRateAlart = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);

  if (req.body) {
    const {
      asset,
      enteredAmount,
      selectedCategory,
      selectedNotifyMethod,
      selectedRate,
      selectedSubCategory,
    } = req.body;

    if (!enteredAmount) {
      return next(new AppError("Please set a rate amount", 200));
    }
    req.body.username = user.username;
    req.body.email = user.email;
    const newAlart = [...user.rateAlart, req.body];
    user.rateAlart = newAlart;
    await user.save({ validateBeforeSave: false });
    res.status(201).json({
      status: "success",
      message: "Alart successfully set",
    });

    const intervalId = setInterval(() => {
      if (user.rateAlart.length === 0) {
        clearInterval(intervalId);
      }
      for (const alarts of user.rateAlart) {
        const alart = user.notifyUserIfAmountBelowRate(alarts);
        if (alart && alarts.selectedNotifyMethod === "Email") {
          Mail.sendEmail({
            email: user.email,
            subject: `[ SKYSHOW.NG  ] Gift Card Notification Alart`,
            message: `${alart} \n\nThanks for choosing skyshow`,
          });

          const remaining_alarts = removeAlartFromList(user.rateAlart);
        }

        if (alart && alarts.selectedNotifyMethod === "SMS") {
          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;
          const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
          const message = `Your Gift Card alart of ${alarts.enteredAmount} is bellow ${alarts.selectedRate}`;
          const client = twilio(accountSid, authToken);

          // Sms body
          client.messages
            .create({
              body: message,
              from: twilioPhoneNumber,
              to: "+234" + user.phoneNumber,
            })
            .then((message) =>
              console.log("sms sent successfully:", message.sid)
            )
            .catch((error) => console.error("Error sending SMS:", error));

          const remaining_alarts = removeAlartFromList(user.rateAlart);
          console.log("alart remainign: sms", remaining_alarts);
        }
      }
    }, 60000);
  }
});

exports.deleteAlart = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    res.send(" error deleting alart");
  }
  const Alart = user.rateAlart.filter(
    (alart) => alart._id.toString() !== req.query.id
  );
  if (Alart) {
    const remaining_alarts = removeAlartFromList(user.rateAlart);
    user.rateAlart = Alart;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "alart successfully deleted",
    });
  }
});

exports.rateAlartList = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);

  if (!user) {
    res.send("you dont have access for this service");
  }

  const rateList = sortByCreatedAtDesc(user.rateAlart);

  res.status(200).json({
    status: "success",
    rateList,
  });
});

// refarer and earn //

exports.refarralLInk = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError(" something went wrong", 403));
  }

  if (user.ref_Link_Code) {
    return next(new AppError("You hava an existing referral link", 403));
  }
  const my_device = await fpPromise;
  const USER_REFERRAL_CODE = await ref_code();
  const refarra_lInk = `${req.protocol}://${req.get(
    "host"
  )}/api/V1/skyshowNG/refUser?ref=${USER_REFERRAL_CODE}`;

  user.my_device = my_device;
  user.ref_Link_Code = USER_REFERRAL_CODE;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    link: refarra_lInk,
  });
});

exports.trackedDevice = catchAsync(async (req, res, next) => {
  const { ref } = req.query;

  const rootLink = await User.findOne({ ref_Link_Code: ref });
  const earnedReward = await Rates.findOne({ Admin: "Admin" });

  if (rootLink) {
    try {
      const device = [...rootLink.devices];

      let bonusReward = 0;

      if (device.includes(await fpPromise)) {
        return next(new AppError("You cant use this service twice", 200));
      }
      if (earnedReward.active) {
        bonusReward = parseFloat(earnedReward.referralRate) + bonusReward;
      }
      const balance = parseFloat(
        String(rootLink.walletBalance).replace(/,/g, "")
      );
      const newDevice = [...rootLink.devices, await fpPromise];
      rootLink.devices = newDevice;

      const newBalance = balance + bonusReward;
      const formatedBallance = formattedCurrency.format(newBalance);
      rootLink.walletBalance = formatedBallance;
      await rootLink.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      return next(new AppError("something went wrong", 500));
    }
  } else {
    return next(new AppError("Please use a valid refarral link", 400));
  }
});
