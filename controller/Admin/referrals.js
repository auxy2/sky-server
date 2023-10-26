const User = require("../../models/userModel");
const catchAsync = require("../../routes/utills/catchAsync");


exports.getAllReferral = catchAsync(async(req, res, next) => {
    const user = await User.find({});
    res.status(200).json({
        status: "success",
        referrals: user
    })
})