const catchAsync = require("../../routes/utills/catchAsync");
const User = require("../../models/userModel");

exports.setApi = catchAsync(async (req, res, next) => {
  const {} = req.body;
  // const user = await User.findOne(req.user);
  // if(user.role === 'admin'){

  // }
  console.log(req.body);
});
