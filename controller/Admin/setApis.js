const catchAsync = require("../../routes/utills/catchAsync");
const User = require("../../models/userModel");

exports.setApi = catchAsync(async (req, res, next) => {
  const {} = req.body;
  // const user = await User.findOne(req.user);
  // if(user.role === 'admin'){
  // }
  await apis.create(req.body);
  console.log(req.body);
  res.status(201).json({
    status: "success",
    message: `you successfull set ${req.body.product}`,
  });
});
