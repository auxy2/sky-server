const User = require("../../models/userModel");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });

exports.AdminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  const Admin = await User.findOne({ role: "admin" });

  if (!email || !password) {
    res.status(404).json({
      status: "fail",
      message: "Invalid input",
    });
  }

  if (!Admin) {
    return next(new AppError("you dont have access to thes page", 200));
  }
  // find user with his credential and validate it
  const user = await User.findOne({ email }).select("password");
  console.log(user);
  const verifiedUser = await User.findById(user._id);
  // if not user send a error message to the user
  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError("Invalid Email or password", 404));
  } else if (!verifiedUser.verify) {
    return next(new AppError("Something went wrong", 403));
  } else {
    const jwtToken = signToken(user._id);
    // sendCookie(jwtToken, res);
    res.status(200).json({
      status: "success",
      jwtToken,
      data: {
        name: verifiedUser.name,
        wallet_Balance: verifiedUser.walletBalance,
      },
    });
  }
});

exports.AdminLogin = catchAsync(async (req, res, next) => {
  const Admin = await User.findOne({ role: "admin" });

  const { email, password, phoneNumber } = req.body;

  if (!Admin) {
    return next(new AppError("you dont have access to thes page", 200));
  }

  if ((!email && !phoneNumber) || !password) {
    res.status(404).json({
      status: "fail",
      message: "Invalid input",
    });
  }
  let user;
  let verifiedUser;
  // find user with his credential and validate it
  email
    ? (user = await User.findOne({ email }).select("password"))
    : (user = await User.findOne({ phoneNumber }).select("password"));
  user
    ? (verifiedUser = await User.findById(user._id))
    : res.send(`Email or Username Not Found`);

  // if not user send a error message to the user
  if (user === "null" || !(await user.correctPass(password, user.password))) {
    res.send(`Invalid password`);
  } else if (!verifiedUser.verify) {
    res.send("Something went wrong please use the reset password");
  } else {
    sendCookie(jwtToken, res);
    const jwtToken = signToken(user._id);
    // sendCookie(jwtToken, res);
    res.status(200).json({
      status: "success",
      jwtToken,
      data: {
        name: verifiedUser.name,
        wallet_Balance: verifiedUser.walletBalance,
      },
    });
  }
});
