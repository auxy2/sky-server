const catchAsync = require("../routes/utills/catchAsync");
const User = require("../models/userModel");
const AppError = require("../routes/utills/AppError");
const jwt = require("jsonwebtoken");
const Mail = require("../routes/utills/email");
const crypto = require("crypto");
const { promisify } = require("util");
const twilio = require("twilio");

const generateToken = () => {
  const randomBytes = crypto.randomBytes(6);
  const randomInt = parseInt(randomBytes.toString("hex"), 16);
  const token = randomInt % Math.pow(10, 6);
  return token.toString().padStart(6, "0");
};
///////  Create A Bearer Token For Athothorization Headers ////

const signToken = (Id) =>
  jwt.sign({ Id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXP,
  });

const sendCookie = (token, res) => {
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXP * 24 * 60 * 60 * 1000
    ),
    // httpOnly: true,
    secure: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;
  res.cookie(token, cookieOption);
};

/////////  SignUP Users ////////////

exports.signUp = catchAsync(async (req, res, next) => {
  if (req.query.email) {
    const email = req.query.email;

    newUser = await User.findOne({ email });
    if (!newUser) {
      return next(new AppError("No user found the email", 200));
    }
    const name = newUser.name;
    const token = generateToken();

    if (req.query.email === newUser.email) {
      if (!newUser.verify) {
        // create A subject and message to send as mail to the user along with the token
        const subject = "[ SKYSHOW.NG  ] Please Verify Your SingUp";
        message = `Dear ${name}\nWelcome to Skyshowing mobile application\n
            Use this One Time Password (OTP) below complete your signUp\n
            ${token} \n\n\n\n\n\nThanks for you surport`;

        // send a mail to the user
        Mail.sendEmail({
          email: newUser.email,
          subject,
          message,
        });

        newUser.token = token;
        await newUser.save({ validateBeforeSave: false });

        res.status(200).json({
          status: "success",
          message: "A verifaction code was sent to your mail",
        });
      } else {
        res.send("You Cant Use This Service Twice");
      }
    }
  }

  if (req.query.Number) {
    let newUser;

    const phoneNumber = req.query.Number;
    console.log(phoneNumber);
    newUser = await User.findOne({ phoneNumber });

    if (!newUser) {
      return next(new AppError("No user found with the mobile number", 200));
    }
    const name = newUser.name;
    const token = generateToken();

    if (req.query.Number === newUser.phoneNumber) {
      if (!newUser.verify) {
        console.log(newUser.verify);
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        const message = `Dear ${name}\n\nuse the (OTP) to verify your signUp\n\nplease dont share with any one ${token}\n\nThank's for your surport`;
        const client = twilio(accountSid, authToken);

        // Sms body
        client.messages
          .create({
            body: message,
            from: twilioPhoneNumber,
            to: "+234" + newUser.phoneNumber,
          })
          .then((message) => console.log("sms sent successfully:", message.sid))
          .catch((error) => console.error("Error sending SMS:", error));

        newUser.token = token;
        await newUser.save({ validateBeforeSave: false });

        res.status(200).json({
          status: "success",
          message: "A verificartion code was sent to your mobile Number",
        });
      } else {
        res.send("You Cant Use This Service Twice");
      }
    }
  }

  if (req.query.verify) {
    const token = req.query.verify;
    const user = await User.findOne({ token });
    console.log(user, token);

    if (!user) {
      return next(new AppError("please singUp with a valid credential", 400));
    }
    if (req.query.verify === user.token) {
      user.token = undefined;
      user.verify = "verified";
      await user.save({ validateBeforeSave: false });

      const jwtToken = signToken(user._id);
      sendCookie(jwtToken, res);
      await user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: "success",
        jwtToken,
        data: {
          name: user.name,
          wallet_Balance: user.walletBalance,
          email: user.email,
          username: user.username,
          message: "confirmed",
        },
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Invalid Token",
      });
    }
  }
  if (req.body) {
    const NewUser = await User.create(req.body);
    if (!NewUser.verify) {
      if (!NewUser) {
        return next(new AppError("Please use a valid credential", 200));
      }
      const mail = NewUser.email;

      const atIndex = mail.indexOf("@");
      const Email = mail.replace(mail.substring(2, atIndex), "*".repeat(5));

      const number = NewUser.phoneNumber;

      const visibleDigit = number.slice(-2);
      const markedPart = "*".repeat(7, -2);
      const PhoneNumber = markedPart + visibleDigit;

      const jwtToken = signToken(NewUser._id);

      res.status(200).json({
        jwtToken,
        status: "sucess",
        data: {
          PhoneNumber,
          Email,
          jwtToken,
        },
      });
    } else {
      return next(new AppError("Something went wrong verify your acount", 200));
    }
  }
});

//////////////    Login Users //////////////
exports.login = catchAsync(async (req, res, next) => {
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

  if (verifiedUser.activity) {
    // if not user send a error message to the user
    if (user === "null" || !(await user.correctPass(password, user.password))) {
      res.send(`Invalid password`);
    } else if (!verifiedUser.verify) {
      res.send("Something went wrong verify your acount");
    } else {
      const jwtToken = signToken(user._id);
      sendCookie(jwtToken, res);
      res.status(200).json({
        status: "success",
        jwtToken,
        data: {
          name: verifiedUser.name,
          wallet_Balance: verifiedUser.walletBalance,
          email: verifiedUser.email,
          username: verifiedUser.username,
          phoneNumner: verifiedUser.phoneNumber,
          profilePhoto: verifiedUser.profilePhoto,
        },
      });
    }
  } else {
    return next(new AppError("you are disabled from acessing this appication"));
  }
});
//////////  Protect Some Resources ////////
exports.protect = catchAsync(async (req, res, next) => {
  let jwtToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    jwtToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookie) {
    console.log("req.cookei", req.cookie);
    jwtToken = req.cookie;
  }
  if (!jwtToken) {
    console.log("not jwt", req.headers);
    return next(new AppError("You are not login yet", 401));
  }
  const decoded = await promisify(jwt.verify)(
    jwtToken,
    process.env.JWT_SECRETE
  );
  const curretUser = await User.findById(decoded.Id);
  if (!curretUser) {
    return next(new AppError("password recently changed please login again"));
  }
  if (curretUser.changePassAfter(decoded.iat)) {
    return next(new AppError("Login in with your new password", 404));
  }
  req.user = curretUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permision to performe this action", 403)
      );
    }

    next();
  };
};

/////  Update User's password Thats Unable To Login   ////

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const userInfo = req.query.Info;
  console.log(userInfo);

  if (userInfo.includes("@")) {
    const user = await User.findOne({ email: userInfo });
    if (user) {
      const token = generateToken();
      const subject = "[ SKYHOWNG ] Forget Your Password?";
      const message = `Forget your password?\nPlease Use The OTP below Your Action.\n
      ${token}\n
      It's only valid for 10 minutes\n
      If You Did Not Forget Your Password Please Ignore This Message. `;

      try {
        Mail.sendEmail({
          email: user.email,
          subject,
          message,
        });

        user.passwordResetToken = token;
        user.passworadEpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const jwtToken = signToken(user._id);
        res.status(200).json({
          status: "success",
          message: "password reset token has been sent to your mail",
          jwtToken,
        });
      } catch (err) {
        res.send("Cant send mail");
      }
    }
  }

  if (userInfo.startsWith("0")) {
    const user = await User.findOne({ phoneNumber: userInfo });
    if (user) {
      const token = generateToken();
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      const message = `Dear ${user.name}\n\nuse the (OTP) to verify your acount\n\nplease dont share with any one ${token}\n\nThank's for your surport`;
      const client = twilio(accountSid, authToken);

      // Sms body
      client.messages
        .create({
          body: message,
          from: twilioPhoneNumber,
          to: "+234" + user.phoneNumber,
        })
        .then((message) => console.log("sms sent successfully:", message.sid))
        .catch((error) => console.error("Error sending SMS:", error));
      const jwtToken = signToken(user._id);
      res.status(200).json({
        status: "success",
        message: "password reset token has been sent to your mobile number",
        jwtToken,
      });

      user.passwordResetToken = token;
      user.passworadEpires = Date.now() + 10 * 60 * 1000;
      await user.save({ validateBeforeSave: false });
    }
  }
});

exports.everifyUpdatePassOTP = catchAsync(async (req, res, next) => {
  const token = req.query.verify_Info;
  const user = await User.findOne({
    passwordResetToken: token,
    passworadEpires: { $gt: Date.now() },
  });
  if (user) {
    user.passwordResetToken = undefined;
    user.passworadEpires = undefined;
    await user.save({ validateBeforeSave: false });
    const jwtToken = signToken(user._id);
    res.status(200).json({
      status: "success",
      message: "OTP is comfirmed",
      jwtToken,
    });
  } else {
    res.send("No user found");
  }
});

exports.resetpassword = catchAsync(async (req, res, next) => {
  const { password, passConfirm } = req.body;
  const user = await User.findOne(req.user);
  if (!user) {
    res.send("something went wrong");
  }
  user.password = password;
  user.passConfirm = passConfirm;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Your password has been changed",
  });
});

exports.UpdatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.correctPass(req.body.CurrentPassword, user.password))) {
    res.send("incorect password");
  } else {
    user.password = req.body.password;
    user.passConfirm = req.body.passConfirm;
    await user.save();

    const subject = "[ SKYHOWNG ] You Recently Change Your Password";
    const message = `Dear ${user.name.toUpperCase}\nYour  password reset at ${Date} was  successfully`;
    try {
      Mail.sendEmail({
        email: user.email,
        subject,
        message,
      });
    } catch (err) {
      return next(new AppError("error sending mail", 400));
    }
    const jwtToken = signToken(user._id);

    sendCookie(jwtToken, res);
    res.status(200).json({
      status: "success",
      data: {
        jwtToken,
      },
    });
  }
});
