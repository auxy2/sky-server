const catchAsync = require("../../routes/utills/catchAsync");
const Verifications = require("../../models/verification");
const User = require("../../models/userModel");

exports.verify = catchAsync(async (req, res, next) => {
  const userVerifications = await Verifications.find({}).sort({
    createdAt: -1,
  });
  res.status(200).json({
    status: "success",
    userVerifications,
  });
});

exports.app_Reject_Verification = catchAsync(async (req, res, next) => {
  const IdCard = await Verifications.find();
  const userWithIdCard = IdCard.filter((item) =>
    item.nin.includes(req.body.nin)
  );
  if (!userWithIdCard) {
    return next(new AppError("no user With the nin provided"));
  } else if (req.body.status === "aprooved") {
    userWithIdCard.status === "success";
    await userWithIdCard.save();
    res.status(200).json({
      status: "success",
      message: "you successfully aprooved an Id Card",
    });
  } else {
    userWithIdCard.status === "failed";
    await userWithIdCard.save();
    res.status(200).json({
      status: "success",
      message: "you successfully declined an Id Card",
    });
  }
});
