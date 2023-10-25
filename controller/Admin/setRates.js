const User = require("../../models/userModel");
const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");
const cloudinary = require("../../routes/utills/cloudinary");

exports.setRate = catchAsync(async (req, res, next) => {
  const newRate = await Rates.find({});
  if (newRate.length === 0) {
    const obj = {
      randomly: "12yregubdi",
    };
    await Rates.create(obj);
  }

  const rate = await Rates.findOne({ Admin: "Admin" });
  if (rate.cryptoRate.length >= 3) {
    return next(new AppError("maxim rate is set", 200));
  }
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        return next(new AppError("image uploads fail", 200));
      }

      const body = req.body;
      body.image = result.url;

      const newRate = [...rate.cryptoRate, req.body];
      rate.cryptoRate = newRate;
      await rate.save();

      const latestRate = await Rates.findOne({ Admin: "Admin" });

      const productField = latestRate.cryptoRate;

      const newproduct = productField.find(
        (item) => item.product === req.body.product
      );
      console.log("body", req.body, "B", body);
      res.status(200).json({
        status: "success",
        message: newproduct,
      });
    });
  } else {
    return next(new AppError("please provide an icon", 200));
  }
});

exports.setGiftCardRate = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const rates = await Rates.findOne({ Admin: "Admin" });

  let Cat_SubBodyObj = req.body;
  console.log(Cat_SubBodyObj);

  let id = Math.random() * Date.now();
  id = Math.floor(id);
  Cat_SubBodyObj.id = id;

  if (req.file) {
    if (Cat_SubBodyObj.type === "catigory") {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          return next(new AppError("image uploads fail", 200));
        }

        Cat_SubBodyObj.image = result.url;

        console.log("catigory", result);
        const catNewRate = [...rates.gitCard_Cartigories, Cat_SubBodyObj];
        rates.gitCard_Cartigories = catNewRate;
        await rates.save();

        const latestRate = await Rates.findOne({ Admin: "Admin" });

        const productField = latestRate.gitCard_Cartigories;

        const newproduct = productField.find(
          (item) => item.product === req.body.product
        );
        console.log("body", req.body, "B", body);
        res.status(200).json({
          status: "success",
          message: newproduct,
        });
      });
    }
  }

  if (req.file) {
    if (Cat_SubBodyObj.type === "SubCatigory") {
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          return next(new AppError("image uploads fail", 200));
        }

        console.log("SubCatigory", result);
        console.log(Cat_SubBodyObj);

        Cat_SubBodyObj.image = result.url;
        const SubCatNewRate = [
          ...rates.giftCardSub_Cartigories,
          Cat_SubBodyObj,
        ];
        rates.giftCardSub_Cartigories = SubCatNewRate;
        await rates.save();

        const latestRate = await Rates.findOne({ Admin: "Admin" });

        const productField = latestRate.giftCardSub_Cartigories;

        const newproduct = productField.find(
          (item) => item.product === req.body.product
        );
        res.status(200).json({
          status: "success",
          message: newproduct,
        });
      });
    }
  }
});

exports.setgiftcardSub_Catigory = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });

  const bodyObj = req.body;

  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;

  const newRate = [...rates.giftCardSub_Cartigories, bodyObj];
  rates.giftCardSub_Cartigories = newRate;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "You successfully set",
  });
});

exports.setCardForm = catchAsync(async (req, res, next) => {
  const forms = await Rates.findOne({ Admin: "Admin" });

  const bodyObj = req.body;
  let id = Math.random() * 15;
  id = Math.floor(id);
  bodyObj.id = id;

  if (forms.cardForms.length >= 3) {
    return next(new AppError("maxim rate is set", 200));
  }
  const newRate = [...forms.giftCard_Form, bodyObj];
  forms.giftCard_Form = newRate;
  await forms.save();
  res.status(200).json({
    status: "success",
    message: "You successfully set",
  });
});
