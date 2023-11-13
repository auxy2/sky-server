const catchAsync = require("../../routes/utills/catchAsync");
const Apis = require("../../models/apiKeys");
const AppError = require("../../routes/utills/AppError");

exports.setApi = catchAsync(async (req, res, next) => {
  const apis = await Apis.find({});
  const { product } = req.body;
  if (apis.length === 0) {
    const obj = {
      paystacSecrete: "emptyString",
      paystackey: "emptyKey",
    };
    await Apis.create(obj);
    console.log(req.body);
    res.status(201).json({
      status: "success",
      message: `you successfull set ${req.body.product}`,
    });
  }

  const newApi = await Apis.findOne({ Admin: "Admin" });

  if (product === "paystack") {
    newApi.paystackApikey = req.body.apikey;
    newApi.paystackApiSecrete = req.body.apiSecrete;
    await newApi.save();
    res.status(200).json({
      status: "success",
      message: `${req.body.product} apikey successfully set`,
    });
  }

  if (product === "blockcypher") {
    if (newApi.blockcypher.length === 0) {
      const newObj = {
        apiSecrete: req.body.apiSecrete,
        apikey: req.body.apikey,
      };

      const blockcypherApi = [...newApi.blockcypher, newObj];
      newApi.blockcypher = blockcypherApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }

  if (product === "blockchain") {
    if (newApi.blockchain.length === 0) {
      const newObj = {
        apiSecrete: req.body.apiSecrete,
        apikey: req.body.apikey,
      };

      const blockchainApi = [...newApi.blockchain, newObj];
      newApi.blockchain = blockchainApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }

  if (product === "alchemy") {
    if (newApi.alchemy.length === 0) {
      const newObj = {
        apiSecrete: req.body.apiSecrete,
        apikey: req.body.apikey,
      };

      const alchemyApi = [...newApi.alchemy, newObj];
      newApi.alchemy = alchemyApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }

  if (product === "coingecko") {
    if (newApi.coingecko.length === 0) {
      const newObj = {
        apiSecrete: req.body.apiSecrete,
        apikey: req.body.apikey,
      };

      const coingeckoApi = [...newApi.coingecko, newObj];
      newApi.coingecko = coingeckoApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }

  if (product === "blockstream") {
    if (newApi.blockstream.length === 0) {
      const newObj = {
        apiSecrete: req.body.apiSecrete,
        apikey: req.body.apikey,
      };

      const blockstreamApi = [...newApi.blockstream, newObj];
      newApi.blockstream = blockstreamApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }

  if (product === "twilio") {
    console.log(req.body);

    if (newApi.twilio.length === 0) {
      const newObj = {
        account_Sid: req.body.account_Sid,
        authToken: req.body.authToken,
        twillio_phoneNumber: req.body.twillio_phoneNumber,
      };

      const twilioApi = [...newApi.twilio, newObj];
      newApi.twilio = twilioApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }

  if (product === "cloudinary") {
    console.log(req.body);

    if (newApi.cloudinary.length === 0) {
      const newObj = {
        cloudname: req.body.cloudname,
        apikey: req.body.apikey,
        apiSecrete: req.body.apiSecrete,
      };

      const cloudinaryApi = [...newApi.cloudinary, newObj];
      newApi.cloudinary = cloudinaryApi;
      await newApi.save();
      res.status(200).json({
        status: "success",
        message: `${req.body.product} apikey successfully set`,
      });
    } else {
      return next(new AppError(`${product} apikey and secrete alredy set`));
    }
  }
});

exports.AllapiKeys = catchAsync(async (req, res, next) => {
  const apis = await Apis.find({});
  res.status(200).json({
    staus: "success",
    apis,
  });
});
