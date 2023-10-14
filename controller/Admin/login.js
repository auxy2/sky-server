const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });

exports.AdminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  // const user = await User.findOne({ role: 'admin'})

  if (!email || !password) {
    res.status(404).json({
      status: "fail",
      message: "Invalid input",
    });
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
