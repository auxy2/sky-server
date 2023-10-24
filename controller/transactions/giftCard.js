const Card = require("../../models/GiftcardModel");
const User = require("../../models/userModel");
const Rates = require("../../models/Rates.js");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");
const cloudinary = require("../../routes/utills/cloudinary");

exports.sellGiftCard = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    res.send("Something went wrong", 404);
  }
  const card = req.body;
  card.userId = user._id;
  console.log(card);
  const GiftCard = await Card.create(card);
  res.status(201).json({
    status: "success",
    message: "please note gift card transction take some while before complete",
  });
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        return next(new AppError("Error uploading image"));
      }
      const obj = {
        userId: user._id,
        image: result.url,
        public_id: result.public_id,
        cardForms: "physical",
      };
      console.log(result);
      await Card.create(obj);
      res.status(201).json({
        status: "success",
        message:
          "please note gift card transction take some while before complete",
      });
    });
  }
});

exports.GiftCard_Cat_SubCat = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    next(new AppError("Something went wrong", 400));
  }
  const rates = await Rates.find();
  const data = req.query.data;
  const form = rates[0].giftCard_Form;
  const subcategories = rates[0].giftCardSub_Cartigories;

  if (data) {
    const cardForm = form.filter((forms) => forms.value.includes(data));
    res.status(200).json({
      status: "sucees",
      cardForm,
      subcategories,
    });
    console.log(cardForm);
  } else {
    // if (rates[0].gitCard_Form.type.includes(data)) {
    //   console.log("data");
    // }
    const cardCategory = rates[0].gitCard_Cartigories;
    //   const subcategories = rates[0].gitCardSub_Cartigories;
    res.status(200).json({
      status: "success",
      cardCategory,
    });
  }
});
