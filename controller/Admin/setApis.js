const catchAsync = require("../../routes/utills/catchAsync");
const Apis = require("../../models/apiKeys");

exports.setApi = catchAsync(async (req, res, next) => {
  const apis = await Apis.find({});
  const { product } = req.bdy;
  if (apis.length < 0) {
    await Apis.create(req.body);
    console.log(req.body);
    res.status(201).json({
      status: "success",
      message: `you successfull set ${req.body.product}`,
    });
  } else if (product === "paystack") {
    const newApi = await Apis.findOne({ Admin: "Admin" });
    const newObj = {
      apikey: req.body.apikey,
      apiSecrete: req.body.apiSecrete,
    };
    const paysatckApi = [...newApi.paystack, newObj];
    newApi.paystack = paysatckApi;
    await newApi.save();
    res.status(200).json({
      status: "success",
      message: `${req.body.product} apikey successfully set`,
    });
  } else if (product === blockcypher) {
    const newApi = await Apis.findOne({ Admin: "Admin" });
    const newObj = {
      apikey: req.body.apikey,
      apiSecrete: req.body.apiSecrete,
    };

    const blockcypherApi = [...newApi.blockcypher, newObj];
    newApi.blockcypher = blockcypherApi;
    await newApi.save();
    res.status(200).json({
      status: "success",
      message: `${req.body.product} apikey successfully set`,
    });
  } else if (product === blockchain) {
    const newApi = await Apis.findOne({ Admin: "Admin" });
    const newObj = {
      apikey: req.body.apikey,
      apiSecrete: req.body.apiSecrete,
    };

    const blockchainApi = [...newApi.blockchain, newObj];
    newApi.blockchain = blockchainApi;
    await newApi.save();
    res.status(200).json({
      status: "success",
      message: `${req.body.product} apikey successfully set`,
    });
  } else if (product === alchemy) {
    const newApi = await Apis.findOne({ Admin: "Admin" });
    const newObj = {
      apikey: req.body.apikey,
      apiSecrete: req.body.apiSecrete,
    };

    const alchemyApi = [...newApi.alchemy, newObj];
    newApi.alchemy = alchemyApi;
    await newApi.save();
    res.status(200).json({
      status: "success",
      message: `${req.body.product} apikey successfully set`,
    });
  }
});
