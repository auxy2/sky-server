const User = require("../models/userModel");
const verification = require("../models/verification");
const catchAsync = require("../routes/utills/catchAsync");
const AppError = require("../routes/utills/AppError");
const axios = require("axios");
const APIs = require("../APIs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fingerPrint = require("fingerprintjs2");
const Mail = require("../routes/utills/email");
const twilio = require("twilio");
const { UploadsImage } = require("./imageUploads");
// const { UploadsImage } = require("./imageaUploads");

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
  let bankArr = [];

  const user = await User.findOne(req.user);

  if (!user) {
    console.log("not Authorized");
    res.status(400).json({
      message: "You dont have acess to this page",
      status: "success",
    });
  }
  let id = Math.random() * 100;
  const bank = user.bankName;
  id = Math.floor(id);
  bankArr.push({
    id,
    name: bank,
  });

  console.log(bank, bankArr);
  res.status(200).json({
    bank: bankArr,
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
  let updatedUser;

  const filterdBody = filteredObj(
    req.body,
    "name",
    "email",
    "phoneNumber",
    "profilePhoto",
    "username"
  );

  const photo = UploadsImage(filterdBody.profilePhoto);
  console.log(photo, filterdBody);

  filterdBody?.email === "" || filterdBody.profilePhoto !== ""
    ? delete filterdBody.email
    : filterdBody;

  updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    res.send("invalid credentials");
  }

  const jwtToken = signToken(updatedUser.id);
  // sendCookie(token, res)
  res.status(200).json({
    status: "success",
    jwtToken,
    updatedUser,
  });
});

exports.createPin = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  const { newpin, confirmPin } = req.body;

  if (!user) {
    res.send("you dont have access to this page");
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

exports.existingWalletAddress = catchAsync(async (res, req, next) => {
  const wallets = await User.find({});
  res.status(200).json({
    status: "success",
    wallets,
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

    console.log(newPin, confirmPin);
    console.log(user);
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
  // const user = await User.findOne(req.user);
  // if(!user){
  //     res.status(200).json({
  //         status: 'sucess'
  //     })
  // }
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
      console.log("bank");

      res.status(200).json({
        status: "success",
        bank: sortedBank,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
});
exports.addBank = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  console.log(user);
  console.log(req.query);

  if (!user) {
    return next(new AppError("Something went wrong", 403));
  }

  try {
    if (req.query.AccountNumber && req.query.bankName) {
      const accountNumber = req.query.AccountNumber;
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
        user.bankName = bank.name;
        user.accountNumber = accountNumber;
        (user.accounName = Details.data.account_name),
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
      } else
        return res.status(200).json({
          status: "failed",
          message: "invalid accountNumber",
        });
    }
  } catch (err) {
    return next(new AppError("Error while fetching data", 400));
  }
  const jwtToken = signToken(user._id);
});
exports.request_Verification = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  const datails = req.body;
  datails.userId = user._id;
  console.log(datails);
  datails.userId = user._id;
  await verification.create(datails);
  res.status(201).json({
    status: "success",
    message: "you verification request is successfull",
  });
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

    console.log(req.body);
    if (!enteredAmount) {
      res.send("Please set a rate amount");
    }
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
        console.log("interver cleared");
      }
      for (const alarts of user.rateAlart) {
        const alart = user.notifyUserIfAmountBelowRate(alarts);
        console.log("interval", alart);
        if (alart && alarts.selectedNotifyMethod === "Email") {
          Mail.sendEmail({
            email: user.email,
            subject: `[ SKYSHOW.NG  ] Gift Card Notification Alart`,
            message: `${alart} \n\nThanks for choosing skyshow`,
          });

          const remaining_alarts = removeAlartFromList(user.rateAlart);
          console.log("alart remainign: email", remaining_alarts);
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
  console.log(Alart);
  if (Alart) {
    const remaining_alarts = removeAlartFromList(user.rateAlart);
    console.log("alart remainig: delete", remaining_alarts);
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
    return next(new AppError(" somethink went wrong", 403));
  }

  const USER_REFERRAL_CODE = await ref_code();
  const refarra_lInk = `${req.protocol}://${req.get(
    "host"
  )}/api/V1/skyshowNG/refUser?ref=${USER_REFERRAL_CODE}`;

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

  if (rootLink) {
    try {
      const device = [...rootLink.devices];
      const earnedReward = await Admin.findOne({
        email: "testAdmin@gmail.com",
      });

      if (device.includes(await fpPromise)) {
        return next(new AppError("You cant use this service twice", 400));
      }
      const balance = parseFloat(
        String(rootLink.walletBalance).replace(/,/g, "")
      );
      const newDevice = [...rootLink.devices, await fpPromise];
      rootLink.devices = newDevice;

      const newBalance = balance + earnedReward.refarralBonus;
      rootLink.walletBalance = newBalance.toLocaleString();
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
