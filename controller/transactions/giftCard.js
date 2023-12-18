const Card = require("../../models/GiftcardModel");
const User = require("../../models/userModel");
const Rates = require("../../models/Rates.js");
const notification = require("../../models/notificationsModel");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");
const cloudinary = require("../../routes/utills/cloudinary");

exports.sellGiftCard = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  const rates = await Rates.findOne({ Admin: "Admin" });
  const obj = req.body;
  const amount = obj.selectedRate * obj.cardAmount;

  if (!user) {
    res.send("Something went wrong", 404);
  }

  if (req.file) {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        return next(new AppError("Error uploading image"));
      }

      console.log(result.url);
      obj.userId = user._id;
      obj.image = result.url;
      obj.public_id = result.public_id;
      obj.salesAmount = amount;
      console.log(result);
      await Card.create(obj);
      await notification.create(obj);
      res.status(201).json({
        status: "success",
        message:
          "please note gift card transction take some while before complete",
      });
    });
  } else {
    obj.userId = user._id;
    obj.salesAmount = amount;
    delete obj.image;
    console.log(obj);

    await Card.create(obj);
    res.status(201).json({
      status: "success",
      message:
        "please note gift card transction take some while before complete",
    });
  }
});

exports.GiftCard_Cat_SubCat = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.user);
  if (!user) {
    next(new AppError("Something went wrong", 400));
  }
  const rates = await Rates.findOne({ Admin: "Admin" });
  const data = req.query.data;
  const form = rates.giftCard_Form;
  const sub_categories = rates.giftCardSub_Cartigories;

  if (data) {
    const cardForm = form.filter((forms) => forms.value.includes(data));
    const subcategories = sub_categories.filter(
      (sub_cat) => sub_cat.category === data
    );
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
    const cardCategory = rates.gitCard_Cartigories;
    //   const subcategories = rates[0].gitCardSub_Cartigories;
    res.status(200).json({
      status: "success",
      cardCategory,
    });
  }
});
