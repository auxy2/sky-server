const Rates = require("../../models/Rates");
const AppError = require("../../routes/utills/AppError");
const catchAsync = require("../../routes/utills/catchAsync");

exports.postNotifications = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const rates = await Rates.find({});

  if (rates.length === 0) {
    const obj = {
      randomly: "245rc24",
    };
    await Rates.create(obj);
  }
  const rate = await Rates.findOne({ Admin: "Admin" });
  if (!rate) {
    return next(
      new AppError("you dont have access to post notifications", 200)
    );
  }
  const bodyObj = req.body;

  let id = Math.random() * Date.now();
  id = Math.floor(id);
  bodyObj.id = id;
  console.log(req.body);

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
  const rates = await Rates.find({});

  if (rates.length === 0) {
    res.send(" No notifications to diplay");
  }
  for (const notifications of rates) {
    const { notification } = notifications;
    res.status(200).json({
      status: "success",
      notification,
    });
  }
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
