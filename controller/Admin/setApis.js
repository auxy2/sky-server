const catchAsync = require("../../routes/utills/catchAsync");
const Apis = require("../../models/apiKeys");

exports.setApi = catchAsync(async (req, res, next) => {
  const apis = await Apis.find({});
  const { product } = req.bdy;
  if (apis.length > 0) {
    await Apis.create(req.body);
    console.log(req.body);
    res.status(201).json({
      status: "success",
      message: `you successfull set ${req.body.product}`,
    });
  } else if (product === "paystack") {
  }
});
