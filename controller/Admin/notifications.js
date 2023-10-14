const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");

exports.postNotifications = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const rate = await Rates.findOne({ Admin: "Admin" });
  if (!rate) {
    return next(
      new AppError("you dont have access to post notifications", 400)
    );
  }
  if (req.query.id) {
    const newRates = rate.notification.filter(
      (notification) => notification.id !== req.query.id
    );
    if (newRates) {
      console.log(newRates);
      rate.notification = newRates;
      await rate.save();
      res.status(200).json({
        status: "success",
        message: "successfully deleted",
      });
    }
  } else if (req.body.notificationBody && req.body.notificationTitle) {
    const newNotifications = [...rate.notification, req.body];
    rate.notification = newNotifications;
    await rate.save();
    res.status(200).json({
      status: "success",
      message: "you successfully post a notification",
    });
  }

  res.status(200).json({
    status: "success",
    notifications: rate.notification,
  });
});

exports.getNotifications = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });
  const allNotifications = rates.notification;
  res.status(200).json({
    status: "success",
    allNotifications,
  });
});
