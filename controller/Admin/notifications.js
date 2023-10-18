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
  const bodyObj = req.body;

  let id = Math.random() * Date.now();
  id = Math.floor(id);
  bodyObj.id = id;

  if (req.body.notificationBody && req.body.notificationTitle) {
    const newNotifications = [...rate.notification, bodyObj];
    rate.notification = newNotifications;
    await rate.save();
    res.status(200).json({
      status: "success",
      message: "you successfully post a notification",
    });
  }
});

exports.getNotifications = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });
  const allNotifications = rates.notification;
  res.status(200).json({
    status: "success",
    allNotifications,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const rates = await Rates.findOne({ Admin: "Admin" });
  const allNotifications = rates.notification;

  const newNotifications = allNotifications.filter(
    (notifications) => notifications._id.toString() !== req.query.id
  );
  rates.notification = newNotifications;
  await rates.save();
  res.status(200).json({
    status: "success",
    message: "notification successfully deleted",
  });
});
