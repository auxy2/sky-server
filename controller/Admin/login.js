const User = require("../../models/userModel");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });

exports.AdminLogin = catchAsync(async (req, res, next) => {
  const { email, password, phoneNumber } = req.body;

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
  } else if (verifiedUser.role !== "admin") {
    return next(new AppError("you dont have access to this page", 200));
  } else {
    const jwtToken = signToken(user._id);
    // sendCookie(jwtToken, res);
    res.status(200).json({
      status: "success",
      jwtToken,
      data: {
        name: verifiedUser.name,
        wallet_Balance: verifiedUser.walletBalance,
        role: verifiedUser.role,
        id: verifiedUser._id,
      },
    });
  }
});
